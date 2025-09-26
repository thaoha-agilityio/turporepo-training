import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls with event handling
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced function that can handle events
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent default if it's a mouse event
      if (event) {
        event.preventDefault();
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
};
