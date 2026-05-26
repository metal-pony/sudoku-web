import {
  ALL,
  cellCol,
  cellMask,
  cellRegion,
  cellRow,
  DIGITS,
  encode,
  seedSieve,
  SPACES,
  Sudoku,
  SudokuSieve
} from '@metal-pony/sudoku-js';
import { CELL_NEIGHBORS } from '@metal-pony/sudoku-js/src/sudoku/Sudoku';
import React, { createContext, useContext, useReducer } from 'react';

/**
 * @typedef {object} SudokuState
 * @property {number[]} digits
 * @property {number[]} candidates
 * @property {number[]} givens
 * @property {number} numEmptyCells
 * @property {boolean} isValid
 * @property {boolean} isSolved
*/

/**
 * @typedef {object} SudokuAction
 * @property {'setDigit' | 'addCandidate' | 'removeCandidate' | 'scramble' | 'sync'} type
 * @property {number} cellIndex
 * @property {number} digit
 * @property {number} candidates Used with 'setCandidates'
 * @property {Sudoku} sudoku
 * @property {number[]} givens
 * @property {boolean} autoReduceCandidates
 */

/**
 * @type {React.Context<SudokuState>}
 */
const SudokuContext = createContext(null);

/**
 * @type {React.Context<(action: SudokuAction)=>void>}
 */
const SudokuDispatchContext = createContext(null);

/**
 *
 * @param {Sudoku} game
 * @param {number[]} givens
 * @returns {SudokuState}
 */
export function stateFromGame(game, givens = []) {
  return ({
    digits: game.board,
    candidates: [...game._board],
    givens: [...givens],
    numEmptyCells: game.numEmptyCells,
    isValid: game.isValid(),
    isSolved: game.isSolved()
  });
}

/**
 *
 * @param {object} props
 * @param {Sudoku} props.game
 * @param {number[]} props.givens
 * @param {any} props.children
 * @returns
 */
export function SudokuProvider({ game, givens, children }) {
  const [sudoku, dispatch] = useReducer(sudokuReducer, stateFromGame(game, givens));

  return (
    <SudokuContext.Provider value={sudoku}>
      <SudokuDispatchContext.Provider value={dispatch}>
        {children}
      </SudokuDispatchContext.Provider>
    </SudokuContext.Provider>
  );
}

export const useSudoku = () => useContext(SudokuContext);
export const useSudokuDispatch = () => useContext(SudokuDispatchContext);

/**
 *
 * @param {SudokuState} prevState
 * @param {SudokuAction} action
 * @returns {SudokuState}
 */
function sudokuReducer(prevState, action) {
  // console.log(`(sudokuReducer) action: ${JSON.stringify(action, (k, v) => (
  //   (typeof v === 'bigint') ? v.toString() : v
  // ))}`);

  const newState = {
    digits: [...prevState.digits],
    candidates: [...prevState.candidates],
    givens: [...prevState.givens],
    numEmptyCells: prevState.numEmptyCells,
    isValid: prevState.isValid,
    isSolved: prevState.isSolved
  };
  const ci = action.cellIndex || 0;
  const digit = action.digit || 0;
  let game = Sudoku.fromState(prevState);

  switch(action.type) {
    case 'setDigit': {
      if (prevState.givens[ci] > 0) break;

      game.setDigit(digit, ci);

      if (Boolean(action.autoReduceCandidates)) {
        CELL_NEIGHBORS[ci].forEach(ni => {
          if (game._digits[ni] > 0) return;
          game._board[ni] &= ~game._cellConstraints(ni);

          // If there are no more candidates for the cell, the board is invalid.
          if (game._board[ni] <= 0) {
            game._isValid = false;
            game.setDigit(0, ni);
          }
        });
      }

      newState.digits = game.board;
      newState.candidates = game._board;
      newState.numEmptyCells = game.numEmptyCells;
      newState.isValid = game.isValid();
      newState.isSolved = game.isSolved();
      break;
    }
    case 'addCandidate': {
      if (prevState.givens[ci] > 0) break;
      newState.candidates[ci] |= encode(digit);
      break;
    }
    case 'removeCandidate': {
      if (prevState.givens[ci] > 0) break;
      newState.candidates[ci] &= ~encode(digit);
      break;
    }
    case 'setCandidates': {
      if (prevState.givens[ci] > 0) break;
      newState.digits[ci] = 0;
      newState.candidates[ci] = action.candidates;
      break;
    }
    case 'scramble': {
      const scrambler = Sudoku.createScrambler();
      const s1 = Sudoku.fromState(prevState);
      const s2 = new Sudoku(prevState.givens);
      scrambler(s1);
      scrambler(s2);
      newState.digits = s1.board;
      newState.candidates = [...s1._board];
      newState.givens = s2.board;
      break;
    }
    case 'sync': {
      return stateFromGame(action.sudoku, action.givens);
    }

    default: {
      throw Error(`Unknown action: ${''+action.type}`);
    }
  }

  return newState;
}
