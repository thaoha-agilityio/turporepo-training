import { act, renderHook } from '@/utils/text-utils';

// Hook
import { useDebouncedCallback } from '../useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('executes callback after delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current(); // call debounced function
    });

    // Not yet called
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets timer if called again before delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
      jest.advanceTimersByTime(300); // not enough time
      result.current(); // call again before delay expires
      jest.advanceTimersByTime(300); // still not enough for 500
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200); // now 500ms passed since last call
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('prevents default if event passed', () => {
    const callback = jest.fn();
    const preventDefault = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 200));

    act(() => {
      result.current({
        preventDefault,
      } as unknown as React.MouseEvent<HTMLButtonElement>);
      jest.advanceTimersByTime(200);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
