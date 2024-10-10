import { TETROMINOS } from "./constants.js";
import { createPreviewBlock } from "./utils.js";

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
          const block = createPreviewBlock(name, y, x);
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
