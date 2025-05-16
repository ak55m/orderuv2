/**
 * Formats a number as currency with the given currency symbol
 */
export function formatCurrency(amount: number, currencySymbol = '$'): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
} 