import { NoteColor, WallType } from '../types';
import { LucideIcon } from 'lucide-react';
import {
  Square,
  Layers,
  Layout,
  Palette,
  Grid3X3,
  Sheet,
  TreePine,
  Flower2,
  Construction,
  Box,
} from 'lucide-react';

export const COLORS: NoteColor[] = [
  'yellow',
  'pink',
  'blue',
  'green',
  'orange',
  'purple',
];

export const ALL_COLORS: NoteColor[] = [
  'yellow',
  'pink',
  'blue',
  'green',
  'orange',
  'purple',
  'cream',
  'mint',
  'coral',
  'lavender',
  'sage',
  'peach',
  'sky',
  'tan',
  'glass',
];

export const COLOR_LABELS: Record<NoteColor, string> = {
  yellow: '黄色',
  pink: '粉色',
  blue: '蓝色',
  green: '绿色',
  orange: '橙色',
  purple: '紫色',
  glass: '玻璃',
  cream: '奶油',
  mint: '薄荷',
  coral: '珊瑚',
  lavender: '薰衣草',
  sage: '鼠尾草',
  peach: '蜜桃',
  sky: '天空',
  tan: '棕褐',
};

export interface WallOption {
  id: WallType;
  name: string;
  icon: LucideIcon;
}

export const WALLS: WallOption[] = [
  // 办公看板系列
  { id: 'whiteboard', name: '磁性白板', icon: Square },
  { id: 'cork', name: '软木公告板', icon: Flower2 },
  { id: 'felt', name: '毛毡展示板', icon: Layout },
  { id: 'magnetic', name: '深色磁板', icon: Grid3X3 },
  // 砖石墙面系列
  { id: 'brick-red', name: '红砖墙', icon: Construction },
  { id: 'brick-white', name: '白砖墙', icon: Layers },
  { id: 'concrete', name: '清水混凝土', icon: Box },
  { id: 'plaster', name: '石膏墙面', icon: Sheet },
  { id: 'sandstone', name: '砂岩墙面', icon: Box },
  // 木质系列
  { id: 'wood-oak', name: '橡木墙板', icon: TreePine },
  { id: 'wood-pine', name: '松木纹理', icon: TreePine },
  { id: 'wood-bamboo', name: '竹制墙板', icon: TreePine },
  { id: 'wood-dark', name: '深色实木', icon: TreePine },
  // 肌理材质系列
  { id: 'linen', name: '亚麻布面', icon: Sheet },
  { id: 'burlap', name: '粗麻布', icon: Layout },
  { id: 'leather', name: '皮革墙面', icon: Box },
  { id: 'canvas', name: '画布底板', icon: Palette },
] as const;

// 有效的背景类型数组（用于运行时验证）
export const VALID_WALL_TYPES: WallType[] = WALLS.map(w => w.id);

export const NOTE_DIMENSIONS = {
  TEXT_NOTE: { width: 320, height: 320 },
  IMAGE_NOTE: { width: 400, height: 480 },
  MIN_SIZE: 180,
} as const;

export const STORAGE_KEYS = {
  NOTES: 'wallnotes_v11',
  WALL_STYLE: 'wall_style_v10',
} as const;

export const Z_INDEX = {
  BASE: 20,
  DOCK: 1000,
  NOTE_PIN: 100,
  NOTE_RESIZE_HANDLE: 70,
  NOTE_TOOLBAR: 50,
  NOTE_CONTENT: 10,
  STYLE_PANEL: 60,
} as const;
