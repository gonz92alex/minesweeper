import { Cell } from "../components/Cell/Cell";

export interface CellData {
    isMine: boolean;
    isMarked: boolean;
    isUncovered: boolean;
    isQuestion: boolean
    countMines: number;
    isHover: boolean;
}

export class Board {
    mines: number[][];
    dangerMap: number[][];
    view: number[][];
    xSize: number;
    ySize: number;
    countMines: number;
    turns: number;
    winner: boolean = false;

    constructor(x: number, y: number, mines: number) {
        if (mines >= (x * y)) throw Error("Too many mines");
        this.turns = 0;
        this.xSize = x;
        this.ySize = y;
        this.countMines = mines;
        this.mines = Array(x).fill(0).map(() => Array(y).fill(0));
        this.view = Array(x).fill(0).map(() => Array(y).fill(0));
        this.dangerMap = Array(x).fill(0).map(() => Array(y).fill(0));
    }

    setMines(x: number, y: number) {
        console.log(this.mines)
        let mineCounting = 0;
        const canPutMine = (posX: number, posY: number) => {
            const isEmpty = this.mines[posX][posY] === 0; //Mina en X, Y esta vacia
            if (isEmpty) { //esta vacia
                const inXRange = (posX >= x - 1 && posX <= x + 1); //esta dentro del rango en X
                const inYRange = (posY >= y - 1 && posY <= y + 1); //esta dentro del rango en Y
                const inRange = inXRange && inYRange; // Si los dos son true es true, si algun no es false
                //console.log({ inXRange, inYRange, posX, posY, x, y, mineCounting }, this.mines);
                return !inRange;
            }
            else return true; // Esta llena por lo que se puede poner
        }
        for (let i = 0; i < this.countMines; i++) {
            let posX = 0;
            let posY = 0;
            do {
                posX = Math.floor(Math.random() * this.xSize);
                posY = Math.floor(Math.random() * this.ySize);
            } while (!canPutMine(posX, posY))
            this.mines[posX][posY] = 1;
            mineCounting += 1;
        }
        this.dangerMap = this.mines.map((r, i) => r.map((cell, j) => {
            if (cell === 1) return -1;
            return this.aroundCells(i, j).reduce((acc, c) => acc + this.mines[c.x][c.y], 0)
        }));
    }


    /*calculateHowManyMines(x: number, y: number) {
        if (this.mines[x][y] === 1) return -1;
        let count = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i >= 0 && i < this.mines.length && j >= 0 && j < this.mines[i].length) {
                    if (this.mines[i][j] === 1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }*/

    aroundCells(x: number, y: number) {
        let cells = [];
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i >= 0 && i < this.view.length && j >= 0 && j < this.view[i].length) {
                    cells.push({ x: i, y: j });
                }
            }
        }
        return cells;
    }

    mark(x: number, y: number) {
        if (this.view[x][y] === 0) {
            this.view[x][y] = 2;
            console.log(this.view[x][y], this.view[x], this.view)
            return this.update();
        }
        if (this.view[x][y] === 2) {
            this.view[x][y] = 3;
            return this.update();
        }
        if (this.view[x][y] === 3) this.view[x][y] = 0;
        return this.update();
    }

    uncover(x: number, y: number) {
        if (this.turns === 0 && this.view[x][y] === 0) {
            this.view[x][y] = 1;
            this.turns = 1;
            this.setMines(x, y);
            this.aroundCells(x, y).forEach(c => this.uncover(c.x, c.y));
            return this.update();
        }
        if (this.view[x][y] === 1) {
            console.log('Pulsando en una casilla pulsada')
            let candidates = this.aroundCells(x, y);
            const originalLenth = candidates.length;
            candidates = candidates.filter(e => this.mines[e.x][e.y] !== 1 || this.view[e.x][e.y] === 2);
            if (candidates.length < originalLenth) return this;
            candidates.forEach(c => {
                if (this.view[c.x][c.y] === 0 || this.view[c.x][c.y] === 4) this.uncover(c.x, c.y)
            });
            return this.update();
        }
        if (this.view[x][y] === 2) return this;
        if (this.mines[x][y] === 1) {
            this.view[x][y] = 1;
            this.turns += 1;
            throw Error('Se acabo la partida')
        }
        if (this.dangerMap[x][y] === 0) {
            this.view[x][y] = 1;
            this.aroundCells(x, y).forEach(c => this.uncover(c.x, c.y));
        } else {
            this.view[x][y] = 1;
        }
        this.turns += 1;
        return this.update();
    }

    getCellData(x: number, y: number): CellData {
        if (this.turns === 0) return {
            isMine: this.mines[x][y] === 1,
            isMarked: this.view[x][y] === 2,
            isUncovered: this.view[x][y] === 1,
            isQuestion: this.view[x][y] === 3,
            countMines: 0,
            isHover: this.view[x][y] === 4
        }
        return {
            isMine: this.mines[x][y] === 1,
            isMarked: this.view[x][y] === 2,
            isUncovered: this.view[x][y] === 1,
            isQuestion: this.view[x][y] === 3,
            countMines: this.dangerMap[x][y],
            isHover: this.view[x][y] === 4
        }
    }

    seeAround(x: number, y: number) {
        if (this.view[x][y] !== 1) return this;
        const candidates = this.aroundCells(x, y).filter(e => this.view[e.x][e.y] === 0);
        candidates.forEach(c => this.hover(c.x, c.y));
        return this.update();
    }

    hover(x: number, y: number) {
        this.view[x][y] = 4;
    }

    hoverOff() {
        this.view.forEach((r, x) => r.forEach((c, y) => c === 4 ? this.view[x][y] = 0 : c));
        return this.update();
    }

    update() {
        const newBoard = new Board(this.xSize, this.ySize, this.countMines);
        newBoard.view = this.view.map(r => r.map(c => c));
        newBoard.dangerMap = this.dangerMap.map(r => r.map(c => c));
        newBoard.mines = this.mines.map(r => r.map(c => c));;
        newBoard.turns = this.turns;
        newBoard.winner = this.isWinner();
        return newBoard;
    }

    getUncovered() {
        return this.view.reduce((acc, r) => acc + r.reduce((acc, c) => acc + (c === 1 ? 1 : 0), 0), 0);
    }

    getMarked() {
        return this.view.reduce((acc, r) => acc + r.reduce((acc, c) => acc + (c === 2 ? 1 : 0), 0), 0);
    }

    isWinner() {
        return this.getUncovered() + this.countMines === this.xSize * this.ySize;
    }

}