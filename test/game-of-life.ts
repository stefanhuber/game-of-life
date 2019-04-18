import { Model } from '../src/game-of-life/model';

describe('GameOfLife', () => {
    let gameOfLife:Model;

    beforeEach(() => {
        gameOfLife = new Model(3, 4);

        // [
        //   [0,1,0,0],
        //   [0,1,1,0],
        //   [0,1,0,0]
        // ]
        
        gameOfLife
            .modify(0, 1)
            .modify(1, 1)
            .modify(1, 2)
            .modify(2, 1)
    });

    it('counting neighbours normally should be correct', () => {
        expect(gameOfLife.countLivingNeighbours(1, 1)).toEqual(3);
        expect(gameOfLife.countLivingNeighbours(1, 2)).toEqual(3);
    });

    it('counting neighbours dimensionally should be correct', () => {
        Model.countMethod = "dimensional";
        expect(gameOfLife.countLivingNeighbours(0, 0)).toEqual(3);
        expect(gameOfLife.countLivingNeighbours(0, 1)).toEqual(3);
        expect(gameOfLife.countLivingNeighbours(0, 2)).toEqual(4);
        expect(gameOfLife.countLivingNeighbours(0, 3)).toEqual(1);
    });

    it('board should be correctly transformed', () => {
        expect(gameOfLife.transform()).toEqual([
            [-1,1,1,-1],
            [1,1,1,-1],
            [-1,1,1,-1]
        ]);
    });
});
