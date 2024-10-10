import { NEXT_PIECE_COUNT, SEQUENCE, TETROMINOS } from "./constants.js";
import { createPreviewBlock, getRandomInt } from "./utils.js";

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
            const block = createPreviewBlock(name, y, x);
            container.appendChild(block);
          }
        }
      }
    }
  }
}

export default RandomGenerator;
