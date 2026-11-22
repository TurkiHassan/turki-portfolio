// A soft centre-to-edge blend keeps paint detail visible through the corona.
export function haloAt(px,py,state){
  const d=Math.hypot(px-state.x,py-state.y)/state.radius;
  const t=Math.min(1,Math.max(0,(d-.45)/.64));
  return 1-t*t*(3-2*t);
}
export function drawHalo(ctx,state){
  if(state.strength<.003)return;
  const {x,y,radius,night,strength}=state;
  const color=night>.5?'255,226,169':'204,224,255';
  const glow=ctx.createRadialGradient(x,y,0,x,y,radius*1.14);
  for(const [offset,opacity] of [[0,0],[.42,0],[.58,.023],[.71,.083],[.78,.126],[.87,.075],[.96,.014],[1,0]]){
    glow.addColorStop(offset,'rgba('+color+','+opacity+')');
  }
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=strength;ctx.fillStyle=glow;
  ctx.fillRect(x-radius*1.14,y-radius*1.14,radius*2.28,radius*2.28);ctx.restore();
}
