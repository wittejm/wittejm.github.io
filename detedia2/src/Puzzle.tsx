import React, { useCallback, useEffect, useState } from "react";
import data from "./data";
import GameRow from "./GameRow";
import valid from "./valid";

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
    const rowStartIndex = cursorIndex - (cursorIndex % 5);
    const rowEndIndex = rowStartIndex + 5;
    const activeRowWord = [
      ...guess.slice(rowStartIndex, cursorIndex),
      key.toUpperCase(),
      ...guess.slice(cursorIndex + 1, rowEndIndex),
    ]
      .join("")
      .toLowerCase();
    if (
      cursorIndex !== guess.length - 1 &&
      !(cursorIndex % 5 === 4 && !valid.includes(activeRowWord))
    ) {
      setCursorIndex(cursorIndex + 1);
    }
  }
  console.log("key", key);
  if (key === "Backspace") {
    const onEmptySquare = guess[cursorIndex] === " ";
    if (onEmptySquare && cursorIndex > 0) {
      setCursorIndex(cursorIndex - 1);
    }
    const toDelete = onEmptySquare ? cursorIndex - 1 : cursorIndex;
    setGuess([
      ...guess.slice(0, toDelete),
      " ",
      ...guess.slice(toDelete + 1, data[activePuzzleIndex].words.length * 5),
    ]);
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
  let remainingLettersInTarget = target.slice().split("");
  guess.split("").forEach((letter, index) => {
    if (letter === remainingLettersInTarget[index]) {
      result = [...result.slice(0, index), "green", ...result.slice(index + 1)];
      remainingLettersInTarget[index] = "_";
    }
  });
  let findingYellows = true;
  let letter;
  while (findingYellows) {
    for (let index = 0; index < 5; index++) {
      letter = guess[index];
      if (!["green", "yellow"].includes(result[index])) {
        if (target.includes(letter)) {
          result = [
            ...result.slice(0, index),
            "yellow",
            ...result.slice(index + 1),
          ];
          remainingLettersInTarget[index] = "_";
          break;
        } else {
          result = [
            ...result.slice(0, index),
            "gray",
            ...result.slice(index + 1),
          ];
        }
      }
    }
    findingYellows = false;
  }
  return result;
}

function computeRedHighlightsForRow(wordIndex: number) {
  return [false, false, false, false, false];
}
