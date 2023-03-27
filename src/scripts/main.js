import BoardClient from "./boardClient.js";
screen.orientation.lock("portrait");
const board = new BoardClient("#play-button", "#check-button", "#reset-button", "#save-button", "#load-button", "#delete-button");
board.init();
