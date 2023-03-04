import BoardClient from "./boardClient.js";
const board = new BoardClient("#play-button", "#check-button", "#clear-button");
board.init();

document.getElementById("last_modified").innerHTML = `Last modified: ${document.lastModified}`;
