// Components
import { Typography } from '../common/Typography';

// Utils
import { formatChange, formatCurrency, formatPercent } from '@/utils';

interface PriceGoldProps {
  latestPrice?: number;
  change: number;
  changePercent: number;
  currency: string;
  isUSD?: boolean;
}

export const PriceGold = ({
  latestPrice = 0,
  change,
  changePercent,
  currency,
  isUSD,
}: PriceGoldProps) => {
  const symbol = isUSD ? '$' : '€';

  const isPositiveAmount = changePercent >= 0;

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center ">
      <Typography variant="h2" className="text-lg md:text-3xl">
        {symbol}
        {formatCurrency(latestPrice)} {currency}
      </Typography>
      <div>
        <Typography variant="span">
          Change: {formatChange(change, currency)}{' '}
          <span
            className={`font-medium  ${
              isPositiveAmount ? 'text-increase' : 'text-decrease'
            }`}
          >
            {formatPercent(changePercent)}
          </span>
        </Typography>
        <Typography variant="span" className="pl-2">
          24H
        </Typography>
      </div>
    </div>
  );
};
