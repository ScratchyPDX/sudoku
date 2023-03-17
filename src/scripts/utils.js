
export function getRandomInt() {
  const min = Math.ceil(0);
  const max = Math.floor(2000);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function removeAlertMessage() {
  let element = document.querySelector("#alert-list");

  // remove any existing alerts
  const originalSection = element.querySelectorAll("section");
  if(originalSection.length > 0) {
    element.removeChild(originalSection[0]);
  }
}

export function alertMessage(message, isErrorAlert) {
    let element = document.querySelector("#alert-list");
    let section = document.createElement("section");
    let p = document.createElement("p");
    p.textContent = message;
    let input = document.createElement("input");
    input.classList.add("alert-button");
    if(isErrorAlert) {
      p.classList.add("square-in-error");
      input.classList.add("square-in-error");
    }
    input.type = "button";
    input.value = "X";
    section.appendChild(p);
    section.appendChild(input);
    element.prepend(section);

    input.addEventListener("click", function() {
        element.removeChild(section);
  })
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function deleteLocalStorage(key) {
  localStorage.removeItem(key);
}

