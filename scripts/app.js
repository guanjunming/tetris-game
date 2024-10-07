import Board from "./board.js";
import { UPDATE_INTERVAL } from "./constants.js";
import GameTimer from "./gameTimer.js";
import Player from "./player.js";

class TetrisGame {
  board;
  tetromino;
  player;

  gameTimer;

  isGameOver = false;

  pausePopup;
  gameOverPopup;

  constructor() {
    this.player = new Player(this);
    this.board = new Board(this, this.player);

    this.gameTimer = new GameTimer(() => this.update(), UPDATE_INTERVAL);
    this.pausePopup = document.querySelector("#pause-popup");
    this.gameOverPopup = document.querySelector("#gameover-popup");
  }

  get currentTetromino() {
    return this.tetromino;
  }

  set currentTetromino(tetromino) {
    this.tetromino = tetromino;
  }

  update() {
    this.currentTetromino?.drop();
  }

  togglePause() {
    this.gameTimer.togglePause();
    this.pausePopup.style.display = this.gameTimer.isPaused() ? "block" : "none";
  }

  startGame() {
    this.isGameOver = false;
    this.currentTetromino = this.board.spawnTetromino();
    this.gameTimer.start();
    this.player.reset();
  }

  restartGame() {
    this.pausePopup.style.display = "none";
    this.gameOverPopup.style.display = "none";
    this.gameTimer.stop();
    this.board.resetBoard();
    this.startGame();
  }

  onGameOver() {
    this.gameOverPopup.style.display = "block";
    this.isGameOver = true;
    this.gameTimer.stop();
  }
}

const game = new TetrisGame();

function handleKeyPress(event) {
  if (game.isGameOver) {
    if (event.code === "Space") {
      game.restartGame();
    }
    return;
  }

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
      game.currentTetromino?.drop(true);
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
    case "KeyC":
      if (!event.repeat) {
        game.currentTetromino?.hold();
      }
  }
}

window.addEventListener("keydown", handleKeyPress);

document.querySelector(".resume-btn").addEventListener("click", () => {
  game.togglePause();
});
document.querySelectorAll(".restart-btn").forEach((btn) => {
  btn.addEventListener("click", () => game.restartGame());
});
document.querySelectorAll(".quit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.reload();
  });
});
