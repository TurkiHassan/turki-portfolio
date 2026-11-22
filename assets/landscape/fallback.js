import {haloAt} from './halo.js';
const make=()=>document.createElement('canvas');
export function fallbackRenderer(day,night,plants,birds){
  const canvas=make(),layer=make(),mask=make();
  const out=canvas.getContext('2d'),overlay=layer.getContext('2d'),maskCtx=mask.getContext('2d');
  canvas.className='surface fallback';canvas.setAttribute('aria-hidden','true');
  birds.before(canvas);
  let pixels;
  function paint(ctx,base,vegetation,s){
    ctx.setTransform(canvas.width/s.w*s.scale,0,0,canvas.height/s.h*s.scale,canvas.width/s.w*s.left,canvas.height/s.h*s.top);
    ctx.drawImage(base,0,0);plants.paint(ctx,vegetation,s);
    ctx.setTransform(1,0,0,1,0,0);
  }
  return function draw(s){
    const dpr=Math.min(devicePixelRatio,1.25,Math.sqrt(1500000/(s.w*s.h)));
    const dw=Math.round(s.w*dpr),dh=Math.round(s.h*dpr);
    if(canvas.width!==dw || canvas.height!==dh || !pixels){
      canvas.width=layer.width=dw;canvas.height=layer.height=dh;
      const factor=Math.min(1,300/Math.max(s.w,s.h));
      mask.width=Math.ceil(s.w*factor);mask.height=Math.ceil(s.h*factor);
      pixels=maskCtx.createImageData(mask.width,mask.height);
    }
    paint(out,day,0,s);
    if(s.strength+s.night<.002)return;
    paint(overlay,night,1,s);
    const wx=s.w/mask.width,hy=s.h/mask.height;
    const active=s.strength>.002,reach=s.radius*1.09;
    for(let j=0,k=3;j<mask.height;j++)for(let i=0;i<mask.width;i++,k+=4){
      const x=(i+.5)*wx,y=(j+.5)*hy;
      const m=active && Math.abs(x-s.x)<reach && Math.abs(y-s.y)<reach?haloAt(x,y,s):0;
      pixels.data[k]=255*(s.night+(1-2*s.night)*s.strength*m);
    }
    maskCtx.putImageData(pixels,0,0);s.nightMask=mask;
    overlay.globalCompositeOperation='destination-in';overlay.drawImage(mask,0,0,dw,dh);overlay.globalCompositeOperation='source-over';
    out.drawImage(layer,0,0);
  }
}
