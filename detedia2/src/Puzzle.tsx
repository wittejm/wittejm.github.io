import React, { useState } from "react";
import data from "./data";
import GameRow from "./GameRow";

type Props = {
  activePuzzleIndex: number;
};

export default function Puzzle({ activePuzzleIndex }: Props) {
  const [guess, setGuess] = useState<string[]>(
    Array(5 * data[activePuzzleIndex].words.length).fill(" "),
  );
  const [cursorIndex, setCursorIndex] = useState(0);

  const source = data[activePuzzleIndex].words;
  return (
    <div>
      {source.map((sourceWord, sourceWordIndex) => (
        <GameRow
          /*
          byg={computeByg(
            guess
              .slice(5 * sourceWordIndex, 5 * (sourceWordIndex + 1))
              .join(""),
            source[source.length - 1],
          )}
          */
          byg={computeByg(sourceWord, source[source.length - 1])}
          letters={sourceWord.split("")}
          cursorIndex={
            5 * sourceWordIndex <= cursorIndex &&
            cursorIndex < 5 * (sourceWordIndex + 1)
              ? cursorIndex % 5
              : undefined
          }
          setCursorIndex={setCursorIndex}
        />
      ))}
    </div>
  );
}

function computeByg(guess: string, target: string) {
  let result = Array(5).fill("gray");
  let remainingLetters = guess.split("");

  remainingLetters.forEach((letter, index) => {
    if (letter === target[index]) {
      result[index] = "green";
      remainingLetters[index] = "_";
    }
  });
  remainingLetters.forEach((letter, index) => {
    if (result[index] !== "green") {
      if (target.includes(letter)) {
        result[index] = "yellow";
        remainingLetters[index] = "_";
      } else {
        result[index] = "gray";
      }
    }
  });

  return result.slice();
}
