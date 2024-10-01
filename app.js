const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // block size in px

class Board {
  constructor() {
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
        this.board[row][col] = 0;
      }
    }

    this.blockContainer.innerHTML = "";
  }
}

const board = new Board();
