import { indicesFor, Sudoku } from '@metal-pony/sudoku-js';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { range } from '../../util/arrays';

/**
 *
 * @param {object} props
 * @param {number} props.cellIndex
 * @param {number} props.digit
 * @param {boolean} props.interactive
 * @param {string} props.className
 * @param {(cellIndex: number)=>void} props.cellOnLeftClick
 * @param {(cellIndex: number)=>void} props.cellOnRightClick
 */
const Cell = React.memo(function Cell({
  cellIndex,
  digit,
  interactive,
  className,
  cellOnLeftClick,
  cellOnRightClick
}) {
  /** @param {MouseEvent} ev */
  const onclick = (ev) => {
    ev.preventDefault();
    if (cellOnLeftClick) cellOnLeftClick(cellIndex);
  };

  /** @param {MouseEvent} ev */
  const onContextMenu = (ev) => {
    ev.preventDefault();
    if (cellOnRightClick) cellOnRightClick(cellIndex);
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
 * @param {number[]} props.values Digits to display on the board. If omitted, shows a blank board.
 * @param {number[]} props.givens Initial puzzle digits. Nonzero digits are rendered as immutable cells.
 * @param {boolean} props.showValidity Whether the board cells will change if a cell or area becomes invalid. Default `true`.
 * @param {boolean} props.interactive Whether the board will respond to clicks. Default `true`.
 * @param {(cellIndex: number)=>void} props.cellOnLeftClick Leftclick handler for cells.
 * @param {(cellIndex: number)=>void} props.cellOnRightClick Rightclick handler for cells.
 */
export function SudokuBoard({
  values = null,
  givens = null,
  interactive = true,
  showValidity = true,
  size = 2,
  cellOnLeftClick,
  cellOnRightClick
}) {
  let game = new Sudoku();
  if (values) {
    game.setBoard(values);
  }

  const [state, setState] = useState({
    selectedCell: 0,
    pickingDigit: false,
    pickedDigit: 0
  });

  const validityMap = game.cellValidityMap;

  const cells = game.board.map((digit,ci) => {
    const given = (givens && givens[ci]);
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
          solved: game.isSolved(),
        })}
        cellOnLeftClick={cellOnLeftClick}
        cellOnRightClick={cellOnRightClick}
      />
    );
  });

  const regions = indicesFor.region.map((indices, ri) => (
    <div
      key={`sregion-${ri}`}
      className='sudoku-region'
    >
      { indices.map(ci => cells[ci]) }
    </div>
  ));

  return (
    <div className='flex center'>
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
