/**
 * Returns an array of numbers from `start` to `end` (exclusive).
 * If `start` is omitted, it defaults to 0.
 * @param {number} start (default: 0)
 * @param {number} end (exclusive)
 * @returns {number[]}
 */
export const range = (end, start = 0) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

/**
 * Shuffles the given array using Fisher-Yates.
 * @param {any[]} arr
 * @returns {any[]}
 */
export function shuffle(arr) {
  let tmp, j;
  for (let i = arr.length - 1; i > 0; i--) {
    j = (Math.random() * (i+1)) | 0;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 *
 * @param {any[]} arr
 * @param {number} i
 * @param {number} j
 */
export function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

/**
 * Swaps all occurrences of `a` and `b` in the given array.
 * @param {any[]} arr
 * @param {number} a
 * @param {number} b
 * @returns {void}
 */
export function swapAllInArr(arr, a, b) {
  if (!arr || arr.length === 0) {
    throw new Error('arr must be a non-empty array');
  }

  if (a === b) return;

  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] === a) arr[i] = b;
    else if (arr[i] === b) arr[i] = a;
  }
};

/**
 * Returns a random integer between 0 and max, exclusive.
 * @param {number} max
 */
export function randInt(max) {
  return (Math.random() * max) | 0;
}
