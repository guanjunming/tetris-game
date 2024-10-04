import Board from "./board.js";
import { UPDATE_INTERVAL } from "./constants.js";

class TetrisGame {
  board;
  tetromino;
  intervalId = 0;

  constructor() {
    this.board = new Board(this);
  }

  get currentTetromino() {
    return this.tetromino;
  }

  set currentTetromino(tetromino) {
    this.tetromino = tetromino;
  }

  startGame() {
    this.board.spawnTetromino();
    this.startGameTimer();
  }

  update() {
    this.currentTetromino?.drop();
  }

  startGameTimer() {
    if (this.intervalId === 0) {
      this.intervalId = setInterval(() => this.update(), UPDATE_INTERVAL);
    }
  }

  stopGameTimer() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
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
