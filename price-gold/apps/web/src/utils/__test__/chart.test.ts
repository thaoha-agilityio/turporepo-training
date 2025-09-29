import { PeriodType } from '@/types';
import { generatePriceData, formatTimeForDisplay } from '../chart';

describe('generatePriceData', () => {
  it('should generate data points for a given period', () => {
    const data = generatePriceData('24H' as PeriodType);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    // Each point should have time, price, displayTime
    data.forEach((point) => {
      expect(point).toHaveProperty('time');
      expect(point).toHaveProperty('price');
      expect(point).toHaveProperty('displayTime');
      expect(typeof point.price).toBe('number');
    });
  });

  it('should return sorted data by time ascending', () => {
    const data = generatePriceData('1W' as PeriodType);
    const times = data.map((d) => d.time);

    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('should keep prices within expected range (85.0 - 87.0)', () => {
    const data = generatePriceData('1M' as PeriodType);

    data.forEach((point) => {
      expect(point.price).toBeGreaterThanOrEqual(85.0);
      expect(point.price).toBeLessThanOrEqual(87.0);
    });
  });

  it('should generate correct number of data points for period', () => {
    const data = generatePriceData('3D' as PeriodType);
    const expectedPoints = 72;
    expect(data.length).toBe(expectedPoints);
  });
});

describe('formatTimeForDisplay', () => {
  const mockDate = new Date('2025-09-12T14:35:00Z'); // UTC date

  it('should format as HH:mm for 24H period', () => {
    const result = formatTimeForDisplay(mockDate, '24H' as PeriodType);
    // en-US with hour12: false → "14:35" (depends on TZ, so match regex)
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should format as 'Mon DD' for 3D", () => {
    const result = formatTimeForDisplay(mockDate, '3D' as PeriodType);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/); // e.g. "Sep 12"
  });

  it("should format as 'Mon DD' for 1W", () => {
    const result = formatTimeForDisplay(mockDate, '1W' as PeriodType);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
  });

  it("should format as 'Mon YY' for default (1M, 3M, etc.)", () => {
    const result = formatTimeForDisplay(mockDate, '1M' as PeriodType);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{2}$/); // e.g. "Sep 25"
  });

  it("should format as 'Mon YY' for YTD", () => {
    const result = formatTimeForDisplay(mockDate, 'YTD' as PeriodType);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{2}$/);
  });

  it("should format as 'Mon YY' for All", () => {
    const result = formatTimeForDisplay(mockDate, 'All' as PeriodType);
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{2}$/);
  });
});
