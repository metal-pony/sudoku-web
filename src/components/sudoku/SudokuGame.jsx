import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sudoku } from '@metal-pony/sudoku-js';

import { scrambleTogether } from '../../util/sudoku-utils';
import { SudokuProvider, useSudoku, useSudokuDispatch } from './SudokuContext';
import SudokuBoard from './SudokuBoard';
import classNames from 'classnames';
import { SettingsContext } from '../../page-apps/common/AppSettingsContext';

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
  const {appState, setAppState} = useContext(SettingsContext);
  const sudokuCtx = useSudoku();
  const dispatch = useSudokuDispatch();

  const [timeStarted, setTimeStarted] = useState(0);
  const [timeSolved, setTimeSolved] = useState(0);

  const [timePaused, setTimePaused] = useState(0);
  const [accumulatedPauseTime, setAccumulatedPauseTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasStarted = (timeStarted > 0);
  const gameInProgress = (hasStarted && !sudokuCtx.isSolved);

  /** @type {React.RefObject<HTMLSpanElement>} */
  const timerTextRef = useRef(null);

  useEffect(() => {
    const cleanupFns = [];

    // If showTimer setting changed while the game was paused, unpause the game.
    if (isPaused && !appState.showTimer) {
      setIsPaused(false);
    }

    // Only set the timer update if the game is in progress.
    if (gameInProgress && appState.showTimer && !isPaused) {
      const intervalId = setInterval(() => {
        const t = Date.now() - timeStarted - accumulatedPauseTime;
        timerTextRef.current.innerText = formatTimeText(t);
      }, 1000);
      cleanupFns.push(() => {
        clearInterval(intervalId);
      });
    }

    return (() => {
      cleanupFns.forEach(fn => { fn(); });
    });
  }, [timeStarted, timeSolved, appState.showTimer, isPaused]);

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
    setTimePaused(0);
    setAccumulatedPauseTime(0);
    if (timerTextRef.current) timerTextRef.current.innerText = '';
  };

  /** @param {MouseEvent} ev */
  const pauseResumeBtnClick = (ev) => {
    ev.preventDefault();

    // Unless the game is active, the button should not be rendered.
    // But ensure clicking it does nothing.
    if (!hasStarted || sudokuCtx.isSolved) return;

    // On resume => scramble board
    if (isPaused) {
      setAccumulatedPauseTime(accumulatedPauseTime + Date.now() - timePaused);

      const scrambled = scrambleTogether([sudokuCtx.digits, sudokuCtx.givens]);
      dispatch({
        type: 'sync',
        sudoku: new Sudoku(scrambled[0]),
        givens: scrambled[1]
      });
    } else {
      setTimePaused(Date.now());
    }
    setIsPaused(!isPaused);
  };

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
  const now = Date.now();
  if (sudokuCtx.isSolved) {
    if (timeSolved === 0) setTimeSolved(now);
    if (timeStarted === 0) setTimeStarted(now);

    timerText = formatTimeText(timeSolved - timeStarted - accumulatedPauseTime);
  } else if (hasStarted) {
    timerText = formatTimeText(now - timeStarted - accumulatedPauseTime);
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

  const gameTime = (
    <div className='flex h col-gap-'>
      <button
        className='w-24px h-24px clickyBtn-gold mono bold'
        onClick={pauseResumeBtnClick}
        disabled={!hasStarted || sudokuCtx.isSolved}
      >
        <i className={`fa-solid fa-${isPaused ? 'play' : 'pause'}`}></i>
      </button>
      <span
        ref={timerTextRef}
        className={`text-center small mono ${sudokuCtx.isSolved ? 'secondary' : 'grey'}`}
      >{ timerText }</span>
    </div>
  );

  return (
    <div className='flex v row-gap-- items-center'>
      <div className='flex h col-gap-- center'>
        <button
          className='clickyBtn-gold px-- py- mono bold'
          onClick={newGameBtnClick}
        >
          New Game
        </button>

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
          className={classNames('anim anim-filter anim-med', {
            'blur-6': (!hasStarted || isPaused)
          })}
          size={3}
          interactive={gameInProgress && !isPaused}
        />
        { gameStartOverlay }
      </div>

      { (hasStarted && appState.showTimer) && gameTime }
    </div>
  );
}

export default SudokuGame;
