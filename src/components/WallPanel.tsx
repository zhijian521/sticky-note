import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { WallType } from '../types';
import { WALLS } from '../constants/app';
import WallOptionButton from './WallOptionButton';

interface WallPanelProps {
  isOpen: boolean;
  wallType: WallType;
  onSelectWall: (wallType: WallType) => void;
  onClose: () => void;
  desktopRef: React.RefObject<HTMLDivElement>;
  mobileRef: React.RefObject<HTMLDivElement>;
}

const WALL_GROUPS = [
  { title: '办公看板', start: 0, end: 4, cols: 'grid-cols-4', hasMargin: true },
  {
    title: '砖石墙面',
    start: 4,
    end: 9,
    cols: 'grid-cols-4 sm:grid-cols-5',
    hasMargin: true,
  },
  { title: '木质系列', start: 9, end: 13, cols: 'grid-cols-4', hasMargin: true },
  { title: '肌理材质', start: 13, end: 17, cols: 'grid-cols-4', hasMargin: false },
] as const;

const WALL_PANEL_CLASSNAME =
  'p-3 sm:p-4 dock-container w-[min(calc(100vw-16px),360px)] sm:min-w-[360px] max-h-[55dvh] sm:max-h-[420px] overflow-y-auto';

const WallPanelContent: React.FC<{
  wallType: WallType;
  onSelectWall: (wallType: WallType) => void;
}> = ({ wallType, onSelectWall }) => {
  return (
    <>
      {WALL_GROUPS.map(group => (
        <div key={group.title}>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            {group.title}
          </div>
          <div
            className={`grid ${group.cols} gap-2 ${group.hasMargin ? 'mb-4' : ''}`}
          >
            {WALLS.slice(group.start, group.end).map(wall => (
              <WallOptionButton
                key={wall.id}
                wall={wall}
                isActive={wallType === wall.id}
                onClick={() => onSelectWall(wall.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const WallPanel: React.FC<WallPanelProps> = ({
  isOpen,
  wallType,
  onSelectWall,
  onClose,
  desktopRef,
  mobileRef,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`hidden sm:block absolute bottom-full mb-6 left-1/2 -translate-x-1/2 ${WALL_PANEL_CLASSNAME}`}
            ref={desktopRef}
          >
            <WallPanelContent wallType={wallType} onSelectWall={onSelectWall} />
          </motion.div>

          {createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:hidden fixed inset-0 z-[1100] bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-2"
              onClick={onClose}
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={WALL_PANEL_CLASSNAME}
                ref={mobileRef}
                onClick={e => e.stopPropagation()}
              >
                <WallPanelContent
                  wallType={wallType}
                  onSelectWall={onSelectWall}
                />
              </motion.div>
            </motion.div>,
            document.body
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default WallPanel;
