import BoardClient from "./boardClient.js";
const board = new BoardClient("#play-button", "#solve-button", "#clear-button");
board.init();
