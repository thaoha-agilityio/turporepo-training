// Services
import { apiClient } from '@/services';

// Constants
import { INIT_GOLD_PRICE, INIT_GOLD_PRICE_HISTORICAL } from '@/constants';

// Utils
import { renderHook, waitFor, wrapper } from '@/utils/text-utils';

// Hooks
import { useHistoricalPriceGold, useLatestPriceGold } from '../usePriceGold';

jest.mock('@/services', () => ({
  ...jest.requireActual('@/services'),
  apiClient: {
    get: jest.fn(),
  },
}));
jest.useFakeTimers();

describe('useLatestPriceGold', () => {
  it('returns INIT_GOLD_PRICE initially', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { success: true, base: 'USD', rates: { XAU: 0.0003 } },
    });

    const { result } = renderHook(() => useLatestPriceGold('USD'), { wrapper });

    // Before fetch resolves
    expect(result.current.data).toEqual(INIT_GOLD_PRICE);

    // Wait for query to resolve
    await waitFor(() =>
      expect(result.current.data).toEqual({
        success: true,
        base: 'USD',
        rates: { XAU: 0.0003 },
      }),
    );
  });

  it('calls API with correct URL and currency', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { success: true, base: 'EUR', rates: { XAU: 0.00025 } },
    });

    renderHook(() => useLatestPriceGold('EUR'), { wrapper });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('base=EUR&currencies=XAU'),
    );
  });
});

describe('useHistoricalPriceGold', () => {
  it('returns INIT_GOLD_PRICE initially', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { success: true, base: 'USD', rates: { XAU: 0.0003 } },
    });

    const { result } = renderHook(() => useHistoricalPriceGold('USD'), {
      wrapper,
    });

    // Before fetch resolves
    expect(result.current.data).toEqual(INIT_GOLD_PRICE_HISTORICAL);

    // Wait for query to resolve
    await waitFor(() =>
      expect(result.current.data).toEqual({
        success: true,
        base: 'USD',
        rates: { XAU: 0.0003 },
      }),
    );
  });

  it('calls API with correct URL and currency', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { success: true, base: 'EUR', rates: { XAU: { change: 0 } } },
    });

    renderHook(() => useHistoricalPriceGold('EUR'), { wrapper });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('base=EUR&currencies=XAU'),
    );
  });
});
