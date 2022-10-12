const prompts = [
  [
    ['b', 'b','g','y','g'],
    ['b', 'g','g','y','g'],
    ['g', 'g','g','g','g']
  ],
];

const allAnswers = [
  ['hello', 'large', 'world']
];

let guesses = [];

const numWords = prompts[0].length;

function createSquare(color) {
  let li = document.createElement('div');
  li.className = `s ${color}`;
  return li;
}

function normalizeInput() {
  let inputArea = document.getElementById('guessInput');
  const cursorLocation = inputArea.selectionStart;
  inputArea.value =  inputArea.value.toUpperCase().replace(/[^a-zA-Z]/, "").slice(0,5 * numWords);
  inputArea.selectionStart = cursorLocation;
  inputArea.selectionEnd = cursorLocation;
  let submitButton = document.getElementById("submitButton");
  console.log("norm");
  console.log("inputArea.value.length", inputArea.value.length);

  if (inputArea.value.length === 5 * numWords) {
    submitButton.disabled=false;
  } else submitButton.disabled=true;
}

function submit() {
  let inputArea = document.getElementById('guessInput');
  const guesses = new Array(numWords).fill(0).map(
    (_,i)=>inputArea.value.slice(i * 5, (i+1) * 5).split(""));
  console.log("guesses", guesses);
  const responsesDiv = document.getElementById("responsesDiv");
  let response = document.createElement('div');
  responsesDiv.appendChild(response);
  guesses.map((guess, i)=>{
    console.log("guess", guess)
    let rowDiv = document.createElement('div');
    rowDiv.className = `r`;
    response.appendChild(rowDiv);
    const answers = allAnswers[0];
    guess.map((letter, j)=>{
      let letterDiv = document.createElement('div');
      console.log("i j", i, j);
      console.log("letter", letter);
      console.log("answer[i][j]", answers[i][j].toUpperCase(), letter);
      const color = letter===answers[i][j].toUpperCase() ? "g" : answers[i].toUpperCase().includes(letter)? "y" : "b"; 
      letterDiv.className = `s l ${color}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter)
    })
  })
}