import React, { useEffect, useRef, useState } from 'react';
import { Sudoku } from '@metal-pony/sudoku-js';

import { scrambleTogether } from '../../util/sudoku-utils';
import { SudokuProvider, useSudoku, useSudokuDispatch } from './SudokuContext';
import SudokuBoard from './SudokuBoard';
import classNames from 'classnames';

const MS_PER_HR = 3_600_000;
const MS_PER_MIN = 60_000;
const MS_PER_SEC = 1000;

/**
 *
 * @param {number} timeMs
 * @returns {string}
 */
function formatTimeText(timeMs) {
  const hrs = Math.trunc(timeMs / MS_PER_HR);
  timeMs -= (MS_PER_HR * hrs);
  const mins = Math.trunc(timeMs / MS_PER_MIN);
  timeMs -= (MS_PER_MIN * mins);
  const secs = Math.trunc(timeMs / MS_PER_SEC);
  return `${(''+hrs).padStart(2,'0')}h:${(''+mins).padStart(2,'0')}m:${(''+secs).padStart(2,'0')}s`;
}

export function SudokuGame({}) {
  const sudokuCtx = useSudoku();
  const dispatch = useSudokuDispatch();

  const [timeStarted, setTimeStarted] = useState(0);
  const [timeSolved, setTimeSolved] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasStarted = timeStarted > 0;

  /** @type {React.RefObject<HTMLSpanElement>} */
  const timerTextRef = useRef(null);

  useEffect(() => {
    const cleanupFns = [];

    // Only set the timer update if the game is in progress.
    if (timeStarted > 0 && timeSolved === 0) {
      const intervalId = setInterval(() => {
        timerTextRef.current.innerText = `Time: ${formatTimeText(Date.now() - timeStarted)}`;
      }, 1000);
      cleanupFns.push(() => {
        clearInterval(intervalId);
      });
    }

    return (() => {
      cleanupFns.forEach(fn => { fn(); });
    });
  }, [timeStarted, timeSolved]);


  /** @param {MouseEvent} ev */
  const newGameBtnClick = (ev) => {
    ev.preventDefault();
    const newGame = Sudoku.generatePuzzle2({ numClues: 27 });
    dispatch({
      type: 'sync',
      sudoku: newGame,
      givens: newGame.board
    });
    setIsPaused(false);
    setTimeStarted(0);
    setTimeSolved(0);
    timerTextRef.current.innerText = ''
  };

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

  let timerText = '';
  if (sudokuCtx.isSolved) {
    const now = Date.now();
    if (timeSolved === 0) setTimeSolved(now);
    if (timeStarted === 0) setTimeStarted(now);

    timerText = `Time: ${formatTimeText(timeSolved - timeStarted)}`;
  }

  const gameStartOverlay = (
    <div className={classNames('sudoku-board-overlay', { 'hidden': hasStarted })}>
      <button
        className='clickyBtn-secondary btn-lg px---- py- mono bold x-large'
        onClick={(ev)=> {
          ev.preventDefault();
          if (!hasStarted) {
            setTimeStarted(Date.now());
          }
        }}
      >
        Start
      </button>
    </div>
  );

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

      <div className='flex center items-center'>
        <SudokuBoard
          className={classNames('filter-transition', {
            'blur-6': (!hasStarted || isPaused)
          })}
          size={3}
          interactive={!isPaused && !sudokuCtx.isSolved}
        />
        { gameStartOverlay }
      </div>

      <span
        ref={timerTextRef}
        className={classNames(
          'py- text-center small mono',
          sudokuCtx.isSolved ? 'secondary' : 'grey'
        )}
      >{timerText}</span>
    </div>
  );
}

export default SudokuGame;
