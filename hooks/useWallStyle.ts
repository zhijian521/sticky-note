import { useEffect } from 'react';
import { WallType } from '../types';
import { STORAGE_KEYS } from '../constants/app';

export function useWallStyle(wallType: WallType) {
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WALL_STYLE, wallType);
      document.body.className = `wall-${wallType}`;
    } catch (error) {
      console.error('Error updating wall style:', error);
    }
  }, [wallType]);
}
