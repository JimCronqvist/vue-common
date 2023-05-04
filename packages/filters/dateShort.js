import dayjs from 'dayjs';

export default function(timestamp) {
  return dayjs(timestamp).toDate().toLocaleDateString(dayjs.locale(), {
    day: 'numeric',
    month: 'numeric',
  });
};
