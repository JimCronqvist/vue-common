
/**
 * Sets a property in an object immutably using a dot-separated path.
 *
 * @param {Object} obj - The object to modify
 * @param {string} path - Dot-separated path
 * @param {*} value - The value to set at the given path
 * @returns {Object} New object with updated value
 */
export function set(obj, path, value) {
  const keys = path.split('.');
  if(keys.length === 0) return obj;
  const [head, ...tail] = keys;
  return { ...obj, [head]: tail.length ? set(obj[head] ?? {}, tail.join('.'), value) : value, };
}
