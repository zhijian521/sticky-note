import React from 'react';
import { Plus, RotateCcw, Wallpaper, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLOR_MAP, NoteColor, WallType } from '../types';
import { COLORS, COLOR_LABELS, Z_INDEX } from '../constants/app';
import WallPanel from './WallPanel';

interface DockProps {
  scale: number;
  minScale: number;
  maxScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onAddNote: (color?: NoteColor) => void;
  wallType: WallType;
  isWallMenuOpen: boolean;
  onToggleWallMenu: () => void;
  onCloseWallMenu: () => void;
  onSelectWall: (wallType: WallType) => void;
  wallMenuRef: React.RefObject<HTMLDivElement>;
  wallPanelDesktopRef: React.RefObject<HTMLDivElement>;
  wallPanelMobileRef: React.RefObject<HTMLDivElement>;
}

const getZoomButtonClass = (isEnabled: boolean) =>
  `p-2 rounded-xl transition-all ${
    isEnabled
      ? 'hover:bg-gray-100 hover:scale-110 text-gray-700'
      : 'opacity-40 cursor-not-allowed text-gray-400'
  }`;

const Dock: React.FC<DockProps> = ({
  scale,
  minScale,
  maxScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onAddNote,
  wallType,
  isWallMenuOpen,
  onToggleWallMenu,
  onCloseWallMenu,
  onSelectWall,
  wallMenuRef,
  wallPanelDesktopRef,
  wallPanelMobileRef,
}) => {
  const canZoomOut = scale > minScale;
  const canZoomIn = scale < maxScale;
  const zoomPercentage = Math.round(scale * 100);

  return (
    <div
      className="fixed bottom-2 sm:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100vw-12px)] sm:w-auto"
      style={{
        zIndex: Z_INDEX.DOCK,
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="dock-container flex flex-wrap sm:flex-nowrap items-center justify-center p-2 sm:p-2.5 gap-1.5 sm:gap-2 max-w-full"
      >
        <div className="hidden sm:flex gap-1 px-2 sm:px-3 border-r border-black/5 shrink-0">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => onAddNote(color)}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-full border border-black/5 hover:scale-110 active:scale-90 transition-transform shadow-sm"
              style={{ backgroundColor: COLOR_MAP[color].replace('0.85', '1') }}
              aria-label={`创建${COLOR_LABELS[color]}便签`}
              title={COLOR_LABELS[color]}
            />
          ))}
        </div>

        <button
          onClick={() => onAddNote()}
          className="ml-1 sm:ml-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white rounded-[16px] transition-all flex items-center gap-1.5 sm:gap-2 hover:bg-black active:scale-95 text-xs sm:text-sm font-bold shadow-lg shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          <span>新建便签</span>
        </button>

        <div className="flex gap-1 px-2 sm:px-3 shrink-0">
          <button
            onClick={onZoomOut}
            disabled={!canZoomOut}
            className={getZoomButtonClass(canZoomOut)}
            title="缩小 (Ctrl + -)"
            aria-label="缩小"
          >
            <ZoomOut size={16} />
          </button>

          <div
            className="flex items-center justify-center w-[52px] px-2 text-sm font-medium text-gray-700 tabular-nums shrink-0"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {zoomPercentage}%
          </div>

          <button
            onClick={onZoomIn}
            disabled={!canZoomIn}
            className={getZoomButtonClass(canZoomIn)}
            title="放大 (Ctrl + +)"
            aria-label="放大"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={onResetZoom}
            className="p-2 rounded-xl transition-all hover:bg-gray-100 hover:scale-110 text-gray-700 ml-1"
            title="重置视图 (Ctrl + 0)"
            aria-label="重置视图"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div
          className="flex gap-1 ml-1 sm:ml-2 px-2 sm:px-4 border-l border-black/5 relative shrink-0"
          ref={wallMenuRef}
        >
          <button
            onClick={onToggleWallMenu}
            className={`p-2.5 rounded-xl transition-colors ${isWallMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            title="更换背景"
            aria-label="更换背景"
          >
            <Wallpaper size={20} className="text-gray-600" />
          </button>

          <WallPanel
            isOpen={isWallMenuOpen}
            wallType={wallType}
            onSelectWall={onSelectWall}
            onClose={onCloseWallMenu}
            desktopRef={wallPanelDesktopRef}
            mobileRef={wallPanelMobileRef}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Dock;
