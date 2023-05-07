import dayjs from 'dayjs';
import getLocale from './utils/locale';

export default function(timestamp) {
  return dayjs(timestamp).toDate().toLocaleDateString(getLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  });
};
