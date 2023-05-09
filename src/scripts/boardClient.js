import { getNewPuzzle, getPuzzleSolution } from "./externalServices.js";
import { getRandomInt, alertMessage, removeAlertMessage, getLocalStorage, setLocalStorage } from "./utils.js";
import { setTime, pauseTime, getIsPaused, getTotalSeconds, setTotalSeconds } from "./timer.js";

const MAX_LENGTH = 1;

export default class BoardClient {
  
  constructor(playButtonSelector, checkButtonSelector, clearButtonSelector, saveButtonSelector, loadButtonSelector, deleteButtonSelector) {
    this.playButton = document.querySelector(playButtonSelector);
    this.checkButton = document.querySelector(checkButtonSelector);
    this.resetButton = document.querySelector(clearButtonSelector);
    this.saveButton = document.querySelector(saveButtonSelector);
    this.loadButton = document.querySelector(loadButtonSelector);
    this.deleteButton = document.querySelector(deleteButtonSelector);
    this.pauseButton = document.querySelector("#pause-button");
    this.oneButton = document.querySelector("#one-button");
    this.twoButton = document.querySelector("#two-button");
    this.threeButton = document.querySelector("#three-button");
    this.fourButton = document.querySelector("#four-button");
    this.fiveButton = document.querySelector("#five-button");
    this.sixButton = document.querySelector("#six-button");
    this.sevenButton = document.querySelector("#seven-button");
    this.eightButton = document.querySelector("#eight-button");
    this.nineButton = document.querySelector("#nine-button");
    this.clearButton = document.querySelector("#clear-button");
    this.howToPlayButton = document.querySelector("#how-to-play-button")
    this.initialBoardData = [];
    this.currentBoardData = [];
    this.boardSolution = [];
    this.selectedField = undefined;
    this.boardId = undefined;
    this.selectElement = document.querySelector("#saved-games");
    this.timerInterval = undefined;
  }

  init() {
    this.playButton.addEventListener("click", () => this.setupBoard()); 
    this.checkButton.addEventListener("click", () => this.checkBoardSolution());
    this.resetButton.addEventListener("click", () => resetBoard(this.initialBoardData));
    this.saveButton.addEventListener("click", () => this.save());
    this.loadButton.addEventListener("click", () => this.load());
    this.deleteButton.addEventListener("click", () => this.delete());
    this.pauseButton.addEventListener("click", () => pauseTime(this.pauseButton));
    this.oneButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 1));
    this.twoButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 2));
    this.threeButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 3));
    this.fourButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 4));
    this.fiveButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 5));
    this.sixButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 6));
    this.sevenButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 7));
    this.eightButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 8));
    this.nineButton.addEventListener("click", () => this.checkMouseInput(this.selectedField, 9));
    this.clearButton.addEventListener("click", () => this.clearInput(this.selectedField));
    this.howToPlayButton.addEventListener("click", () => this.howToPlay());

    this.drawBoard();
  }

  save() {
    saveGame(this.initialBoardData, getCurrentBoardData(), this.boardSolution, getTotalSeconds());
    getSavedGames(this.selectElement);
  }

  load() {
    const savedGame = loadGame(this.selectElement);
    this.initialBoardData = savedGame.initial;
    this.currentBoardData = savedGame.current;
    this.boardSolution = savedGame.solution;
    resetBoard(this.currentBoardData);
    this.timerInterval = startClock(savedGame.elapseTime, this.timerInterval);
  }

  delete() {
    deleteGame(this.selectElement);
    getSavedGames(this.selectElement);
  }

  howToPlay() {
    const howToPlay = document.querySelector("#info");
    howToPlay.style.display = "block";
  }

  async setupBoard() {
    this.playButton.disabled = true;
    await this.initializeBoard().then(async () => {
      const difficultyElememt = document.getElementsByName("difficulty");
      let difficulty = difficultyElememt[0].checked ? "easy" : "medium"
      await getBoardPuzzle(difficulty).then(async puzzle =>{
        this.initialBoardData = Array.from(puzzle);
        await getBoardSolution(this.initialBoardData).then(solution => {
          this.boardSolution = Array.from(solution);
          setBoardData(this.initialBoardData);
          this.timerInterval = startClock(0, this.timerInterval);
          this.playButton.disabled = false;
        });
      });      
    });
  }
  
  async initializeBoard() {
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
      inputElement.setAttribute("inputmode", "none");
      inputElement.classList.add("puzzle-input")
      inputElement.id = `f${i}`;
      inputElement.addEventListener("click", () => {this.setSelected(inputElement.id)});        
      inputElement.addEventListener("keyup", () => {this.checkInput(inputElement)});        
      if (darkSquare.includes(i)) {
        inputElement.classList.add("odd-section");
      }
      sudokuBoard.appendChild(inputElement);
    }
    getSavedGames(this.selectElement);
  }

  checkInput(element) {
    if(getIsPaused()) {pauseTime(this.pauseButton); }
    let expression = new RegExp("^[1-9]+$");
    if(!expression.test(element.value)) { element.value = ""; }
    element.value = element.value.slice(0, MAX_LENGTH);
    removeAlertMessage()
    this.currentBoardData = getCurrentBoardData();
    if(!this.currentBoardData.includes(".")) {
      compareBoardToSolution(this.currentBoardData, this.boardSolution);
      const inputs = document.querySelectorAll(".square-in-error");
      clearFieldHighlights();
      if(inputs.length > 0) {
        alertMessage(`Puzzle has ${inputs.length} error(s)`, true);
      }
      else {
        alertMessage(`Congratulations! You finished the puzzle correctly!`, false);
        pauseTime(this.pauseButton)
      }
    }
  }

  checkMouseInput(element, number) {
    putValue(element, number);
    this.checkInput(element);
  }

  clearInput(element) {
    element.value = "";
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
  const inputs = document.querySelectorAll(".puzzle-input")
  inputs.forEach((input, i) => {
    if(boardData[i] != ".") {
      input.value = boardData[i];
      input.classList.add("initial-value");
      input.readOnly = true;
    }
  });
}  

async function getBoardPuzzle(difficulty) {
  try {
    let response = await getNewPuzzle(getRandomInt(), difficulty);
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
  const inputs = document.querySelectorAll(".puzzle-input")
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
  const inputs = document.querySelectorAll(".puzzle-input");
  inputs.forEach((input) => { 
    input.classList.remove("square-in-error");
  });
}

function compareBoardToSolution(currentBoardData, boardSolution) {
  const inputs = document.querySelectorAll(".puzzle-input");
  boardSolution.forEach((correctValue, i) => { 
    if(currentBoardData[i] != correctValue) {
      inputs[i].classList.add("square-in-error");
    }
  });
}

function resetBoard(boardData) {
  const inputs = document.querySelectorAll(".puzzle-input");
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

function saveGame(initial, current, solution, elapseTime) {
  let savedGames = getLocalStorage("saved-games");
  if(savedGames === null) {
    savedGames = [];
  }

  const savedGame = { initial: initial, current: current, solution: solution, elapseTime: elapseTime };
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

function deleteGame(selectElement) {
  const savedGames = getLocalStorage("saved-games");
  savedGames.splice(selectElement.selectedIndex, 1);
  setLocalStorage("saved-games", savedGames);
}

function startClock(totalSeconds, timerInterval) {
  if(!timerInterval !== undefined) {
    clearInterval(timerInterval);
  }
  setTotalSeconds(totalSeconds);
  return setInterval(setTime, 1000);
}
