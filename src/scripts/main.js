import BoardClient from "./boardClient.js";
const board = new BoardClient("#play-button", "#check-button", "#clear-button");
board.init();
