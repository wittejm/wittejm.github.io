import React, { useState } from "react";
import "./App.css";
import data from "./data";
import HeaderControls from "./HeaderControls";
import Keyboard from "./Keyboard";
import Puzzle from "./Puzzle";

function App() {
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);

  return (
    <div className="DetediaPage">
      <HeaderControls
        activePuzzleIndex={activePuzzleIndex}
        setActivePuzzleIndex={setActivePuzzleIndex}
      />
      <Puzzle activePuzzleIndex={activePuzzleIndex} />

      <Keyboard />
    </div>
  );
}

export default App;
