import { useCallback, useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance to trigger refresh (px)
  resistance?: number; // How much resistance during pull
  enabled?: boolean; // Enable/disable pull to refresh
  distanceToRefresh?: number; // Min distance to trigger refresh
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  hasRefresh: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
  distanceToRefresh = 60,
}: PullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    hasRefresh: false,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if at top of page
  const isAtTop = useCallback(() => {
    if (containerRef.current) {
      return containerRef.current.scrollTop === 0;
    }
    return window.scrollY === 0;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: Event) => {
      if (!enabled || !isAtTop()) return;

      if (!(e instanceof TouchEvent)) return;

      startY.current = e.touches[0].clientY;
      isDragging.current = true;

      setState((prev) => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
      }));
    },
    [enabled, isAtTop],
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: Event) => {
      if (!enabled || !isDragging.current || !isAtTop()) return;
      if (!(e instanceof TouchEvent)) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        // Prevent default scroll when pulling down
        e.preventDefault();

        const pullDistance = Math.min(deltaY / resistance, threshold);
        const hasRefresh = pullDistance >= distanceToRefresh;

        setState((prev) => ({
          ...prev,
          isPulling: true,
          pullDistance,
          hasRefresh,
        }));
      }
    },
    [enabled, isAtTop, resistance, threshold, distanceToRefresh],
  );

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isDragging.current) return;

    isDragging.current = false;

    if (state.hasRefresh && !state.isRefreshing) {
      setState((prev) => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
          hasRefresh: false,
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        hasRefresh: false,
      }));
    }
  }, [enabled, state.hasRefresh, state.isRefreshing, onRefresh]);

  // Add event listeners
  useEffect(() => {
    if (!enabled) return;

    const element = containerRef.current || document;

    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    containerRef,
    pullToRefreshStyle: {
      transform: `translateY(${state.pullDistance}px)`,
      transition: state.isPulling ? 'none' : 'transform 0.3s ease-out',
    },
  };
};
