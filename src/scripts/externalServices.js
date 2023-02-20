const baseUrl = "https://sudoku-generator1.p.rapidapi.com/sudoku";
const apiKey = "af23287987mshc12f3e6f80944bcp117c10jsn6dc87d745977";
const apiHost = "sudoku-generator1.p.rapidapi.com";

export async function getNewPuzzle(seed, difficulty = "easy") {
  let boardData = "";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": `${apiKey}`,
      "X-RapidAPI-Host": `${apiHost}`
    }
  };
  
  await fetch(`${baseUrl}/generate?seed=${seed}`, options)
    .then(response => response.json())
    .then(response => boardData = Array.from(response.puzzle.replaceAll(".", " ")))
    .catch(err => console.error(err));
    return boardData;
}

export async function getPuzzleSolution(board) {
  console.log("getPuzzleSolution: board: " + board);
  let solution = "";
  const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `${apiKey}`,
        "X-RapidAPI-Host": `${apiHost}`
        }
  };
  console.log("getPuzzleSolution: board.toString(): " + board.toString());
  console.log("getPuzzleSolution: board.toString().replaceAll: " + board.toString().replaceAll(",", "").replaceAll(" ", "."));
  await fetch(`${baseUrl}/solve?puzzle=${board.toString().replaceAll(",", "").replaceAll(" ", ".")}`, options)
    .then(response => response.json())
    .then(response => solution = response.solution)
    .catch(err => console.error(err));
    return solution;
}