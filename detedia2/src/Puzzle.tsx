import React, { useCallback, useEffect, useState } from "react";
import data from "./data";
import GameRow from "./GameRow";

type Props = {
  activePuzzleIndex: number;
  guess: string[];
  setGuess: (a: string[]) => void;
  cursorIndex: number;
  setCursorIndex: (a: number) => void;
};

export function handleKeyInput(
  key: string,
  activePuzzleIndex: number,
  guess: string[],
  setGuess: (a: string[]) => void,
  cursorIndex: number,
  setCursorIndex: (a: number) => void,
) {
  if (key.match(/^[a-zA-Z]$/)) {
    setGuess([
      ...guess.slice(0, cursorIndex),
      key.toUpperCase(),
      ...guess.slice(cursorIndex + 1, data[activePuzzleIndex].words.length * 5),
    ]);
    if (cursorIndex !== guess.length - 1) {
      setCursorIndex(cursorIndex + 1);
    }
  }
  if (key === "ArrowRight") {
    if (cursorIndex % 5 !== 4) setCursorIndex(cursorIndex + 1);
  }
}

export default function Puzzle({
  activePuzzleIndex,
  guess,
  setGuess,
  cursorIndex,
  setCursorIndex,
}: Props) {
  console.log("Puzzle rerender");

  const handleKeydownEvent = useCallback(
    (event: KeyboardEvent) =>
      handleKeyInput(
        event.key,
        activePuzzleIndex,
        guess,
        setGuess,
        cursorIndex,
        setCursorIndex,
      ),
    [guess, cursorIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeydownEvent);
    };
  }, [handleKeydownEvent]);

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
          letters={guess.slice(5 * sourceWordIndex, 5 * (sourceWordIndex + 1))}
          cursorIndex={
            5 * sourceWordIndex <= cursorIndex &&
            cursorIndex < 5 * (sourceWordIndex + 1)
              ? cursorIndex % 5
              : undefined
          }
          setCursorIndex={setCursorIndex}
          rowIndex={sourceWordIndex}
          redHighlights={computeRedHighlightsForRow(sourceWordIndex)}
        />
      ))}
    </div>
  );
}

export function computeByg(guess: string, target: string) {
  let result = new Array(5).fill("gray");
  let remainingLetters = guess.split("");
  console.log("remainingLetters", remainingLetters);
  console.log("result", result);
  remainingLetters.forEach((letter, index) => {
    if (letter === target[index]) {
      console.log("index", index);
      result = [...result.slice(0, index), "green", ...result.slice(index + 1)];
      remainingLetters[index] = "_";
    }
  });
  remainingLetters.forEach((letter, index) => {
    if (result[index] !== "green") {
      if (target.includes(letter)) {
        result = [
          ...result.slice(0, index),
          "yellow",
          ...result.slice(index + 1),
        ];
        remainingLetters[index] = "_";
      } else {
        result = [
          ...result.slice(0, index),
          "gray",
          ...result.slice(index + 1),
        ];
      }
    }
  });
  console.log("result", result);
  return result;
}

function computeRedHighlightsForRow(wordIndex: number) {
  return [false, false, false, false, false];
}
