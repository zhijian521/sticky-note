import { Note, NoteColor } from '../types';
import { PUCK_COLORS } from '../constants/note';
import { COLORS, NOTE_DIMENSIONS } from '../constants/app';

export function getPuckColor(color: NoteColor): string {
  return PUCK_COLORS[color];
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

export function parseBase64Image(base64Image: string): {
  data: string;
  mimeType: string;
} {
  const hasPrefix = base64Image.includes(',');
  const data = hasPrefix ? base64Image.split(',')[1]! : base64Image;
  const mimeTypeMatch = base64Image.match(/data:([^;]+);/);

  if (!mimeTypeMatch?.[1]) {
    throw new Error('无效的 Base64 图片格式');
  }

  const mimeType = mimeTypeMatch[1];

  return { data, mimeType };
}

export function createBase64Url(
  data: string,
  mimeType: string = 'image/png'
): string {
  return `data:${mimeType};base64,${data}`;
}

export function createNote(
  color?: NoteColor,
  imageUrl?: string,
  text?: string
): Note {
  const hasImage = !!imageUrl;
  const dimensions = hasImage
    ? NOTE_DIMENSIONS.IMAGE_NOTE
    : NOTE_DIMENSIONS.TEXT_NOTE;

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const calculatePosition = (width: number, height: number) => ({
    x: window.innerWidth / 2 - width / 2 + (Math.random() * 100 - 50),
    y: window.innerHeight / 2 - height / 2 + (Math.random() * 100 - 50),
  });

  const note: Note = {
    id: generateId(),
    text: text || '',
    color:
      color || (COLORS[Math.floor(Math.random() * COLORS.length)] as NoteColor),
    position: calculatePosition(dimensions.width, dimensions.height),
    width: dimensions.width,
    height: dimensions.height,
    createdAt: Date.now(),
    lastFocusedAt: Date.now(),
  };

  if (imageUrl) {
    note.imageUrl = imageUrl;
  }

  return note;
}
