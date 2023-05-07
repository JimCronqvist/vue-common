import dayjs from 'dayjs';
import getLocale from './utils/locale';

export default function(timestamp) {
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: 'short',
    timeStyle: 'long',
  }).format(dayjs(timestamp).toDate());
};
