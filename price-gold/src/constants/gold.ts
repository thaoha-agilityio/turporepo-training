import { GoldPrice } from '../types';

export const INIT_GOLD_PRICE: GoldPrice = {
  success: false,
  date: '',
  price: 0,
  rates: {
    XAU: 0,
  },
};

export const INIT_GOLD_PRICE_HISTORICAL = {
  success: false,
  start_rate: 0,
  end_rate: 0,
  rates: {
    XAU: {
      change: 0,
      change_pct: 0,
      end_rate: 0,
      start_rate: 0,
    },
  },
};
