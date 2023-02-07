import React from 'react';
import GameRow from './GameRow';

type Props = {
  puzzle: number;
};

export default function Puzzle({ puzzle }: Props) {
  return (
    <div>
      <GameRow word="right" />
      <GameRow word="wrong" />
      <GameRow word="where" />
    </div>
  );
}
