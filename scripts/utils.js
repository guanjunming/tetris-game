import { BLOCK_SIZE, PREVIEW_BLOCK_SIZE } from "./constants.js";

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const createBlock = (name, row, col, isGhost) => {
  const block = document.createElement("div");
  block.classList.add(`block${isGhost ? "-ghost" : ""}`, `${isGhost ? "ghost" : "block"}-${name}`);
  block.style.width = `${BLOCK_SIZE}px`;
  block.style.height = `${BLOCK_SIZE}px`;
  block.style.top = `${row * BLOCK_SIZE}px`;
  block.style.left = `${col * BLOCK_SIZE}px`;
  block.setAttribute("id", `${isGhost ? "ghost" : "block"}-x${col}-y${row}`);
  return block;
};

export const createPreviewBlock = (name, row, col) => {
  const block = document.createElement("div");
  block.classList.add("block", `block-${name}`);
  block.style.width = `${PREVIEW_BLOCK_SIZE}px`;
  block.style.height = `${PREVIEW_BLOCK_SIZE}px`;
  block.style.top = `${row * PREVIEW_BLOCK_SIZE}px`;
  // "O" piece shift right by 1 to align better
  block.style.left = `${(name === "O" ? col + 1 : col) * PREVIEW_BLOCK_SIZE}px`;
  return block;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
