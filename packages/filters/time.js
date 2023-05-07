import dayjs from 'dayjs';
import getLocale from './utils/locale';

export default function(timestamp) {
  return dayjs(timestamp).toDate().toLocaleTimeString(getLocale(), {
    timeStyle: 'short',
  });
};
