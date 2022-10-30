const gameNodes = [];
const allSvgs = [];
let inputFields = [];
let activeDay = 0;

let guesses;
let numWords;
let answers;
let prompt;
let usage = {};

function loadGame() {

  const header = document.getElementById("header");
  header.textContent = data[activeDay][0];
  let forwardButton = document.getElementById("forwardButton");
  let backButton = document.getElementById("backButton");

  if (activeDay===0) {
    forwardButton.disabled=true;
  } else forwardButton.disabled=false;

  if (activeDay===data.length -  1) {
    backButton.disabled=true;
  } else backButton.disabled=false;

  guesses = [];
  numWords = data[activeDay][1].length;
  answers = data[activeDay][2];
  prompt = data[activeDay][1];

  gameNodes.map(node=>node.remove());
  inputFields = [];
  prompt.map(
    (row, i) =>
      {
        let rowDiv = document.createElement('div');
        rowDiv.className = `r`;
        gameNodes.push(rowDiv);
        promptDiv.appendChild(rowDiv);
        row.map((c, i)=>{
          const square = createSquare(c);
          gameNodes.push(square);
          rowDiv.appendChild(square);
        })

        let wordInput = document.createElement('input');
        gameNodes.push(wordInput);
        let wordDiv = document.createElement('div');
        gameNodes.push(wordDiv);

        wordInput.type = "text";
        wordInput.id = `wordInput-${i}`;
        wordInput.placeholder = "";
        wordInput.addEventListener('input', ()=>normalizeInput(wordInput));
        guessDiv.appendChild(wordDiv);
        wordDiv.appendChild(wordInput);
        inputFields.push(wordInput)
      }
  );

  usage = {};
  [...line1, ...line2, ...line3].map((l)=>usage[l]= new Array(data[activeDay][1].length).fill('w'));
  updateKeyColors();
}

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

  if (inputArea.value.length===5 && !valid.includes(inputArea.value.toLowerCase())) 
     inputArea.className = 'fontRed';
   else inputArea.className = '';
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
    if (updatedTruth.includes(guessLetter) && greenMarked[i]!==1) {
      yellowMarked[i]=1;
      updatedTruth= updatedTruth.slice(0,updatedTruth.indexOf(guessLetter))+"_"+(updatedTruth.slice(updatedTruth.indexOf(guessLetter)+1));
    }
  });
  return guess.split("").map((_,i)=>{
    if(greenMarked[i]) return "g";
    if(yellowMarked[i]) return "y";
    return "b";
  });
}

function submit() {

  const guesses = new Array(numWords).fill(0).map(
    (_,i)=>inputFields[i].value.split(""));
  const responsesDiv = document.getElementById("responsesDiv");
  gameNodes.push(responsesDiv)
  let response = document.createElement('div');
  response.className = 'response'
  responsesDiv.appendChild(response);
  const resultBygs = [];
  guesses.map((guess, i)=>{
    let rowDiv = document.createElement('div');
    rowDiv.className = `r`;
    response.appendChild(rowDiv);
    const byg = bygSingleWord(guess.join(""), answers[i].toUpperCase());
    if (byg.every(l=>l==='g')) inputFields[i].disabled=true;
    else inputFields[i].value="";
    resultBygs.push(byg);
    guess.map((letter, j)=>{
      let letterDiv = document.createElement('div');
      const color = byg[j];

      usage[letter][j]= usage[letter][j]==='g'? 'g' : usage[letter][j]==='y'? 'y' : color;
      
      letterDiv.className = `s l ${color}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter)
    })
  });
  updateKeyColors();
  // if (resultBygs.map((word)=>word.every(l=>l==='g')).every((correct)=>correct)) window.alert("yay!")
}
