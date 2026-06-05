import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ALL,
  encode,
  SPACES,
  Sudoku
} from '@metal-pony/sudoku-js';

import { SudokuContext } from '../../page-apps/common/SudokuContext';
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
  /** @type {{ appState: import('../../page-apps/common/AppSettingsContext').AppSettings, setAppState: (stateChange: any)=>void }} */
  const {appState, setAppState} = useContext(SettingsContext);

  /** @type {{ sudokuState: import('../../page-apps/common/SudokuContext').SudokuState }} */
  const {sudokuState} = useContext(SudokuContext);
  const sudoku = sudokuState.sudoku;

  const [timeStarted, setTimeStarted] = useState(appState.showTimer ? 0 : Date.now());
  const [timeSolved, setTimeSolved] = useState(0);

  const [timePaused, setTimePaused] = useState(0);
  const [accumulatedPauseTime, setAccumulatedPauseTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasStarted = (timeStarted > 0);
  const gameInProgress = (hasStarted && !sudoku.isSolved());

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
    for (let ci = 0; ci < SPACES; ci++) {
      newGame._board[ci] &= ~newGame._cellConstraints(ci);
    }

    sudokuState.sync(newGame, newGame.board, true);
    setIsPaused(false);
    setTimeStarted(appState.showTimer ? 0 : Date.now());
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
    if (!hasStarted || sudoku.isSolved()) return;

    // On resume => scramble board
    if (isPaused) {
      setAccumulatedPauseTime(accumulatedPauseTime + Date.now() - timePaused);
      sudokuState.scramble();
    } else {
      setTimePaused(Date.now());
    }
    setIsPaused(!isPaused);
  };

  /** @param {MouseEvent} ev */
  const shuffleBtnClick = (ev) => {
    ev.preventDefault();
    sudokuState.scramble();
  };

  /** @param {MouseEvent} ev */
  const resetCandidatesBtnClick = (ev) => {
    ev.preventDefault();
    const newSudoku = new Sudoku(sudoku);
    for (let ci = 0; ci < SPACES; ci++) {
      const digit = newSudoku.getDigit(ci);
      newSudoku._board[ci] = ((digit > 0) ?
        encode(digit) :
        (ALL & ~newSudoku._cellConstraints(ci))
      );
    }
    sudokuState.sync(newSudoku, sudokuState.givens, false);
  };

  /** @param {MouseEvent} ev */
  const undoBtnClick = (ev) => {
    ev.preventDefault();
    sudokuState.undo();
  };

  let timerText = '';
  const now = Date.now();
  if (sudoku.isSolved()) {
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
    <div className='flex h col-gap- start'>
      <button
        className='w-24px h-24px clickyBtn-gold mono bold'
        onClick={pauseResumeBtnClick}
        disabled={!hasStarted || sudoku.isSolved()}
      >
        <i className={`fa-solid fa-${isPaused ? 'play' : 'pause'}`}></i>
      </button>
      <span
        ref={timerTextRef}
        className={`text-center small mono ${sudoku.isSolved() ? 'secondary' : 'grey'}`}
      >{ timerText }</span>
    </div>
  );

  const resetCandidates = (
    <div className='flex h col-gap- end'>
      <span className='text-center small mono grey'>reset candidates</span>
      <button
        className='w-24px h-24px clickyBtn-gold mono bold'
        onClick={resetCandidatesBtnClick}
        disabled={!hasStarted || sudoku.isSolved()}
      >
        <i className='fa-solid fa-rotate fa-sm'></i>
      </button>
    </div>
  );

  const undoBtn = (
    <div className='flex h col-gap- end'>
      <span className='text-center small mono grey'>undo</span>
      <button
        className='w-24px h-24px clickyBtn-gold mono bold'
        onClick={undoBtnClick}
        disabled={!hasStarted || sudoku.isSolved() || sudokuState.history.length === 0}
      >
        <i className='fa-solid fa-rotate-left fa-sm'></i>
      </button>
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

      <div className='flex v row-gap-- center items-center'>
        <div className='flex v row-gap-- center items-center'>
          <SudokuBoard
            className={classNames('anim anim-filter anim-med', {
              'blur-6': (!hasStarted || isPaused)
            })}
            size={appState.puzzleSize}
            interactive={gameInProgress && !isPaused}
            showCandidates={appState.showCandidates}
          />
          { gameStartOverlay }
        </div>
        <div className='w-full flex h'>
          { (hasStarted && appState.showTimer) && gameTime }
          { appState.showCandidates && resetCandidates }
        </div>
        <div className='w-full flex h'>
          { undoBtn }
        </div>
      </div>

    </div>
  );
}

export default SudokuGame;
