const gameNodes = [];
const allSvgs = [];
let inputFields = [];
let activeDay = 0;
let selectedInput = -1;
let guesses;
let numWords;
let answers;
let usage = {};
let useKeyboard = true;
let isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);

function addClassName(existing, classNameToAdd) {
  if (existing.includes(classNameToAdd)) return existing;
  return `${existing} ${classNameToAdd}`;
}
function removeClassName(existing, classNameToRemove) {
  if (!existing.includes(classNameToRemove)) return existing;
  return existing
    .split(" ")
    .filter((c) => c !== classNameToRemove)
    .join(" ");
}

function tapSelectInput(i) {
  selectedInput = i;
  inputFields.map((f, index) => {
    if (i === index) f.className = addClassName(f.className, "focusedInput");
    else f.className = removeClassName(f.className, "focusedInput");
  });
}

function loadGame() {
  const header = document.getElementById("header");
  header.textContent = data[activeDay][0];
  let forwardButton = document.getElementById("forwardButton");
  let backButton = document.getElementById("backButton");

  if (activeDay === 0) {
    forwardButton.disabled = true;
  } else forwardButton.disabled = false;

  if (activeDay === data.length - 1) {
    backButton.disabled = true;
  } else backButton.disabled = false;

  guesses = [];
  numWords = data[activeDay][1].length;
  answers = data[activeDay][2];
  let prompt = data[activeDay][1];

  gameNodes.map((node) => node.remove());
  inputFields = [];
  prompt.map((row, wordIndex) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = `r`;
    gameNodes.push(rowDiv);
    promptDiv.appendChild(rowDiv);
    row.map((c, letterIndex) => {
      const square = createSquare(c, `prompt-${wordIndex}-${letterIndex}`);
      gameNodes.push(square);
      rowDiv.appendChild(square);
    });

    let wordDiv = document.createElement("div");
    gameNodes.push(wordDiv);

    let wordInput;
    if (isMobile) {
      wordInput = document.createElement("div");
      wordInput.id = `wordInput-${wordIndex}`;
      wordInput.className = "mobileInput";
      wordInput.addEventListener("click", () => {
        console.log("selected", wordIndex);
        tapSelectInput(wordIndex);
      });

      gameNodes.push(wordInput);
      inputFields.push(wordInput);
    } else {
      wordInput = document.createElement("input");
      gameNodes.push(wordInput);

      wordInput.type = "text";
      wordInput.id = `wordInput-${wordIndex}`;
      wordInput.placeholder = "";
      wordInput.addEventListener("input", () => normalizeInput(wordInput));
      inputFields.push(wordInput);
    }

    guessDiv.appendChild(wordDiv);
    wordDiv.appendChild(wordInput);
  });

  selectedInput = 0;
  inputFields[selectedInput].className = "mobileInput focusedInput";
  usage = {};
  [...line1, ...line2, ...line3].map(
    (l) => (usage[l] = new Array(data[activeDay][1].length).fill("w"))
  );
  updateKeyColors();
}

function createSquare(color, id) {
  let li = document.createElement("div");
  li.className = `s ${color} noHighlight`;
  li.id = id;
  return li;
}

function normalizeInput(inputArea) {
  let input = (isMobile ? inputArea.innerHTML : inputArea.value)
    .slice(0, 5)
    .toLowerCase()
    .replace(/[^a-zA-Z]/, "");
  const inputWordIndex = parseInt(inputArea.id.split("-")[1]);
  if (input.length === 5 && !valid.includes(input))
    inputArea.className = addClassName(inputArea.className, "fontRed");
  else inputArea.className = removeClassName(inputArea.className, "fontRed");
  if (isMobile) {
    inputArea.innerHTML = input.toUpperCase();
  } else {
    inputArea.value = input.toUpperCase();
    const cursorLocation = inputArea.selectionStart;
    inputArea.selectionStart = cursorLocation;
    inputArea.selectionEnd = cursorLocation;
  }
  if (input.length === 5) applySolutionConstraint(inputWordIndex);
  else clearConstraintHighlights(inputWordIndex);
  let submitButton = document.getElementById("submitButton");
  if (inputFields.every((i) => (i.value || i.innerHTML).length === 5)) {
    submitButton.disabled = false;
  } else submitButton.disabled = true;
}

function bygSingleWord(guess, truth) {
  const greenMarked = new Array(5).fill(0);
  const yellowMarked = new Array(5).fill(0);
  let updatedTruth = truth;

  guess.split("").map((_, i) => {
    guessLetter = guess[i];
    truthLetter = updatedTruth[i];
    if (guessLetter === truthLetter) {
      greenMarked[i] = 1;
      updatedTruth = updatedTruth.slice(0, i) + "_" + updatedTruth.slice(i + 1);
    }
  });

  guess.split("").map((_, i) => {
    guessLetter = guess[i];
    truthLetter = updatedTruth[i];
    if (updatedTruth.includes(guessLetter) && greenMarked[i] !== 1) {
      yellowMarked[i] = 1;
      updatedTruth =
        updatedTruth.slice(0, updatedTruth.indexOf(guessLetter)) +
        "_" +
        updatedTruth.slice(updatedTruth.indexOf(guessLetter) + 1);
    }
  });
  return guess.split("").map((_, i) => {
    if (greenMarked[i]) return "g";
    if (yellowMarked[i]) return "y";
    return "b";
  });
}

function submit() {
  const guesses = getGuesses();

  const responsesDiv = document.getElementById("responsesDiv");
  let response = document.createElement("div");
  response.className = "response";
  responsesDiv.appendChild(response);
  gameNodes.push(response);
  const resultBygs = [];
  guesses.map((guess, i) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = `r`;
    response.appendChild(rowDiv);
    const byg = bygSingleWord(guess.join(""), answers[i].toUpperCase());
    if (byg.length === 5 && byg.every((l) => l === "g"))
      inputFields[i].disabled = true;
    else
      isMobile ? (inputFields[i].innerHTML = "") : (inputFields[i].value = "");
    resultBygs.push(byg);
    guess.map((letter, j) => {
      let letterDiv = document.createElement("div");
      const color = byg[j];

      usage[letter][i] =
        usage[letter][i] === "g" || color === "g"
          ? "g"
          : usage[letter][i] === "y"
          ? "y"
          : color;

      letterDiv.className = `s l ${color}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter);
    });
  });
  updateKeyColors();
  let submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;

  // if (resultBygs.map((word)=>word.every(l=>l==='g')).every((correct)=>correct)) window.alert("yay!")
}

function getGuesses() {
  const guesses = new Array(numWords)
    .fill(0)
    .map((_, i) =>
      isMobile
        ? inputFields[i].innerHTML.split("")
        : inputFields[i].value.split("")
    );
  return guesses;
}
