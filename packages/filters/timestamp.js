import dayjs from 'dayjs';

export default function(timestamp) {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};
