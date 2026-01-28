import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, WallType } from '../types';
import { createNote } from '../utils/noteHelpers';

interface NotesStore {
  notes: Note[];
  wallType: WallType;
  isWallMenuOpen: boolean;
  addNote: (color?: Note['color']) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  focusNote: (id: string) => void;
  setWallType: (wallType: WallType) => void;
  setWallMenuOpen: (isOpen: boolean) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    set => ({
      notes: [],
      wallType: 'cork',
      isWallMenuOpen: false,

      addNote: color => {
        const newNote = createNote(color);
        set(state => ({ notes: [...state.notes, newNote] }));
      },

      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, ...updates } : note
          ),
        }));
      },

      deleteNote: id => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
        }));
      },

      focusNote: id => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, lastFocusedAt: Date.now() } : note
          ),
        }));
      },

      setWallType: wallType => {
        set({ wallType });
      },

      setWallMenuOpen: isWallMenuOpen => {
        set({ isWallMenuOpen });
      },
    }),
    {
      name: 'wallnotes-store',
      partialize: state => ({
        notes: state.notes,
        wallType: state.wallType,
      }),
    }
  )
);
