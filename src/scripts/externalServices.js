const baseUrl = "https://sudoku-generator1.p.rapidapi.com/sudoku";
const apiKey = "af23287987mshc12f3e6f80944bcp117c10jsn6dc87d745977";
const apiHost = "sudoku-generator1.p.rapidapi.com";

export async function getNewPuzzle(seed, difficulty) {
  const options = buildRequestOptions("GET");
  return await fetch(`${baseUrl}/generate?seed=${seed}&difficulty=${difficulty}`, options).then(convertToJson);
}

export async function getPuzzleSolution(board) {
  const options = buildRequestOptions("GET");
  return await fetch(`${baseUrl}/solve?puzzle=${board}`, options).then(convertToJson);
}

function buildRequestOptions(httpMethod) {
  const options = {
    method: httpMethod,
    headers: {
      "X-RapidAPI-Key": `${apiKey}`,
      "X-RapidAPI-Host": `${apiHost}`
      }
  };
  return options;
}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    return res.text().then(text => { throw {name: "serviceError", message: `${text}` } })
  }
}
