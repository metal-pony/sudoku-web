import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { encode, indicesFor, Sudoku } from '@metal-pony/sudoku-js';

import { range } from '../../util/arrays';
import { useSudoku, useSudokuDispatch } from './SudokuContext';
import { SettingsContext } from '../../page-apps/common/AppSettingsContext';

/**
 *
 * @param {object} props
 * @param {number} props.cellIndex
 * @param {number} props.digit
 * @param {boolean} props.interactive
 * @param {string} props.className
 */
const Cell = React.memo(function Cell({
  cellIndex,
  digit,
  interactive,
  className
}) {
  const dispatch = useSudokuDispatch();
  const {appState} = useContext(SettingsContext);

  /** @param {MouseEvent} ev */
  const onclick = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      if (appState.showCandidates) {
        dispatch({
          type: 'setCandidates',
          cellIndex,
          candidates: encode(digit)
        });
      } else {
        dispatch({
          type: 'setDigit',
          cellIndex,
          digit: (digit + 1) % 10
        });
      }
    }
  };

  /** @param {MouseEvent} ev */
  const onContextMenu = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      if (appState.showCandidates) {
        dispatch({
          type: 'setCandidates',
          cellIndex,
          candidates: encode(digit)
        });
      } else {
        dispatch({ type: 'setDigit', cellIndex, digit: 0 });
      }
    }
  };

  return (
    <div
      key={`scell-${cellIndex}`}
      className={classNames('sudoku-cell no-select', className, { interactive })}
      onClick={interactive ? onclick : null}
      onContextMenu={interactive ? onContextMenu : null}
    >
      { (digit > 0 && digit <= 9) ? ''+digit : '' }
    </div>
  );
});

/**
 *
 * @param {object} props
 * @param {number} props.cellIndex
 * @param {number} props.candidates
 * @param {number} props.digit
 * @param {boolean} props.interactive
 */
const CandidateSubCell = React.memo(function CandidateSubCell({
  cellIndex,
  candidates,
  digit,
  interactive
}) {
  const dispatch = useSudokuDispatch();
  const {appState} = useContext(SettingsContext);
  const isShown = (candidates & encode(digit)) > 0;
  const isLastCandidate = (candidates === encode(digit));

  /** @param {MouseEvent} ev */
  const onclick = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      const type = isLastCandidate ? 'setDigit' : (isShown ? 'removeCandidate' : 'addCandidate');
      dispatch({
        type, cellIndex, digit,
        autoReduceCandidates: appState.autoReduceCandidates
      });
    }
  };

  /** @param {MouseEvent} ev */
  const onContextMenu = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      dispatch({
        type: 'setDigit',
        cellIndex,
        digit,
        autoReduceCandidates: appState.autoReduceCandidates
      });
    }
  };

  return (
    <div
      className={classNames('sudoku-cell-candidate no-select', { interactive })}
      onClick={interactive ? onclick : null}
      onContextMenu={interactive ? onContextMenu : null}
    >
      { isShown ? digit : '' }
    </div>
  );
});

/**
 *
 * @param {object} props
 * @param {number} props.cellIndex
 * @param {number} props.candidates
 * @param {boolean} props.interactive
 * @param {string} props.className
 */
const CandidatesViewCell = React.memo(function CandidatesViewCell({
  cellIndex,
  candidates,
  interactive,
  className
}) {
  return (
    <div
      key={`scell-${cellIndex}`}
      className={classNames('sudoku-cell candidates-container no-select', className, { interactive })}
    >
      {
        range(9).map(di => (
          <CandidateSubCell
            key={`scell-${cellIndex}-candidate-${di + 1}`}
            cellIndex={cellIndex}
            candidates={candidates}
            digit={di + 1}
            interactive={interactive}
          />
        ))
      }
    </div>
  );
});

/**
 *
 * @param {object} props
 * @param {number} props.size Number associated with `SIZES`. 0 (smallest) through 4 (largest). Default `2` (medium).
 * @param {boolean} props.interactive Whether the board will respond to clicks. Default `true`.
 * @param {boolean} props.showValidity Whether the board cells will change if a cell or area becomes invalid. Default `true`.
 * @param {boolean} props.showCandidates Whether the board cells will display individual candidates. Default `false`.
 * @param {string} props.className
 */
export function SudokuBoard({
  size = 2,
  interactive = true,
  showValidity = true,
  showCandidates = false,
  className,
}) {
  const sudokuCtx = useSudoku();
  const game = new Sudoku(sudokuCtx.digits);

  const [state, setState] = useState({
    selectedCell: 0,
    pickingDigit: false,
    pickedDigit: 0
  });

  const validityMap = game.cellValidityMap;

  const cells = sudokuCtx.digits.map((digit,ci) => {
    const given = sudokuCtx.givens[ci];
    const validityClassName = (showValidity && (
      (validityMap[ci] === 0) ? '' : `invalid-${validityMap[ci]}`
    ));
    return (digit === 0 && showCandidates) ? (
      <CandidatesViewCell
        key={`scell${ci}`}
        cellIndex={ci}
        candidates={sudokuCtx.candidates[ci]}
        interactive={interactive}
        className={classNames(validityClassName)}
      />
    ) : (
      <Cell
        key={`scell${ci}`}
        cellIndex={ci}
        digit={digit}
        // Cells that are given should not be changed.
        interactive={interactive && !given}
        className={classNames(validityClassName, {
          given,
          solved: sudokuCtx.isSolved
        })}
      />
    );
  });

  const regions = indicesFor.region.map((indices, ri) => (
    <div key={`sregion-${ri}`} className='sudoku-region'>
      { indices.map(ci => cells[ci]) }
    </div>
  ));

  return (
    <div className={classNames('flex center', className)}>
      <div
        className={classNames('sudoku-board', SIZES[size].className)}
        onContextMenu={(ev)=>{ev.preventDefault();}}
      >
        { regions }
      </div>
    </div>
  );
}

/**
 * Supported sizes of SudokuBoard, where higher index = larger board.
 */
export const SIZES = [
  { className: 'size-xs', name: 'XSMALL' },
  { className: 'size-s',  name: ' SMALL' },
  { className: 'size-m',  name: 'MEDIUM' },
  { className: 'size-l',  name: ' LARGE' },
  { className: 'size-xl', name: 'XLARGE' }
];

export default SudokuBoard;
