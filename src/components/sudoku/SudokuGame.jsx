import React, { useState } from 'react';
import { Sudoku } from '@metal-pony/sudoku-js';

import { scrambleTogether } from '../../util/sudoku-utils';
import { SudokuProvider, useSudoku, useSudokuDispatch } from './SudokuContext';
import SudokuBoard from './SudokuBoard';

export function SudokuGame({}) {
  const sudokuCtx = useSudoku();
  const dispatch = useSudokuDispatch();

  /** @param {MouseEvent} ev */
  const newGameBtnClick = (ev) => {
    ev.preventDefault();
    const newGame = Sudoku.generatePuzzle2({ numClues: 27 });
    dispatch({
      type: 'sync',
      sudoku: newGame,
      givens: newGame.board
    });
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
    const scrambled = scrambleTogether([sudokuCtx.digits, sudokuCtx.givens]);
    dispatch({
      type: 'sync',
      sudoku: new Sudoku(scrambled[0]),
      givens: scrambled[1]
    });
  };

  return (
    <div className='flex v row-gap---'>
      <div className='flex h col-gap-- center'>
        <button
          className='clickyBtn-gold px-- py- mono bold'
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
          <div className='flex h col-gap- center items-center'>
            <i className='fa-solid fa-shuffle fa-lg'></i>&nbsp;Shuffle

          </div>
        </button>
      </div>

      <SudokuBoard
        size={3}
        interactive={!isPaused}
      />
    </div>
  );
}

export default SudokuGame;
