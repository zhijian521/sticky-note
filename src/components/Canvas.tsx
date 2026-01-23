import { ReactNode, forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ViewportState } from '../types';

interface CanvasProps {
  viewport: ViewportState;
  children: ReactNode;
  className?: string;
  setupCanvas?: (element: HTMLDivElement | null) => (() => void) | undefined;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ viewport, children, className = '', setupCanvas }, ref) => {
    const transform = `translate(${viewport.position.x}px, ${viewport.position.y}px) scale(${viewport.scale})`;

    const motionProps = {
      style: {
        transform,
        transformOrigin: '0 0',
      },
      initial: { transform, transformOrigin: '0 0' },
      animate: { transform, transformOrigin: '0 0' },
      transition: {
        type: 'tween' as const,
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const, // Custom easing for smooth feel
      },
    };

    // Set up canvas event handlers
    useEffect(() => {
      if (setupCanvas && ref && 'current' in ref && ref.current) {
        const cleanup = setupCanvas(ref.current);
        return cleanup;
      }
      return undefined;
    }, [setupCanvas, ref]);

    return (
      <div
        ref={ref}
        className={`canvas-container absolute inset-0 overflow-hidden ${className}`}
        style={{ cursor: viewport.scale > 1 ? 'grab' : 'default' }}
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
