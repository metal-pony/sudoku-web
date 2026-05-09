import { Sudoku } from '@metal-pony/sudoku-js';
import { randInt, range, shuffle, swapAllInArr } from './arrays.js';

/**
 * Scrambles a sudoku board randomly.
 * @param {number[]} board
 * @returns {number[]} A new array containing the scrambled board.
 */
export function scramble(board) {
  return scrambleTogether([board])[0];
}

/**
 * Scrambles the given sudoku boards randomly, using the same steps for each.
 * @param {number[][]} boards
 * @returns {number[][]} A new array of boards.
 */
export function scrambleTogether(boards) {
  const _games = boards.map(b => new Sudoku(b));

  for (let i = 2; i > 0; i--) {
    // randomly swap bands
    let j = (Math.random() * (i+1)) | 0;
    _games.forEach(g => g.swapBands(i, j));

    // randomly swap stack
    j = (Math.random() * (i+1)) | 0;
    _games.forEach(g => g.swapStacks(i, j));
  }

  // randomly swap rows within bands and cols within stacks
  for (let i = 2; i > 0; i--) {
    let j = randInt(i + 1);
    _games.forEach(g => g.swapRows(6 + i, 6 + j));
    j = randInt(i + 1);
    _games.forEach(g => g.swapRows(3 + i, 3 + j));
    j = randInt(i + 1);
    _games.forEach(g => g.swapRows(i, j));

    j = randInt(i + 1);
    _games.forEach(g => g.swapColumns(6 + i, 6 + j));
    j = randInt(i + 1);
    _games.forEach(g => g.swapColumns(3 + i, 3 + j));
    j = randInt(i + 1);
    _games.forEach(g => g.swapColumns(i, j));
  }

  const _boards = _games.map(g => g.board);
  // Shuffle digits
  shuffle(range(10, 1)).forEach((digit, i) => {
    _boards.forEach(b => {
      swapAllInArr(b, digit, i + 1);
    });
  });

  return _boards;
}
