import { PREVIEW_BLOCK_SIZE, NEXT_PIECE_COUNT, SEQUENCE, TETROMINOS } from "./constants.js";
import { getRandomInt } from "./utils.js";

class RandomGenerator {
  currentSequence = [];

  // generate sequence of 7 pieces permuted randomly
  generateSequence() {
    const sequence = [...SEQUENCE];
    while (sequence.length > 0) {
      const randIdx = getRandomInt(0, sequence.length);
      this.currentSequence.push(sequence[randIdx]);
      sequence.splice(randIdx, 1);
    }
  }

  getNextPiece() {
    if (this.currentSequence.length <= NEXT_PIECE_COUNT) {
      this.generateSequence();
    }
    const nextPiece = this.currentSequence.shift();
    this.renderNextPieces();
    return nextPiece;
  }

  resetSequence() {
    this.currentSequence.length = 0;
  }

  renderNextPieces() {
    for (let i = 0; i < NEXT_PIECE_COUNT; i++) {
      const container = document.getElementById("next-piece-" + i);
      container.innerHTML = "";

      const name = this.currentSequence[i];
      const shape = TETROMINOS[name];

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const block = document.createElement("div");
            block.classList.add("block", `block-${name}`);
            block.style.width = `${PREVIEW_BLOCK_SIZE}px`;
            block.style.height = `${PREVIEW_BLOCK_SIZE}px`;
            block.style.top = `${y * PREVIEW_BLOCK_SIZE}px`;
            // "O" piece shift right by 1 to align better
            block.style.left = `${(name === "O" ? x + 1 : x) * PREVIEW_BLOCK_SIZE}px`;
            container.appendChild(block);
          }
        }
      }
    }
  }
}

export default RandomGenerator;
