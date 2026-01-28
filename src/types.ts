export type NoteColor =
  | 'yellow'
  | 'pink'
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'glass'
  | 'cream'
  | 'mint'
  | 'coral'
  | 'lavender'
  | 'sage'
  | 'peach'
  | 'sky'
  | 'tan';

export type WallType =
  // 办公看板系列
  | 'whiteboard'
  | 'cork'
  | 'felt'
  | 'magnetic'
  // 砖石墙面系列
  | 'brick-red'
  | 'brick-white'
  | 'concrete'
  | 'plaster'
  | 'sandstone'
  // 木质系列
  | 'wood-oak'
  | 'wood-pine'
  | 'wood-bamboo'
  | 'wood-dark'
  // 肌理材质系列
  | 'linen'
  | 'burlap'
  | 'leather'
  | 'canvas';

export interface Position {
  x: number;
  y: number;
}

export interface Note {
  id: string;
  text: string;
  imageUrl?: string;
  color: NoteColor;
  position: Position;
  width: number;
  height: number;
  createdAt: number;
  lastFocusedAt: number;
}

export interface ViewportState {
  scale: number;
  position: Position;
}

export const COLOR_MAP: Record<NoteColor, string> = {
  // 原有颜色 - 更真实的色调
  yellow: 'rgba(255, 248, 180, 0.85)', // 经典黄色便签
  pink: 'rgba(255, 220, 235, 0.85)', // 柔和粉色
  blue: 'rgba(195, 220, 255, 0.85)', // 天蓝色便签
  green: 'rgba(200, 245, 200, 0.85)', // 淡绿色便签
  orange: 'rgba(255, 225, 180, 0.85)', // 橙色便签
  purple: 'rgba(235, 220, 255, 0.85)', // 淡紫色便签
  glass: 'rgba(255, 255, 255, 0.25)', // 玻璃效果

  // 新增真实便签颜色
  cream: 'rgba(255, 253, 230, 0.9)', // 奶油色/羊皮纸
  mint: 'rgba(220, 255, 230, 0.85)', // 薄荷绿
  coral: 'rgba(255, 210, 200, 0.85)', // 珊瑚粉色
  lavender: 'rgba(245, 235, 255, 0.85)', // 薰衣草紫
  sage: 'rgba(220, 235, 220, 0.85)', // 鼠尾草绿
  peach: 'rgba(255, 235, 210, 0.85)', // 桃色
  sky: 'rgba(210, 235, 255, 0.85)', // 天空蓝
  tan: 'rgba(240, 230, 210, 0.85)', // 棕褐色
};
