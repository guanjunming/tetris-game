import { BLOCK_SIZE, TETROMINOS } from "./constants.js";

class Tetromino {
  constructor(type, board) {
    this.board = board;
    this.type = type;
    this.shape = TETROMINOS[type];
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

export default Tetromino;
