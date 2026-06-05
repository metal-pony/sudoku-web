import React, { useState } from 'react';
import classNames from 'classnames';
import { ALL, SPACES, Sudoku } from '@metal-pony/sudoku-js';

import { range, shuffle, swapAllInArr } from '../util/arrays';
import Article from '../components/Article';
import Page from '../components/page/Page';
import SudokuGame from '../components/sudoku/SudokuGame';
import SudokuProvider from './common/SudokuContext';
import BasePage from './common/BasePage';

const URL_PARAM_GRID = 'grid';

export function GamePage({}) {
  /** @type {Sudoku} */
  let grid = null;

  // Load grid from URL if it's present
  const urlParams = new URLSearchParams(location.search);
  let usingURLGrid = urlParams.has(URL_PARAM_GRID);
  if (usingURLGrid) {
    const paramStr = urlParams.get(URL_PARAM_GRID).trim();
    if (Sudoku.validateStr(paramStr)) {
      grid = Sudoku.fromString(paramStr);
    } else {
      console.warn(`⚠️ Grid from URL is not valid: \'${paramStr}\'`);
      usingURLGrid = false;
    }
  }

  // TODO generate via worker promise, then => populate state/context
  // and display some loading state while generating.
  // If no grid from URL, fallback to generation.
  if (!grid) {
    grid = Sudoku.generatePuzzle2({ numClues: 27 });
  }

  // Reduce grid's initial cell candidates
  for (let ci = 0; ci < SPACES; ci++) {
    grid._board[ci] = ALL & ~grid._cellConstraints(ci);
  }

  return (
    <BasePage>
      <SudokuProvider initialSudoku={grid} givenDigits={grid.board}>
        <SudokuGame />
      </SudokuProvider>
    </BasePage>
  );
}

export default GamePage;
