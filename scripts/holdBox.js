import { SMALL_BLOCK_SIZE, TETROMINOS } from "./constants.js";

class HoldBox {
  container;
  holdPiece = null;

  constructor() {
    this.container = document.getElementById("hold-piece");
  }

  getHoldPiece() {
    return this.holdPiece;
  }

  setHoldPiece(name) {
    this.holdPiece = name;
    const shape = TETROMINOS[name];

    this.container.innerHTML = "";

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const block = document.createElement("div");
          block.classList.add("block", `block-${name}`);
          block.style.width = `${SMALL_BLOCK_SIZE}px`;
          block.style.height = `${SMALL_BLOCK_SIZE}px`;
          block.style.top = `${y * SMALL_BLOCK_SIZE}px`;
          // "O" piece shift right by 1 to align better
          block.style.left = `${(name === "O" ? x + 1 : x) * SMALL_BLOCK_SIZE}px`;
          this.container.appendChild(block);
        }
      }
    }
  }

  clear() {
    this.holdPiece = null;
    this.container.innerHTML = "";
  }
}

export default HoldBox;
