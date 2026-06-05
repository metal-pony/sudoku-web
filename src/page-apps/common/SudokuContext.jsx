import { SPACES, Sudoku } from '@metal-pony/sudoku-js';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { range } from '../../util/arrays';
import { CELL_NEIGHBORS, encode } from '@metal-pony/sudoku-js/src/sudoku/Sudoku';

/**
 * @typedef {object} StateLike
 * @property {Sudoku} sudoku
 * @property {number[]} givens
 */

/**
 * @typedef {object} SudokuState
 * @property {Sudoku} sudoku
 * @property {{ sudoku: Sudoku, givens: number[] }[]} history
 * @property {number[]} givens
 * @property {(cellIndex:number,digit:number, autoReduceCandidates?:boolean)=>void} setDigit
 * @property {(cellIndex:number,digit:number)=>void} addCandidate
 * @property {(cellIndex:number,digit:number)=>void} removeCandidate
 * @property {(cellIndex:number,candidates:number)=>void} setCandidates
 * @property {(newSudoku:Sudoku, newGivens:number[], clearHistory:boolean)=>void} sync
 * @property {(scrambleHistory: boolean)=>void} scramble
 * @property {()=>void} undo
 * @property {()=>void} clearHistory
 */

/**
 * @type {React.Context<{ sudokuState: SudokuState } | null>}
 */
export const SudokuContext = /** @type {React.Context<{ sudokuState: SudokuState } | null>} */ (createContext(null));

/**
 *
 * @param {StateLike[]} history
 * @returns {StateLike[]}
 */
function copyHistory(history) {
  return history.map(h => ({
    sudoku: new Sudoku(h.sudoku),
    givens: [...h.givens]
  }));
}

/**
 *
 * @param {object} props
 * @param {Sudoku} props.initialSudoku
 * @param {number[]} props.givenDigits
 * @param {any} props.children
 */
export function SudokuProvider({ initialSudoku, givenDigits, children }) {
  const [sudoku, setSudoku] = useState(new Sudoku(initialSudoku));
  /** @type {ReturnType<typeof useState<number[]>} */
  const [givens, setGivens] = useState([...givenDigits]);

  /**
   * @type {ReturnType<typeof useState<StateLike[]>}
   */
  const [history, setHistory] = useState([]);
  const [useHistory, setUseHistory] = useState(true);

  /** @type {SudokuState} */
  const sudokuState = {
    get sudoku() { return new Sudoku(sudoku); },
    get history() { return copyHistory(history) },

    /**
     * @type {number[]}
     */
    get givens() { return [...givens]; },

    /**
     * @param {number} cellIndex
     * @param {number} digit
     */
    setDigit(cellIndex, digit, autoReduceCandidates = true) {
      if (givens[cellIndex] > 0 || sudoku.getDigit(cellIndex) === digit) return;

      const next = new Sudoku(sudoku);
      if (useHistory) {
        // TODO Unsure if it's okay to store sudoku in another state object.
        setHistory([...history, { sudoku, givens: [...givens]}]);
      }

      next.setDigit(digit, cellIndex);

      if (autoReduceCandidates) {
        // TODO replace with next.applyConstraints()
        // or bake autoReduce into setDigits
        CELL_NEIGHBORS[cellIndex].forEach(ni => {
          if (next.getDigit(ni) > 0) return;
          next._board[ni] &= ~next._cellConstraints(ni);
          // If there are no more candidates for the cell, the board is invalid.
          if (next._board[ni] <= 0) {
            next._isValid = false;
          }
        });
      }

      setSudoku(next);
    },

    /**
     * @param {number} cellIndex
     * @param {number} digit
     */
    addCandidate(cellIndex, digit) {
      if (givens[cellIndex] > 0) return;
      if (useHistory) {
        setHistory([...history, { sudoku, givens: [...givens]}]);
      }
      const next = new Sudoku(sudoku);
      next._board[cellIndex] |= encode(digit);
      setSudoku(next);
    },

    /**
     * @param {number} cellIndex
     * @param {number} digit
     */
    removeCandidate(cellIndex, digit) {
      if (givens[cellIndex] > 0) return;
      if (useHistory) {
        setHistory([...history, { sudoku, givens: [...givens]}]);
      }
      const next = new Sudoku(sudoku);
      next._board[cellIndex] &= ~encode(digit);
      setSudoku(next);
    },

    /**
     * @param {number} cellIndex
     * @param {number} candidates
     */
    setCandidates(cellIndex, candidates) {
      if (givens[cellIndex] > 0) return;
      if (useHistory) {
        setHistory([...history, { sudoku, givens: [...givens]}]);
      }
      const next = new Sudoku(sudoku);
      next.setDigit(0, cellIndex);
      next._board[cellIndex] = candidates;
      setSudoku(next);
    },

    resetCandidates() {
      const newSudoku = new Sudoku(sudoku);
      for (let ci = 0; ci < SPACES; ci++) {
        newSudoku._board[ci] = ((newSudoku.getDigit(ci) > 0) ?
          encode(newSudoku.getDigit(ci)) :
          (ALL & ~newSudoku._cellConstraints(ci))
        );
      }
      setSudoku(newSudoku);
    },

    /**
     * @param {Sudoku} newSudoku
     * @param {number[]} newGivens
     * @param {boolean} clearHistory (Default: true)
     */
    sync(newSudoku, newGivens, clearHistory = true) {
      if (clearHistory) setHistory([]);
      else if (useHistory) {
        setHistory([...history, { sudoku, givens: [...givens]}]);
      }
      setSudoku(new Sudoku(newSudoku));
      setGivens([...newGivens]);
    },

    /**
     * @param {boolean} scrambleHistory (Default: false)
     */
    scramble(scrambleHistory = false) {
      const scrambler = Sudoku.createScrambler();

      if (useHistory) {
        /** @type {StateLike[]} */
        const newHistory = [...history, { sudoku, givens: [...givens]}];
        if (scrambleHistory) {
          for (let i = 0; i < newHistory.length; i++) {
            scrambler(newHistory[i].sudoku);
            const historyGivensSudoku = new Sudoku(newHistory[i].givens);
            scrambler(historyGivensSudoku);
            newHistory[i].givens = historyGivensSudoku.board;
          }
        }
        setHistory(newHistory);
      }

      const next = new Sudoku(sudoku);
      scrambler(next);
      next._resetConstraints();
      setSudoku(next);

      const givensSudoku = new Sudoku(givens);
      scrambler(givensSudoku);
      setGivens(givensSudoku.board);
    },

    undo() {
      if (history.length === 0) return;

      const lastIndex = history.length - 1;
      const top = history[lastIndex];
      setSudoku(new Sudoku(top.sudoku));
      setGivens([...top.givens]);
      setHistory(history.slice(0, lastIndex));
    },

    clearHistory() {
      if (history.length === 0) return;
      setHistory([]);
    },
  };

  return (
    <SudokuContext.Provider value={{ sudokuState }}>
      {children}
    </SudokuContext.Provider>
  );
}

export default SudokuProvider;
