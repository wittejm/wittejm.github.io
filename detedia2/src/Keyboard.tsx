import React from "react";
import { handleKeyInput } from "./Puzzle";
const row1 = "QWERTYUIOP";
const row2 = "ASDFGHJKL";
const row3 = "ZXCVBNM";

type Props = {
  activePuzzleIndex: number;
  guess: string[];
  setGuess: any;
  cursorIndex: number;
  setCursorIndex: any;
};

export default function Keyboard({
  activePuzzleIndex,
  guess,
  setGuess,
  cursorIndex,
  setCursorIndex,
}: Props) {
  return (
    <div>
      <div className="keyboardRow">
        {row1.split("").map((letter) => (
          <KeyButton
            letter={letter}
            usage={[]}
            activePuzzleIndex={activePuzzleIndex}
            guess={guess}
            setGuess={setGuess}
            cursorIndex={cursorIndex}
            setCursorIndex={setCursorIndex}
          />
        ))}
      </div>
      <div className="keyboardRow">
        {row2.split("").map((letter) => (
          <KeyButton
            letter={letter}
            usage={[]}
            activePuzzleIndex={activePuzzleIndex}
            guess={guess}
            setGuess={setGuess}
            cursorIndex={cursorIndex}
            setCursorIndex={setCursorIndex}
          />
        ))}
      </div>
      <div className="keyboardRow">
        {row3.split("").map((letter) => (
          <KeyButton
            letter={letter}
            usage={[]}
            activePuzzleIndex={activePuzzleIndex}
            guess={guess}
            setGuess={setGuess}
            cursorIndex={cursorIndex}
            setCursorIndex={setCursorIndex}
          />
        ))}
        <div
          className="delButton"
          onClick={() =>
            handleKeyInput(
              "Backspace",
              activePuzzleIndex,
              guess,
              setGuess,
              cursorIndex,
              setCursorIndex,
            )
          }
        >
          DEL
        </div>
      </div>
    </div>
  );
}

type KeyButtonProps = {
  letter: string;
  usage: string[];
  activePuzzleIndex: number;
  guess: string[];
  setGuess: any;
  cursorIndex: number;
  setCursorIndex: any;
};

function KeyButton({
  letter,
  usage,
  activePuzzleIndex,
  guess,
  setGuess,
  cursorIndex,
  setCursorIndex,
}: KeyButtonProps) {
  return (
    <div
      className="keyButton"
      onClick={() =>
        handleKeyInput(
          letter,
          activePuzzleIndex,
          guess,
          setGuess,
          cursorIndex,
          setCursorIndex,
        )
      }
    >
      {letter}
    </div>
  );
}
