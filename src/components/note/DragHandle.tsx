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

const DragHandle: React.FC<DragHandleProps> = ({
  x,
  y,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const cursorStyle = isDragging ? 'grabbing' : 'grab';

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPageX = x.get();
    const startPageY = y.get();

    onDragStart();

    const handleMouseMove = (me: MouseEvent) => {
      const deltaX = me.clientX - startX;
      const deltaY = me.clientY - startY;
      // 直接设置新位置 = 初始位置 + 偏移量
      x.set(startPageX + deltaX);
      y.set(startPageY + deltaY);
    };

    const handleMouseUp = (me: MouseEvent) => {
      const deltaX = me.clientX - startX;
      const deltaY = me.clientY - startY;
      x.set(startPageX + deltaX);
      y.set(startPageY + deltaY);

      onDragEnd();

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {/* 顶部拖拽条 */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: TOP_BOTTOM_HANDLE_SIZE,
          cursor: cursorStyle,
          zIndex: 50
        }}
        aria-label="顶部拖拽区域"
      />

      {/* 底部拖拽条 */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute left-0 right-0"
        style={{
          bottom: 0,
          height: TOP_BOTTOM_HANDLE_SIZE,
          cursor: cursorStyle,
          zIndex: 50
        }}
        aria-label="底部拖拽区域"
      />

      {/* 左侧拖拽条 */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0"
        style={{
          left: 0,
          width: LEFT_RIGHT_HANDLE_SIZE,
          cursor: cursorStyle,
          zIndex: 50
        }}
        aria-label="左侧拖拽区域"
      />

      {/* 右侧拖拽条 */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0"
        style={{
          right: 0,
          width: LEFT_RIGHT_HANDLE_SIZE,
          cursor: cursorStyle,
          zIndex: 50
        }}
        aria-label="右侧拖拽区域"
      />
    </>
  );
};

export default DragHandle;
