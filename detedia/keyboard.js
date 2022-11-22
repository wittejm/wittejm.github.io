const line1 = 'QWERTYUIOP'.split("");
const line2 = 'ASDFGHJKL'.split("");
const line3 = 'ZXCVBNM'.split("");
let row3Div;
const size = 38;
function buildKeyboard() {
  const keyboardDiv = document.getElementById("keyboardDiv");

  [line1, line2, line3].map((line, index)=> {
    const lineDiv = document.createElement('div');
    if (index===2) row3Div = lineDiv;
    lineDiv.className = 'keyboardRow';
    keyboardDiv.appendChild(lineDiv);

    line.map((k)=> {
      let keyDiv = document.createElement('div');
      keyDiv.className = 'key l';
      keyDiv.id=`key-${k}`;
      let keyLetterDiv = document.createElement('div');
      keyLetterDiv.className = 'keyLetter';
      let keySubLetterDiv = document.createElement('div');
      keySubLetterDiv.className = 'keySubLetter';
      keySubLetterDiv.addEventListener('click', ()=>clickKey(k));

      lineDiv.appendChild(keyDiv);
      keyDiv.appendChild(keyLetterDiv);
      keyLetterDiv.append(keySubLetterDiv);
      keySubLetterDiv.append(k);
    });
  });
  let backspaceDiv = document.createElement('div');
  backspaceDiv.className = 'backspace';
  backspaceDiv.id="del";
  backspaceDiv.addEventListener('click', ()=>backspace());

  row3Div.appendChild(backspaceDiv);
  backspaceDiv.append("DEL");
}

function backspace() {
  let input = gameSquares[selectedInput];
  if(input.innerHTML === "") {
    selectedInput = selectedInput > 0 ? selectedInput-1 : inputs.length-1;
    input = gameSquares[selectedInput];
  }
  input.innerHTML = "";
  inputs[selectedInput]="";
  applyRules();
  tapSelectInput(selectedInput);
}

function clickKey(k) {
  const input = gameSquares[selectedInput];
  input.innerHTML = k;
  inputs[selectedInput]=k;
  applyRules();
  tapSelectInput((selectedInput+1) % inputs.length);
}

function updateKeyColors() {
  allSvgs.map(node=>node.remove());

  Object.keys(usage).map((letter)=>{
    const usageOfLetter = usage[letter];

    const keyDiv = document.getElementById(`key-${letter}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    allSvgs.push(svg);
    svg.setAttribute('viewBox',`0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', size);
      rect.setAttribute('height',size);
      rect.setAttribute('stroke','gray');
      rect.setAttribute('strokeWidth',1);
      rect.setAttribute('fill','#FFFFFF');

      svg.appendChild(rect);
    keyDiv.appendChild(svg);
    const stepSize = size/numWords;
    usageOfLetter.map((color, index)=> {
      if (color==='w') return;
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', (index ) * stepSize);
      rect.setAttribute('width', size);
      rect.setAttribute('height',stepSize);
      rect.setAttribute('stroke',{g:'#228B22',w:'white',y:'#FFEECC',b:'#ACACAC'}[color]);
      rect.setAttribute('strokeWidth',1);
      rect.setAttribute('fill',{g:'#6bd425',w:'white',y:'#FFD700',b:'#DCDCDC'}[color]);
  
      svg.appendChild(rect);
      allSvgs.push(rect);
    });

  });
}

document.addEventListener('keydown', event => {
  const key = event.key.toUpperCase();
  if (key==="BACKSPACE") backspace();
  if (key.match(/^[A-Z]$/)) clickKey(key);
});