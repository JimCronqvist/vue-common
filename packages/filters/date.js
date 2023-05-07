import dayjs from 'dayjs';
import getLocale from './utils/locale';

export default function(timestamp) {
  return dayjs(timestamp).toDate().toLocaleDateString(getLocale(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
