import { NoteColor } from '../types';
import { PUCK_COLORS } from '../constants/note';

export function getPuckColor(color: NoteColor): string {
  return PUCK_COLORS[color];
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}
