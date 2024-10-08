import Board from "./board.js";
import { LEVEL_SPEED_INTERVAL } from "./constants.js";
import timeManager from "./timeManager.js";
import Player from "./player.js";

class TetrisGame {
  board;
  tetromino;
  player;

  isGameRunning = false;
  isGameOver = false;

  pausePopup;
  gameOverPopup;

  constructor() {
    this.player = new Player(this);
    this.board = new Board(this, this.player);

    timeManager.initGameTimer(() => this.update(), LEVEL_SPEED_INTERVAL[0]);

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
    timeManager.togglePause();
    this.pausePopup.style.display = timeManager.isPaused ? "block" : "none";
  }

  startGame() {
    this.isGameOver = false;
    this.currentTetromino = this.board.spawnTetromino();
    timeManager.startGameTimer();
    this.isGameRunning = true;
    this.player.reset();
  }

  restartGame() {
    this.pausePopup.style.display = "none";
    this.gameOverPopup.style.display = "none";

    timeManager.resetTimer();
    this.board.resetBoard();
    this.startGame();
  }

  onGameOver() {
    this.isGameOver = true;
    this.isGameRunning = false;
    timeManager.resetTimer();
    this.gameOverPopup.style.display = "block";
  }

  onLevelUp(level) {
    timeManager.initGameTimer(() => this.update(), LEVEL_SPEED_INTERVAL[level - 1]);
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

  if (event.code === "Comma") {
    game.startGame();
    return;
  }

  if (!game.isGameRunning) {
    return;
  }

  if (event.code === "Escape") {
    game.togglePause();
  }

  if (timeManager.isPaused) {
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
