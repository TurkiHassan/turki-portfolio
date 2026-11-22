import {drawHalo} from './halo.js';
import {PlantRig} from './vegetation.js';
import {fallbackRenderer} from './fallback.js';
import {installSignature} from './signature.js';
import {installLights, nightAt} from './atmosphere.js';
import { WebGLRenderer, Scene, Camera, PlaneGeometry, Mesh, ShaderMaterial, Texture, Vector2, LinearFilter, Vector4 } from './three.module.js';

const $ = selector => document.querySelector(selector);
const stage = $('#scene');
const assetURL=name=>new URL(name,import.meta.url).href;
const assets=await fetch(assetURL('painting.json')).then(response=>response.json());
const day=document.createElement('canvas'),night=document.createElement('canvas'),mist=new Image();
const leafImages=[new Image(),new Image()];
leafImages[0].src=assetURL('day-sprigs.webp');leafImages[1].src=assetURL('night-sprigs.webp');
const plants=new PlantRig(assets.sprigs,...leafImages);
const impulse=new Vector2();
let cpuRender,contact=0;
const originals=[new Image(),new Image()];
originals[0].src=assetURL('day-plate.webp');originals[1].src=assetURL('night-plate.webp');mist.src=assetURL('mist.png');
const drawLights=installLights(assets.stars,assets.ridge);
const celestial=[1608,99];
let skyPlacement='';
const sheets=[new Vector4(),new Vector4(),new Vector4()];
function moveMist(){
  sheets[0].set(760+65*Math.sin(time*.15),502+6*Math.sin(time*.21),790,94);
  sheets[1].set(811+112*Math.sin(time*.124+.75),567+10*Math.cos(time*.18),905,126);
  sheets[2].set(705+90*Math.sin(time*.17-1),617+7*Math.sin(time*.25),680,91);
}
const birdCanvas = $('#birds'), ink = birdCanvas.getContext('2d');
const intro = $('#landscape-intro');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let w=1, h=1, scale=1, left=0, top=0, dpr=1;
let x=0, y=0, tx=0, ty=0, strength=0, nightMix=0, zoom=1;
let touched=false, pressed=false, lastMove=-Infinity, time=0, last=performance.now(), frame;
let renderer, material, world, camera, fallbackFog;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function aim(px,py){
  if(!touched || strength<.015){x=px;y=py;impulse.set(0,0)}
  touched=true;tx=px;ty=py;lastMove=performance.now();
}
intro.addEventListener('pointermove',e=>{
  if(e.target.closest('button,a')){lastMove=-Infinity;return}
  aim(e.clientX,e.clientY);
});
intro.addEventListener('pointerdown',e=>{
  if(e.target.closest('button,a'))return;
  pressed=true;aim(e.clientX,e.clientY);
});
function release(){pressed=false;lastMove=-Infinity}
window.addEventListener('pointerup',release);
window.addEventListener('pointercancel',release);
intro.addEventListener('pointerleave',release);
window.addEventListener('blur',release);

installSignature(reduced);

function texture(image){
  const map=new Texture(image);
  map.generateMipmaps=false;map.minFilter=LinearFilter;map.magFilter=LinearFilter;map.needsUpdate=true;
  return map;
}

