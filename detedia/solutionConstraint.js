function applySolutionConstraint() {
  // for each word starting with the second
  // if that word is complete,
  // look at the previous word and its solution byg
  // for each letter in the previous row: if its byg is green, check the letter below matches.
  // remove the letter below (to not confuse yellows)
  // oh shit. this is a lot of similar logic to above....
  // already, we're checking the whole word to see if it's correct;... or rather, we're scoring it. applying byg.
  const guesses = getGuesses();
  new Array(numWords - 1).fill(0).forEach((_, wordIndex) => {
    const byg = computePromptFromWords(data[activeDay][2])[wordIndex];
    const previousWord = guesses[wordIndex].join("");
    let thisWord = guesses[wordIndex + 1].join("");
    if (thisWord.length < 5 || previousWord.length < 5) return;
    byg.forEach((letter, letterIndex) => {
      const square = document.getElementById(
        `prompt-${wordIndex}-${letterIndex}`
      );
      square.className = removeClassName(square.className, "redHighlight");

      if (
        letter === "g" &&
        previousWord[letterIndex] !== thisWord[letterIndex]
      ) {
        square.className = addClassName(square.className, "redHighlight");
        thisWord =
          thisWord.slice(0, letterIndex) +
          "_" +
          thisWord.slice(letterIndex + 1);
      }
    });
    byg.forEach((letter, letterIndex) => {
      const square = document.getElementById(
        `prompt-${wordIndex}-${letterIndex}`
      );
      if (letter === "y") {
        if (!thisWord.includes(previousWord[letterIndex])) {
          square.className = addClassName(square.className, "redHighlight");
        } else {
          const indexOfMatch = thisWord.indexOf(previousWord[letterIndex]);
          thisWord =
            thisWord.slice(0, indexOfMatch) +
            "_" +
            thisWord.slice(indexOfMatch + 1);
        }
      }
    });
  });
}

function clearConstraintHighlights(changedWordIndex) {
  [changedWordIndex - 1, changedWordIndex].forEach((wordIndex) => {
    if (wordIndex === -1) return;
    const byg = computePromptFromWords(data[activeDay][2])[wordIndex];
    byg.forEach((_, letterIndex) => {
      const square = document.getElementById(
        `prompt-${wordIndex}-${letterIndex}`
      );
      square.className = removeClassName(square.className, "redHighlight");
      square.className = addClassName(square.className, "noHighlight");
    });
  });
}
