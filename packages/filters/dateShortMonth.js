import dayjs from 'dayjs';
import getLocale from './utils/locale';

export default function(timestamp) {
  return dayjs(timestamp).toDate().toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'short',
  });
};
