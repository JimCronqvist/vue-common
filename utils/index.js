
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

/**
 * Sorts an array by multiple criteria, supporting nested properties (dot notation)
 * and custom accessor functions. Returns a new sorted array without modifying
 * the original (immutable).
 *
 * @param {Array} array - The array of objects to sort.
 * @param {Array<[string|function, 'asc'|'desc']>} fields - Sorting criteria.
 *        Each criterion is an array with:
 *        - a string (dot-separated path, e.g., 'user.age') or a function (custom accessor),
 *        - the sorting direction: 'asc' or 'desc'.
 *
 * @returns {Array} A new array sorted according to the specified criteria.
 *
 * @example
 * const sorted = multiSort(users, [
 *   ['user.name', 'asc'],
 *   [user => user.tags.includes('admin') ? 0 : 1, 'asc'],
 *   ['user.age', 'desc']
 * ]);
 */
export function multiSort(array, fields) {
  const getValue = (obj, key) =>
    typeof key === 'function'
      ? key(obj)
      : key.split('.').reduce((val, prop) => val?.[prop], obj);

  return [...array].sort((a, b) => {
    for (const [key, direction] of fields) {
      const dir = direction === 'desc' ? -1 : 1;
      const valA = getValue(a, key);
      const valB = getValue(b, key);

      if (valA > valB) return dir;
      if (valA < valB) return -dir;
    }
    return 0;
  });
}
