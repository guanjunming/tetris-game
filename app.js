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
        this.playfield[row][col] = 0;
      }
    }
    this.blockContainer.innerHTML = "";
  }

  addBlock(block) {
    this.blockContainer.appendChild(block);
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
}

const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

class Tetromino {
  constructor(type, board) {
    this.board = board;
    this.type = type;
    this.shape = tetrominos[type];
    this.position = { x: 0, y: 0 };
    this.blocks = [];
  }

  draw() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          const block = document.createElement("div");
          block.classList.add("block", `block-${this.type}`);
          block.style.width = `${BLOCK_SIZE}px`;
          block.style.height = `${BLOCK_SIZE}px`;
          block.style.top = `${(this.position.y + y) * BLOCK_SIZE}px`;
          block.style.left = `${(this.position.x + x) * BLOCK_SIZE}px`;
          block.setAttribute("id", `x${this.position.x + x}-y${this.position.y + y}`);
          this.blocks.push(block);
          this.board.addBlock(block);
        }
      }
    }
  }

  remove() {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].remove();
    }
    this.blocks.length = 0;
  }

  move(xOffset) {
    if (this.board.isValidMove(this, xOffset, 0)) {
      this.position.x += xOffset;
      this.remove();
      this.draw();
    }
  }

  drop() {
    if (this.board.isValidMove(this, 0, 1)) {
      this.position.y += 1;
      this.remove();
      this.draw();
    }
  }
}

window.addEventListener("keyup", handleKeyPress);
window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.type === "keydown") {
    switch (event.key) {
      case "ArrowLeft":
        if (currentTetromino) {
          currentTetromino.move(-1);
        }
        break;
      case "ArrowRight":
        if (currentTetromino) {
          currentTetromino.move(1);
        }
        break;
      case "ArrowDown":
        if (currentTetromino) {
          currentTetromino.drop();
        }
    }
  } else {
    switch (event.key) {
      case "r":
        board.resetBoard();
        break;
    }
  }
}

const board = new Board();

const currentTetromino = new Tetromino("T", board);
currentTetromino.draw();
