import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { indicesFor, Sudoku } from '@metal-pony/sudoku-js';

import { range } from '../../util/arrays';
import { useSudoku, useSudokuDispatch } from './SudokuContext';

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
  /** @param {MouseEvent} ev */
  const onclick = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      dispatch({
        type: 'setDigit',
        cellIndex,
        digit: (digit + 1) % 10
      });
    }
  };

  /** @param {MouseEvent} ev */
  const onContextMenu = (ev) => {
    ev.preventDefault();
    if (dispatch) {
      dispatch({ type: 'setDigit', cellIndex, digit: 0 });
    }
  };

  return (
    <div
      key={`scell-${cellIndex}`}
      className={classNames('sudoku-cell no-select', className)}
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
 * @param {number} props.size Number associated with `SIZES`. 0 (smallest) through 4 (largest). Default `2` (medium).
 * @param {boolean} props.showValidity Whether the board cells will change if a cell or area becomes invalid. Default `true`.
 * @param {boolean} props.interactive Whether the board will respond to clicks. Default `true`.
 * @param {string} props.className
 */
export function SudokuBoard({
  interactive = true,
  showValidity = true,
  size = 2,
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
    return (
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
        className={classNames('sudoku-board', SIZES[size])}
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
export const SIZES = ['size-xs','size-s','size-m','size-l','size-xl'];

export default SudokuBoard;
