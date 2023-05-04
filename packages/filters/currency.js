export default function(number, currency) {
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: currency,
  });
};
