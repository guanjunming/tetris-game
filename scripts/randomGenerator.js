import { SEQUENCE } from "./constants.js";
import { getRandomInt } from "./utils.js";

class RandomGenerator {
  game;
  currentSequence = [];

  constructor(game) {
    this.game = game;
  }

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
    if (this.currentSequence.length === 0) {
      this.generateSequence();
    }
    return this.currentSequence.pop();
  }

  resetSequence() {
    this.currentSequence.length = 0;
  }
}

export default RandomGenerator;
