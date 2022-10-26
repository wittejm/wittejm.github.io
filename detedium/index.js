const data = [
  [
    494,
    [
      ['b', 'b','b','b','y'],
      ['g', 'y','y','b','b'],
      ['g', 'g','g','b','b'],
      ['g', 'g','g','b','b'],
      ['g', 'g','g','b','g'],
      ['g', 'g','g','g','g'],
    ],
    ['grief','folds', 'flown', 'flock', 'float', 'flout']
  ],
  [
    493,
    [
      ['b', 'b','y','b','b'],
      ['b', 'g','b','b','b'],
      ['b', 'g','b','b','b'],
      ['b', 'g','g','g','g'],
      ['g', 'g','g','g','g'],
    ],
    ['cloth','roads', 'women', 'boggy', 'foggy']
  ],
  [
    492,
    [
      ['b', 'b','b','b','b'],
      ['b', 'y','b','g','g'],
      ['y', 'b','g','g','g'],
      ['g', 'g','g','g','g'],
    ],
    ['porch','built', 'adult', 'fault']
  ],
  [
    491,
    [
      ['b', 'b','b','b','b'],
      ['b', 'g','b','b','b'],
      ['b', 'g','b','b','b'],
      ['b', 'g','g','b','b'],
      ['g', 'g','g','g','g'],
    ],
    ['spank', 'butte', 'guild', 'humor', 'mummy']
  ],
  [
    490,
    [
      ['y', 'b','b','g','b'],
      ['b', 'b','b','g','g'],
      ['g', 'g','g','g','g'],
    ],
    ['later', 'dowel', 'spiel']
  ],
  [
    489,
    [
      ['b', 'b','b','b','b'],
      ['b', 'b','g','b','b'],
      ['b', 'g','g','b','g'],
      ['g', 'g','g','g','g'],
    ],
    ['fluff', 'adopt', 'crone', 'grove']
  ],
  [
    488,
    [
      ['b', 'b','b','y','b'],
      ['y', 'b','y','b','y'],
      ['b', 'y','g','y','y'],
      ['g', 'g','g','g','g'],
    ],
    ['haunt', 'noise', 'pined', 'denim']
  ],
  [
    487,
    [
      ['b', 'b','b','b','b'],
      ['b', 'b','b','b','b'],
      ['b', 'b','y','b','b'],
      ['y', 'y','b','b','b'],
      ['b', 'y','g','b','b'],
      ['g', 'g','g','g','g'],
    ],
    ['allay', 'tooth', 'verve', 'rigid', 'primp', 'quirk']
  ],
  [
    486,
    [
      ['b', 'b','b','b','b'],
      ['b', 'b','y','b','b'],
      ['y', 'y','b','y','b'],
      ['b', 'y','b','y','y'],
      ['g', 'g','g','g','g'],
    ],
    ['foggy', 'quell', 'strep', 'dents', 'exist']
  ],
  [
    485,
    [
      ['b', 'b','y','y','b'],
      ['b', 'y','y','y','y'],
      ['g', 'b','g','g','g'],
      ['g', 'g','g','g','g'],
    ],
    ['doing', 'fines', 'skein', 'stein']
  ],
  [
    484,
    [
      ['y', 'b','b','b','b'],
      ['b', 'b','b','g','y'],
      ['g', 'g','g','g','g'],
    ],
    ['ditzy', 'words', 'spade']
  ],
  [
    483,
    [
      ['b', 'b','b','b','b'],
      ['b', 'b','b','b','b'],
      ['g', 'b','b','b','b'],
      ['g', 'g','g','g','g'],
    ],
    ['gorge', 'sunny', 'cliff', 'catch']
  ],
  [
    482,
    [
      ['b', 'y','b','b','b'],
      ['y', 'b','b','y','b'],
      ['b', 'y','g','b','b'],
      ['y', 'b','g','b','b'],
      ['g', 'g','g','g','g'],
    ],
    ['mound', 'ovary', 'grope', 'riots', 'floor']
  ],
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
  const responsesDiv = document.getElementById("responsesDiv");
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
      letterDiv.className = `s l ${color}`;
      rowDiv.appendChild(letterDiv);
      letterDiv.append(letter)
    })
  });
  // if (resultBygs.map((word)=>word.every(l=>l==='g')).every((correct)=>correct)) window.alert("yay hike!")
}