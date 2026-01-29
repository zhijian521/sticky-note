import React, { memo } from 'react';
import type { WallOption } from '../constants/app';

interface WallOptionButtonProps {
  wall: WallOption;
  isActive: boolean;
  onClick: () => void;
}

/**
 * 背景选项按钮组件
 * 显示背景预览和名称，支持激活状态
 */
export const WallOptionButton: React.FC<WallOptionButtonProps> = memo(
  ({ wall, isActive, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`
        flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        ${
          isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'
        }
      `}
        title={wall.name}
        aria-label={`选择 ${wall.name} 背景`}
        aria-pressed={isActive}
      >
        <div
          className={`
          wall-preview w-10 h-10 rounded-lg border-2 transition-all overflow-hidden relative
          ${isActive ? 'border-white/30' : 'border-black/5'}
        `}
          data-wall={wall.id}
          aria-hidden="true"
        />
        <span className="text-[10px] font-medium whitespace-nowrap">
          {wall.name}
        </span>
      </button>
    );
  }
);

WallOptionButton.displayName = 'WallOptionButton';

export default WallOptionButton;
