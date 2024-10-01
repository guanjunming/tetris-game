import Board from "./board.js";
import RandomGenerator from "./randomGenerator.js";

class TetrisGame {
  constructor() {
    this.randomGenerator = new RandomGenerator(this);
    this.board = new Board(this, this.randomGenerator);
    this.tetromino = null;
  }

  startGame() {
    this.board.spawnTetromino();
  }

  get currentTetromino() {
    return this.tetromino;
  }

  set currentTetromino(tetromino) {
    this.tetromino = tetromino;
  }
}

const game = new TetrisGame();
game.startGame();

window.addEventListener("keyup", handleKeyPress);
window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.type === "keydown") {
    switch (event.key) {
      case "ArrowLeft":
        if (game.currentTetromino) {
          game.currentTetromino.move(-1);
        }
        break;
      case "ArrowRight":
        if (game.currentTetromino) {
          game.currentTetromino.move(1);
        }
        break;
      case "ArrowDown":
        if (game.currentTetromino) {
          game.currentTetromino.drop();
        }
    }
  } else {
    switch (event.key) {
      case "r":
        game.board.resetBoard();
        game.startGame();
        break;
    }
  }
}
