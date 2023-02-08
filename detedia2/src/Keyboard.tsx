import React from 'react';

const row1 = 'QWERTYUIOP';
const row2 = 'ASDFGHJKL';
const row3 = 'ZXCVBNM';

type Props = {};

export default function Keyboard({}: Props) {
  return (
    <div>
      <div className="keyboardRow">
        {row1.split('').map((letter) => (
          <KeyButton letter={letter} usage={[]} />
        ))}
      </div>
      <div className="keyboardRow">
        {row2.split('').map((letter) => (
          <KeyButton letter={letter} usage={[]} />
        ))}
      </div>
      <div className="keyboardRow">
        {row3.split('').map((letter) => (
          <KeyButton letter={letter} usage={[]} />
        ))}
      </div>
    </div>
  );
}

type KeyButtonProps = {
  letter: string;
  usage: string[];
};

function KeyButton({ letter, usage }: KeyButtonProps) {
  return <div className="keyButton">{letter}</div>;
}
