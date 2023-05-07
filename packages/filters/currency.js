import getLocale from './utils/locale';

export default function(number, currency) {
  return number.toLocaleString(getLocale(), {
    style: 'currency',
    currency: currency,
  });
};
