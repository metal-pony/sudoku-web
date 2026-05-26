import React, { useState } from 'react';
import classNames from 'classnames';
import { SPACES, Sudoku } from '@metal-pony/sudoku-js';

import { range, shuffle, swapAllInArr } from '../util/arrays';
import Article from '../components/Article';
import Page from '../components/page/Page';
import SudokuGame from '../components/sudoku/SudokuGame';
import { SudokuProvider } from '../components/sudoku/SudokuContext';
import BasePage from './common/BasePage';

export function GamePage({}) {
  // TODO generate via worker promise, then => populate state/context
  // display some loading state while generating
  const game = Sudoku.generatePuzzle2({ numClues: 27 });
  for (let ci = 0; ci < SPACES; ci++) {
    game._board[ci] &= ~game._cellConstraints(ci);
  }

  return (
    <BasePage>
      <SudokuProvider game={game} givens={game.board}>
        <SudokuGame />
      </SudokuProvider>
    </BasePage>
  );
}

export default GamePage;
