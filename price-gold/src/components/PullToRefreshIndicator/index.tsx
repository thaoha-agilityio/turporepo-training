import { RotateCcw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  hasRefresh: boolean;
  pullDistance: number;
  threshold?: number;
}

export const PullToRefreshIndicator = ({
  isPulling,
  isRefreshing,
  pullDistance,
  threshold = 60,
  hasRefresh,
}: PullToRefreshIndicatorProps) => {
  const opacity = Math.min(pullDistance / threshold, 1);

  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0  flex items-center justify-center py-4 z-10"
      style={{
        transform: `translateY(-${Math.max(0, 60 - pullDistance)}px)`,
        opacity: isRefreshing ? 1 : opacity,
      }}
    >
      <div className="flex items-center space-x-2 text-secondary">
        {isRefreshing ? (
          <>
            <RotateCcw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Refreshing...</span>
          </>
        ) : (
          <span className="text-sm font-medium text-secondary">
            {hasRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        )}
      </div>
    </div>
  );
};
