import React, { useState, useCallback, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Note } from '../types';
import { COLOR_MAP } from '../types';
import { NOTE_DIMENSIONS } from '../constants/app';

import NotePin from './note/NotePin';
import NoteToolbar from './note/NoteToolbar';
import NoteResizeHandle from './note/NoteResizeHandle';
import DragHandle from './note/DragHandle';
import StylePanel from './note/StylePanel';
import NoteContent from './note/NoteContent';

const clampNoteSize = (size: number) => {
  return Math.max(NOTE_DIMENSIONS.MIN_SIZE, size);
};

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  zIndex: number;
}

const StickyNote: React.FC<StickyNoteProps> = memo(
  ({ note, onUpdate, onDelete, onFocus, zIndex }) => {
    const [isStyling, setIsStyling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const x = useMotionValue(note.position.x);
    const y = useMotionValue(note.position.y);
    const scale = useSpring(useMotionValue(1), { stiffness: 300, damping: 20 });
    const noteId = note.id;

    useEffect(() => {
      x.set(note.position.x);
      y.set(note.position.y);
    }, [note.position.x, note.position.y, x, y]);

    const handleDragStart = useCallback(() => {
      setIsDragging(true);
      scale.set(1.03);
      onFocus(noteId);
    }, [noteId, onFocus, scale]);

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      scale.set(1);
      // 保存当前位置
      onUpdate(noteId, { position: { x: x.get(), y: y.get() } });
    }, [noteId, onUpdate, x, y, scale]);

    const handleNoteClick = useCallback(
      (e: React.MouseEvent) => {
        // 只在非编辑模式下聚焦
        if (
          !(e.target instanceof HTMLTextAreaElement) &&
          !(e.target instanceof HTMLInputElement)
        ) {
          onFocus(noteId);
        }
      },
      [noteId, onFocus]
    );

    const handleResizeStart = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);

        const startW = note.width;
        const startH = note.height;
        const startX = e.clientX;
        const startY = e.clientY;

        const onMove = (me: MouseEvent) => {
          onUpdate(noteId, {
            width: clampNoteSize(startW + (me.clientX - startX)),
            height: clampNoteSize(startH + (me.clientY - startY)),
          });
        };

        const onUp = () => {
          setIsResizing(false);
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      },
      [noteId, note.width, note.height, onUpdate]
    );

    const handleColorSelect = useCallback(
      (color: typeof note.color) => {
        onUpdate(noteId, { color });
        setIsStyling(false);
      },
      [noteId, onUpdate]
    );

    const handleToggleStyling = useCallback(() => {
      setIsStyling(prev => !prev);
    }, []);

    const handleDelete = useCallback(() => {
      onDelete(noteId);
    }, [noteId, onDelete]);

    const handleContentUpdate = useCallback(
      (updates: Partial<Note>) => {
        onUpdate(noteId, updates);
      },
      [noteId, onUpdate]
    );

    const canDrag = !isStyling && !isResizing;

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
          backgroundColor: COLOR_MAP[note.color],
        }}
        className={`note-container p-6 pt-10 flex flex-col group ${isDragging ? 'note-dragging' : ''}`}
        data-note-id={note.id}
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
          isStyling={isStyling}
          onToggleStyling={handleToggleStyling}
          onDelete={handleDelete}
        />

        <NoteContent note={note} onUpdate={handleContentUpdate} />

        <StylePanel
          isOpen={isStyling}
          currentColor={note.color}
          onColorSelect={handleColorSelect}
          onClose={() => setIsStyling(false)}
        />
      </motion.div>
    );
  }
);

StickyNote.displayName = 'StickyNote';

export default StickyNote;
