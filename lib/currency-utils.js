// lib/currency-utils.js

export const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£'
  };
  return symbols[currency] || currency;
};

export const formatCurrency = (amount, currency = 'INR') => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
};