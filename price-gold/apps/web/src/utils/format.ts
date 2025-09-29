/**
 * Format a number as a currency string.
 *
 * @param {number} value - The number to be formatted.
 * @param {number} decimals - The number of decimal places to round to. Defaults to 2.
 * @returns {string} The formatted string.
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDate = (date: Date) => date.toISOString().split('T')[0];

/**
 * Get the latest available date for the API, which is the previous day.
 * @returns {string} The date in ISO format (yyyy-mm-dd).
 */
export const latestAvailableDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() - 1); // API delays by one day

  return formatDate(today);
};

/**
 * Get the previous available date for the API, which is the day before yesterday.
 * @returns {string} The date in ISO format (yyyy-mm-dd).
 */
export const previousAvailableDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 2); // API delays by one day

  return formatDate(yesterday);
};

/**
 * Format a number as a percentage string.
 *
 * @param {number} value - The number to be formatted.
 * @param {number} decimals - The number of decimal places to round to. Defaults to 2.
 * @returns {string} The formatted string.
 */
export const formatPercent = (value: number, decimals = 2): string => {
  return `${value > 0 ? '+' : ''}${formatCurrency(value, decimals)}%`;
};

/**
 * Format a change in value as a string.
 *
 * @param {number} value - The number to be formatted.
 * @param {string} currency - The currency to use for formatting. Defaults to 'USD'.
 * @param {number} decimals - The number of decimal places to round to. Defaults to 2.
 * @returns {string} The formatted string. The string will be prefixed with '+' or '-' depending on the sign of the value.
 */
export const formatChange = (
  value: number,
  currency = 'USD',
  decimals = 2,
): string => {
  const formatted = formatCurrency(value, decimals);
  return `${value > 0 ? '+' : '-'} $${Math.abs(Number(formatted))} ${currency}`;
};
