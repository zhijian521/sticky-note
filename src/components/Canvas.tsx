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
  onWheel: (e: WheelEvent, element: HTMLDivElement) => void;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ viewport, children, className = '', onViewportChange, onWheel }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState<Position>({
      x: 0,
      y: 0,
    });

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
    const handleMouseDown = useCallback(
      (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClickingOnNote = target.closest('[data-note-id]');

        // Only start dragging if clicking on canvas container, not on notes
        if (!isClickingOnNote) {
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          setStartPosition({ ...viewport.position });
          e.preventDefault();
        }
      },
      [viewport.position]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (isDragging) {
          const deltaX = e.clientX - dragStart.x;
          const deltaY = e.clientY - dragStart.y;

          const newPosition = {
            x: startPosition.x + deltaX,
            y: startPosition.y + deltaY,
          };

          onViewportChange({ position: newPosition });
        }
      },
      [isDragging, dragStart, startPosition, onViewportChange]
    );

    const handleMouseUp = useCallback(() => {
      if (isDragging) {
        setIsDragging(false);
      }
    }, [isDragging]);

    // Handle wheel events
    const handleWheel = useCallback(
      (e: WheelEvent) => {
        const element = internalRef.current;
        if (element) {
          onWheel(e, element);
        }
      },
      [onWheel]
    );

    // Set up event listeners
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

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
        style={{ cursor }}
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
