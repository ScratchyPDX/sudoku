import { getNewPuzzle, getPuzzleSolution } from "./externalServices.js";
import { getRandomInt, alertMessage } from "./utils.js";

export default class BoardClient {
  
  constructor(playButtonSelector, checkButtonSelector, clearButtonSelector, saveButtonSelector, loadButtonSelector) {
    this.playButton = document.querySelector(playButtonSelector);
    this.checkButton = document.querySelector(checkButtonSelector);
    this.resetButton = document.querySelector(clearButtonSelector);
    this.saveButton = document.querySelector(saveButtonSelector);
    this.loadButton = document.querySelector(loadButtonSelector);
    this.oneButton = document.querySelector("#one-button");
    this.twoButton = document.querySelector("#two-button");
    this.threeButton = document.querySelector("#three-button");
    this.fourButton = document.querySelector("#four-button");
    this.fiveButton = document.querySelector("#five-button");
    this.sixButton = document.querySelector("#six-button");
    this.sevenButton = document.querySelector("#seven-button");
    this.eightButton = document.querySelector("#eight-button");
    this.nineButton = document.querySelector("#nine-button");
    this.initialBoardData = [];
    this.currentBoardData = [];
    this.boardSolution = [];
    this.selectedField = undefined;
  }

  init() {
    this.playButton.addEventListener("click", () => this.setupBoard()); 
    this.checkButton.addEventListener("click", () => this.checkBoardSolution());
    this.resetButton.addEventListener("click", () => window.location.reload(true));
    this.oneButton.addEventListener("click", () => this.putValue(1));
    this.twoButton.addEventListener("click", () => this.putValue(2));
    this.threeButton.addEventListener("click", () => this.putValue(3));
    this.fourButton.addEventListener("click", () => this.putValue(4));
    this.fiveButton.addEventListener("click", () => this.putValue(5));
    this.sixButton.addEventListener("click", () => this.putValue(6));
    this.sevenButton.addEventListener("click", () => this.putValue(7));
    this.eightButton.addEventListener("click", () => this.putValue(8));
    this.nineButton.addEventListener("click", () => this.putValue(9));

    this.drawBoard();
  }

  putValue(value) {
   this.selectedField.value = value; 
  }

  async setupBoard() {
    this.initializeBoard();
    const puzzle = await getBoardPuzzle();
    this.initialBoardData = Array.from(puzzle);
    const solution = await getBoardSolution(this.initialBoardData);
    this.boardSolution = Array.from(solution);
    setBoardData(this.initialBoardData);
  }
  
  initializeBoard() {
    this.initialBoardData = [];
    this.boardSolution = [];
    this.currentBoardData = [];
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
      input.value = "";
      input.classList.remove("square-in-error");
    })
  }

  async checkBoardSolution() {
    this.currentBoardData = getCurrentBoardData();
    compareBoardToSolution(this.currentBoardData, this.boardSolution);
  }

  drawBoard() {
    const sudokuBoard = document.querySelector("#puzzle-board")
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
        inputElement.id = `f${i}`;
        inputElement.addEventListener("click", () => {this.setSelected(inputElement.id)});        
        if (darkSquare.includes(i)) {
            inputElement.classList.add("odd-section")
        }
        sudokuBoard.appendChild(inputElement);
    }
  }

    setSelected(elementId) {
      if(this.selectedField !== undefined) {
        this.selectedField.classList.remove("selected");
      }
      this.selectedField = document.querySelector(`#${elementId}`);
      this.selectedField.classList.add("selected");
    }
  }

function setBoardData(boardData) {
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input, i) => {
    if(boardData[i] != " ") {
      input.value = boardData[i];
    }
  });
}  

async function getBoardPuzzle() {
  try {
    let response = await getNewPuzzle(getRandomInt());
    return response.puzzle;
  }
  catch(err) {
    // console.log(`getBoardPuzzle: ${err.name}: ${err.message}`);
    let errorMessages = JSON.parse(err.message);
    Object.keys(errorMessages).forEach(key => {
      alertMessage(errorMessages[key]);
    });
  }
}

async function getBoardSolution(initialBoardData) {
  try {
    let response = await getPuzzleSolution(initialBoardData.toString().replaceAll(",", "").replaceAll(" ", "."));
    return  Array.from(response.solution);
  }
  catch(err) {
    // console.log(`getBoardSolution: ${err.name}: ${err.message}`);
    let errorMessages = JSON.parse(err.message);
    Object.keys(errorMessages).forEach(key => {
      alertMessage(errorMessages[key]);
    });
  }
}

function getCurrentBoardData() {
  let board = [];
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
      if(input.value) {
          board.push(input.value); 
      } else {
        board.push("."); 
      }
  })
  return board;
}

function compareBoardToSolution(currentBoardData, boardSolution) {
  const inputs = document.querySelectorAll("input");
  boardSolution.forEach((correctValue, i) => { 
    if(currentBoardData[i] != correctValue) {
      inputs[i].classList.add("square-in-error");
    }
  });
}
