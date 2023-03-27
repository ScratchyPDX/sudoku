import BoardClient from "./boardClient.js";
let screenOrientation = window.screen.orientation;
screenOrientation.lock("portrait");
const board = new BoardClient("#play-button", "#check-button", "#reset-button", "#save-button", "#load-button", "#delete-button");
board.init();
