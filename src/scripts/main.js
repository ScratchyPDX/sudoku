import BoardClient from "./boardClient.js";
var elem = document.getElementById("body");
if (elem.requestFullscreen) {
  elem.requestFullscreen();
} else if (elem.webkitRequestFullscreen) { /* Safari */
  elem.webkitRequestFullscreen();
} else if (elem.msRequestFullscreen) { /* IE11 */
  elem.msRequestFullscreen();
}
const board = new BoardClient("#play-button", "#check-button", "#reset-button", "#save-button", "#load-button", "#delete-button");
board.init();
