const gameNodes = [];
let gameSquares;
let inputs;
const allSvgs = [];
let activeDay = 0;
let selectedInput = -1;
let guesses;
let numWords;
let answers;
let usage = {};
let previousGuess = null;
let previousGuessByg = null;
let numSubmitted = 0;

let isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
// if (!isMobile) window.location = ('https://wittejm.github.io/detedium/index.html');

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

function tapSelectInput(tapped) {
  selectedInput = tapped;
  gameSquares.map((f, index) => {
    if (selectedInput === index) {
      f.className = addClassName(f.className, "focusedInput");
    } else {
      f.className = removeClassName(f.className, "focusedInput");
    }
  });
}

function loadGame() {
  previousGuess = null;
  previousGuessByg = null;
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

  numWords = data[activeDay][1].length;
  answers = data[activeDay][2];
  inputs = new Array(numWords * 5).fill("");
  let prompt = data[activeDay][1];
  gameSquares = [];
  gameNodes.map((node) => node.remove());
  prompt.map((row, wordIndex) => {
    let rowDiv = document.createElement("div");
    rowDiv.id = `r-${wordIndex}`;
    rowDiv.className = `r`;
    gameNodes.push(rowDiv);
    promptDiv.appendChild(rowDiv);
    row.map((c, letterIndex) => {
      const square = createSquare(c, wordIndex, letterIndex);
      gameSquares.push(square);
      gameNodes.push(square);
      rowDiv.appendChild(square);
    });
  });

  tapSelectInput(0);
  usage = {};
  [...line1, ...line2, ...line3].map(
    (l) => (usage[l] = new Array(data[activeDay][1].length).fill("w"))
  );
  updateKeyColors();
}

function createSquare(color, wordIndex, letterIndex) {
  let li = document.createElement("div");
  li.addEventListener("click", () => {
    console.log("selected", wordIndex, letterIndex);
    tapSelectInput(wordIndex * 5 + letterIndex);
  });
  li.className = `s ${color} noHighlight`;
  li.id = `prompt-${wordIndex}-${letterIndex}`;
  return li;
}

function applyRules() {
  // if completing a word, check it's valid
  const currentRowIndex = Math.floor(selectedInput / 5);
  const currentWord = [0, 1, 2, 3, 4]
    .map((i) => inputs[currentRowIndex * 5 + i])
    .join("");
  const rowDiv = document.getElementById(`r-${currentRowIndex}`);
  if (currentWord.length === 5 && !valid.includes(currentWord.toLowerCase())) {
    rowDiv.className = addClassName(rowDiv.className, "fontRed");
  } else {
    rowDiv.className = removeClassName(rowDiv.className, "fontRed");
  }

  // if completing a word, apply sol'n constraint; otherwise clear it.
  if (currentWord.length === 5) {
    applySolutionConstraint(currentRowIndex);
  } else clearConstraintHighlights(currentRowIndex);

  // hard mode
  if (previousGuessByg) {
    new Array(5).fill(0).map((_, letterIndex) => {
      console.log(`guess-${numSubmitted}-${currentRowIndex}-${letterIndex}`);
      const guessSquare = document.getElementById(
        `guess-${numSubmitted}-${currentRowIndex}-${letterIndex}`
      );
      guessSquare.className = removeClassName(
        guessSquare.className,
        "redHighlight"
      );
    });
    if (currentWord.length === 5) {
      let thisGuessWord = getGuesses()[currentRowIndex].join("");
      const previousGuessBygWord = previousGuessByg[currentRowIndex];
      const previousGuessWord = previousGuess[currentRowIndex];
      // If it's green, reuse it in the same place.
      // If it's yellow, reuse it somewhere. but after wiping greens (if there are two yellows, reuse both)
      previousGuessBygWord.map((color, letterIndex) => {
        if (color === "g") {
          if (thisGuessWord[letterIndex] !== previousGuessWord[letterIndex]) {
            const guessSquare = document.getElementById(
              `guess-${numSubmitted}-${currentRowIndex}-${letterIndex}`
            );
            guessSquare.className = addClassName(
              guessSquare.className,
              "redHighlight"
            );
          } else {
            thisGuessWord =
              thisGuessWord.slice(0, letterIndex) +
              "_" +
              thisGuessWord.slice(letterIndex + 1);
          }
        }
      });
      previousGuessBygWord.map((color, letterIndex) => {
        const guessSquare = document.getElementById(
          `guess-${numSubmitted}-${currentRowIndex}-${letterIndex}`
        );

        if (color === "y") {
          if (!thisGuessWord.includes(previousGuessWord[letterIndex])) {
            const guessSquare = document.getElementById(
              `guess-${numSubmitted}-${currentRowIndex}-${letterIndex}`
            );
            guessSquare.className = addClassName(
              guessSquare.className,
              "redHighlight"
            );
          } else {
            const indexOfYellow = thisGuessWord.indexOf(
              previousGuessWord[letterIndex]
            );
            thisGuessWord =
              thisGuessWord.slice(0, indexOfYellow) +
              "_" +
              thisGuessWord.slice(indexOfYellow + 1);
          }
        }
      });
    }
  }

  // if all inputs are filled, enable submit button; otherwise disabled it.
  let submitButton = document.getElementById("submitButton");
  if (inputs.every((i) => i !== "")) {
    submitButton.disabled = false;
  } else submitButton.disabled = true;
}

