import { useQuery } from '@tanstack/react-query';

// Types
import { GoldPrice, HistoricalGoldPrice } from '@/types';

// Constants
import {
  API_KEY,
  INIT_GOLD_PRICE,
  INIT_GOLD_PRICE_HISTORICAL,
  QUERY_KEYS,
  TIMING,
} from '@/constants';

// Services
import { apiClient } from '@/services';

// Utils
import { latestAvailableDate, previousAvailableDate } from '@/utils';

export const useLatestPriceGold = (currency = 'USD') => {
  const { data, ...rest } = useQuery<GoldPrice, string>({
    queryKey: [QUERY_KEYS.PRICE_GOLD + currency],
    queryFn: async () => {
      const response = await apiClient.get<GoldPrice>(
        `latest?api_key=${API_KEY}&base=${currency}&currencies=XAU`,
      );

      return response.data as GoldPrice;
    },
    staleTime: TIMING.API_STALE_TIME,
    refetchOnMount: true, // always refetch when component is mounted
    refetchOnReconnect: 'always', // always refetch when reconnecting (back online)
  });

  return {
    ...rest,
    data: data || INIT_GOLD_PRICE,
  };
};

export const useHistoricalPriceGold = (currency = 'USD') => {
  const startDate = previousAvailableDate();
  const endDate = latestAvailableDate();

  const { data, ...rest } = useQuery<HistoricalGoldPrice, string>({
    queryKey: [QUERY_KEYS.PRICE_GOLD + currency + startDate + endDate],
    queryFn: async () => {
      const response = await apiClient.get<HistoricalGoldPrice>(
        `change?api_key=${API_KEY}&&start_date=${startDate}&end_date=${endDate}&base=${currency}&currencies=XAU`,
      );

      return response.data as HistoricalGoldPrice;
    },
    staleTime: TIMING.API_STALE_TIME,
    refetchOnMount: true,
    refetchOnReconnect: 'always',
  });

  return {
    ...rest,
    data: data || INIT_GOLD_PRICE_HISTORICAL,
  };
};
