
// Timer functionality
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let isPaused = false;

export function setTime()
{
  if(!isPaused) {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
}

export function pauseTime(pauseButtonElement) {
  isPaused = !isPaused;
  pauseButtonElement.textContent =  (isPaused) ? "Continue" : "Pause";
  
}

function pad(val)
{
    var valString = val + "";
    if(valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
}
