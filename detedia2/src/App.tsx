import React, { useState } from "react";
import "./App.css";
import data from "./data";
import HeaderControls from "./HeaderControls";
import Keyboard from "./Keyboard";
import Puzzle from "./Puzzle";
import Submissions from "./Submissions";

function submitGuess(
  guess: string[],
  submissions: string[][],
  setSubmissions: any,
) {
  setSubmissions([guess, ...submissions]);
}

function App() {
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [guess, setGuess] = useState<string[]>(
    Array(5 * data[activePuzzleIndex].words.length).fill(" "),
  );
  const [cursorIndex, setCursorIndex] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  return (
    <div className="DetediaPage">
      <HeaderControls
        activePuzzleIndex={activePuzzleIndex}
        setActivePuzzleIndex={setActivePuzzleIndex}
      />
      <Puzzle
        activePuzzleIndex={activePuzzleIndex}
        guess={guess}
        setGuess={setGuess}
        cursorIndex={cursorIndex}
        setCursorIndex={setCursorIndex}
      />

      <Keyboard
        activePuzzleIndex={activePuzzleIndex}
        guess={guess}
        setGuess={setGuess}
        cursorIndex={cursorIndex}
        setCursorIndex={setCursorIndex}
      />
      <button
        onClick={() => submitGuess(guess.slice(), submissions, setSubmissions)}
      >
        SUBMIT
      </button>
      <Submissions
        submissions={submissions}
        activePuzzleIndex={activePuzzleIndex}
      />
    </div>
  );
}

export default App;
