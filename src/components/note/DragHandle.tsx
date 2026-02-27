import React from 'react';
import { MotionValue } from 'framer-motion';

interface DragHandleProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TOP_BOTTOM_HANDLE_SIZE = 30;
const LEFT_RIGHT_HANDLE_SIZE = 24;
const HANDLE_Z_INDEX = 50;

const HANDLE_AREAS = [
  {
    ariaLabel: '顶部拖拽区域',
    className: 'absolute left-0 right-0',
    style: { top: 0, height: TOP_BOTTOM_HANDLE_SIZE },
  },
  {
    ariaLabel: '底部拖拽区域',
    className: 'absolute left-0 right-0',
    style: { bottom: 0, height: TOP_BOTTOM_HANDLE_SIZE },
  },
  {
    ariaLabel: '左侧拖拽区域',
    className: 'absolute top-0 bottom-0',
    style: { left: 0, width: LEFT_RIGHT_HANDLE_SIZE },
  },
  {
    ariaLabel: '右侧拖拽区域',
    className: 'absolute top-0 bottom-0',
    style: { right: 0, width: LEFT_RIGHT_HANDLE_SIZE },
  },
] as const;

const DragHandle: React.FC<DragHandleProps> = ({
  x,
  y,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const cursorStyle = isDragging ? 'grabbing' : 'grab';

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPageX = x.get();
    const startPageY = y.get();
    const pointerId = e.pointerId;

    onDragStart();

    const handlePointerMove = (pe: PointerEvent) => {
      if (pe.pointerId !== pointerId) return;
      pe.preventDefault();

      const deltaX = pe.clientX - startX;
      const deltaY = pe.clientY - startY;
      // 直接设置新位置 = 初始位置 + 偏移量
      x.set(startPageX + deltaX);
      y.set(startPageY + deltaY);
    };

    const handlePointerUp = (pe: PointerEvent) => {
      if (pe.pointerId !== pointerId) return;

      const deltaX = pe.clientX - startX;
      const deltaY = pe.clientY - startY;
      x.set(startPageX + deltaX);
      y.set(startPageY + deltaY);

      onDragEnd();

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <>
      {HANDLE_AREAS.map(area => (
        <div
          key={area.ariaLabel}
          onPointerDown={handlePointerDown}
          className={area.className}
          style={{
            ...area.style,
            cursor: cursorStyle,
            zIndex: HANDLE_Z_INDEX,
            touchAction: 'none',
          }}
          aria-label={area.ariaLabel}
        />
      ))}
    </>
  );
};

export default DragHandle;
