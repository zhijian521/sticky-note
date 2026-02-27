import { useState, useCallback, useEffect } from 'react';
import { ViewportState, Position } from '../types';

const MIN_SCALE = 0.25;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.1;
const RESET_SCALE = 1.0;
const VIEWPORT_STORAGE_KEY = 'wallnotes_viewport';
const SCREEN_MATCH_THRESHOLD = 120;

const clampScale = (scale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));

interface StoredViewportState extends ViewportState {
  screen: {
    width: number;
    height: number;
  };
}

const isSameScreenSize = (
  screen: StoredViewportState['screen'],
  current: StoredViewportState['screen']
) => {
  return (
    Math.abs(screen.width - current.width) <= SCREEN_MATCH_THRESHOLD &&
    Math.abs(screen.height - current.height) <= SCREEN_MATCH_THRESHOLD
  );
};

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    const currentScreen = { width: window.innerWidth, height: window.innerHeight };
    const saved = localStorage.getItem(VIEWPORT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<StoredViewportState>;
        if (
          parsed.scale !== undefined &&
          parsed.position &&
          parsed.screen &&
          isSameScreenSize(parsed.screen, currentScreen)
        ) {
          return {
            scale: clampScale(parsed.scale),
            position: parsed.position,
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
    const stateToStore: StoredViewportState = {
      ...viewport,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
    localStorage.setItem(VIEWPORT_STORAGE_KEY, JSON.stringify(stateToStore));
  }, [viewport]);

  // Update viewport position when scale changes to center view
  const updateViewport = useCallback((updates: Partial<ViewportState>) => {
    setViewport(prev => {
      const newState = { ...prev, ...updates };

      // Ensure scale stays within bounds
      if (newState.scale !== undefined) {
        newState.scale = clampScale(newState.scale);
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

  const zoomBy = useCallback(
    (delta: number) => {
      const newScale = clampScale(viewport.scale + delta);
      updateViewport(calculateCenterZoom(newScale));
    },
    [viewport.scale, calculateCenterZoom, updateViewport]
  );

  // Zoom functions
  const zoomIn = useCallback(() => {
    zoomBy(SCALE_STEP);
  }, [zoomBy]);

  const zoomOut = useCallback(() => {
    zoomBy(-SCALE_STEP);
  }, [zoomBy]);

  const resetZoom = useCallback(() => {
    updateViewport({ scale: RESET_SCALE, position: { x: 0, y: 0 } });
  }, [updateViewport]);

  const setZoom = useCallback(
    (scale: number) => {
      const clampedScale = clampScale(scale);
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
