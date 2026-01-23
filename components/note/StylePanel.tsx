import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NoteColor, COLOR_MAP } from '../../types';
import { ALL_COLORS, Z_INDEX } from '../../constants/app';

interface StylePanelProps {
  isOpen: boolean;
  currentColor: NoteColor;
  onColorSelect: (color: NoteColor) => void;
  onClose: () => void;
}

const StylePanel: React.FC<StylePanelProps> = ({
  isOpen,
  currentColor,
  onColorSelect,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 bg-white/90 backdrop-blur-md p-6 flex flex-col gap-4 rounded border border-black/5 shadow-xl"
          style={{ zIndex: Z_INDEX.STYLE_PANEL }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Color</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-full"
              aria-label="Close style panel"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ALL_COLORS.map(c => (
              <button
                key={c}
                onClick={() => onColorSelect(c)}
                className={`h-10 rounded-md transition-all hover:scale-105 active:scale-95 border border-black/5 ${currentColor === c ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                style={{ backgroundColor: COLOR_MAP[c].replace('0.7', '1') }}
                aria-label={`Select ${c} color`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StylePanel;
