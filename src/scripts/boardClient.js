import { getNewPuzzle, getPuzzleSolution } from "./externalServices.js";
import { getRandomInt } from "./utils.js";

export default class boardClient {
  
  constructor(playButtonSelector, solveButtonSelector, clearButtonSelector) {
    this.playButton = document.querySelector(playButtonSelector);
    this.solveButton = document.querySelector(solveButtonSelector);
    this.clearButton = document.querySelector(clearButtonSelector);
    this.initialBoardData = [];
    this.currentBoardData = [];
    this.boardSolution = [];
  }

  init() {
    this.playButton.addEventListener("click", () => { 
      this.initialBoardData = getNewPuzzle(getRandomInt()).then(response => {
        console.log("response: " + response);
        this.initialBoardData = response;
        console.log("populateBoard: init: boardData: " + this.initialBoardData);
        populateValues(this.initialBoardData);
      }) 
    });

    this.solveButton.addEventListener('click', () => {
      this.currentBoardData = getBoardValues();
      getPuzzleSolution(this.initialBoardData).then(response => {
        this.boardSolution = response;
        console.log("boardSolution: " + this.boardSolution);
      })
    });

    this.clearButton.addEventListener('click', () => window.location.reload(true));

    drawInitialBoard();
  }
}

export function drawInitialBoard() {
  const sudokuBoard = document.querySelector("#puzzle")
  const squares = 81
  const darkSquare = [0,1,2,6,7,8,9,10,11,15,16,17,18,
      19,20,24,25,26,30,31,32,39,40,41,48,49,50,54,55,
      56,60,61,62,63,64,65,69,70,71,72,73,74,78,79,80];

  for (let i = 0; i < squares; i++) {
      const inputElement = document.createElement("input")
      inputElement.setAttribute("type", "number")
      inputElement.setAttribute("maxlength", "1")
      inputElement.setAttribute("oninput", "this.value=this.value.slice(0,this.maxLength)")
      inputElement.setAttribute("onkeyup", "if(value<1) value='';")
     
      if (darkSquare.includes(i)) {
          inputElement.classList.add("odd-section")
      }
      sudokuBoard.appendChild(inputElement)
  }
}

function populateValues(boardData) {
  console.log("populateBoard");
  console.log("populateBoard: boardData: " + boardData);
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input, i) => {
    if(boardData[i] != " ") {
      input.value = boardData[i];
    }
  });
}  

function getBoardValues() {
  let board = [];
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
      if(input.value) {
          board.push(input.value); 
      } else {
        board.push("."); 
      }
  })
  console.log("getBoardValues: board: " + board);
  return board;
}