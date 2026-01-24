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

  // Helper function to calculate zoom towards screen center
  const calculateCenterZoom = useCallback(
    (newScale: number) => {
      // Get canvas element to calculate center point
      const canvasElement = document.querySelector(
        '.canvas-container'
      ) as HTMLDivElement;
      if (!canvasElement) return { scale: newScale };

      const rect = canvasElement.getBoundingClientRect();
      const centerX = window.innerWidth / 2 - rect.left;
      const centerY = window.innerHeight / 2 - rect.top;

      // Calculate new position to zoom towards screen center
      const scaleChange = newScale - viewport.scale;
      const newX =
        viewport.position.x - (centerX * scaleChange) / viewport.scale;
      const newY =
        viewport.position.y - (centerY * scaleChange) / viewport.scale;

      return {
        scale: newScale,
        position: { x: newX, y: newY },
      };
    },
    [viewport]
  );

  // Zoom functions
  const zoomIn = useCallback(() => {
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, viewport.scale + SCALE_STEP)
    );
    updateViewport(calculateCenterZoom(newScale));
  }, [viewport.scale, calculateCenterZoom, updateViewport]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, viewport.scale - SCALE_STEP)
    );
    updateViewport(calculateCenterZoom(newScale));
  }, [viewport.scale, calculateCenterZoom, updateViewport]);

  const resetZoom = useCallback(() => {
    updateViewport({ scale: RESET_SCALE, position: { x: 0, y: 0 } });
  }, [updateViewport]);

  const setZoom = useCallback(
    (scale: number) => {
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
      updateViewport(calculateCenterZoom(clampedScale));
    },
    [calculateCenterZoom, updateViewport]
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
