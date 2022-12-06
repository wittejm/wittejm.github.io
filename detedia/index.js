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
let enforceDictionary = false;
let enforceSolutionConstraint = false;
let enforceHardMode = false;

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
  let forwardButton = document.getElementById("forwardButton");
  let backButton = document.getElementById("backButton");

  if (activeDay === 0) {
    forwardButton.disabled = true;
  } else forwardButton.disabled = false;
  forwardButton.blur();

  if (activeDay === data.length - 1) {
    backButton.disabled = true;
  } else backButton.disabled = false;
  backButton.blur();

  answers = data[activeDay][2];
  numWords = Math.min(6, answers.length);
  inputs = new Array(numWords * 5).fill("");
  let prompt = computePromptFromWords(answers);
  // data[activeDay][1] = prompt;
  // prompt = data[activeDay][1];
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
    (l) => (usage[l] = new Array(numWords).fill("w"))
  );
  updateKeyColors();

  const dayNumber = document.getElementById("dayNumber");
  dayNumber.textContent = `${data[activeDay][0]}${
    !obeysSuperHardMode(answers) ? "!" : ""
  }`;
}

function createSquare(color, wordIndex, letterIndex) {
  let li = document.createElement("div");
  li.addEventListener("click", () => {
    tapSelectInput(wordIndex * 5 + letterIndex);
  });
  li.className = `s ${color} noHighlight`;
  li.id = `prompt-${wordIndex}-${letterIndex}`;
  return li;
}

function getWordAt(index) {
  return [0, 1, 2, 3, 4]
  .map((i) => inputs[index * 5 + i])
  .join("");
}

function applyRules() {
  // if completing a word, check it's valid
  const currentRowIndex = Math.floor(selectedInput / 5);
  const currentWord = getWordAt(currentRowIndex);
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
  submitButton.blur();
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
  new Array(numWords).fill(0).forEach((_, wordIndex) => {
    clearConstraintHighlights(wordIndex);
    const rowDiv = document.getElementById(`r-${wordIndex}`);
    rowDiv.className = removeClassName(rowDiv.className, "fontRed");
  });
  let submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.blur();
  tapSelectInput(0);
}

function getGuesses() {
  const guesses = new Array(numWords)
    .fill(0)
    .map((_, i) => inputs.slice(5 * i, 5 * (i + 1)));
  return guesses;
}

function toggleRulesList() {
  const rulesList = document.getElementById("rulesList");
  if (rulesList.className.includes("hidden")) {
    rulesList.className = removeClassName(rulesList.className, "hidden");
  } else {
    rulesList.className = addClassName(rulesList.className, "hidden");
  }
}

function computePromptFromWords(words) {
  return words
    .map((word) => bygSingleWord(word, words[words.length - 1]))
    .slice(0, 6);
}

function obeysSuperHardMode(words) {
  // for each word: for each blank, check that subsequent words do not contain that letter. UNLESS there's yellow shit going on.

  let foundRepeat = words
    .slice(0, words.length - 1)
    .some((previousWord, previousIndex) =>
      words.slice(previousIndex + 1).some((subsequentWord, subsequentIndex) => {
        const byg = bygSingleWord(previousWord, words[words.length - 1]);
        console.log("previousWord, subsq:", previousWord, subsequentWord, byg);
        return byg.some((c, ind) => {
          const indicesInPreviousWordOfThisLetter = previousWord
            .split("")
            .reduce((soFar, current, currInd) => {
              if (current === previousWord[ind]) soFar.push(currInd);
              return soFar;
            }, []);
          const indicesInSubsequentWordOfThisLetter = subsequentWord
            .split("")
            .reduce((soFar, current, currInd) => {
              if (current === previousWord[ind]) soFar.push(currInd);
              return soFar;
            }, []);
          console.log(
            "indicesInPreviousWordOfThisLetter, ind: ",
            ind,
            subsequentWord[ind],
            indicesInPreviousWordOfThisLetter
          );
          const numYellowOrGreenOfThisLetterInPreviousWord =
            indicesInPreviousWordOfThisLetter.filter(
              (ind) => byg[ind] === "y" || byg[ind] === "g"
            ).length;
          console.log(
            "numYellowOrGreenOfThisLetterInPreviousWord",
            numYellowOrGreenOfThisLetterInPreviousWord
          );
          console.log(
            "subsequentWord.match(new RegExp(previousWord[ind], 'g'')) || [].length",
            (subsequentWord.match(new RegExp(previousWord[ind], "g")) || [])
              .length
          );
          const foundARepeat =
            (c === "y" && previousWord[ind] === subsequentWord[ind]) ||
            (c === "b" &&
              (numYellowOrGreenOfThisLetterInPreviousWord <
                (subsequentWord.match(new RegExp(previousWord[ind], "g")) || [])
                  .length ||
                previousWord[ind] === subsequentWord[ind]));
          if (foundARepeat) {
            console.log(
              "====\n====\n",
              "isyorg",
              numYellowOrGreenOfThisLetterInPreviousWord
            );
            console.log(
              c,
              "prev, subs",
              previousWord[ind],
              subsequentWord[ind]
            );
            console.log(
              "subsequentWord.includes(previousWord[ind])",
              subsequentWord.includes(previousWord[ind])
            );
          }
          return foundARepeat;
        });
      })
    );
  console.log(
    foundRepeat
      ? "this does not obey super hard mode"
      : "this obeys super hard mode!"
  );
  return !foundRepeat;
}
