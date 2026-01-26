import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canShowPrompt, setCanShowPrompt] = useState(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) return true;
    const daysSinceDismiss =
      (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSinceDismiss > 7;
  });

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Window & { standalone?: boolean }).standalone ||
        document.referrer.includes('android-app://');

      setIsInstalled(isStandalone);
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Show prompt after a delay for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setCanShowPrompt(false);
  };

  if (isInstalled || !deferredPrompt || !showPrompt || !canShowPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-200">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-3 flex-shrink-0">
            <Download className="text-amber-600" size={24} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Install Sticky Note
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Install the app for a better experience with offline support and
              quick access
            </p>

            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200"
            >
              Install App
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
