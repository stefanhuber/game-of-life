import * as helpers from './helpers';

export class Model {
    public static livingCell:number = 1;
    public static deadCell:number = 0;
    public static initCell:number = -1;
    public static countMethod:string = "normal";

    protected _board:number[][] = [];
    protected _generation:number = 0;

    get board(): number[][] {
        return this._board;
    }

    get generation(): number {
        return this._generation;
    }

    get livingCells(): number {
        let livingCells = 0;

        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[i].length; j++) {
                if (this._board[i][j] > 0) {
                    livingCells++;
                }                
            }
        }

        return livingCells;
    }

    constructor(row:number, column:number) {
        for (let r = 0; r < row; r++) {
            this._board[r] = [];
            for (let c = 0; c < column; c++) {
                this._board[r][c] = Model.initCell;
            }
        }  
    }

    clear(): Model {
        for (let r = 0; r < this._board.length; r++) {
            for (let c = 0; c < this._board[r].length; c++) {
                this._board[r][c] = Model.initCell;
            }
        }        

        this._generation = 0;
        return this;
    }

    randomize(probabilityLiving:number = 0.3): Model {
        this.clear();

        for (let r = 0; r < this._board.length; r++) {
            for (let c = 0; c < this._board[r].length; c++) {
                if (Math.random() <= probabilityLiving) {
                    this._board[r][c] = Model.livingCell;
                }
            }
        }  

        return this;
    }

    modify(row:number, column:number, value:number = 1): Model {
        this._board[row][column] = value;
        return this;
    }

    countLivingNeighbours(row:number, column:number): number {
        if (Model.countMethod == "normal") {
            return helpers.countLivingNeighbours(this._board, row, column);
        } else {
            return helpers.countLivingNeighboursSpherical(this._board, row, column);
        }
    }

    transform(): number[][] {
        this._generation += 1;
        return (this._board = this._board.map((row, r) => {
            return row.map((column, c) => {
                return this.getNextState(column, this.countLivingNeighbours(r, c));
            });
        }));
    }

    getNextState(state:number, neighbours:number) : number {
        if (state <= Model.deadCell && neighbours == 3) {
            return Model.livingCell;
        } else if (state == Model.livingCell && neighbours >= 2 && neighbours <= 3) {
            return Model.livingCell;
        } else if (state == Model.initCell) {
            return Model.initCell;
        } else {
            return Model.deadCell;
        }
    }
}
