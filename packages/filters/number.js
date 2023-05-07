import getLocale from './utils/locale';

export default function(number) {
  return number.toLocaleString(getLocale());
};
