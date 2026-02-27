import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker
registerSW({
  onNeedRefresh() {
    if (confirm('检测到新内容，是否立即刷新更新？')) {
      location.reload();
    }
  },
  onOfflineReady() {
    console.log('PWA 应用已就绪，可离线使用。');
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('未找到根节点，无法挂载应用。');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
