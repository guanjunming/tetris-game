import { LOCK_DELAY, MOVE_LIMIT, TETROMINOS, WALL_KICK_OFFSET } from "./constants.js";
import { createBlock } from "./utils.js";

class Tetromino {
  board;
  name;
  shape;
  position;
  rotation = 0;
  blocks = [];
  lockTimerId = 0;
  moveCounter = 0;
  pendingLock = false;

  constructor(board, name, posX = 0, posY = 0) {
    this.board = board;
    this.name = name;
    this.shape = TETROMINOS[name];
    this.position = { x: posX, y: posY };
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

  lock() {
    this.moveCounter = 0;
    this.board.lockTetromino(this);
  }

  setLockTimer() {
    this.lockTimerId = setTimeout(() => {
      this.lockTimerId = 0;
      this.lock();
    }, LOCK_DELAY);
  }

  clearLockTimer() {
    if (this.lockTimerId) {
      clearTimeout(this.lockTimerId);
      this.lockTimerId = 0;
    }
  }

  resetLockTimer() {
    this.clearLockTimer();
    this.moveCounter++;
    if (this.moveCounter >= MOVE_LIMIT) {
      this.lock();
    } else {
      this.setLockTimer();
    }
  }

  tryLock() {
    if (this.board.checkCollision(this, 0, 1)) {
      // start lock timer if not already started
      if (!this.pendingLock) {
        this.pendingLock = true;
        this.setLockTimer();
        this.board.enableGameTimer(false);
      } else {
        this.resetLockTimer();
      }
    } else {
      this.clearLockTimer();
      this.board.enableGameTimer(true);
      if (this.pendingLock) {
        this.moveCounter++;
      }
    }
  }

  drop() {
    if (!this.board.checkCollision(this, 0, 1)) {
      this.position.y += 1;
      this.redraw();

      this.clearLockTimer();
      this.moveCounter = 0;
      this.pendingLock = false;

      // cannot drop anymore, start lock timer
      if (this.board.checkCollision(this, 0, 1)) {
        this.pendingLock = true;
        this.setLockTimer();
        this.board.enableGameTimer(false);
      }
    }
  }

  move(xOffset) {
    if (!this.board.checkCollision(this, xOffset, 0)) {
      this.position.x += xOffset;
      this.redraw();
      this.tryLock();
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
        // invert the direction of y in dataset as y=0 is at top of grid
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
    } else {
      this.shape = originalShape;
    }
  }

  hardDrop() {
    this.board.enableGameTimer(false);
    this.clearLockTimer();
    this.pendingLock = false;

    while (!this.board.checkCollision(this, 0, 1)) {
      this.position.y += 1;
    }

    this.redraw();
    this.lock();
  }
}

export default Tetromino;
