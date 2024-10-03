import { BLOCK_SIZE, TETROMINOS, WALL_KICK_OFFSET } from "./constants.js";

class Tetromino {
  board;
  name;
  shape;
  position;
  rotation = 0;
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
        // } else {
        //   const block = document.createElement("div");
        //   block.classList.add("block-outline");
        //   block.style.width = `${BLOCK_SIZE}px`;
        //   block.style.height = `${BLOCK_SIZE}px`;
        //   block.style.top = `${(this.position.y + y) * BLOCK_SIZE}px`;
        //   block.style.left = `${(this.position.x + x) * BLOCK_SIZE}px`;
        //   this.blocks.push(block);
        //   this.board.addBlock(block);
        // }
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
    if (!this.board.checkCollision(this, xOffset, 0)) {
      this.position.x += xOffset;
      this.redraw();
      //console.log(`position: x${this.position.x},y${this.position.y}`);
    }
  }

  drop() {
    if (!this.board.checkCollision(this, 0, 1)) {
      this.position.y += 1;
      this.redraw();
      //console.log(`position: x${this.position.x},y${this.position.y}`);
    } else {
      this.board.lockTetromino(this);
    }
  }

  up() {
    if (!this.board.checkCollision(this, 0, -1)) {
      this.position.y -= 1;
      this.redraw();
      //console.log(`position: x${this.position.x},y${this.position.y}`);
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
    if (this.name === "O") return;

    const originalShape = this.shape;
    this.shape = this.getRotatedShape(dir);

    const newRotation = (this.rotation + dir + 4) % 4; // +4 to make -1 -> 3

    const dataset = this.name === "I" ? WALL_KICK_OFFSET.I : WALL_KICK_OFFSET.JLSTZ;
    const wallKickOffsets = dataset[this.rotation][newRotation];

    let rotated = false;
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

    if (rotated) {
      this.redraw();
    } else {
      this.shape = originalShape;
    }
    //console.log(`position: x${this.position.x},y${this.position.y}`);
  }
}

export default Tetromino;
