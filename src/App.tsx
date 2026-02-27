import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Note, ViewportState, WallType } from './types';
import StickyNote from './components/StickyNote';
import Canvas from './components/Canvas';
import Dock from './components/Dock';

import { Z_INDEX, VALID_WALL_TYPES, STORAGE_KEYS } from './constants/app';
import { InstallPrompt } from './components/pwa';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNoteOperations } from './hooks/useNoteOperations';
import { useWallStyle } from './hooks/useWallStyle';
import { useClickOutside } from './hooks/useClickOutside';
import { useViewport } from './hooks/useViewport';

const TUTORIAL_NOTE_TEXT =
  '欢迎使用 Sticky Note！\n\n这是一块模拟真实物理质感的空间：\n\n• 拖拽便签即可移动位置\n• 拖动右下角图标调整大小\n• 点击便签文字开始编辑\n• 下方工具栏可创建新便签及更换墙壁皮肤\n\n尽情发挥你的创意吧！';

const App: React.FC = () => {
  const [notes, setNotes, isNotesLoaded] = useLocalStorage<Note[]>(
    STORAGE_KEYS.NOTES,
    []
  );
  const [wallType, setWallType] = useState<WallType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WALL_STYLE);
      if (saved && VALID_WALL_TYPES.includes(saved as WallType)) {
        return saved as WallType;
      }
      return 'cork';
    } catch {
      return 'cork';
    }
  });
  const [isWallMenuOpen, setIsWallMenuOpen] = useState(false);
  const wallMenuRef = useRef<HTMLDivElement>(null);
  const wallPanelDesktopRef = useRef<HTMLDivElement>(null);
  const wallPanelMobileRef = useRef<HTMLDivElement>(null);
  const wallOutsideRefs = useMemo(() => {
    return [wallMenuRef, wallPanelDesktopRef, wallPanelMobileRef];
  }, []);
  const initialLoadRef = useRef(false);
  const closeWallMenu = () => setIsWallMenuOpen(false);

  useWallStyle(wallType);
  const { createNote } = useNoteOperations();

  // Viewport controls for zoom and pan
  const {
    viewport,
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
    wallOutsideRefs,
    closeWallMenu,
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

  const handleViewportChange = (updates: Partial<ViewportState>) => {
    if (updates.position) {
      panTo(updates.position);
    }
    if (updates.scale !== undefined) {
      setZoom(updates.scale);
    }
  };

  const handleWallSelect = (selectedWall: WallType) => {
    setWallType(selectedWall);
    closeWallMenu();
  };

  return (
    <div
      className="relative w-screen h-[100dvh] overflow-hidden"
      role="application"
      aria-label="便签墙"
    >
      {/* Canvas for zoom and pan */}
      <Canvas
        viewport={viewport}
        onViewportChange={handleViewportChange}
      >
        <div
          className="absolute inset-0"
          style={{ zIndex: Z_INDEX.BASE }}
          aria-label="便签容器"
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

      {/* Bottom dock */}
      <Dock
        scale={viewport.scale}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onAddNote={addNote}
        wallType={wallType}
        isWallMenuOpen={isWallMenuOpen}
        onToggleWallMenu={() => setIsWallMenuOpen(prev => !prev)}
        onCloseWallMenu={closeWallMenu}
        onSelectWall={handleWallSelect}
        wallMenuRef={wallMenuRef}
        wallPanelDesktopRef={wallPanelDesktopRef}
        wallPanelMobileRef={wallPanelMobileRef}
      />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default App;
