import { BLOCK_SIZE } from "./constants.js";

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const createBlock = (name, row, col) => {
  const block = document.createElement("div");
  block.classList.add("block", `block-${name}`);
  block.style.width = `${BLOCK_SIZE}px`;
  block.style.height = `${BLOCK_SIZE}px`;
  block.style.top = `${row * BLOCK_SIZE}px`;
  block.style.left = `${col * BLOCK_SIZE}px`;
  block.setAttribute("id", `x${col}-y${row}`);
  return block;
};
