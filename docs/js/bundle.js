(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    var View = /** @class */ (function () {
        function View(rows, columns, cellSize) {
            if (cellSize === void 0) { cellSize = 10; }
            this.canvas = document.querySelector('canvas');
            this.rows = rows;
            this.columns = columns;
            this.cellSize = cellSize;
            this.width = (rows * cellSize) + (View.lineWidth * 2);
            this.height = (columns * cellSize) + (View.lineWidth * 2);
        }
        View.prototype.draw = function (board) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            var context = this.canvas.getContext("2d");
            context.lineWidth = View.lineWidth;
            context.strokeStyle = View.lineColor;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    context.beginPath();
                    context.rect((i * this.cellSize) + 1, (j * this.cellSize) + 1, this.cellSize, this.cellSize);
                    context.stroke();
                    if (board[i][j] > 0) {
                        context.fillStyle = View.fillColorLiving;
                    }
                    else if (board[i][j] == 0) {
                        context.fillStyle = View.fillColorDead;
                    }
                    else {
                        context.fillStyle = View.fillColorUninitialized;
                    }
                    context.fill();
                }
            }
        };
        View.lineColor = "#eee";
        View.lineWidth = 1;
        View.fillColorUninitialized = "#fff";
        View.fillColorLiving = "#f00";
        View.fillColorDead = "#fcc";
        return View;
    }());

    function countLivingNeighbours(board, row, column) {
        var count = 0;
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = column - 1; c <= column + 1; c++) {
                if (r >= 0 && r < board.length &&
                    c >= 0 && c < board[0].length &&
                    (c != column || r != row))
                    count += (board[r][c] > 0 ? 1 : 0);
            }
        }
        return count;
    }
    function countLivingNeighboursSpherical(board, row, column) {
        var count = 0;
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = column - 1; c <= column + 1; c++) {
                var rtmp = r;
                var ctmp = c;
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

    var Model = /** @class */ (function () {
        function Model(row, column) {
            this._board = [];
            this._generation = 0;
            for (var r = 0; r < row; r++) {
                this._board[r] = [];
                for (var c = 0; c < column; c++) {
                    this._board[r][c] = Model.initCell;
                }
            }
        }
        Object.defineProperty(Model.prototype, "board", {
            get: function () {
                return this._board;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "generation", {
            get: function () {
                return this._generation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "livingCells", {
            get: function () {
                var livingCells = 0;
                for (var i = 0; i < this._board.length; i++) {
                    for (var j = 0; j < this._board[i].length; j++) {
                        if (this._board[i][j] > 0) {
                            livingCells++;
                        }
                    }
                }
                return livingCells;
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.clear = function () {
            for (var r = 0; r < this._board.length; r++) {
                for (var c = 0; c < this._board[r].length; c++) {
                    this._board[r][c] = Model.initCell;
                }
            }
            this._generation = 0;
            return this;
        };
        Model.prototype.randomize = function (probabilityLiving) {
            if (probabilityLiving === void 0) { probabilityLiving = 0.3; }
            this.clear();
            for (var r = 0; r < this._board.length; r++) {
                for (var c = 0; c < this._board[r].length; c++) {
                    if (Math.random() <= probabilityLiving) {
                        this._board[r][c] = Model.livingCell;
                    }
                }
            }
            return this;
        };
        Model.prototype.modify = function (row, column, value) {
            if (value === void 0) { value = 1; }
            this._board[row][column] = value;
            return this;
        };
        Model.prototype.countLivingNeighbours = function (row, column) {
            if (Model.countMethod == "normal") {
                return countLivingNeighbours(this._board, row, column);
            }
            else {
                return countLivingNeighboursSpherical(this._board, row, column);
            }
        };
        Model.prototype.transform = function () {
            var _this = this;
            this._generation += 1;
            return (this._board = this._board.map(function (row, r) {
                return row.map(function (column, c) {
                    return _this.getNextState(column, _this.countLivingNeighbours(r, c));
                });
            }));
        };
        Model.prototype.getNextState = function (state, neighbours) {
            if (state <= Model.deadCell && neighbours == 3) {
                return Model.livingCell;
            }
            else if (state == Model.livingCell && neighbours >= 2 && neighbours <= 3) {
                return Model.livingCell;
            }
            else if (state == Model.initCell) {
                return Model.initCell;
            }
            else {
                return Model.deadCell;
            }
        };
        Model.livingCell = 1;
        Model.deadCell = 0;
        Model.initCell = -1;
        Model.countMethod = "normal";
        return Model;
    }());

    var View$1 = /** @class */ (function () {
        function View() {
            var _this = this;
            this.playing = false;
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
            this.buttonStep.addEventListener('click', function () { return _this.step(); });
            this.buttonClear.addEventListener('click', function () { return _this.clear(); });
            this.buttonPlay.addEventListener('click', function () { return _this.play(); });
            this.buttonRandomize.addEventListener('click', function () { return _this.randomize(); });
            this.selectColorScheme.addEventListener('change', function (event) { return _this.changeColorScheme(event.target.value); });
            this.selectFps.addEventListener('change', function (event) { return _this.changeFps(event.target.value); });
            this.selectNeighbours.addEventListener('change', function (event) { return _this.changeChangeMethod(event.target.value); });
        }
        View.prototype.play = function () {
            if (!this.stopPlaying()) {
                this.playing = true;
                this.buttonPlay.innerHTML = "Pause";
                this.trigger('play');
            }
            else {
                this.trigger('pause');
            }
        };
        View.prototype.step = function () {
            this.stopPlaying();
            this.trigger('step');
        };
        View.prototype.clear = function () {
            this.stopPlaying();
            this.trigger('clear');
        };
        View.prototype.randomize = function () {
            this.stopPlaying();
            this.trigger('randomize', {
                probability: this.selectProbability.value
            });
        };
        View.prototype.changeColorScheme = function (scheme) {
            this.trigger('color', {
                scheme: scheme
            });
        };
        View.prototype.changeFps = function (fps) {
            this.trigger('fps', {
                fps: fps
            });
        };
        View.prototype.changeChangeMethod = function (method) {
            this.trigger('count-method', {
                method: method
            });
        };
        View.prototype.stopPlaying = function () {
            if (this.playing) {
                this.playing = false;
                this.buttonPlay.innerHTML = "Play";
                return true;
            }
            else {
                return false;
            }
        };
        View.prototype.render = function (data) {
            if (data === void 0) { data = { generation: 0, livingCells: 0 }; }
            this.outputGeneration.innerHTML = data.generation.toString();
            this.outputLivingCells.innerHTML = data.livingCells.toString();
        };
        View.prototype.trigger = function (event, data) {
            if (data === void 0) { data = undefined; }
            if (this.handler) {
                this.handler(event, data);
            }
        };
        View.prototype.register = function (handler) {
            this.handler = handler;
        };
        return View;
    }());

    var COLORS = {
        "red": {
            "living": "#f00",
            "dead": "#fcc"
        },
        "green": {
            "living": "#0f0",
            "dead": "#cfc",
        },
        "blue": {
            "living": "#00f",
            "dead": "#ccf"
        },
        "magenta": {
            "living": "#f0f",
            "dead": "#fcf",
        },
        "cyan": {
            "living": "#0ff",
            "dead": "#cff"
        },
        "yellow": {
            "living": "#ff0",
            "dead": "#ffc"
        }
    };

    var Controller = /** @class */ (function () {
        function Controller() {
            this.fps = 10;
            this.running = false;
        }
        Controller.create = function () {
            var ctrl = new Controller();
            ctrl.model = new Model(Controller.rows, Controller.columns);
            ctrl.board = new View(Controller.rows, Controller.columns, Controller.cellSize);
            ctrl.settings = new View$1();
            ctrl.registerEventHandler();
            ctrl.settings.render();
            return ctrl;
        };
        Controller.prototype.init = function () {
            this.model.randomize(0.1);
            this.board.draw(this.model.board);
        };
        Controller.prototype.clear = function () {
            this.running = false;
            this.model.clear();
            this.board.draw(this.model.board);
            this.settings.render();
        };
        Controller.prototype.step = function () {
            this.model.transform();
            this.board.draw(this.model.board);
            this.settings.render({
                generation: this.model.generation,
                livingCells: this.model.livingCells
            });
        };
        Controller.prototype.play = function () {
            this.running = true;
            this.loop();
        };
        Controller.prototype.pause = function () {
            this.running = false;
        };
        Controller.prototype.randomize = function (probabiliy) {
            this.running = false;
            this.model.randomize(probabiliy);
            this.board.draw(this.model.board);
            this.settings.render({
                generation: this.model.generation,
                livingCells: this.model.livingCells
            });
        };
        Controller.prototype.color = function (scheme) {
            if (scheme === void 0) { scheme = "red"; }
            View.fillColorLiving = COLORS[scheme].living;
            View.fillColorDead = COLORS[scheme].dead;
            this.board.draw(this.model.board);
        };
        Controller.prototype.framesPerSecond = function (fps) {
            if (fps === void 0) { fps = 10; }
            this.fps = fps;
        };
        Controller.prototype.neighbourCountMethod = function (neighbours) {
            if (neighbours === void 0) { neighbours = "normal"; }
            Model.countMethod = neighbours;
        };
        Controller.prototype.registerEventHandler = function () {
            var _this = this;
            this.settings.register(function (event, data) {
                if (event == "play") {
                    _this.play();
                }
                else if (event == "pause") {
                    _this.pause();
                }
                else if (event == "step") {
                    _this.pause();
                    _this.step();
                }
                else if (event == "randomize") {
                    _this.randomize(data['probability'] / 10);
                }
                else if (event == "color") {
                    _this.color(data['scheme']);
                }
                else if (event == "clear") {
                    _this.clear();
                }
                else if (event == "fps") {
                    _this.framesPerSecond(data['fps']);
                }
                else if (event == "count-method") {
                    _this.neighbourCountMethod(data['method']);
                }
            });
        };
        Controller.prototype.loop = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.running) {
                    _this.step();
                    _this.loop();
                }
            }, 1000 / this.fps);
        };
        Controller.rows = 115;
        Controller.columns = 80;
        Controller.cellSize = 8;
        return Controller;
    }());

    var controller = Controller.create();
    controller.init();

})));
//# sourceMappingURL=bundle.js.map
