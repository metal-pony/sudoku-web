import React, { useState } from 'react';
import classNames from 'classnames';
import { Sudoku } from '@metal-pony/sudoku-js';

import { range, shuffle, swapAllInArr } from '../util/arrays';
import { scrambleTogether } from '../util/sudoku-utils';
import Article from '../components/Article';
import Page from '../components/page/Page';
import SudokuGame from '../components/sudoku/SudokuGame';
import { SudokuProvider } from '../components/sudoku/SudokuContext';

export function GamePage({}) {
  // TODO generate via worker promise, then => populate state/context
  // display some loading state while generating
  const game = Sudoku.generatePuzzle2({ numClues: 27 });

  return (
    <Page className='center'>
      <Page.Header
        text='Sudoku.JS' href='/'
        className='w-full pt---- pb- mono gold text-center'
      />
      <div className='w-8 pt----- page-max-width'>
        <main>
          <SudokuProvider game={game} givens={game.board}>
            <SudokuGame />
          </SudokuProvider>
        </main>
      </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
  );
}

export default GamePage;
