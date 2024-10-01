import Board from "./board.js";
import Tetromino from "./tetromino.js";

window.addEventListener("keyup", handleKeyPress);
window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.type === "keydown") {
    switch (event.key) {
      case "ArrowLeft":
        if (currentTetromino) {
          currentTetromino.move(-1);
        }
        break;
      case "ArrowRight":
        if (currentTetromino) {
          currentTetromino.move(1);
        }
        break;
      case "ArrowDown":
        if (currentTetromino) {
          currentTetromino.drop();
        }
    }
  } else {
    switch (event.key) {
      case "r":
        board.resetBoard();
        break;
    }
  }
}

const board = new Board();

const currentTetromino = new Tetromino("T", board);
currentTetromino.draw();
