import React from "react";

type Props = {
  hasCursor: boolean;
  color: string;
  letter: string;
  index: number;
  setCursorIndex: (ind: number) => void;
  redHighlight: boolean;
};
export default function GameSquare({
  hasCursor,
  color,
  letter,
  index,
  setCursorIndex,
  redHighlight,
}: Props) {
  return (
    <div
      className={`square ${color} ${hasCursor ? "cursor" : ""} ${
        redHighlight ? "redHighlight" : ""
      }`}
      onClick={() => setCursorIndex(index)}
    >
      {letter}
    </div>
  );
}
