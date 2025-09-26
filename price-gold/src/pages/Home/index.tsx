import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Components
import {
  Button,
  PriceGold,
  SelectDropdown,
  Tabs,
  Typography,
  TradingPriceChart,
  PullToRefreshIndicator,
  NotificationInfo,
} from '@/components';

// Constants
import { CURRENCIES_OPTIONS, NOTIFICATION_MESSAGES } from '@/constants';

// Hooks
import {
  useDebouncedCallback,
  useHistoricalPriceGold,
  useIsMobile,
  useLatestPriceGold,
  useNotificationPermission,
  useOnlineStatus,
  usePullToRefresh,
} from '@/hooks';

// utils
import { isIOS, isStandalone } from '@/utils';

export const Home = () => {
  const [currency, setCurrency] = useState(CURRENCIES_OPTIONS[0].value);
  const isOnline = useOnlineStatus();

  // Queries
  const {
    data: latestData,
    isFetching,
    refetch,
    error: errorLatest,
  } = useLatestPriceGold(currency);

  const { data: historicalData, error: errorHistorical } =
    useHistoricalPriceGold(currency);

  // Latest rates
  const { rates: latestRates, success } = latestData || {};
  const { rates: historicalRates } = historicalData || {};

  // Helpers
  const isUSD = currency === CURRENCIES_OPTIONS[0].value;
  const latestPrice = isUSD ? latestRates?.USDXAU : latestRates?.EURXAU;

  // Additional data
  const xauData = historicalRates?.XAU ?? { change: 0, change_pct: 0 };

  const TABS_DATA = [
    {
      value: 'gold',
      label: 'Gold',
      content: (
        <PriceGold
          isUSD={isUSD}
          latestPrice={latestPrice}
          change={xauData.change}
          changePercent={xauData.change_pct}
          currency={currency}
        />
      ),
    },
    {
      value: 'sliver',
      label: 'Sliver',
      content: <Typography>Sliver</Typography>,
    },
    {
      value: 'platinum',
      label: 'Platinum',
      content: <Typography>Platinum</Typography>,
    },
    {
      value: 'palladium',
      label: 'Palladium',
      content: <Typography>Palladium</Typography>,
    },
  ];

  const handleRefresh = useDebouncedCallback(() => refetch(), 500);

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };
  // Pull to refresh hook
  const {
    isPulling,
    isRefreshing,
    hasRefresh,
    pullDistance,
    containerRef,
    pullToRefreshStyle,
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
    enabled: true,
    distanceToRefresh: 60,
  });

  const isMobile = useIsMobile();

  useEffect(() => {
    if (errorLatest || errorHistorical) {
      toast.error('Fetch error', {
        description: errorLatest || errorHistorical,
      });
    }
  }, [errorLatest, errorHistorical, success]);

  const { permission, requestPermission, isSupported, isBlocked, isPending } =
    useNotificationPermission();

  useEffect(() => {
    if (isBlocked) {
      toast.error(NOTIFICATION_MESSAGES.BLOCKED);
    }
  }, [isBlocked]);

  const handleRequest = async () => {
    const result = await requestPermission();

    if (result === 'granted') {
      toast.success(NOTIFICATION_MESSAGES.GRANTED);

      return;
    }

    if (result === 'denied') {
      toast.error(NOTIFICATION_MESSAGES.DENIED);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-auto bg-gray-50"
      style={pullToRefreshStyle}
    >
      {/* Pull to refresh indicator */}
      {isMobile && (
        <PullToRefreshIndicator
          isPulling={isPulling}
          isRefreshing={isRefreshing || isFetching}
          hasRefresh={hasRefresh}
          pullDistance={pullDistance}
        />
      )}
      <div className="p-3 w-full m-auto md:max-w-6xl py-6">
        <NotificationInfo
          isSupported={isSupported}
          permission={permission}
          isPending={isPending}
          isBlocked={isBlocked}
          isIOS={isIOS}
          isStandalone={isStandalone}
          onRequest={handleRequest}
        />

        <Typography variant="h1" className="mt-2">
          Gold Price Charts
        </Typography>
        <div className="my-6 flex md:flex-row flex-col-reverse justify-between">
          <Tabs tabs={TABS_DATA} />

          <div className="flex pb-3 md:pb-0 gap-2 md:gap-4">
            {!isMobile && (
              <Button
                disabled={isFetching}
                isLoading={isFetching}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            )}
            <SelectDropdown
              selectedValue={currency}
              options={CURRENCIES_OPTIONS}
              extraStyle="w-[120px] md:w-[200px]"
              onSelect={handleCurrencyChange}
            />
          </div>
        </div>

        {!isOnline && (
          <Typography className="text-destructive py-4">
            You are offline. Data may be outdated.
          </Typography>
        )}
        <TradingPriceChart />
      </div>
    </div>
  );
};
