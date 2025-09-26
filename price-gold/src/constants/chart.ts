import { PeriodType } from '../types';

export const DATA_POINTS: Record<PeriodType, number> = {
  '24H': 48,
  '3D': 72,
  '1W': 168,
  '1M': 720,
  '3M': 2160,
  YTD: 6000,
  '1Y': 8760,
  '5Y': 43800,
  All: 87600,
};
