import * as gol from './game-of-life';
import * as settings from './game-settings';
import {COLORS} from './colors';

export class Controller {

    public static rows:number = 115;
    public static columns:number = 80;
    public static cellSize:number = 8;

    protected model:gol.Model;
    protected board:gol.View;
    protected settings:settings.View;

    protected fps:number = 10;
    protected running:boolean = false;

    static create() {
        let ctrl = new Controller();
        ctrl.model = new gol.Model(Controller.rows, Controller.columns);
        ctrl.board = new gol.View(Controller.rows, Controller.columns, Controller.cellSize);
        ctrl.settings = new settings.View();
        ctrl.registerEventHandler();
        ctrl.settings.render();        
        return ctrl;
    }

    init() {
        this.model.randomize(0.1);
        this.board.draw(this.model.board);
    }

    clear() {
        this.running = false;
        this.model.clear();
        this.board.draw(this.model.board);
        this.settings.render();
    }

    step() {
        this.model.transform();
        this.board.draw(this.model.board);
        this.settings.render({
            generation: this.model.generation ,
            livingCells: this.model.livingCells
        });
    }

    play() {
        this.running = true;
        this.loop();
    }

    pause() {
        this.running = false;
    }

    randomize(probabiliy:number) {
        this.running = false;
        this.model.randomize(probabiliy);
        this.board.draw(this.model.board);
        this.settings.render({
            generation: this.model.generation,
            livingCells: this.model.livingCells
        })
    }

    color(scheme:string = "red") {
        gol.View.fillColorLiving = COLORS[scheme].living;
        gol.View.fillColorDead = COLORS[scheme].dead;
        this.board.draw(this.model.board);
    }

    framesPerSecond(fps:number = 10) {
        this.fps = fps;
    }

    neighbourCountMethod(neighbours:string = "normal") {
        gol.Model.countMethod = neighbours;
    }

    registerEventHandler() {
        this.settings.register((event:string, data:any) => {
            if (event == "play") {
                this.play();
            } else if (event == "pause") {
                this.pause();
            } else if (event == "step") {
                this.pause();
                this.step();
            } else if (event == "randomize") {
                this.randomize(data['probability'] / 10);
            } else if (event == "color") {
                this.color(data['scheme']);
            } else if (event == "clear") {
                this.clear();
            } else if (event == "fps") {
                this.framesPerSecond(data['fps']);
            } else if (event == "count-method") {
                this.neighbourCountMethod(data['method']);
            }
        });
    }

    loop() {
        setTimeout(() => {           
            if (this.running) {
                this.step();
                this.loop();
            }            
        }, 1000 / this.fps);
    }

}