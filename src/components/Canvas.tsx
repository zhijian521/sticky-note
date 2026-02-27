import {
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { ViewportState, Position } from '../types';

interface CanvasProps {
  viewport: ViewportState;
  children: ReactNode;
  className?: string;
  onViewportChange: (updates: Partial<ViewportState>) => void;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ viewport, children, className = '', onViewportChange }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<Position | null>(null);
    const startPositionRef = useRef<Position | null>(null);
    const activePointerIdRef = useRef<number | null>(null);

    // Forward ref to external if provided
    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(internalRef.current);
      } else if (ref && 'current' in ref) {
        (ref as { current: HTMLDivElement | null }).current =
          internalRef.current;
      }
    }, [ref]);

    // Handle mouse drag
    const handlePointerDown = useCallback(
      (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        const isClickingOnNote = target.closest('[data-note-id]');

        if (isClickingOnNote || activePointerIdRef.current !== null) return;

        // Only start dragging if clicking on canvas container, not on notes
        activePointerIdRef.current = e.pointerId;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        startPositionRef.current = { ...viewport.position };
        e.preventDefault();
      },
      [viewport.position]
    );

    const handlePointerMove = useCallback(
      (e: PointerEvent) => {
        if (activePointerIdRef.current !== e.pointerId) return;

        const dragStart = dragStartRef.current;
        const startPosition = startPositionRef.current;
        if (!isDragging || !dragStart || !startPosition) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        onViewportChange({
          position: {
            x: startPosition.x + deltaX,
            y: startPosition.y + deltaY,
          },
        });
      },
      [isDragging, onViewportChange]
    );

    const handlePointerUp = useCallback((e: PointerEvent) => {
      if (activePointerIdRef.current !== e.pointerId) return;

      if (!isDragging) return;
      setIsDragging(false);
      activePointerIdRef.current = null;
      dragStartRef.current = null;
      startPositionRef.current = null;
    }, [isDragging]);

    // Set up event listeners
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      element.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointercancel', handlePointerUp);

      return () => {
        element.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointercancel', handlePointerUp);
      };
    }, [handlePointerDown, handlePointerMove, handlePointerUp]);

    const transform = `translate(${viewport.position.x}px, ${viewport.position.y}px) scale(${viewport.scale})`;
    const cursor = isDragging
      ? 'grabbing'
      : viewport.scale > 1
        ? 'grab'
        : 'default';

    const motionProps = {
      initial: { transform, transformOrigin: '0 0' },
      animate: { transform, transformOrigin: '0 0' },
      transition: {
        type: 'tween' as const,
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    };

    return (
      <div
        ref={internalRef}
        className={`canvas-container absolute inset-0 ${className}`}
        style={{ cursor, touchAction: 'none' }}
      >
        <motion.div className="relative w-full h-full" {...motionProps}>
          {children}
        </motion.div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas;
