import React, { useState } from 'react';
import classNames from 'classnames';
import { Sudoku } from '@metal-pony/sudoku-js';

import Article from '../components/Article';
import Page from '../components/page/Page';
import SudokuBoard, { SIZES } from '../components/sudoku/SudokuBoard';
import { range, shuffle, swapAllInArr } from '../util/arrays';
import { scrambleTogether } from '../util/sudoku-utils';

export function GamePage({}) {
  // TODO generate via worker promise, then => populate state/context
  // display some loading state while generating
  let game = Sudoku.generatePuzzle2({ numClues: 27 });

  const [board, setBoard] = useState(game.board);
  const [givens, setGivens] = useState(game.board);
  // Left-click: increment cell value
  const cellOnLeftClick = (ci) => {
    const digit = board[ci];
    const newBoard = [...board];
    newBoard[ci] = (digit + 1) % 10;
    setBoard(newBoard);
  };
  // Right-click: clear cell value
  const cellOnRightClick = (ci) => {
    const newBoard = [...board];
    newBoard[ci] = 0;
    setBoard(newBoard);
  };

  /** @param {MouseEvent} ev */
  const newGameBtnClick = (ev) => {
    ev.preventDefault();
    const newGame = Sudoku.generatePuzzle2({ numClues: 27 });
    setBoard(newGame.board);
    setGivens(newGame.board);
  };

  const [isPaused, setIsPaused] = useState(false);
  /** @param {MouseEvent} ev */
  // const pauseResumeBtnClick = (ev) => {
  //   ev.preventDefault();
  //   // On resume => scramble board
  //   if (isPaused) {
  //     const scrambled = scrambleTogether([board, givens]);
  //     setBoard(scrambled[0]);
  //     setGivens(scrambled[1]);
  //   }
  //   setIsPaused(!isPaused);
  // };

  /** @param {MouseEvent} ev */
  const shuffleBtnClick = (ev) => {
    ev.preventDefault();
    const scrambled = scrambleTogether([board, givens]);
    setBoard(scrambled[0]);
    setGivens(scrambled[1]);
  };

  return (
    <Page className='center'>
      <Page.Header
        text='Sudoku.JS' href='/'
        className='w-full pt---- pb- mono gold text-center'
      />
      <div className='w-8 pt----- page-max-width'>
        <main className='flex v row-gap---'>

          <div className='flex h col-gap-- center'>
            <button
              className='clickyBtn-gold px--- py- mono bold large'
              onClick={newGameBtnClick}
            >
              New Game
            </button>

            {/* TODO Pause button - stops timer; obscures board; scrambles board upon resuming */}
            {/* <button
              className={classNames('w-128px clickyToggleBtn-gold px--- py- mono bold', {
                'toggled': !isPaused
              })}
              onClick={pauseResumeBtnClick}
            >
              <i
                className={classNames('fa-solid fa-lg', isPaused ? 'fa-play' : 'fa-pause')}
              ></i>&nbsp;{ isPaused ? 'Resume' : 'Pause'}
            </button> */}

            <button
              className='w-128px clickyBtn-gold px--- py- mono bold'
              onClick={shuffleBtnClick}
            >
              <i className='fa-solid fa-shuffle fa-lg'></i>&nbsp;Shuffle
            </button>
          </div>

          <SudokuBoard
            size={3}
            values={board}
            givens={givens}
            interactive={!isPaused}
            cellOnLeftClick={cellOnLeftClick}
            cellOnRightClick={cellOnRightClick}
          />

        </main>
      </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
  );
}

export default GamePage;
