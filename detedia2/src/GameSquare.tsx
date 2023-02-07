import React from 'react';

type Props = {
  hasCursor: boolean;
  color: string;
  letter: string;
};
export default function GameSquare({ hasCursor, color, letter }: Props) {
  return (
    <div className={`square ${color} ${hasCursor ? 'cursor' : ''}`}>
      {letter}
    </div>
  );
}
