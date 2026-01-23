import React, { useState, useCallback, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Note } from '../types';
import { geminiService } from '../services/geminiService';
import { soundService } from '../services/soundService';
import { COLOR_MAP } from '../types';
import { Z_INDEX, NOTE_DIMENSIONS } from '../constants/app';

import NotePin from './note/NotePin';
import NoteToolbar from './note/NoteToolbar';
import NoteResizeHandle from './note/NoteResizeHandle';
import DragHandle from './note/DragHandle';
import AiEditPanel from './note/AiEditPanel';
import StylePanel from './note/StylePanel';
import NoteContent from './note/NoteContent';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  zIndex: number;
}

const StickyNote: React.FC<StickyNoteProps> = memo(({ note, onUpdate, onDelete, onFocus, zIndex }) => {
  const [isStyling, setIsStyling] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const x = useMotionValue(note.position.x);
  const y = useMotionValue(note.position.y);
  const scale = useSpring(useMotionValue(1), { stiffness: 300, damping: 20 });

  useEffect(() => {
    x.set(note.position.x);
    y.set(note.position.y);
  }, [note.position.x, note.position.y, x, y]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    scale.set(1.03);
    onFocus(note.id);
  }, [note.id, onFocus, scale]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    scale.set(1);
    // 保存当前位置
    onUpdate(note.id, { position: { x: x.get(), y: y.get() } });
  }, [note.id, onUpdate, x, y, scale]);

  const handleNoteClick = useCallback((e: React.MouseEvent) => {
    // 只在非编辑模式下聚焦
    if (!(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLInputElement)) {
      onFocus(note.id);
    }
  }, [note.id, onFocus]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startW = note.width;
    const startH = note.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove = (me: MouseEvent) => {
      onUpdate(note.id, {
        width: Math.max(NOTE_DIMENSIONS.MIN_SIZE, startW + (me.clientX - startX)),
        height: Math.max(NOTE_DIMENSIONS.MIN_SIZE, startH + (me.clientY - startY))
      });
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [note.id, note.width, note.height, onUpdate]);

  const handleAiEdit = useCallback(async () => {
    if (!note.imageUrl || !aiPrompt) return;

    onUpdate(note.id, { isProcessing: true });
    setIsAiMode(false);

    try {
      const newImage = await geminiService.editImage(note.imageUrl, aiPrompt);
      onUpdate(note.id, { imageUrl: newImage, isProcessing: false });
      setAiPrompt('');
    } catch (error) {
      console.error('AI Edit failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI editing failed. Please try again.';
      alert(errorMessage);
      onUpdate(note.id, { isProcessing: false });
    }
  }, [note.id, note.imageUrl, aiPrompt, onUpdate]);

  const handleColorSelect = useCallback((color: typeof note.color) => {
    onUpdate(note.id, { color });
    setIsStyling(false);
  }, [note.id, onUpdate]);

  const canDrag = !isStyling && !isResizing && !isAiMode;

  return (
    <motion.div
      onClick={handleNoteClick}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        x,
        y,
        width: note.width,
        height: note.height,
        zIndex,
        scale,
        backgroundColor: COLOR_MAP[note.color]
      }}
      className={`note-container p-6 pt-10 flex flex-col group ${isDragging ? 'note-dragging' : ''}`}
    >
      {canDrag && (
        <DragHandle
          x={x}
          y={y}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={isDragging}
        />
      )}

      <NotePin color={note.color} />

      <NoteResizeHandle onResizeStart={handleResizeStart} />

      <NoteToolbar
        hasImage={!!note.imageUrl}
        isAiMode={isAiMode}
        onToggleAi={() => setIsAiMode(!isAiMode)}
        isStyling={isStyling}
        onToggleStyling={() => setIsStyling(!isStyling)}
        onDelete={() => {
          soundService.playRip();
          onDelete(note.id);
        }}
      />

      <NoteContent note={note} onUpdate={(updates) => onUpdate(note.id, updates)} />

      <AiEditPanel
        isOpen={isAiMode}
        prompt={aiPrompt}
        onPromptChange={setAiPrompt}
        onApply={handleAiEdit}
        onClose={() => setIsAiMode(false)}
      />

      <StylePanel
        isOpen={isStyling}
        currentColor={note.color}
        onColorSelect={handleColorSelect}
        onClose={() => setIsStyling(false)}
      />
    </motion.div>
  );
});

StickyNote.displayName = 'StickyNote';

export default StickyNote;
