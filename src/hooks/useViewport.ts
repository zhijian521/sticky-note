import { useState, useCallback, useRef, useEffect } from 'react';
import { ViewportState, Position } from '../types';

const MIN_SCALE = 0.25;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.1;
const RESET_SCALE = 1.0;

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    const saved = localStorage.getItem('wallnotes_viewport');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.scale && parsed.position) {
          return {
            scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, parsed.scale)),
            position: parsed.position || { x: 0, y: 0 },
          };
        }
      } catch {
        // Ignore parsing errors
      }
    }
    return { scale: RESET_SCALE, position: { x: 0, y: 0 } };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );

  // Save viewport state to localStorage
  useEffect(() => {
    localStorage.setItem('wallnotes_viewport', JSON.stringify(viewport));
  }, [viewport]);

  // Update viewport position when scale changes to center view
  const updateViewport = useCallback((updates: Partial<ViewportState>) => {
    setViewport(prev => {
      const newState = { ...prev, ...updates };

      // Ensure scale stays within bounds
      if (newState.scale !== undefined) {
        newState.scale = Math.max(
          MIN_SCALE,
          Math.min(MAX_SCALE, newState.scale)
        );
      }

      return newState;
    });
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    updateViewport({ scale: viewport.scale + SCALE_STEP });
  }, [viewport.scale, updateViewport]);

  const zoomOut = useCallback(() => {
    updateViewport({ scale: viewport.scale - SCALE_STEP });
  }, [viewport.scale, updateViewport]);

  const resetZoom = useCallback(() => {
    updateViewport({ scale: RESET_SCALE, position: { x: 0, y: 0 } });
  }, [updateViewport]);

  const setZoom = useCallback(
    (scale: number) => {
      updateViewport({ scale });
    },
    [updateViewport]
  );

  // Pan functions
  const panTo = useCallback(
    (position: Position) => {
      updateViewport({ position });
    },
    [updateViewport]
  );

  const panBy = useCallback((delta: Position) => {
    setViewport(prev => ({
      ...prev,
      position: {
        x: prev.position.x + delta.x,
        y: prev.position.y + delta.y,
      },
    }));
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, viewport.scale + delta)
      );

      if (newScale !== viewport.scale) {
        // Calculate mouse position relative to container
        const container = canvasRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Calculate new position to zoom towards mouse position
          const scaleChange = newScale - viewport.scale;
          const newX =
            viewport.position.x - (mouseX * scaleChange) / viewport.scale;
          const newY =
            viewport.position.y - (mouseY * scaleChange) / viewport.scale;

          updateViewport({
            scale: newScale,
            position: { x: newX, y: newY },
          });
        } else {
          updateViewport({ scale: newScale });
        }
      }
    },
    [viewport, updateViewport]
  );

  // Mouse drag to pan
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // Only start dragging if clicking on canvas directly (not on notes)
      const target = e.target as HTMLElement;
      if (target === canvasRef.current || target.closest('.canvas-container')) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        lastPositionRef.current = viewport.position;
        e.preventDefault();
      }
    },
    [viewport.position]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newPosition = {
        x: lastPositionRef.current.x + deltaX,
        y: lastPositionRef.current.y + deltaY,
      };

      setViewport(prev => ({ ...prev, position: newPosition }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (touch) {
        lastTouchRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      }
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        lastTouchRef.current = { x: distance, y: 0, time: Date.now() };
      }
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && lastTouchRef.current) {
        // Pan with single finger
        const touch = e.touches[0];
        if (touch) {
          const deltaX = touch.clientX - lastTouchRef.current.x;
          const deltaY = touch.clientY - lastTouchRef.current.y;

          setViewport(prev => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY,
            },
          }));

          lastTouchRef.current.x = touch.clientX;
          lastTouchRef.current.y = touch.clientY;
        }
      } else if (e.touches.length === 2 && lastTouchRef.current) {
        // Pinch to zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        if (touch1 && touch2) {
          const distance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );

          const scaleChange = distance / lastTouchRef.current.x;
          const newScale = Math.max(
            MIN_SCALE,
            Math.min(MAX_SCALE, viewport.scale * scaleChange)
          );

          if (newScale !== viewport.scale) {
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;

            const scaleDiff = newScale - viewport.scale;
            const newX =
              viewport.position.x - (centerX * scaleDiff) / viewport.scale;
            const newY =
              viewport.position.y - (centerY * scaleDiff) / viewport.scale;

            updateViewport({ scale: newScale, position: { x: newX, y: newY } });
          }

          lastTouchRef.current.x = distance;
        }
      }
    },
    [viewport, updateViewport]
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
  }, []);

  // Set up event listeners for canvas element
  const setupCanvas = useCallback(
    (element: HTMLDivElement | null) => {
      canvasRef.current = element;
      if (!element) return;

      // Mouse events
      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Touch events
      element.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      element.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        // Mouse events
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Touch events
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
      };
    },
    [
      handleWheel,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ]
  );

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
          case '_':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
        }
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        resetZoom();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  return {
    viewport,
    setupCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    panTo,
    panBy,
    MIN_SCALE,
    MAX_SCALE,
    SCALE_STEP,
  };
}
