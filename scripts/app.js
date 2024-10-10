import Board from "./board.js";
import { LEVEL_SPEED_INTERVAL } from "./constants.js";
import timeManager from "./timeManager.js";
import Player from "./player.js";
import soundManager from "./soundManager.js";

class GameManager {
  board;
  tetromino;
  player;

  isGameRunning = false;
  isGameOver = false;
  isPlayingAnimation = false;

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
    this.pausePopup.classList.toggle("hidden");
  }

  startGame() {
    this.isGameOver = false;
    this.currentTetromino = this.board.spawnTetromino();
    timeManager.startGameTimer();
    this.isGameRunning = true;
    this.player.reset();
  }

  restartGame() {
    this.pausePopup.classList.add("hidden");
    this.gameOverPopup.classList.add("hidden");

    timeManager.resetTimer();
    this.board.resetBoard();
    this.startGame();
  }

  onGameOver() {
    soundManager.playSoundEffect("game_over", 0.4);
    this.isGameOver = true;
    this.isGameRunning = false;
    timeManager.resetTimer();
    this.gameOverPopup.classList.remove("hidden");

    const score = this.player.score;
    document.getElementById("gameover-score").textContent = score;

    const highScore = Number(localStorage.getItem("high_score")) || 0;
    if (score > highScore) {
      localStorage.setItem("high_score", score);
      document.getElementById("high-score").textContent = score;
    }

    document.getElementById("gameover-score-title").textContent =
      score > highScore ? "NEW HIGH SCORE!" : "SCORE";
  }

  onLevelUp(level) {
    timeManager.initGameTimer(() => this.update(), LEVEL_SPEED_INTERVAL[level - 1]);
  }
}

const game = new GameManager();

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

  if (!game.isGameRunning || game.isPlayingAnimation) {
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
    case "ArrowUp":
      if (!event.repeat) {
        game.currentTetromino?.rotate(1);
      }
      break;
    case "KeyZ":
      if (!event.repeat) {
        game.currentTetromino?.rotate(-1);
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

document.querySelector(".play-btn").addEventListener("click", () => {
  document.querySelector("#home-popup").classList.add("hidden");
  game.startGame();
});
document.querySelector("#pause-btn").addEventListener("click", () => {
  game.togglePause();
});
document.querySelector(".resume-btn").addEventListener("click", () => {
  game.togglePause();
});
document.querySelectorAll(".restart-btn").forEach((btn) => {
  btn.addEventListener("click", () => game.restartGame());
});
document.querySelectorAll(".quit-btn").forEach((btn) => {
  btn.addEventListener("click", () => window.location.reload());
});
