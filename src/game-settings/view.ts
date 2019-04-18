export class View {
    protected handler:(event:string, data:any) => void;

    protected outputGeneration:HTMLSpanElement;
    protected outputLivingCells:HTMLSpanElement;
    protected buttonPlay:HTMLButtonElement;
    protected buttonStep:HTMLButtonElement;
    protected buttonClear:HTMLButtonElement;
    protected buttonRandomize:HTMLButtonElement;
    protected selectColorScheme:HTMLSelectElement;
    protected selectProbability:HTMLSelectElement;
    protected selectFps:HTMLSelectElement;
    protected selectNeighbours:HTMLSelectElement;

    protected playing:boolean = false;

    constructor() {
        this.buttonClear = document.querySelector('#clear-button');
        this.buttonStep = document.querySelector('#step-button');
        this.buttonPlay = document.querySelector('#play-button');
        this.buttonRandomize = document.querySelector('#randomize-button');
        this.outputGeneration = document.querySelector('#output-generation');
        this.outputLivingCells = document.querySelector('#output-living-cells');
        this.selectProbability = document.querySelector('#probability-select');
        this.selectColorScheme = document.querySelector('#color-scheme-select');
        this.selectFps = document.querySelector('#fps-select');
        this.selectNeighbours = document.querySelector('#neighbours-select');

        this.buttonStep.addEventListener('click', () => this.step());
        this.buttonClear.addEventListener('click', () => this.clear());
        this.buttonPlay.addEventListener('click', () => this.play());
        this.buttonRandomize.addEventListener('click', () => this.randomize());
        this.selectColorScheme.addEventListener('change', (event:any) => this.changeColorScheme(event.target.value));
        this.selectFps.addEventListener('change', (event:any) => this.changeFps(event.target.value));
        this.selectNeighbours.addEventListener('change', (event:any) => this.changeChangeMethod(event.target.value));
    }

    play() {
        if (!this.stopPlaying()) {
            this.playing = true;
            this.buttonPlay.innerHTML = "Pause";
            this.trigger('play');
        } else {
            this.trigger('pause');
        }        
    }

    step() {
        this.stopPlaying();        
        this.trigger('step');
    }

    clear() {
        this.stopPlaying();       
        this.trigger('clear');
    }

    randomize() {
        this.stopPlaying();
        this.trigger('randomize', {
            probability: this.selectProbability.value
        });
    }

    changeColorScheme(scheme:string) {
        this.trigger('color', {
            scheme: scheme
        })
    }

    changeFps(fps:number) {
        this.trigger('fps', {
            fps: fps
        })
    }

    changeChangeMethod(method:string) {
        this.trigger('count-method', {
            method: method
        })
    }

    stopPlaying(): boolean {
        if (this.playing) {
            this.playing = false;
            this.buttonPlay.innerHTML = "Play";
            return true;        
        } else {
            return false;
        }
    }

    render(data:{generation:number, livingCells:number } = {generation:0, livingCells:0}) {
        this.outputGeneration.innerHTML = data.generation.toString();
        this.outputLivingCells.innerHTML = data.livingCells.toString();
    }

    trigger(event:string, data:any = undefined) {
        if (this.handler) {
            this.handler(event, data);
        }        
    }

    register(handler:(event:string, data:any) => void) {
        this.handler = handler;
    }

}