import { useCallback } from 'react';
import { Note, NoteColor } from '../types';
import { COLORS, NOTE_DIMENSIONS } from '../constants/app';

export function useNoteOperations() {
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 11);
  }, []);

  const calculatePosition = useCallback((width: number, height: number) => {
    return {
      x: window.innerWidth / 2 - width / 2 + (Math.random() * 100 - 50),
      y: window.innerHeight / 2 - height / 2 + (Math.random() * 100 - 50)
    };
  }, []);

  const createNote = useCallback((color?: NoteColor, imageUrl?: string, text?: string): Note => {
    const hasImage = !!imageUrl;
    const dimensions = hasImage ? NOTE_DIMENSIONS.IMAGE_NOTE : NOTE_DIMENSIONS.TEXT_NOTE;

    return {
      id: generateId(),
      text: text || '',
      imageUrl,
      color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
      position: calculatePosition(dimensions.width, dimensions.height),
      width: dimensions.width,
      height: dimensions.height,
      createdAt: Date.now(),
      lastFocusedAt: Date.now()
    };
  }, [generateId, calculatePosition]);

  return { createNote };
}
