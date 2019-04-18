
export function countLivingNeighbours(board:number[][], row:number, column:number): number {
    let count = 0;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = column - 1; c <= column + 1; c++) {
            if (r >= 0 && r < board.length &&
                c >= 0 && c < board[0].length &&
                (c != column || r != row))
                count += (board[r][c] > 0 ? 1 : 0);
        }
    }

    return count;
}

export function countLivingNeighboursSpherical(board:number[][], row:number, column:number): number {
    let count = 0;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = column - 1; c <= column + 1; c++) {
            let rtmp = r;
            let ctmp = c;
            
            if (rtmp < 0 || rtmp >= board.length) {
                rtmp = rtmp < 0 ? board.length - 1 : 0;
            }
            if (ctmp < 0 || ctmp >= board[rtmp].length) {
                ctmp = ctmp < 0 ? board[rtmp].length - 1 : 0;
            }
            if (ctmp != column || rtmp != row) {
                count += (board[rtmp][ctmp] > 0 ? 1 : 0);
            }            
        }
    }

    return count;
}