// Constants
import { DATA_POINTS } from '@/constants';

// Types
import { PeriodType } from '@/types';

export const generatePriceData = (period: PeriodType) => {
  const now = new Date();
  const points = DATA_POINTS[period] || 48;
  const data = [];
  let basePrice = 85.4;

  for (let i = 0; i < points; i++) {
    const time = new Date(
      now.getTime() - (points - i - 1) * getTimeInterval(period),
    );

    // Create realistic price movement similar to your image
    basePrice += (Math.random() - 0.5) * 0.1;

    // Add some trend patterns to match your chart shape
    if (i < points * 0.15)
      basePrice += 0.01; // Initial rise
    else if (i > points * 0.4 && i < points * 0.6)
      basePrice += 0.015; // Mid rise
    else if (i > points * 0.75) basePrice += 0.02; // Final strong rise

    const price = Math.max(85.0, Math.min(87.0, basePrice));

    data.push({
      time: time.getTime(),
      price: parseFloat(price.toFixed(2)),
      displayTime: formatTimeForDisplay(time, period),
    });
  }

  return data.sort((a, b) => a.time - b.time);
};

const getTimeInterval = (period: PeriodType) => {
  const intervals: Record<PeriodType, number> = {
    '24H': 30 * 60 * 1000, // 30 minutes
    '3D': 60 * 60 * 1000, // 1 hour
    '1W': 2 * 60 * 60 * 1000, // 2 hours
    '1M': 24 * 60 * 60 * 1000, // 1 day
    '3M': 24 * 60 * 60 * 1000, // 1 day
    YTD: 24 * 60 * 60 * 1000, // 1 day
    '1Y': 24 * 60 * 60 * 1000, // 1 day
    '5Y': 7 * 24 * 60 * 60 * 1000, // 1 week
    All: 30 * 24 * 60 * 60 * 1000, // 1 month
  };

  return intervals[period] || intervals['24H'];
};

export const formatTimeForDisplay = (
  date: Date,
  period: PeriodType,
): string => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const dayOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const monthYearOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
  };

  switch (period) {
    case '24H':
      return date.toLocaleTimeString('en-US', timeOptions);
    case '3D':
    case '1W':
      return date.toLocaleDateString('en-US', dayOptions);
    default:
      return date.toLocaleDateString('en-US', monthYearOptions);
  }
};

export const formatXAxisTick = (
  tickValue: number,
  period: PeriodType,
): string => {
  const date = new Date(tickValue);

  const hourOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const dayOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const monthYearOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
  };

  switch (period) {
    case '24H':
      return date.toLocaleTimeString('en-US', hourOptions);
    case '3D':
    case '1W':
      return date.toLocaleDateString('en-US', dayOptions);
    default:
      return date.toLocaleDateString('en-US', monthYearOptions);
  }
};
