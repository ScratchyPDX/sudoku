
export function getRandomInt() {
  const min = Math.ceil(0);
  const max = Math.floor(2000);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function alertMessage(message) {
    let element = document.querySelector("#alert-list");
    let section = document.createElement("section");
    let p = document.createElement("p");
    p.textContent = message;
    let input = document.createElement("input");
    input.className = "alert-button";
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

export function generateGUID() {
  let d = new Date().getTime();
  let d2 = ((typeof performance !== "undefined") && performance.now && (performance.now() * 1000)) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
  });
};
