import { useState } from 'react';
import { Board } from '../datamodels/board';
import styles from './Board.module.css';
import { Cell } from './Cell/Cell';


export function GameBoard() {
  const [board, setBoard] = useState(new Board(10, 10, 10));


  const mark = (x: number, y: number) => {
    const newBoard = board.mark(x, y)
    setBoard(newBoard);
  }

  const newGame = (x: number, y: number, mines: number) => {
    const newBoard = new Board(board.xSize, board.ySize, board.countMines);
    setBoard(newBoard);
  }

  const uncover = (x: number, y: number) => {
    try {
      const newBoard = board.uncover(x, y);
      setBoard(newBoard);
    }
    catch {
      alert('Perdiste')
      setBoard(board.showMines());
    }

  }

  const seeAroundIn = (x: number, y: number) => {
    setBoard(board.seeAround(x, y));
  }

  const seeAroundOut = () => {
    setBoard(board.hoverOff());
  }

  return (
    <>
      <button onClick={(e) => newGame(30, 15, 99)}>New Game</button>
      <h1>Llevamos {board.getUncovered()} casillas puestas</h1>
      {board.winner ? <h1>Ganador</h1> : ''}
      <div className={styles.board}>
        {
          board.view.map((row, x) => {
            return (
              <div key={x} className={styles.row}>

                {
                  row.map((cell, y) => <Cell key={`cell_${x}-${y}`} id={`cell_${x}-${y}`} cellData={board.getCellData(x, y)} x={x} y={y} mark={mark} uncover={uncover} hoverIn={seeAroundIn} hoverOut={seeAroundOut} />)
                }
              </div>
            );
          })
        }
      </div></>
  );
}
