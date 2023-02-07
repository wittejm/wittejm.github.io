import React from 'react';

type Props = {
  puzzle: number;
  onForward: () => void;
  onBackward: () => void;
};

function HeaderControls({ puzzle }: Props) {
  return (
    <div>
      <h1>{puzzle}</h1>
    </div>
  );
}

export default HeaderControls;
