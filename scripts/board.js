import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, TETROMINOS } from "./constants.js";
import Tetromino from "./tetromino.js";

class Board {
  game;
  randomGenerator;
  boardGrid;
  blockContainer;
  playfield = [];

  constructor(game, randomGenerator) {
    this.game = game;
    this.randomGenerator = randomGenerator;
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

  spawnTetromino() {
    const name = this.randomGenerator.getNextPiece();
    // I and O start centered, others start center-left
    const col = BOARD_WIDTH / 2 - Math.ceil(TETROMINOS[name][0].length / 2);
    const row = 0;
    const tetromino = new Tetromino(this, name, col, row);
    tetromino.draw();
    this.game.currentTetromino = tetromino;
  }

  isValidMove(tetromino, xOffset, yOffset) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const row = tetromino.position.y + y + yOffset;
          const col = tetromino.position.x + x + xOffset;
          // check within board boundary and not overlap with blocks in playfield
          if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || this.playfield[row][col]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  lockTetromino(tetromino) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const row = tetromino.position.y + y;
          const col = tetromino.position.x + x;
          this.playfield[row][col] = 1;
        }
      }
    }

    this.spawnTetromino();
  }
}

export default Board;
