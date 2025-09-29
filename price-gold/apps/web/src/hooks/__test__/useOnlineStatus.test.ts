import { act, renderHook } from '@/utils/text-utils';

// Hook
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus', () => {
  const setNavigatorOnLine = (value: boolean) => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => value,
    });
  };

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('initial state should match navigator.onLine', () => {
    setNavigatorOnLine(true);
    const { result: onlineResult } = renderHook(() => useOnlineStatus());
    expect(onlineResult.current).toBe(true);

    setNavigatorOnLine(false);
    const { result: offlineResult } = renderHook(() => useOnlineStatus());
    expect(offlineResult.current).toBe(false);
  });

  it('should update when going offline', () => {
    setNavigatorOnLine(true);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });

  it('should update when going online', () => {
    setNavigatorOnLine(false);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });
});
