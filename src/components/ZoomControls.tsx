import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  minScale: number;
  maxScale: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  minScale,
  maxScale,
}) => {
  const scalePercentage = Math.round(scale * 100);
  const canZoomIn = scale < maxScale;
  const canZoomOut = scale > minScale;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-black/10 p-2 flex flex-col gap-1"
    >
      {/* Current zoom level */}
      <div className="text-center px-3 py-1 text-sm font-medium text-gray-700 border-b border-gray-200 mb-1">
        {scalePercentage}%
      </div>

      {/* Zoom controls */}
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className={`p-2 rounded-xl transition-all ${
          canZoomIn
            ? 'hover:bg-gray-100 hover:scale-110 text-gray-700'
            : 'opacity-40 cursor-not-allowed text-gray-400'
        }`}
        title="放大 (Ctrl + +)"
        aria-label="放大"
      >
        <ZoomIn size={18} />
      </button>

      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className={`p-2 rounded-xl transition-all ${
          canZoomOut
            ? 'hover:bg-gray-100 hover:scale-110 text-gray-700'
            : 'opacity-40 cursor-not-allowed text-gray-400'
        }`}
        title="缩小 (Ctrl + -)"
        aria-label="缩小"
      >
        <ZoomOut size={18} />
      </button>

      <button
        onClick={onReset}
        className="p-2 rounded-xl transition-all hover:bg-gray-100 hover:scale-110 text-gray-700 border-t border-gray-200 pt-3"
        title="重置视图 (Ctrl + 0 或 空格)"
        aria-label="重置视图"
      >
        <RotateCcw size={18} />
      </button>
    </motion.div>
  );
};

export default ZoomControls;
