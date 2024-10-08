import { LEVEL_SPEED_INTERVAL, LINES_PER_LEVEL } from "./constants.js";

class Player {
  scoreElement;
  levelElement;
  linesElement;

  game;
  score = 0;
  level = 1;
  linesCleared = 0;
  linesForNextLevel;

  constructor(game) {
    this.game = game;

    this.scoreElement = document.getElementById("score");
    this.levelElement = document.getElementById("level");
    this.linesElement = document.getElementById("lines");
  }

  updateDisplay() {
    this.scoreElement.textContent = this.score;
    this.levelElement.textContent = this.level;
    this.linesElement.textContent = this.linesCleared;
  }

  reset() {
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.linesForNextLevel = LINES_PER_LEVEL;
    this.updateDisplay();
  }

  updateScore(lines) {
    let points = 0;

    switch (lines) {
      case 1:
        points = 100 * this.level;
        break;
      case 2:
        points = 300 * this.level;
        break;
      case 3:
        points = 500 * this.level;
        break;
      case 4:
        points = 800 * this.level;
        break;
    }

    if (points > 0) {
      this.score += points;
      this.linesCleared += lines;

      this.tryLevelUp();

      this.updateDisplay();
    }
  }

  tryLevelUp() {
    // check whether has reached max level
    if (this.level < LEVEL_SPEED_INTERVAL.length && this.linesCleared >= this.linesForNextLevel) {
      this.level++;
      this.linesForNextLevel += LINES_PER_LEVEL;
      this.game.onLevelUp(this.level);
    }
  }

  updateSoftDropScore(cellsDropped) {
    this.score += cellsDropped;
    this.updateDisplay();
  }

  updateHardDropScore(cellsDropped) {
    this.score += cellsDropped * 2;
    this.updateDisplay();
  }
}

export default Player;
