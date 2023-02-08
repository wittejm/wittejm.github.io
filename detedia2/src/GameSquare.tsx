import React from "react";

type Props = {
  hasCursor: boolean;
  color: string;
  letter: string;
  onClick: () => void;
  redHighlight: boolean;
};
export default function GameSquare({
  hasCursor,
  color,
  letter,
  onClick,
  redHighlight,
}: Props) {
  return (
    <div
      className={`square ${color} ${hasCursor ? "cursor" : ""} ${
        redHighlight ? "redHighlight" : ""
      }`}
      onClick={onClick}
    >
      {letter}
    </div>
  );
}
