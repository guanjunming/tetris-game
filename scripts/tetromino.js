import { LOCK_DELAY, MOVE_LIMIT, TETROMINOS, WALL_KICK_OFFSET } from "./constants.js";
import soundManager from "./soundManager.js";
import timeManager from "./timeManager.js";
import { createBlock } from "./utils.js";

class Tetromino {
  board;
  name;
  shape;
  position;
  rotation = 0; // rotation state 0, 1, 2, 3
  blocks = [];
  ghostBlocks = [];
  moveCounter = 0;
  pendingLock = false;
  isHoldPiece = false;

  constructor(board, name, posX, posY, isHoldPiece) {
    this.board = board;
    this.name = name;
    this.shape = TETROMINOS[name];
    this.position = { x: posX, y: posY };
    this.isHoldPiece = isHoldPiece;

    timeManager.initLockTimer(() => this.lock(), LOCK_DELAY);
  }

  draw() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x] && this.position.y + y >= 0) {
          const block = createBlock(this.name, this.position.y + y, this.position.x + x, false);
          this.blocks.push(block);
          this.board.addBlock(block);
        }
      }
    }

    this.drawGhost();
  }

  drawGhost() {
    const ghost = {
      shape: this.shape,
      position: { ...this.position },
    };

    while (!this.board.checkCollision(ghost, 0, 1)) {
      ghost.position.y += 1;
    }

    for (let y = 0; y < ghost.shape.length; y++) {
      for (let x = 0; x < ghost.shape[y].length; x++) {
        if (ghost.shape[y][x] && ghost.position.y + y >= 0) {
          const block = createBlock(this.name, ghost.position.y + y, ghost.position.x + x, true);
          this.ghostBlocks.push(block);
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

    for (let i = 0; i < this.ghostBlocks.length; i++) {
      this.ghostBlocks[i].remove();
    }
    this.ghostBlocks.length = 0;
  }

  redraw() {
    this.remove();
    this.draw();
  }

  lock() {
    this.pendingLock = false;
    this.moveCounter = 0;
    this.board.lockTetromino(this);

    for (let i = 0; i < this.ghostBlocks.length; i++) {
      this.ghostBlocks[i].remove();
    }
    this.ghostBlocks.length = 0;

    soundManager.playSoundEffect("soft_drop");
  }

  resetLockTimer() {
    timeManager.stopTimer();
    this.moveCounter++;
    if (this.moveCounter >= MOVE_LIMIT) {
      this.lock();
    } else {
      timeManager.startLockTimer();
    }
  }

  tryLock() {
    if (this.board.checkCollision(this, 0, 1)) {
      // start lock timer if not already started
      if (!this.pendingLock) {
        this.pendingLock = true;
        timeManager.startLockTimer();
      } else {
        this.resetLockTimer();
      }
    } else {
      timeManager.startGameTimer();
      if (this.pendingLock) {
        this.moveCounter++;
      }
    }
  }

  drop(playerInput = false) {
    if (!this.board.checkCollision(this, 0, 1)) {
      this.position.y += 1;
      this.redraw();

      if (playerInput) {
        this.board.player.updateSoftDropScore(1);
        soundManager.playSoundEffect("move");
      }

      this.moveCounter = 0;
      this.pendingLock = false;

      // cannot drop anymore, start lock timer
      if (this.board.checkCollision(this, 0, 1)) {
        this.pendingLock = true;
        timeManager.startLockTimer();
      }
    }
  }

  move(xOffset) {
    if (!this.board.checkCollision(this, xOffset, 0)) {
      this.position.x += xOffset;
      this.redraw();
      this.tryLock();
      soundManager.playSoundEffect("move");
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
    const originalShape = this.shape;
    this.shape = this.getRotatedShape(dir);
    let rotated = false;

    if (this.name === "O") {
      rotated = true;
    } else {
      const newRotation = (this.rotation + dir + 4) % 4; // +4 to make -1 -> 3

      const dataset = this.name === "I" ? WALL_KICK_OFFSET.I : WALL_KICK_OFFSET.JLSTZ;
      const wallKickOffsets = dataset[this.rotation][newRotation];

      for (let i = 0; i < wallKickOffsets.length; i++) {
        let [xOffset, yOffset] = wallKickOffsets[i];
        // invert the direction of y in dataset as y = 0 is at top of grid
        yOffset *= -1;

        if (!this.board.checkCollision(this, xOffset, yOffset)) {
          this.position.x += xOffset;
          this.position.y += yOffset;
          this.rotation = newRotation;
          rotated = true;
          break;
        }
      }
    }

    if (rotated) {
      this.redraw();
      this.tryLock();
      soundManager.playSoundEffect("rotate");
    } else {
      this.shape = originalShape;
    }
  }

  hardDrop() {
    timeManager.stopTimer();
    this.pendingLock = false;

    const origY = this.position.y;

    while (!this.board.checkCollision(this, 0, 1)) {
      this.position.y += 1;
    }
    const cellsDropped = this.position.y - origY;
    this.board.player.updateHardDropScore(cellsDropped);

    this.redraw();
    this.lock();
    soundManager.playSoundEffect("hard_drop", 0.3);
  }

  destroy() {
    timeManager.stopTimer();
    this.remove();
  }

  hold() {
    if (!this.isHoldPiece) {
      this.destroy();
      this.board.holdTetromino(this);
      soundManager.playSoundEffect("hold");
    }
  }
}

export default Tetromino;
