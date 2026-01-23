import { NoteColor, WallType } from '../types';
import { LucideIcon } from 'lucide-react';
import { Square, Image as ImageIcon, Moon, Layers, Layout } from 'lucide-react';

export const COLORS: NoteColor[] = [
  'yellow', 'pink', 'blue', 'green', 'orange', 'purple'
];

export const ALL_COLORS: NoteColor[] = [
  'yellow', 'pink', 'blue', 'green', 'orange', 'purple',
  'cream', 'mint', 'coral', 'lavender', 'sage', 'peach', 'sky', 'tan', 'glass'
];

export interface WallOption {
  id: WallType;
  name: string;
  icon: LucideIcon;
}

export const WALLS: WallOption[] = [
  { id: 'minimal', name: 'White Wall', icon: Square },
  { id: 'concrete', name: 'Concrete', icon: ImageIcon },
  { id: 'studio', name: 'Dark Room', icon: Moon },
  { id: 'brick', name: 'Grid Wall', icon: Layers },
  { id: 'wood', name: 'Wood Panel', icon: Layout }
];

export const NOTE_DIMENSIONS = {
  TEXT_NOTE: { width: 320, height: 320 },
  IMAGE_NOTE: { width: 400, height: 480 },
  MIN_SIZE: 180
} as const;

export const STORAGE_KEYS = {
  NOTES: 'wallnotes_v11',
  WALL_STYLE: 'wall_style_v10'
} as const;

export const Z_INDEX = {
  BASE: 20,
  DOCK: 1000,
  NOTE_PIN: 100,
  NOTE_RESIZE_HANDLE: 70,
  NOTE_TOOLBAR: 50,
  NOTE_CONTENT: 10,
  STYLE_PANEL: 60
} as const;
