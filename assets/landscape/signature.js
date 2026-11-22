// Sample a handwritten centreline with an angled nib, preserving the order of pen lifts.
const strokes = [
  ['M7 42 C6 28 22 19 48 20 C78 20 91 30 117 23 C125 21 131 18 135 14', .98],
  ['M76 25 C75 36 66 53 56 72 C45 94 37 104 25 103 C16 102 15 94 21 89', 1.13],
  ['M59 80 C67 79 77 63 81 61 C84 61 67 86 72 91 C78 99 93 77 105 59 C99 71 87 92 95 93 C102 95 113 81 119 74 C129 61 129 54 125 57 C117 64 125 70 135 63 C139 60 141 59 142 60 C143 64 128 83 131 89 C135 97 150 83 157 73',1],
  ['M154 83 C170 59 203 21 199 14 C192 5 169 46 159 69 L148 93 C156 83 165 71 175 65 C182 61 185 64 181 69 C177 75 168 78 161 79 C168 77 172 82 174 86 C178 98 187 90 197 78 C204 69 207 62 212 60 C210 65 193 88 198 91 C205 98 220 83 228 76 C243 64 258 60 279 58',1],
  ['M217 47 Q218 45 219 44',1.35],
  ['M30 112 C90 101 163 101 227 104 C252 105 268 104 292 100',.44]
];
const outlines=strokes.map(([d,pressure])=>{
  const guide=document.createElementNS('http://www.w3.org/2000/svg','path');guide.setAttribute('d',d);
  const length=guide.getTotalLength(),points=[];
  for(let s=0;s<=Math.ceil(length/.56);s++){
    const p=guide.getPointAtLength(Math.min(s*.56,length));points.push(p);
  }
  return {points,pressure};
});
export function installSignature(reduced){
  const canvas=document.querySelector('#hand'),button=document.querySelector('#replay'),line=document.querySelector('.signature');
  button.classList.add('has-ink');
  const ctx=canvas.getContext('2d'),word='..NeverMind';
  const dims=[304,122];let ratio=0,painted=[],start=0,running=false,raf;
  const lengths=outlines.map(s=>s.points.length);
  const total=lengths.reduce((a,b)=>a+b);
  function clear(){
    const factor=Math.min(3,Math.max(1.5,button.clientWidth/304*devicePixelRatio));
    if(factor!==ratio){ratio=factor;canvas.width=Math.ceil(dims[0]*ratio);canvas.height=Math.ceil(dims[1]*ratio)}
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,...dims);ctx.fillStyle='#fff';painted=lengths.map(()=>0);
  }
  function stamp(i,limit){
    const {points,pressure}=outlines[i];
    ctx.beginPath();
    for(let j=painted[i];j<limit;j++){
      const p=points[j],f=j/(points.length-1);
      const width=(1.8+.78*Math.sin(Math.PI*f))*pressure*Math.min(1,.27+Math.min(j,points.length-1-j)/13);
      ctx.moveTo(p.x+width*.866,p.y+width*.5);
      ctx.ellipse(p.x,p.y,width,.58*pressure,.52,0,Math.PI*2);
    }
    ctx.fill();painted[i]=limit;
  }
  function draw(now){
    const elapsed=now-start;
    // Short pauses between strokes read as the nib lifting from the paper.
    let clock=260;
    for(let i=0;i<outlines.length;i++){
      const duration=lengths[i]/total*3550;
      const phase=Math.min(1,Math.max(0,(elapsed-clock)/duration));
      const flow=phase-.052*Math.sin(2*Math.PI*phase);
      const limit=Math.floor(flow*lengths[i]);if(limit>painted[i])stamp(i,limit);
      clock+=duration+110;
    }
    const letters=Math.max(0,Math.min(word.length,Math.floor((elapsed-clock+65)/100)));
    line.textContent=word.slice(0,letters);
    line.classList.toggle('typing',elapsed>=clock && elapsed<clock+2100);
    if(elapsed<clock+2200){raf=requestAnimationFrame(draw);return}
    running=false;
  }
  function play(){
    cancelAnimationFrame(raf);clear();line.classList.remove('typing');
    if(reduced.matches){outlines.forEach((_,i)=>stamp(i,lengths[i]));line.textContent=word;running=false;return}
    line.textContent='';start=performance.now();running=true;raf=requestAnimationFrame(draw);
  }
  button.onclick=play;reduced.addEventListener('change',play);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(raf);}else play();
  });
  window.addEventListener('resize',()=>{if(!running)play()});
  play();
}
