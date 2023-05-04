import dayjs from 'dayjs';

export default function(timestamp) {
  return dayjs(timestamp).format('L');
};
