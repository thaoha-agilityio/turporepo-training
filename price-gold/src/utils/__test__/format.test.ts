import {
  formatChange,
  formatCurrency,
  formatDate,
  formatPercent,
  latestAvailableDate,
  previousAvailableDate,
} from '../format';

describe('formatCurrency', () => {
  it('should format number with 2 decimals by default', () => {
    expect(formatCurrency(1234.5)).toBe('1,234.50');
    expect(formatCurrency(85)).toBe('85.00');
  });

  it('should format number with custom decimals', () => {
    expect(formatCurrency(1234.567, 3)).toBe('1,234.567');
    expect(formatCurrency(85.4, 1)).toBe('85.4');
  });

  it('should round correctly based on decimals', () => {
    expect(formatCurrency(1.2349, 3)).toBe('1.235');
    expect(formatCurrency(1.2344, 3)).toBe('1.234');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });
});

describe('formatDate', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date('2025-09-12T14:35:00Z');
    expect(formatDate(date)).toBe('2025-09-12');
  });

  it('should pad month and day with leading zeros', () => {
    const date = new Date('2025-01-05T00:00:00Z');
    expect(formatDate(date)).toBe('2025-01-05');
  });

  it('should work with local timezone offset', () => {
    const date = new Date('1999-12-31T23:59:59-05:00');
    // ISO will convert to UTC → "2000-01-01T04:59:59.000Z"
    expect(formatDate(date)).toBe('2000-01-01');
  });

  it('should handle epoch start correctly', () => {
    const date = new Date(0); // Jan 1, 1970 UTC
    expect(formatDate(date)).toBe('1970-01-01');
  });
});

describe('date utils', () => {
  const mockToday = new Date('2025-09-15T10:00:00Z'); // fixed reference date

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockToday); // freeze system time
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('formatDate should format date as yyyy-mm-dd', () => {
    const date = new Date('2025-01-02T12:34:56Z');
    expect(formatDate(date)).toBe('2025-01-02');
  });

  it('latestAvailableDate should return yesterday in yyyy-mm-dd', () => {
    // mockToday = 2025-09-15
    // expected yesterday = 2025-09-14
    expect(latestAvailableDate()).toBe('2025-09-14');
  });

  it('previousAvailableDate should return day before yesterday in yyyy-mm-dd', () => {
    // mockToday = 2025-09-15
    // expected two days ago = 2025-09-13
    expect(previousAvailableDate()).toBe('2025-09-13');
  });
});

describe('formatPercent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds + sign for positive values', () => {
    expect(formatPercent(12.3456)).toBe('+12.35%');
  });

  it('no + sign for negative values', () => {
    expect(formatPercent(-7.891)).toBe('-7.89%');
  });

  it('zero does not get a + sign', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('respects custom decimals', () => {
    expect(formatPercent(3.4567, 1)).toBe('+3.5%');
  });
});

describe('formatChange', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds + sign for positive value', () => {
    expect(formatChange(123.456)).toBe('+ $123.46 USD');
  });

  it('adds - sign for negative value', () => {
    expect(formatChange(-45.678)).toBe('- $45.68 USD');
  });

  it('respects decimals argument', () => {
    expect(formatChange(9.876, 'USD', 1)).toBe('+ $9.9 USD');
  });
});
