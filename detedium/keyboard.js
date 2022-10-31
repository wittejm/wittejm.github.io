const line1 = 'QWERTYUIOP'.split("");
const line2 = 'ASDFGHJKL'.split("");
const line3 = 'ZXCVBNM'.split("");

function buildKeyboard() {
  const keyboardDiv = document.getElementById("keyboardDiv");

  [line1, line2, line3].map((line)=> {
    const lineDiv = document.createElement('div');
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
}

function clickKey(k) {
  const input = inputFields[selectedInput];

  input.value = `${input.value}${k}`;
  normalizeInput(input);
}
function updateKeyColors() {
  allSvgs.map(node=>node.remove());

  Object.keys(usage).map((letter)=>{
    const usageOfLetter = usage[letter];

    const keyDiv = document.getElementById(`key-${letter}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    allSvgs.push(svg);
    svg.setAttribute('onClick',"msg()");

    svg.setAttribute('viewBox',"0 0 48 48");
    svg.setAttribute('width', 48);
    svg.setAttribute('height', 48);

    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', 48);
      rect.setAttribute('height',48);
      rect.setAttribute('stroke','gray');
      rect.setAttribute('strokeWidth',1);
      rect.setAttribute('fill','#FFFFFF');

      svg.appendChild(rect);
    keyDiv.appendChild(svg);
    const stepSize = 48/numWords;
    usageOfLetter.map((color, index)=> {
      if (color==='w') return;
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', (index ) * stepSize);
      rect.setAttribute('width', 48);
      rect.setAttribute('height',stepSize);
      rect.setAttribute('stroke',{g:'#228B22',w:'white',y:'#FFEECC',b:'#ACACAC'}[color]);
      rect.setAttribute('strokeWidth',1);
      rect.setAttribute('fill',{g:'#6bd425',w:'white',y:'#FFD700',b:'#DCDCDC'}[color]);
  
      svg.appendChild(rect);
      allSvgs.push(rect);
    });

  });
}