function createRenderer(){
  const canvas=document.createElement('canvas');
  canvas.className='surface';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  renderer=new WebGLRenderer({canvas,context:gl,alpha:false,antialias:false});
  const vapor=texture(mist);
  material=new ShaderMaterial({
    uniforms:{
      dayMap:{value:texture(day)},nightMap:{value:texture(night)},mistMap:{value:vapor},sheets:{value:sheets},
      size:{value:new Vector2()},visibleUV:{value:new Vector2()},origin:{value:new Vector2()},pointer:{value:new Vector2()},
      clock:{value:0},radius:{value:1},amount:{value:0},fullNight:{value:0}
    },
    depthTest:false,depthWrite:false,
    vertexShader:`varying vec2 screen;
    void main(){screen=vec2(uv.x,1.-uv.y); gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`varying vec2 screen;
    uniform sampler2D dayMap,nightMap,mistMap;
    uniform vec4 sheets[3];
    uniform vec2 size, visibleUV,origin,pointer;
    uniform float clock,radius,amount,fullNight;
    void main(){
      vec2 p=origin+screen*visibleUV;
      vec2 st=vec2(p.x,1.-p.y);
      vec3 day=texture2D(dayMap,st).rgb, night=texture2D(nightMap,st).rgb;
      float dist=length(screen*size-pointer)/radius;
      float veil=amount*(1.-smoothstep(.45,1.09,dist));
      float darkness=mix(fullNight,1.-fullNight,veil);
      vec3 color=mix(day,night,darkness);
      vec2 art=p*vec2(1916.,821.);
      float air=1.;
      for(int i=0;i<3;i++){
        vec2 uv=(art-sheets[i].xy)/sheets[i].zw+.5;
        // Ripple the lower edge as wind pushes a bank around a ridge.
        uv.y+=.064*sin(uv.x*10.+clock*.42+float(i));
        vec3 grain=texture2D(mistMap,vec2(uv.x,1.-uv.y)).rgb;
        float density=i==0?grain.r:(i==1?grain.g:grain.b);
        air*=1.-density*(i==1?.85:.72);
      }
      color=mix(color,mix(vec3(.90,.941,.953),vec3(.51,.64,.76),darkness),1.-air);
      gl_FragColor=vec4(color,1.);
    }`
  });
  world=new Scene();camera=new Camera();
  world.add(new Mesh(new PlaneGeometry(2,2),material));
  world.add(plants.mesh(texture,material.uniforms));
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();canvas.remove();renderer=null;buildFogSprite();cpuRender=fallbackRenderer(day,night,plants,birdCanvas);
  });
  stage.insertBefore(canvas,birdCanvas);
}
// If the sun falls entirely outside a narrow crop, recompose its painted swirl
// in the visible sky. Both canvases use precisely the same feathered patch.
function composeSky(){
  const originalX=left+1608*scale,originalY=top+99*scale;
  const offscreen=originalX>w+57*scale || originalY< -46*scale;
  celestial[0]=offscreen?Math.round((w*.78-left)/scale):1608;
  celestial[1]=offscreen?Math.round((h*.14-top)/scale):99;
  const key=celestial.join(',');
  if(key===skyPlacement)return;
  skyPlacement=key;
  [day,night].forEach((canvas,i)=>{
    canvas.width=1916;canvas.height=821;
    const g=canvas.getContext('2d');g.drawImage(originals[i],0,0);
    if(offscreen){
      const patch=document.createElement('canvas');patch.width=patch.height=162;
      const c=patch.getContext('2d');c.drawImage(originals[i],1527,18,162,162,0,0,162,162);
      const feather=c.createRadialGradient(81,81,32,81,81,80);
      feather.addColorStop(0,'white');feather.addColorStop(1,'transparent');
      c.globalCompositeOperation='destination-in';c.fillStyle=feather;c.fillRect(0,0,162,162);
      g.drawImage(patch,celestial[0]-81,celestial[1]-81);
    }
    if(material)material.uniforms[i?'nightMap':'dayMap'].value.needsUpdate=true;
  });
}
function resize(){
  w=stage.clientWidth;h=stage.clientHeight;
  dpr=Math.min(devicePixelRatio||1,1.75,Math.sqrt(2600000/(w*h)));
  scale=Math.max(w/1916,h/821);left=(w-1916*scale)/2;top=(h-821*scale)/2;
  const sx=left+1608*scale,sy=top+99*scale;
  if(sx<=w+57*scale && sx>w-58*scale)left=Math.max(w-1916*scale,left+w-58*scale-sx);
  if(sy>=-46*scale && sy<53*scale)top=Math.min(0,top+53*scale-sy);
  const position=(w<1916*scale?100*left/(w-1916*scale):50)+'% '+(h<821*scale?100*top/(h-821*scale):50)+'%';
  day.style.objectPosition=night.style.objectPosition=position;
  composeSky();
  birdCanvas.width=Math.round(w*dpr);birdCanvas.height=Math.round(h*dpr);
  ink.setTransform(dpr,0,0,dpr,0,0);
  if(renderer){
    renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);
    material.uniforms.size.value.set(w,h);
    material.uniforms.origin.value.set(-left/(1916*scale),-top/(821*scale));
    material.uniforms.visibleUV.value.set(w/(1916*scale),h/(821*scale));
  }
}
function buildFogSprite(){
  const source=document.createElement('canvas');source.width=mist.width;source.height=mist.height;
  const c=source.getContext('2d');c.drawImage(mist,0,0);
  const input=c.getImageData(0,0,source.width,source.height).data;
  fallbackFog=[0,1,2].map(channel=>{
    const layer=source.cloneNode();const ctx=layer.getContext('2d'),pixels=ctx.createImageData(layer.width,layer.height);
    for(let k=0;k<input.length;k+=4){pixels.data.set([229,239,243,input[k+channel]],k)}
    ctx.putImageData(pixels,0,0);return layer;
  });
}
function drawFallbackFog(state){
  ink.save();ink.globalAlpha=.74;
  sheets.forEach((sheet,i)=>{
    const {x,y,z:width,w:height}=sheet;
    ink.drawImage(fallbackFog[i],left+(x-width/2)*scale,top+(y-height/2)*scale,width*scale,height*scale);
  });
  if(state.nightMask){
    ink.globalCompositeOperation='destination-out';ink.globalAlpha=.27/.74;
    ink.drawImage(state.nightMask,0,0,w,h);
  }
  ink.restore();
}
const flock=[
  [-.069,-.017,5.8,.3],[-.046,.006,7.3,2.8],[-.024,-.009,8.3,4.7],
  [0,0,9.5,1.6],[.022,.018,6.8,3.3],[.043,.033,6.2,5.8],[.060,.028,5.5,1.1]
];
function drawBirds(lighting){
  ink.clearRect(0,0,w,h);
  if(!renderer && fallbackFog)drawFallbackFog(lighting);
  drawLights(ink,lighting);
  drawHalo(ink,lighting);
  // Sweep along the clear opening between the oak canopy and the sun.
  const cx=.499+.155*Math.sin(time*.048-.25);
  const cy=.265+.040*Math.sin(time*.083+.27);
  for(const [dx,dy,span,phase] of flock){
    const bx=left+1916*scale*(cx+dx+.004*Math.sin(time*.43+phase));
    const by=top+821*scale*(cy+dy+.010*Math.sin(time*.50+phase));
    if(bx< -20||bx>w+20||by< -20||by>h+20)continue;
    const daylight=1-nightAt(bx,by,lighting);
    ink.fillStyle='rgba(26,38,53,'+(.80*daylight)+')';
    const flap=Math.sin(time*(2.7+span*.15)+phase);
    const s=span*Math.min(scale,1.5);
    ink.save();ink.translate(bx,by);ink.rotate(.12*Math.sin(time*.85+phase));ink.scale(s,s);
    ink.beginPath();ink.moveTo(-1,-.32-.46*flap);
    ink.quadraticCurveTo(-.48,-.58-.23*flap,0,-.04);
    ink.quadraticCurveTo(.45,-.61-.20*flap,1,-.40-.41*flap);
    ink.quadraticCurveTo(.46,-.22-.17*flap,.065,.14);
    ink.lineTo(-.035,.20);ink.quadraticCurveTo(-.47,-.18-.12*flap,-1,-.32-.46*flap);
    ink.fill();ink.restore();
  }
}
function animate(now){
  const interval=window.landscapeScroll.progress>=1 || reduced.matches?50:1000/45;
  if(now-last<interval-1){frame=requestAnimationFrame(animate);return}
  const dt=clamp((now-last)/1000,0,.08);last=now;
  if(!reduced.matches)time+=dt;
  const ease=rate=>reduced.matches?1:1-Math.exp(-rate*dt);
  const oldX=x,oldY=y;
  x+=(tx-x)*ease(24);y+=(ty-y)*ease(24);
  const speedScale=Math.max(.001,dt)*scale*590;
  impulse.x+=(clamp((x-oldX)/speedScale,-1,1)-impulse.x)*ease(9);
  impulse.y+=(clamp((y-oldY)/speedScale,-1,1)-impulse.y)*ease(9);
  contact+=((pressed || now-lastMove<450?1:0)-contact)*ease(4.2);
  const show=touched && (pressed || now-lastMove<2900);
  strength+=((show?1:0)-strength)*ease(show?8:3.1);
  nightMix=window.landscapeScroll.night;
  zoom+=((pressed?1.34:1)-zoom)*ease(5);
  const radius=clamp(Math.min(w,h)*.286,98,345)*zoom;
  const state={x,y,strength,night:nightMix,radius,w,h,left,top,scale,time,celestial,
    bx:(x-left)/scale,by:(y-top)/scale,vx:impulse.x,contact,motion:!reduced.matches};
  moveMist();plants.update(state,dt);
  if(renderer){
    const u=material.uniforms;
    plants.updateMesh();
    u.pointer.value.set(x,y);u.radius.value=radius;u.amount.value=strength;
    u.fullNight.value=nightMix;u.clock.value=time;
    renderer.render(world,camera);
  }else{
    cpuRender(state);
  }
  drawBirds(state);stage.classList.add('is-painted');frame=requestAnimationFrame(animate);
}
async function start(){
  await Promise.all([...originals.map(im=>im.decode()),...leafImages.map(im=>im.decode()),mist.decode()]);
  resize();
  try{createRenderer()}catch{renderer=null}
  if(!renderer){buildFogSprite();cpuRender=fallbackRenderer(day,night,plants,birdCanvas)}
  resize();window.addEventListener('resize',resize);
  frame=requestAnimationFrame(animate);
  document.addEventListener('visibilitychange',()=>{
    cancelAnimationFrame(frame);
    if(!document.hidden){last=performance.now();frame=requestAnimationFrame(animate)}
  });
}
start();
