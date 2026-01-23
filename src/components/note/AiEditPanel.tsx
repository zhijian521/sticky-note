import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Z_INDEX } from '../../constants/app';

interface AiEditPanelProps {
  isOpen: boolean;
  prompt: string;
  onPromptChange: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const AiEditPanel: React.FC<AiEditPanelProps> = ({
  isOpen,
  prompt,
  onPromptChange,
  onApply,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-md p-6 flex flex-col gap-3 rounded border border-black/5 shadow-xl"
          style={{ zIndex: Z_INDEX.AI_PANEL }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={12} /> AI Image Edit
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-full"
              aria-label="Close AI panel"
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            autoFocus
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g. 'Add a retro filter'..."
            className="flex-grow bg-gray-50 p-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
          />
          <button
            onClick={onApply}
            disabled={!prompt}
            className="bg-indigo-600 text-white py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Apply Magic
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiEditPanel;
