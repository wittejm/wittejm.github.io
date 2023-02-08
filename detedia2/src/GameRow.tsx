import GameSquare from "./GameSquare";
import React from "react";

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
  return (
    <div className="row">
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
