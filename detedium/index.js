const data = [
  [
    480,
    [
      ['y', 'b','b','b','b'],
      ['b', 'b','b','y','b'],
      ['b', 'y','b','g','g'],
      ['g', 'g','g','g','g'],
    ],
    ['clued', 'aback', 'mimic', 'ionic']
  ],
  [
    479,
    [
      ['b', 'y','b','b','b'],
      ['b', 'g','g','b','b'],
      ['y', 'g','g','b','b'],
      ['g', 'g','g','g','g'],
    ],
    ['clots', 'ralph', 'dally', 'valid']
  ],
]

let guesses = [];
let activeDay = 0;
let numWords = data[activeDay][1].length;
let answers = data[activeDay][2];
let prompt = data[activeDay][1];

function createSquare(color) {
  let li = document.createElement('div');
  li.className = `s ${color}`;
  return li;
}

function normalizeInput(inputArea) {
  const cursorLocation = inputArea.selectionStart;
  inputArea.value =  inputArea.value.toUpperCase().replace(/[^a-zA-Z]/, "").slice(0,5);
  inputArea.selectionStart = cursorLocation;
  inputArea.selectionEnd = cursorLocation;
  let submitButton = document.getElementById("submitButton");

  if (inputFields.every(i=>i.value.length === 5)) {
    submitButton.disabled=false;
  } else submitButton.disabled=true;
}

function bygSingleWord(guess, truth) {
  const greenMarked = new Array(5).fill(0);
  const yellowMarked = new Array(5).fill(0);
  let updatedTruth = truth;

  guess.split("").map((_,i)=>{
    guessLetter = guess[i];
    truthLetter = updatedTruth[i];
    if(guessLetter===truthLetter) {
      greenMarked[i]=1;
      updatedTruth= updatedTruth.slice(0,i)+"_"+(updatedTruth.slice(i+1));
    } 
  });

  guess.split("").map((_,i)=>{
    guessLetter = guess[i];
    truthLetter = updatedTruth[i];
    if (updatedTruth.includes(guessLetter)) {
      yellowMarked[i]=1;
      updatedTruth= updatedTruth.slice(0,updatedTruth.indexOf(guessLetter))+"_"+(updatedTruth.slice(updatedTruth.indexOf(guessLetter)+1));
    }
  });

  return guess.split("").map((_,i)=>{
    guessLetter = guess[i];
    truthLetter = updatedTruth[i];
    if(greenMarked[i]) return "g";
    if(yellowMarked[i]) return "y";
    return "b";
  });
}

function submit() {

  const guesses = new Array(numWords).fill(0).map(
    (_,i)=>inputFields[i].value.split(""));
  console.log("guesses", guesses);
  const responsesDiv = document.getElementById("responsesDiv");
  let response = document.createElement('div');
  response.className = 'response'
  responsesDiv.appendChild(response);
  guesses.map((guess, i)=>{
    console.log("guess", guess)
    let rowDiv = document.createElement('div');
    rowDiv.className = `r`;
    response.appendChild(rowDiv);
    const byg = bygSingleWord(guess.join(""), answers[i].toUpperCase());
    guess.map((letter, j)=>{
      let letterDiv = document.createElement('div');
      console.log("i j", i, j);
      console.log("letter", letter);
      console.log("answer[i][j]", answers[i][j].toUpperCase(), letter);
      const color = byg[j];
      letterDiv.className = `s l ${color}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter)
    })
  })
}