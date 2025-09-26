export enum CurrencyPair {
  USDXAU = 'USDXAU',
  EURXAU = 'EURXAU',
  XAU = 'XAU',
}

export type Rates = Partial<Record<CurrencyPair, number>>;

export interface GoldPrice {
  success: boolean;
  date: string;
  price: number;
  rates: Rates;
}

export interface HistoricalGoldPrice {
  success: boolean;
  start_rate: number;
  end_rate: number;
  rates: {
    XAU: {
      change: number;
      change_pct: number;
      end_rate: number;
      start_rate: number;
    };
  };
}
