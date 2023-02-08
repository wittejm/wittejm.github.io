import GameSquare from "./GameSquare";
import React from "react";

type Props = {
  letters: string[];
  byg: string[];
  cursorIndex?: number;
  setCursorIndex: (ind: number) => void;
};

export default function Puzzle({
  letters,
  byg,
  cursorIndex,
  setCursorIndex,
}: Props) {
  return (
    <div className="row">
      {letters.map((letter, index) => {
        const color = byg[index];
        return (
          <GameSquare
            hasCursor={cursorIndex === index}
            color={byg[index]}
            letter={letter}
            index={index}
            setCursorIndex={setCursorIndex}
            redHighlight
          />
        );
      })}
    </div>
  );
}
