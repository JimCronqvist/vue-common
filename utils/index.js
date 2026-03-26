import { isRef, isProxy, toRaw } from 'vue';

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

/**
 * Debounce function execution by specified wait time.
 *
 * @param callback
 * @param wait
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(callback, wait = 100) {
  let timeoutID = null;
  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(async () => {
      await callback.apply(this, args);
    }, wait);
  };
}

/**
 * Simple deep equality check between two objects.
 *
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
export function isEqual(obj1, obj2) {
  // Check if they are the exact same reference
  if(obj1 === obj2) return true;

  // Handle nulls or primitive mismatches
  if(obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // Get keys for both
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Must have the same number of properties
  if(keys1.length !== keys2.length) return false;

  // Recursively compare every property
  for(const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Deeply clones a value into plain, non-reactive JavaScript data.
 *
 * - Explicitly unwraps Vue refs (ref / computed → .value)
 * - Strips Vue reactivity (reactive / readonly → raw object)
 * - Uses `structuredClone` to break all shared references
 *
 * IMPORTANT:
 * This helper is intended for DTO-like data only.
 *
 * Do NOT pass:
 * - class instances (prototypes & methods are not preserved)
 *   → If a class needs cloning, define an explicit `clone()` method
 *     and call it directly instead of using this helper.
 * - functions
 * - DOM nodes
 * - non-Vue Proxies (e.g. user-created or library proxies)
 *
 * Nested non-plain objects may cause `structuredClone` to throw
 * or result in semantic data loss.
 *
 * Use this at boundaries (API payloads, router params, drafts),
 * not inside reactive mutation logic.
 *
 * @param {*} value - A value, ref, or reactive object to clone
 * @returns {*} A deep-cloned, non-reactive copy of the value
 */
export function deepCloneValue(value) {
  const v = isRef(value) ? value.value : value;   // unwrap refs intentionally
  const raw = isProxy(v) ? toRaw(v) : v;          // strip Vue proxies
  return structuredClone(raw);                    // deep clone
}

/**
 * Creates a performance timer for measuring multistep operations.
 *
 * - `log(step)` logs and returns the time delta since the previous log (or start).
 * - `end(skipLog)` logs (unless skipped) and returns the total duration.
 *
 * All durations are rounded to 2 decimal places (milliseconds).
 *
 * @param {string} [label] - Optional label used as prefix in console output.
 * @returns {{
 *   log: (step?: string) => number,
 *   end: (skipLog?: boolean) => number
 * }}
 */
export function createTimer(label) {
  const start = performance.now();
  let last = start;
  let ended = false;

  const round = (ms) => +ms.toFixed(2);
  const now = () => performance.now();

  function log(step = '') {
    if(ended) return 0;

    const current = now();
    const delta = round(current - last);
    const total = round(current - start);

    last = current;

    const prefix = label ? label : '';
    const stepPart = step ? (prefix ? ` - ${step}` : step) : '';

    console.debug(`${prefix}${stepPart}: +${delta} ms (total ${total} ms)`);

    return delta;
  }

  function end(skipLog = false) {
    if(ended) return 0;

    ended = true;
    const total = round(now() - start);

    if(!skipLog) {
      label
        ? console.debug(`${label} - done: ${total} ms`)
        : console.debug(`Done: ${total} ms`);
    }

    return total;
  }

  return { log, end };
}

export function getErrorMessage(error, fallbackMessage = 'An unknown error occurred.') {
  if(!error) return fallbackMessage;

  if(typeof error === 'string') {
    return error;
  }

  if(error instanceof Error) {
    return error.message;
  }

  // Axios specific
  if(error.isAxiosError && error.response?.data) {
    const data = error.response.data;

    if(typeof data === 'string') return data;

    if(data.message) return data.message;
    if(data.error) return data.error;

    if(data.data?.message) return data.data.message;
    if(data.data?.error) return data.data.error;
  }

  // Generic http responses (fetch, etc.)
  if (typeof error === 'object') {
    if(error.message) return error.message;
    if(error.error) return error.error;

    if(error.data?.message) return error.data.message;
    if(error.data?.error) return error.data.error;
  }

  // Axios fallback
  if(error.response?.status && error.response?.statusText) {
    return `Request failed with status ${error.response.status}: ${error.response.statusText}`;
  }

  if(error.request) {
    return 'No response received from server.';
  }

  return fallbackMessage;
}
