import React, { useState } from 'react';
import './App.css';
import HeaderControls from './HeaderControls';
import Keyboard from './Keyboard';
import Puzzle from './Puzzle';

function App() {
  return (
    <div className="DetediaPage">
      <HeaderControls
        puzzle={500}
        onForward={() => null}
        onBackward={() => null}
      />
      <Puzzle puzzle={500} />

      <Keyboard />
    </div>
  );
}

export default App;
