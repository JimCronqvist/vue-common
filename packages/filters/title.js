export default function(value) {
  return value
    .toString()
    .split(' ')
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
};
