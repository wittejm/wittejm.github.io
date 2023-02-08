import React from "react";
import data from "./data";

type Props = {
  activePuzzleIndex: number;
  setActivePuzzleIndex: (arg0: any) => any;
};

function HeaderControls({ activePuzzleIndex, setActivePuzzleIndex }: Props) {
  return (
    <div className="headerBlock">
      <NavButton
        text="<<"
        onClick={() => setActivePuzzleIndex(data.length - 1)}
      />
      <NavButton
        text="<"
        onClick={() =>
          setActivePuzzleIndex(
            activePuzzleIndex === data.length - 1
              ? data.length - 1
              : activePuzzleIndex + 1,
          )
        }
      />
      <div style={{ margin: "0 1em" }}>
        <h1>{data[activePuzzleIndex].puzzleNumber}</h1>
      </div>
      <NavButton
        text=">"
        onClick={() =>
          setActivePuzzleIndex(
            activePuzzleIndex === 0 ? 0 : activePuzzleIndex - 1,
          )
        }
      />
      <NavButton text=">>" onClick={() => setActivePuzzleIndex(0)} />
    </div>
  );
}

type NavButtonProps = {
  text: string;
  onClick: () => void;
};
function NavButton({ text, onClick }: NavButtonProps) {
  return (
    <button className="navButton" onClick={onClick}>
      {text}
    </button>
  );
}
export default HeaderControls;
