import {haloAt} from './halo.js';
import {drawMeteors} from './meteors.js';

export function nightAt(px,py,state){
  if(state.strength<.002)return state.night;
  return state.night+(1-2*state.night)*state.strength*haloAt(px,py,state);
}
function lightSprite(rgb,star){
  const c=document.createElement('canvas');c.width=c.height=40;
  const g=c.getContext('2d'),glow=g.createRadialGradient(20,20,0,20,20,18);
  glow.addColorStop(0,'rgba('+rgb+',1)');glow.addColorStop(.14,'rgba('+rgb+',.76)');
  glow.addColorStop(.36,'rgba('+rgb+',.18)');glow.addColorStop(1,'rgba('+rgb+',0)');
  g.fillStyle=glow;g.fillRect(0,0,40,40);
  if(star){g.fillStyle='rgba('+rgb+',.84)';g.beginPath();
    for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?1.35:i%4?8:12;g.lineTo(20+Math.cos(a)*r,20+Math.sin(a)*r)}
    g.closePath();g.fill()}
  return c;
}
export function installLights(stars,ridge){
  const glints=[lightSprite('207,225,255',true),lightSprite('255,237,195',true)];
  const firefly=lightSprite('255,209,100',false);
  return function drawLights(ctx,state){
    const {left,top,scale,w,h,time,night,strength,celestial}=state;
    if(night+strength<.006)return;
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<stars.length;i++){
      const [u,v,r,phase,rate]=stars[i],px=left+u*scale,py=top+v*scale;
      if(px<0||px>w||py<0||py>h||Math.hypot(u-celestial[0],v-celestial[1])<36)continue;
      const light=nightAt(px,py,state);if(light<.012)continue;
      const pulse=.5+.5*Math.sin(time*(1.75+rate)+phase+Math.sin(time*.59+phase));
      const f=pulse*pulse;
      const large=r>1.49;
      const size=(r*4+f*r*(large?11.5:6.6))*Math.min(1.45,Math.max(.84,scale));
      const moonDistance=Math.hypot(u-celestial[0],v-celestial[1]);
      const contrast=1-.40*Math.exp(-((moonDistance/79)**2));
      ctx.globalAlpha=light*contrast*(.16+.84*f);
      ctx.drawImage(glints[i%5===0?1:0],px-size/2,py-size/2,size,size);
    }
    // Fireflies hover at different depths over the flowers.
    for(let i=0;i<26;i++){
      const px=left+scale*(210+(i*193)%1500+18*Math.sin(time*.48+i*3.1));
      const py=top+scale*(598+(i*53)%207+10*Math.sin(time*.72+i*1.8));
      const pulse=Math.max(0,Math.sin(time*.94+i*1.8));
      ctx.globalAlpha=nightAt(px,py,state)*pulse*.86;
      if(ctx.globalAlpha<.02)continue;
      const size=(9+(i%4)*2)*scale;ctx.drawImage(firefly,px-size/2,py-size/2,size,size);
    }
    drawMeteors(ctx,state,ridge,nightAt,glints);
    ctx.restore();
  }
}
