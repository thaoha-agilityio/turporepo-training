import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Types
import { PeriodType } from '@/types';

// Utils
import { formatXAxisTick, generatePriceData } from '@/utils';

// Components
import { Button } from '../common/Button';

export const TradingPriceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('24H');

  // API not supported, using generated data for now
  const [data, setData] = useState(() => generatePriceData('24H'));

  const periods = [
    '24H',
    '3D',
    '1W',
    '1M',
    '3M',
    'YTD',
    '1Y',
    '5Y',
    'All',
  ] as PeriodType[];

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    setData(generatePriceData(period));
  };

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.05;

  // Calculate tick positions for Y axis labels
  const yAxisTicks = [
    minPrice,
    minPrice + priceRange * 0.25,
    minPrice + priceRange * 0.5,
    minPrice + priceRange * 0.75,
    maxPrice,
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
      {/* Time Period Buttons */}
      <div className="flex justify-end mb-6 space-x-1">
        {periods.map((period) => (
          <Button
            variant="ghost"
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-1 md:px-3 py-1.5 text-xs md:text-sm font-medium rounded transition-colors ${
              selectedPeriod === period
                ? 'text-chart'
                : 'text-secondary hover:bg-gray-100'
            }`}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="relative h-96 w-full">
        {/* Custom Y-axis labels positioned on the right */}
        <div className="absolute right-2 top-6 h-80 flex flex-col justify-between text-xs text-secondary z-10 pointer-events-none">
          {yAxisTicks.reverse().map((tick, index) => (
            <div key={index} className="text-right">
              {tick.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Recharts Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            {/* Grid configuration */}
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              axisLine
              tickLine
              tick={{ fontSize: 11, fill: '#666666' }}
              tickFormatter={(value) => formatXAxisTick(value, selectedPeriod)}
              tickCount={6}
            />
            <YAxis
              hide={true}
              domain={[minPrice - padding, maxPrice + padding]}
              type="number"
            />

            {/* Main price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#008fbe"
              strokeWidth={1}
              dot={false}
              activeDot={{ r: 4, fill: '#008fbe', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
