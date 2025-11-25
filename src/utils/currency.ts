/**
 * Currency formatting utilities
 */

/**
 * Format price in NZD currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format price without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Parse price from string
 */
export const parsePrice = (priceString: string): number => {
  const cleaned = priceString.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Calculate shipping cost based on weight and destination
 */
export const calculateShipping = (weight: number, country: string, orderTotal: number): number => {
  // Free shipping on orders over $1000 NZD
  if (orderTotal >= 1000) {
    return 0;
  }

  // Shipping rates by country and weight
  const shippingRates: { [key: string]: { [key: string]: number } } = {
    NZ: {
      '0-1': 8.50,
      '1-2': 12.00,
      '2-3': 18.00,
      '3-4': 25.00,
      '4+': 30.00
    },
    AU: {
      '0-1': 25.00,
      '1+': 35.00
    },
    US: {
      '0-1': 35.00,
      '1+': 50.00
    },
    CA: {
      '0-1': 35.00,
      '1+': 50.00
    },
    GB: {
      '0-1': 40.00,
      '1+': 55.00
    },
    default: {
      '0-1': 50.00,
      '1+': 70.00
    }
  };

  const rates = shippingRates[country] || shippingRates.default;
  
  // Determine weight bracket
  let weightBracket = '1+';
  if (weight <= 1) weightBracket = '0-1';
  else if (weight <= 2 && rates['1-2']) weightBracket = '1-2';
  else if (weight <= 3 && rates['2-3']) weightBracket = '2-3';
  else if (weight <= 4 && rates['3-4']) weightBracket = '3-4';
  else if (rates['4+']) weightBracket = '4+';

  return rates[weightBracket] || rates['1+'] || 50.00;
};

/**
 * Calculate tax (GST for NZ)
 */
export const calculateTax = (amount: number, country: string): number => {
  if (country === 'NZ') {
    return amount * 0.15; // 15% GST
  }
  return 0; // No tax for international orders
};

/**
 * Format weight for display
 */
export const formatWeight = (weight: number): string => {
  if (weight < 1) {
    return `${(weight * 1000).toFixed(0)}g`;
  }
  return `${weight.toFixed(1)}kg`;
};