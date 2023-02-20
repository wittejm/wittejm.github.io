import GameSquare from "./GameSquare";
import React from "react";
import valid from "./valid";

type Props = {
  letters: string[];
  byg: string[];
  cursorIndex?: number;
  setCursorIndex: (ind: number) => void;
  rowIndex: number;
  redHighlights: boolean[];
};

export default function GameRow({
  letters,
  byg,
  cursorIndex,
  setCursorIndex,
  rowIndex,
  redHighlights,
}: Props) {
  console.log("letters", letters, letters.indexOf(" "));
  return (
    <div
      className={`row ${
        letters.indexOf(" ") !== -1 ||
        valid.includes(letters.join("").toLowerCase())
          ? ""
          : "wrongText"
      }`}
    >
      {letters.map((letter, index) => {
        const color = byg[index];
        return (
          <GameSquare
            hasCursor={cursorIndex === index}
            color={byg[index]}
            letter={letter}
            onClick={() => setCursorIndex(5 * rowIndex + index)}
            redHighlight={redHighlights[index]}
          />
        );
      })}
    </div>
  );
}
