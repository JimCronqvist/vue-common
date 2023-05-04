import dayjs from 'dayjs';

/**
 * https://day.js.org/docs/en/display/format
 *
 * @param date {string}
 * @param format {string}
 * @returns {string}
 */
export default function(date, format= 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format);
};
