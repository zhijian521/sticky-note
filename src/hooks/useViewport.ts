import { useState, useCallback, useEffect } from 'react';
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

  // Mouse wheel zoom at cursor position
  const handleWheelZoom = useCallback(
    (e: WheelEvent, element: HTMLDivElement) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, viewport.scale + delta)
      );

      if (newScale !== viewport.scale) {
        const rect = element.getBoundingClientRect();
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
      }
    },
    [viewport, updateViewport]
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  return {
    viewport,
    handleWheelZoom,
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
