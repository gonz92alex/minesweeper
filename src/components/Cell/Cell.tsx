import React, { MouseEvent, useState } from 'react';
import { CellData } from '../../datamodels/board';
import styles from './Cell.module.css';

interface CellProps {
  id: string;
  x: number;
  y: number;
  cellData: CellData;
  mark: (x: number, y: number) => void;
  uncover: (x: number, y: number) => void;
  hoverIn: (x: number, y: number) => void;
  hoverOut: () => void;

}

export function Cell({ id, x, y, cellData, mark, uncover, hoverIn, hoverOut, ...props }: CellProps) {
  const [canHover, setCanHover] = useState(false);
  let cellText = '';
  let className = [styles.cell];
  if (cellData.isUncovered) {
    className.push(styles.uncovered);
    if (cellData.isMine) {
      cellText = '💣';
      className.push(styles.mine);
    }
    else if (cellData.countMines > 0) {
      cellText = cellData.countMines.toString();
      if (cellData.countMines <= 8) className.push(styles[`d${cellData.countMines}`]);
      else className.push(styles.danger);
    }

  }
  else {
    if (cellData.isMarked) className.push(styles.marked);
    if (cellData.isQuestion) className.push(styles.doubt);
    if (cellData.isHover) className.push(styles.hovered);
    else {
      className.push(styles.covered);
    }

  }


  const handleMouseEnter = () => {
    if (!cellData.isUncovered) {
      uncover(x, y)
    }
    else {
      setCanHover(true);
      hoverIn(x, y);
    }
  };

  const resolve = (e: MouseEvent<HTMLDivElement>) => {
    if (cellData.isUncovered) {
      uncover(x, y)
    }
  }

  const doHoverIn = () => {
    if (canHover) hoverIn(x, y);
  }

  const doHoverOut = (e: MouseEvent<HTMLDivElement>) => {
    hoverOut();
    setCanHover(false)
  }


  const markCell = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!cellData.isUncovered) {
      mark(x, y);
    }
    else {
      if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
      ) {
        resolve(e);
      }
      else {
        setCanHover(true);
        hoverIn(x, y);
      }
    }
  };


  return (
    <div id={id} className={className.join(' ')} onClick={(e) => handleMouseEnter()} onContextMenu={markCell} onMouseOver={doHoverIn} onMouseOut={doHoverOut} onDoubleClick={resolve}>
      {cellData.isUncovered ? cellText : ''}
    </ div>
  );
}
