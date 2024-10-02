import { BLOCK_SIZE, TETROMINOS } from "./constants.js";

class Tetromino {
  board;
  name;
  shape;
  position;
  blocks = [];

  constructor(board, name, posX = 0, posY = 0) {
    this.board = board;
    this.name = name;
    this.shape = TETROMINOS[name];
    this.position = { x: posX, y: posY };
  }

  draw() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          const block = document.createElement("div");
          block.classList.add("block", `block-${this.name}`);
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

  redraw() {
    this.remove();
    this.draw();
  }

  move(xOffset) {
    if (this.board.isValidMove(this, xOffset, 0)) {
      this.position.x += xOffset;
      this.redraw();
    }
  }

  drop() {
    if (this.board.isValidMove(this, 0, 1)) {
      this.position.y += 1;
      this.redraw();
    } else {
      this.board.lockTetromino(this);
    }
  }

  // https://stackoverflow.com/questions/42519/how-do-you-rotate-a-two-dimensional-array
  getRotatedShape(dir) {
    const n = this.shape.length;
    const rotatedShape = [];

    for (let i = 0; i < n; i++) {
      rotatedShape.push([]);
    }

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        // rotate clockwise 90 deg
        if (dir > 0) {
          // transpose and reverse rows
          rotatedShape[y][x] = this.shape[n - x - 1][y];
        }
        // rotate anti-clockwise 90 deg
        else {
          // transpose and reverse columns
          rotatedShape[y][x] = this.shape[x][n - y - 1];
        }
      }
    }

    return rotatedShape;
  }

  rotate(dir) {
    const rotatedShape = this.getRotatedShape(dir);
    if (this.board.isValidRotation(this, rotatedShape)) {
      this.shape = rotatedShape;
      this.redraw();
    }
  }
}

export default Tetromino;
