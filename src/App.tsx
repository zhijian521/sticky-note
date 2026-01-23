import React, { useState, useEffect, useMemo, useRef, RefObject } from 'react';
import { Plus, Command } from 'lucide-react';
import { Note, WallType, COLOR_MAP } from './types';
import StickyNote from './components/StickyNote';
import ZoomControls from './components/ZoomControls';
import Canvas from './components/Canvas';
import { AnimatePresence, motion } from 'framer-motion';

import { COLORS, WALLS, Z_INDEX } from './constants/app';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNoteOperations } from './hooks/useNoteOperations';
import { useWallStyle } from './hooks/useWallStyle';
import { useClickOutside } from './hooks/useClickOutside';
import { useViewport } from './hooks/useViewport';

const TUTORIAL_NOTE_TEXT =
  '欢迎使用 WallNotes！\n\n这是一块模拟真实物理质感的空间：\n\n• 拖拽便签即可移动位置\n• 拖动右下角图标调整大小\n• 点击便签文字开始编辑\n• 下方工具栏可创建新便签及更换墙壁皮肤\n\n尽情发挥你的创意吧！';

const App: React.FC = () => {
  const [notes, setNotes, isNotesLoaded] = useLocalStorage<Note[]>(
    'wallnotes_v11',
    []
  );
  const [wallType, setWallType] = useState<WallType>(() => {
    try {
      const saved = localStorage.getItem('wall_style_v10');
      if (
        saved &&
        ['minimal', 'brick', 'wood', 'concrete', 'studio'].includes(saved)
      ) {
        return saved as WallType;
      }
      return 'minimal';
    } catch {
      return 'minimal';
    }
  });
  const [isWallMenuOpen, setIsWallMenuOpen] = useState(false);
  const wallMenuRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  useWallStyle(wallType);
  const { createNote } = useNoteOperations();

  // Viewport controls for zoom and pan
  const {
    viewport,
    handleWheelZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    panTo,
    MIN_SCALE,
    MAX_SCALE,
  } = useViewport();

  // Initialize with tutorial note if no notes exist
  useEffect(() => {
    if (isNotesLoaded && notes.length === 0 && !initialLoadRef.current) {
      const newNote = createNote('yellow', undefined, TUTORIAL_NOTE_TEXT);
      setNotes([newNote]);
      initialLoadRef.current = true;
    }
  }, [isNotesLoaded, notes, createNote, setNotes]);

  // Click outside handler for wall menu
  useClickOutside(
    wallMenuRef as RefObject<HTMLElement>,
    () => setIsWallMenuOpen(false),
    isWallMenuOpen
  );

  const addNote = (color?: Note['color']) => {
    const newNote = createNote(color);
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const focusNote = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, lastFocusedAt: Date.now() } : n))
    );
  };

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => a.lastFocusedAt - b.lastFocusedAt);
  }, [notes]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      role="application"
      aria-label="Sticky Notes Wall"
    >
      {/* Canvas for zoom and pan */}
      <Canvas
        viewport={viewport}
        onViewportChange={updates => {
          // Handle both position and scale updates
          if (updates.position || updates.scale) {
            if (updates.position) {
              panTo(updates.position);
            }
            if (updates.scale) {
              setZoom(updates.scale);
            }
          }
        }}
        onWheel={handleWheelZoom}
      >
        <div
          className="absolute inset-0"
          style={{ zIndex: Z_INDEX.BASE }}
          aria-label="Notes container"
        >
          <AnimatePresence>
            {sortedNotes.map((note, index) => (
              <StickyNote
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onFocus={focusNote}
                zIndex={index + Z_INDEX.BASE}
              />
            ))}
          </AnimatePresence>
        </div>
      </Canvas>

      {/* Zoom controls */}
      <ZoomControls
        scale={viewport.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
      />

      {/* Bottom dock */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2"
        style={{ zIndex: Z_INDEX.DOCK }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="dock-container flex items-center p-2.5 gap-2"
        >
          <div className="flex gap-1.5 px-3 border-r border-black/5 flex-wrap max-w-[280px]">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => addNote(c)}
                className="w-7 h-7 rounded-full border border-black/5 hover:scale-110 active:scale-90 transition-transform shadow-sm"
                style={{ backgroundColor: COLOR_MAP[c].replace('0.85', '1') }}
                aria-label={`Create ${c} note`}
                title={c}
              />
            ))}
          </div>

          <button
            onClick={() => addNote()}
            className="ml-2 px-5 py-2.5 bg-gray-900 text-white rounded-[16px] transition-all flex items-center gap-2 hover:bg-black active:scale-95 text-sm font-bold shadow-lg"
          >
            <Plus size={18} strokeWidth={3} />
            <span>New Note</span>
          </button>

          <div
            className="flex gap-1 ml-2 px-4 border-l border-black/5 relative"
            ref={wallMenuRef}
          >
            <button
              onClick={() => setIsWallMenuOpen(!isWallMenuOpen)}
              className={`p-2.5 rounded-xl transition-colors ${isWallMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              title="Change Wall Style"
              aria-label="Change wall style"
            >
              <Command size={20} className="text-gray-600" />
            </button>

            <AnimatePresence>
              {isWallMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 flex flex-col gap-1 p-2 dock-container min-w-[180px]"
                >
                  {WALLS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setWallType(w.id);
                        setIsWallMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${wallType === w.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <w.icon size={16} /> {w.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;
