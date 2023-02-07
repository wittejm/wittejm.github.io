import GameSquare from './GameSquare';
import React from 'react';

type Props = {
  word: string;
};

export default function Puzzle({ word }: Props) {
  return (
    <div className="row">
      {word.split('').map((letter) => (
        <GameSquare hasCursor={false} color={'green'} letter={letter} />
      ))}
    </div>
  );
}
