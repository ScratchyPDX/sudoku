import boardClient from "./boardClient.js";
const board = new boardClient("#play-button", "#solve-button", "#clear-button");
board.init();
