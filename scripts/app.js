import Board from "./board.js";
import { UPDATE_INTERVAL } from "./constants.js";
import GameTimer from "./gameTimer.js";

class TetrisGame {
  board;
  tetromino;
  gameTimer;
  pauseMenu;

  constructor() {
    this.board = new Board(this);
    this.gameTimer = new GameTimer(() => this.update(), UPDATE_INTERVAL);
    this.pauseMenu = document.querySelector(".pause-menu");
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

  restartGame() {
    this.gameTimer.stop();
    this.board.resetBoard();
    this.startGame();
    this.pauseMenu.style.display = "none";
  }

  update() {
    this.currentTetromino?.drop();
  }

  startGameTimer() {
    this.gameTimer.start();
  }

  stopGameTimer() {
    this.gameTimer.stop();
  }

  togglePause() {
    this.gameTimer.togglePause();
    this.pauseMenu.style.display = this.gameTimer.isPaused() ? "block" : "none";
  }
}

const game = new TetrisGame();

window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.code === "Escape") {
    game.togglePause();
  } else if (event.code === "Comma") {
    game.startGame();
  }

  if (game.gameTimer.isPaused()) {
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
      game.currentTetromino?.move(-1);
      break;
    case "ArrowRight":
      game.currentTetromino?.move(1);
      break;
    case "ArrowDown":
      game.currentTetromino?.drop();
      break;
    case "ArrowUp": // TODO: to remove
      game.currentTetromino?.up();
      break;
    case "KeyZ":
      if (!event.repeat) {
        game.currentTetromino?.rotate(-1);
      }
      break;
    case "KeyX":
      if (!event.repeat) {
        game.currentTetromino?.rotate(1);
      }
      break;
    case "Space":
      if (!event.repeat) {
        game.currentTetromino?.hardDrop();
      }
      break;
  }
}

document.getElementById("resume-btn").addEventListener("click", () => game.togglePause());
document.getElementById("restart-btn").addEventListener("click", () => game.restartGame());
