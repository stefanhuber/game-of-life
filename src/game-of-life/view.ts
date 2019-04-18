export class View {
    public static lineColor:string = "#eee";
    public static lineWidth:number = 1;
    public static fillColorUninitialized:string = "#fff";
    public static fillColorLiving:string = "#f00";
    public static fillColorDead:string = "#fcc";

    protected canvas:HTMLCanvasElement;
    
    protected rows:number;
    protected columns:number;
    protected cellSize:number;
    protected width:number;
    protected height:number;

    constructor(rows:number, columns:number, cellSize:number = 10) {
        this.canvas = document.querySelector('canvas');
        this.rows = rows;
        this.columns = columns;
        this.cellSize = cellSize;
        this.width = (rows * cellSize) + (View.lineWidth * 2);
        this.height = (columns * cellSize) + (View.lineWidth * 2);
    }

    draw(board:number[][]) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        let context = this.canvas.getContext("2d");
        context.lineWidth = View.lineWidth;
        context.strokeStyle = View.lineColor;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                context.beginPath();
                context.rect((i * this.cellSize)+1, (j * this.cellSize)+1, this.cellSize, this.cellSize);
                context.stroke();

                if (board[i][j] > 0) {
                    context.fillStyle = View.fillColorLiving;
                } else if (board[i][j] == 0) {
                    context.fillStyle = View.fillColorDead;
                } else {
                    context.fillStyle = View.fillColorUninitialized;
                }

                context.fill();
            }
        }
    }
}