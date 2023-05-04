export default function(value) {
  return value || value === 0 ? value.toString().toUpperCase() : '';
};
