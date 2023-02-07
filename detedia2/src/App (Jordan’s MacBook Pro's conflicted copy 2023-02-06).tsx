import React, { useState } from 'react';
import './App.css';
import HeaderControls from './HeaderControls';
import Puzzle from './Puzzle';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="DetediaPage">
      <HeaderControls
        puzzle={500}
        onForward={() => null}
        onBackward={() => null}
      />
      <Puzzle puzzle={500} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
