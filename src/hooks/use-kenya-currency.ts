
/**
 * Custom hook for formatting Kenyan Shilling (KES) values
 */

export function useKenyaCurrency() {
  /**
   * Format a number as Kenyan Shillings (KES)
   * 
   * @param amount - The amount to format
   * @param options - Formatting options
   * @returns Formatted currency string
   */
  const formatKES = (
    amount: number, 
    options: { 
      decimals?: number;
      includeSymbol?: boolean; 
      compactDisplay?: boolean;
    } = {}
  ): string => {
    const { 
      decimals = 2, 
      includeSymbol = true,
      compactDisplay = false
    } = options;
    
    // Format the number according to options
    const formatter = new Intl.NumberFormat('en-KE', {
      style: compactDisplay ? 'decimal' : 'currency',
      currency: compactDisplay ? undefined : 'KES',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compactDisplay ? 'compact' : 'standard',
      compactDisplay: 'short',
    });
    
    let formatted = formatter.format(amount);
    
    // If compact display but still want KES symbol
    if (compactDisplay && includeSymbol) {
      formatted = `KES ${formatted}`;
    }
    
    // If not using compact display and don't want the symbol
    if (!compactDisplay && !includeSymbol) {
      formatted = formatted.replace(/KES\s?/, '');
    }
    
    return formatted;
  };

  /**
   * Convert USD to KES using the current exchange rate
   * 
   * @param usdAmount - Amount in USD
   * @param exchangeRate - USD to KES exchange rate (default: 127.5)
   * @returns Amount in KES
   */
  const convertUSDtoKES = (usdAmount: number, exchangeRate: number = 127.5): number => {
    return usdAmount * exchangeRate;
  };

  /**
   * Convert KES to USD using the current exchange rate
   * 
   * @param kesAmount - Amount in KES
   * @param exchangeRate - USD to KES exchange rate (default: 127.5)
   * @returns Amount in USD
   */
  const convertKEStoUSD = (kesAmount: number, exchangeRate: number = 127.5): number => {
    return kesAmount / exchangeRate;
  };

  /**
   * Format a price showing both KES and USD values
   * 
   * @param kesAmount - Amount in KES
   * @param exchangeRate - USD to KES exchange rate (default: 127.5)
   * @returns Formatted string showing both currencies
   */
  const formatDualCurrency = (kesAmount: number, exchangeRate: number = 127.5): string => {
    const usdAmount = convertKEStoUSD(kesAmount, exchangeRate);
    return `${formatKES(kesAmount)} (USD ${usdAmount.toFixed(2)})`;
  };

  return {
    formatKES,
    convertUSDtoKES,
    convertKEStoUSD,
    formatDualCurrency
  };
}
