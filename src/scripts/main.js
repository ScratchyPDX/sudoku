import BoardClient from "./boardClient.js";
const board = new BoardClient("#play-button", "#check-button", "#reset-button", "#save-button", "#load-button");
board.init();
