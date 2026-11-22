// A path ends just above the painted skyline, including on tall mobile crops.
function horizon(ridge,worldX){
  let lo=0,hi=ridge.length-1;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(ridge[mid][0]<worldX)lo=mid;else hi=mid}
  const a=ridge[lo],b=ridge[hi],f=Math.max(0,Math.min(1,(worldX-a[0])/(b[0]-a[0])));
  return a[1]+(b[1]-a[1])*f;
}
const showers=[
  {period:9.8,offset:.45,length:1.86,land:.45,dx:.27,tint:'182,219,255'},
  {period:16.3,offset:3.18,length:1.55,land:.72,dx:-.18,tint:'255,211,152'},
  {period:13.1,offset:1.82,length:1.62,land:.27,dx:.24,tint:'209,226,255'}
];
export function drawMeteors(ctx,s,ridge,nightAt,glints){
  if(!s.motion)return;
  for(const [i,m] of showers.entries()){
    const elapsed=s.time+m.offset,cycle=Math.floor(elapsed/m.period);
    const p=(elapsed-cycle*m.period)/m.length;
    if(p>=1)continue;
    const ex=s.w*(m.land+.064*Math.sin(cycle*4.1+i));
    const ey=Math.max(s.h*.24,Math.min(s.h*.62,s.top+s.scale*(horizon(ridge,(ex-s.left)/s.scale)-15)));
    const dx=Math.min(s.w,1100)*m.dx,dy=Math.min(ey-s.h*.035,s.h*(.27+.035*i));
    const travel=p*(.83+.17*p),hx=ex+dx*(1-travel),hy=ey-dy*(1-travel);
    const tail=Math.min(travel,.27),fade=Math.min(1,p*8,(1-p)*7);
    const length=Math.hypot(dx,dy),nx=dy/length,ny=dx/length;
    for(let k=0;k<18;k++){
      const u=k/18,v=(k+1)/18;
      const ax=hx+dx*tail*u,ay=hy-dy*tail*u,bx=hx+dx*tail*v,by=hy-dy*tail*v;
      const visibility=nightAt(ax,ay,s);
      if(visibility<.01 || ay>s.top+s.scale*horizon(ridge,(ax-s.left)/s.scale))continue;
      ctx.lineCap='round';
      ctx.strokeStyle='rgb('+m.tint+')';ctx.globalAlpha=fade*(1-u)**1.4*visibility*.085;ctx.lineWidth=1.0+1.9*(1-u);
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
      ctx.strokeStyle='rgb(248,250,255)';ctx.globalAlpha=fade*(1-u)**.8*visibility*.39;ctx.lineWidth=.35+.73*(1-u);
      ctx.stroke();
      if(k%4===1){
        const d=2+5*u;
        ctx.globalAlpha*=.20;ctx.fillStyle='rgb('+m.tint+')';ctx.beginPath();
        ctx.arc(ax+nx*d,ay+ny*d,.65,0,Math.PI*2);ctx.fill();
      }
    }
    if(hy<s.top+s.scale*horizon(ridge,(hx-s.left)/s.scale)){
      ctx.globalAlpha=.40*fade*nightAt(hx,hy,s);const r=7;
      ctx.drawImage(glints[i%2],hx-r,hy-r,r*2,r*2);
    }
  }
}
