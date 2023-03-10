import { getNewPuzzle, getPuzzleSolution } from "./externalServices.js";
import { getRandomInt, alertMessage, getLocalStorage, setLocalStorage } from "./utils.js";

const MAX_LENGTH = 1;

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
    this.boardId = undefined;
    this.selectElement = document.querySelector("#saved-games")
  }

  init() {
    this.playButton.addEventListener("click", () => this.setupBoard()); 
    this.checkButton.addEventListener("click", () => this.checkBoardSolution());
    this.resetButton.addEventListener("click", () => resetBoard(this.initialBoardData));
    this.saveButton.addEventListener("click", () => this.save());
    this.loadButton.addEventListener("click", () => this.load());
    this.oneButton.addEventListener("click", () => putValue(this.selectedField, 1));
    this.twoButton.addEventListener("click", () => putValue(this.selectedField, 2));
    this.threeButton.addEventListener("click", () => putValue(this.selectedField, 3));
    this.fourButton.addEventListener("click", () => putValue(this.selectedField, 4));
    this.fiveButton.addEventListener("click", () => putValue(this.selectedField, 5));
    this.sixButton.addEventListener("click", () => putValue(this.selectedField, 6));
    this.sevenButton.addEventListener("click", () => putValue(this.selectedField, 7));
    this.eightButton.addEventListener("click", () => putValue(this.selectedField, 8));
    this.nineButton.addEventListener("click", () => putValue(this.selectedField, 9));

    this.drawBoard();
  }

  save() {
    saveGame(this.initialBoardData, getCurrentBoardData(), this.boardSolution, this.boardId);
    getSavedGames(this.selectElement);
  }

  load() {
    const savedGame = loadGame(this.selectElement);
    this.initialBoardData = savedGame.initial;
    this.currentBoardData = savedGame.current;
    this.boardSolution = savedGame.solution;
    resetBoard(this.currentBoardData);
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
    })
  }

  async checkBoardSolution() {
    this.currentBoardData = getCurrentBoardData();
    compareBoardToSolution(this.currentBoardData, this.boardSolution);
    setTimeout(function() {clearFieldHighlights();}, 2000);
  }

  drawBoard() {
    const sudokuBoard = document.querySelector("#puzzle-board")
    const squares = 81
    const darkSquare = [0,1,2,6,7,8,9,10,11,15,16,17,18,
        19,20,24,25,26,30,31,32,39,40,41,48,49,50,54,55,
        56,60,61,62,63,64,65,69,70,71,72,73,74,78,79,80];
  
    for (let i = 0; i < squares; i++) {
      const inputElement = document.createElement("input");
      inputElement.setAttribute("type", "number");
      inputElement.id = `f${i}`;
      inputElement.addEventListener("click", () => {this.setSelected(inputElement.id)});        
      inputElement.addEventListener("keyup", () => {this.checkInput(inputElement)});        
      if (darkSquare.includes(i)) {
          inputElement.classList.add("odd-section")
      }
      sudokuBoard.appendChild(inputElement);
    }
    getSavedGames(this.selectElement);
  }

  checkInput(element) {
    console.log("changed");
    if(element.value < 1) { element.value = ""; }
    element.value = element.value.slice(0, MAX_LENGTH);
    // this.currentBoardData = getCurrentBoardData();
    // console.log("currentBoardData: " + this.currentBoardData);
    // if(!this.currentBoardData.includes(".")) {
    //   this.checkBoardSolution()
    // }
  }

  setSelected(elementId) {
    if(this.selectedField !== undefined) {
      this.selectedField.classList.remove("selected");
    }
    this.selectedField = document.querySelector(`#${elementId}`);
    this.selectedField.classList.add("selected");
    this.selectedField.select();
  }
}

function setBoardData(boardData) {
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input, i) => {
    if(boardData[i] != ".") {
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

function clearFieldHighlights() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => { 
    input.classList.remove("square-in-error");
    input.classList.remove("square-is-correct");
  });
}

function compareBoardToSolution(currentBoardData, boardSolution) {
  const inputs = document.querySelectorAll("input");
  boardSolution.forEach((correctValue, i) => { 
    if(currentBoardData[i] != correctValue) {
      inputs[i].classList.add("square-in-error");
    }
    else {
      inputs[i].classList.add("square-is-correct");
    }
  });
}

function resetBoard(boardData) {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, i) => {
    if(boardData[i] === ".") {
      input.value = "";
    }
    else {
      input.value = boardData[i];
    }
  });
}

function putValue(element, value) {
 element.value = value; 
}

function saveGame(initial, current, solution) {
  let savedGames = getLocalStorage("saved-games");
  if(savedGames === null) {
    savedGames = [];
  }

  const savedGame = { initial: initial, current: current, solution: solution };
  savedGames.push(savedGame);
  setLocalStorage("saved-games", savedGames);
}

function getSavedGames(selectElement) {
  const savedGames = getLocalStorage("saved-games");
  selectElement.options.length = 0;
  if(savedGames !== null) {
    savedGames.forEach((savedGame, i) => {
      const optionElement = document.createElement("option");
      optionElement.value = savedGame.id;
      optionElement.text = `Game ${i + 1}`;
      selectElement.add(optionElement);
    });
  }
}

function loadGame(selectElement) {
  const savedGames = getLocalStorage("saved-games");
  return savedGames[selectElement.selectedIndex];
}

