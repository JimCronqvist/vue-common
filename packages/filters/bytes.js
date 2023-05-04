export default function(bytes,decimals = 'auto') {
  if(!+bytes) return '0 byte';
  if(bytes === 1) return '1 byte';

  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const number = bytes / Math.pow(k, i);
  const dm = decimals === 'auto' ? (number < 10 ? 1 : 0) : (decimals < 0 ? 0 : decimals);
  return `${parseFloat(number.toFixed(dm))} ${sizes[i]}`;
};
