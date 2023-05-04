export default function(value, decimals = 0, locale) {
  value = value === null || isNaN(value) ? 0 : value;

  const decimalSeparator = (1.1).toLocaleString(locale).substring(1, 2);
  return (value * 100).toFixed(decimals).replace('.', decimalSeparator) + '%';
};
