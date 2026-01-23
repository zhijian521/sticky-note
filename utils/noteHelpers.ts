import { Note, NoteColor } from '../types';
import { PUCK_COLORS } from '../constants/note';

export function getPuckColor(color: NoteColor): string {
  return PUCK_COLORS[color];
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

export function parseBase64Image(base64Image: string): { data: string; mimeType: string } {
  const hasPrefix = base64Image.includes(',');
  const data = hasPrefix ? base64Image.split(',')[1] : base64Image;
  const mimeType = base64Image.match(/data:([^;]+);/)?.[1] || 'image/png';

  return { data, mimeType };
}

export function createBase64Url(data: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${data}`;
}
