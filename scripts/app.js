import Board from "./board.js";
import { UPDATE_INTERVAL } from "./constants.js";
import RandomGenerator from "./randomGenerator.js";

class TetrisGame {
  randomGenerator;
  board;
  tetromino;
  intervalId;

  constructor() {
    this.randomGenerator = new RandomGenerator(this);
    this.board = new Board(this, this.randomGenerator);
  }

  get currentTetromino() {
    return this.tetromino;
  }

  set currentTetromino(tetromino) {
    this.tetromino = tetromino;
  }

  startGame() {
    this.board.spawnTetromino();
    //this.startInterval(UPDATE_INTERVAL);
  }

  update() {
    if (!this.currentTetromino) {
      return;
    }

    this.tetromino.drop();
  }

  startInterval(delay) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => this.update(), delay);
  }
}

const game = new TetrisGame();

window.addEventListener("keyup", handleKeyPress);
window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.type === "keydown") {
    switch (event.key) {
      case "ArrowLeft":
        game.currentTetromino?.move(-1);
        break;
      case "ArrowRight":
        game.currentTetromino?.move(1);
        break;
      case "ArrowDown":
        game.currentTetromino?.drop();
        break;
      case "ArrowUp":
        game.currentTetromino?.up();
        break;
      case "z":
        if (!event.repeat) {
          game.currentTetromino?.rotate(-1);
        }
        break;
      case "x":
        if (!event.repeat) {
          game.currentTetromino?.rotate(1);
        }
        break;
    }
  } else {
    switch (event.key) {
      case "t":
        game.startGame();
        break;
      case "r":
        game.board.resetBoard();
        game.startGame();
        break;
    }
  }
}
