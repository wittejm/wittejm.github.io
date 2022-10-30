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

      lineDiv.appendChild(keyDiv);
      keyDiv.appendChild(keyLetterDiv);
      keyLetterDiv.append(keySubLetterDiv);
      keySubLetterDiv.append(k);
    });
  });
}

function updateKeyColors() {
  allSvgs.map(node=>node.remove());

  Object.keys(usage).map((letter)=>{
    const usageOfLetter = usage[letter];

    const keyDiv = document.getElementById(`key-${letter}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    allSvgs.push(svg);

    svg.setAttribute('viewBox',"0 0 48 48");
    svg.setAttribute('width', 48);
    svg.setAttribute('height', 48);
    keyDiv.appendChild(svg);
    const stepSize = 50/numWords;
    usageOfLetter.map((color, index)=> {
      if (color==='w') return;
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', (index ) * stepSize);
      rect.setAttribute('width', 40);
      rect.setAttribute('height',stepSize);
      rect.setAttribute('stroke','black');
      rect.setAttribute('strokeWidth',1);
      rect.setAttribute('fill',{g:'#228B22',w:'white',y:'#FFD700',b:'#DCDCDC'}[color]);
  
      svg.appendChild(rect);
      allSvgs.push(rect);
    });

  });
}

