import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, TETROMINOS, INVISIBLE_ROWS } from "./constants.js";
import Tetromino from "./tetromino.js";
import RandomGenerator from "./randomGenerator.js";
import { createBlock } from "./utils.js";
import HoldBox from "./holdBox.js";

class Board {
  game;
  randomGenerator;
  holdBox;
  blockContainer;
  playfield = [];

  constructor(game) {
    this.game = game;
    this.randomGenerator = new RandomGenerator();
    this.holdBox = new HoldBox();
    this.createGrid();
    this.setupPlayfield();
  }

  createGrid() {
    const boardGrid = document.querySelector(".board-grid");
    boardGrid.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, ${BLOCK_SIZE}px)`;
    boardGrid.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, ${BLOCK_SIZE}px)`;

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const block = document.createElement("div");
        block.classList.add("block-grid");
        block.style.width = `${BLOCK_SIZE}px`;
        block.style.height = `${BLOCK_SIZE}px`;
        block.setAttribute("id", `x${col}-y${row}`);
        boardGrid.appendChild(block);
      }
    }
  }

  setupPlayfield() {
    this.blockContainer = document.querySelector(".block-container");
    this.blockContainer.style.width = `${BOARD_WIDTH * BLOCK_SIZE}px`;
    this.blockContainer.style.height = `${BOARD_HEIGHT * BLOCK_SIZE}px`;

    // fill playfield with 0
    for (let row = -INVISIBLE_ROWS; row < BOARD_HEIGHT; row++) {
      this.playfield[row] = Array(BOARD_WIDTH).fill(0);
    }
  }

  resetBoard() {
    for (let row = -INVISIBLE_ROWS; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.playfield[row][col] = 0;
      }
    }
    this.blockContainer.innerHTML = "";
    this.randomGenerator.resetSequence();
    this.holdBox.clear();
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

  checkCollision(tetromino, xOffset = 0, yOffset = 0) {
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

  spawnTetromino(tetrominoName = null, isHoldPiece = false) {
    const name =
      isHoldPiece && tetrominoName !== null ? tetrominoName : this.randomGenerator.getNextPiece();

    // I and O start centered, others start center-left
    const x = BOARD_WIDTH / 2 - Math.ceil(TETROMINOS[name][0].length / 2);
    const y = 0;
    const tetromino = new Tetromino(this, name, x, y, isHoldPiece);

    // if overlap with stack, spawn one row up
    if (this.checkCollision(tetromino)) {
      tetromino.position.y = -1;
    }
    tetromino.draw();

    return tetromino;
  }

  onNewTetrominoSpawn(newTetromino) {
    // game over if new spawn overlap with stack
    if (this.checkCollision(newTetromino)) {
      this.game.onGameOver();
    } else {
      // start lock if new spawn can't drop
      newTetromino.tryLock();
    }
  }

  lockTetromino(tetromino) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const row = tetromino.position.y + y;
          const col = tetromino.position.x + x;
          if (this.playfield[row]) {
            this.playfield[row][col] = tetromino.name;
          }
        }
      }
    }

    this.clearLines();

    const newTetromino = this.spawnTetromino();
    this.game.currentTetromino = newTetromino;
    this.onNewTetrominoSpawn(newTetromino);
  }

  enableGameTimer(enable) {
    if (enable) {
      this.game.gameTimer.start();
    } else {
      this.game.gameTimer.stop();
    }
  }

  clearLines() {
    let linesCleared = 0;

    for (let row = BOARD_HEIGHT - 1; row >= 0; ) {
      if (this.playfield[row].every((cell) => cell !== 0)) {
        linesCleared++;

        // shift all rows above down by 1
        for (let y = row; y > -INVISIBLE_ROWS; y--) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            this.playfield[y][x] = this.playfield[y - 1][x];
          }
        }
        // clear top row
        for (let x = 0; x < BOARD_WIDTH; x++) {
          this.playfield[-INVISIBLE_ROWS][x] = 0;
        }
      } else {
        row--;
      }
    }

    if (linesCleared > 0) {
      this.renderBoard();
    }
  }

  holdTetromino(tetromino) {
    const currHoldPiece = this.holdBox.getHoldPiece();
    this.holdBox.setHoldPiece(tetromino.name);

    const newTetromino = this.spawnTetromino(currHoldPiece, true);
    this.game.currentTetromino = newTetromino;
    this.onNewTetrominoSpawn(newTetromino);
  }
}

export default Board;
