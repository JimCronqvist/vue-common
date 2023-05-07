export default function(value, decimals = 0) {
  value = value === null || isNaN(value) ? 0 : value;

  const decimalSeparator = (1.1).toLocaleString(undefined).substring(1, 2);
  return (value * 100).toFixed(decimals).replace('.', decimalSeparator) + '%';
};