function bygSingleWord(guess, truth) {
  const greenMarked = new Array(5).fill(0);
  const yellowMarked = new Array(5).fill(0);
  let updatedTruth = truth;

  guess.split("").map((_, letterIndex) => {
    guessLetter = guess[letterIndex];
    truthLetter = updatedTruth[letterIndex];
    if (guessLetter === truthLetter) {
      greenMarked[letterIndex] = 1;
      updatedTruth =
        updatedTruth.slice(0, letterIndex) +
        "_" +
        updatedTruth.slice(letterIndex + 1);
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
  numSubmitted = numSubmitted + 1;
  previousGuess = getGuesses();
  const responsesDiv = document.getElementById("responsesDiv");
  let response = document.createElement("div");
  response.className = "response";
  responsesDiv.prepend(response);
  gameNodes.push(response);
  const resultBygs = [];
  previousGuess.map((guess, wordIndex) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = `r`;
    response.appendChild(rowDiv);
    const byg = bygSingleWord(guess.join(""), answers[wordIndex].toUpperCase());
    // wipe non-green letters
    byg.map((c, letterIndex) => {
      if (c !== "g") {
        selectedInput = wordIndex * 5 + letterIndex;
        let input = gameSquares[selectedInput];
        input.innerHTML = "";
        inputs[selectedInput] = "";
      }
    });
    resultBygs.push(byg);
    guess.map((letter, letterIndex) => {
      let letterDiv = document.createElement("div");
      const color = byg[letterIndex];

      usage[letter][wordIndex] =
        usage[letter][wordIndex] === "g" || color === "g"
          ? "g"
          : usage[letter][wordIndex] === "y"
          ? "y"
          : color;

      letterDiv.className = `s l ${color} noHighlight`;
      letterDiv.id = `guess-${numSubmitted}-${wordIndex}-${letterIndex}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter);
    });
  });
  previousGuessByg = resultBygs;
  applyRules();
  updateKeyColors();
  new Array(numWords)
    .fill(0)
    .forEach((_, wordIndex) => {
      clearConstraintHighlights(wordIndex);
      const rowDiv = document.getElementById(`r-${wordIndex}`);
      rowDiv.className = removeClassName(rowDiv.className, "fontRed");
    })
  let submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  tapSelectInput(0);
}

function getGuesses() {
  const guesses = new Array(numWords)
    .fill(0)
    .map((_, i) => inputs.slice(5 * i, 5 * (i + 1)));
  return guesses;
}
