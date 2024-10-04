import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, TETROMINOS } from "./constants.js";
import Tetromino from "./tetromino.js";
import RandomGenerator from "./randomGenerator.js";
import { createBlock } from "./utils.js";

class Board {
  game;
  randomGenerator;
  boardGrid;
  blockContainer;
  playfield = [];

  constructor(game) {
    this.game = game;
    this.randomGenerator = new RandomGenerator();
    this.createGrid();
    this.setupPlayfield();
  }

  createGrid() {
    this.boardGrid = document.querySelector(".board-grid");
    this.boardGrid.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, ${BLOCK_SIZE}px)`;
    this.boardGrid.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, ${BLOCK_SIZE}px)`;

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const block = document.createElement("div");
        block.classList.add("block-grid");
        block.style.width = `${BLOCK_SIZE}px`;
        block.style.height = `${BLOCK_SIZE}px`;
        block.setAttribute("id", `x${col}-y${row}`);
        this.boardGrid.appendChild(block);
      }
    }
  }

  setupPlayfield() {
    // fill playfield with 0
    this.playfield = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    this.blockContainer = document.querySelector(".block-container");
    this.blockContainer.style.width = `${BOARD_WIDTH * BLOCK_SIZE}px`;
    this.blockContainer.style.height = `${BOARD_HEIGHT * BLOCK_SIZE}px`;
  }

  resetBoard() {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.playfield[row][col] = 0;
      }
    }
    this.blockContainer.innerHTML = "";
    this.randomGenerator.resetSequence();
  }

  addBlock(block) {
    this.blockContainer.appendChild(block);
  }

  renderBoard() {
    this.blockContainer.innerHTML = "";

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (this.playfield[row][col]) {
          const block = createBlock(this.playfield[row][col], row, col);
          this.blockContainer.appendChild(block);
        }
      }
    }
  }

  spawnTetromino() {
    const name = this.randomGenerator.getNextPiece();
    // I and O start centered, others start center-left
    const col = BOARD_WIDTH / 2 - Math.ceil(TETROMINOS[name][0].length / 2);
    const row = 0;
    const tetromino = new Tetromino(this, name, col, row);
    tetromino.draw();
    this.game.currentTetromino = tetromino;
  }

  checkCollision(tetromino, xOffset, yOffset) {
    const row = tetromino.position.y + yOffset;
    const col = tetromino.position.x + xOffset;

    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const currRow = row + y;
          const currCol = col + x;
          if (
            // check out of bound
            currRow >= BOARD_HEIGHT ||
            currCol < 0 ||
            currCol >= BOARD_WIDTH ||
            // check overlap with other blocks
            (this.playfield[currRow] && this.playfield[currRow][currCol])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lockTetromino(tetromino) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const row = tetromino.position.y + y;
          const col = tetromino.position.x + x;
          this.playfield[row][col] = tetromino.name;
        }
      }
    }

    this.clearLines();
    this.spawnTetromino();
    this.enableGameTimer(true);
  }

  enableGameTimer(enable) {
    if (enable) {
      this.game.startGameTimer();
    } else {
      this.game.stopGameTimer();
    }
  }

  clearLines() {
    let linesCleared = 0;

    for (let row = BOARD_HEIGHT - 1; row >= 0; ) {
      if (this.playfield[row].every((cell) => cell !== 0)) {
        linesCleared++;

        // shift all rows above down by 1
        for (let y = row; y > 0; y--) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            this.playfield[y][x] = this.playfield[y - 1][x];
          }
        }
        // clear top row
        for (let x = 0; x < BOARD_WIDTH; x++) {
          this.playfield[0][x] = 0;
        }
      } else {
        row--;
      }
    }

    if (linesCleared > 0) {
      this.renderBoard();
    }
  }
}

export default Board;
