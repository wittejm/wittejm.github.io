import { useState } from "react";

function useKeyInput() {
  const [keyInput, setKeyInput] = useState(false);
  return { keyInput, setKeyInput };
}
