import {BufferGeometry,BufferAttribute,DynamicDrawUsage,Mesh,ShaderMaterial,DoubleSide} from './three.module.js';

const mechanics={
  twig:{stiffness:22,damping:6.1,sail:.078,flutter:.009},
  leaf:{stiffness:60,damping:10.2,sail:.15,flutter:.047},
  blade:{stiffness:37,damping:6.4,sail:.21,flutter:.026},
  flower:{stiffness:29,damping:6.6,sail:.135,flutter:.013}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export class PlantRig{
  constructor(atlas,day,night){
    this.atlas=atlas;this.images=[day,night];
    this.parts=atlas.parts.map((p,i)=>({...p,phase:(i*2.399963)%6.28,angle:0,speed:0,roll:1,liftX:0,liftY:0}));
    const sprays=this.parts.filter(p=>p.kind==='twig');
    for(const p of this.parts){
      if(p.kind!=='leaf')continue;
      let shortest=41;
      for(const twig of sprays){
        const dx=p.ax-(twig.x+twig.w*.5),dy=p.ay-(twig.y+twig.h*.5),d=Math.hypot(dx,dy);
        if(d<shortest){shortest=d;p.parent=twig}
      }
    }
  }
  update(s,dt){
    const steps=Math.max(1,Math.ceil(dt*60)),step=dt/steps;
    for(const p of this.parts){
      if(!s.motion){p.angle=p.speed=p.liftX=p.liftY=0;p.roll=1;continue}
      const m=mechanics[p.kind],t=s.time;
      // Gusts travel across the hillside. Neighbours feel one wind front, but
      // settle at different rates according to their stem stiffness and inertia.
      const air=t*1.08-p.ax*.0061-p.ay*.0024;
      const gust=Math.max(0,Math.sin(air*.64+.85))**2;
      const wind=.72*Math.sin(air)+.34*Math.sin(air*1.89+.8)+.55*gust;
      const dx=(p.ax-s.bx)/75,dy=(p.ay-s.by)/72,near=s.contact*Math.exp(-dx*dx-dy*dy);
      const push=near*(.21*s.vx+.14*clamp(dx,-1,1)+.075*Math.sin(t*3.3+p.phase*.12));
      const flutter=(.32+.68*gust)*Math.sin(t*(3.4+.35*Math.sin(p.phase))+p.phase);
      const target=m.sail*wind+push+m.flutter*flutter;
      for(let j=0;j<steps;j++){
        p.speed+=(m.stiffness*(target-p.angle)-m.damping*p.speed)*step;
        p.angle+=p.speed*step;
      }
      // Leaves twist as they turn edge-on. Blades keep their narrow profile.
      p.roll=1-(p.kind==='leaf'?.12:p.kind==='twig'?.027:.014)*(1-Math.cos(p.angle*3+flutter*.68));
      p.liftX=p.liftY=0;
      if(p.parent){
        const branch=p.parent,dx=p.ax-branch.ax,dy=p.ay-branch.ay;
        const theta=branch.angle*.68,co=Math.cos(theta),si=Math.sin(theta);
        p.liftX=dx*(co-1)-dy*si;p.liftY=dx*si+dy*(co-1);
      }
    }
  }
  mesh(makeTexture,uniforms){
    const rows=6,columns=2,count=this.parts.length*(rows+1)*columns;
    const positions=new Float32Array(count*3),uv=new Float32Array(count*2),indices=[];
    let v=0;
    for(const p of this.parts){
      for(let row=0;row<=rows;row++){
        const fy=row/rows;
        for(let col=0;col<2;col++,v++){
          uv[v*2]=(p.u+col*p.w)/this.atlas.width;
          uv[v*2+1]=1-(p.v+fy*p.h)/this.atlas.height;
          if(row<rows && !col)indices.push(v,v+2,v+1,v+1,v+2,v+3);
        }
      }
    }
    const geometry=new BufferGeometry();
    const attribute=new BufferAttribute(positions,3).setUsage(DynamicDrawUsage);
    geometry.setAttribute('position',attribute);geometry.setAttribute('uv',new BufferAttribute(uv,2));geometry.setIndex(indices);
    const material=new ShaderMaterial({
      side:DoubleSide,forceSinglePass:true,transparent:true,depthTest:false,depthWrite:false,
      uniforms:{...uniforms,sprigsDay:{value:makeTexture(this.images[0])},sprigsNight:{value:makeTexture(this.images[1])}},
      vertexShader:`varying vec2 paintUV,screen;uniform vec2 origin,visibleUV;
        void main(){paintUV=uv;screen=(position.xy/vec2(1916.,821.)-origin)/visibleUV;
          gl_Position=vec4(screen.x*2.-1.,1.-screen.y*2.,0.,1.);}`,
      fragmentShader:`varying vec2 paintUV,screen;uniform vec2 size,pointer;uniform float amount,radius,fullNight;
        uniform sampler2D sprigsDay,sprigsNight;
        void main(){vec4 a=texture2D(sprigsDay,paintUV);if(a.a<.008)discard;
          float veil=(1.-smoothstep(.45,1.09,length(screen*size-pointer)/radius))*amount;
          vec3 b=texture2D(sprigsNight,paintUV).rgb;
          gl_FragColor=vec4(mix(a.rgb,b,mix(fullNight,1.-fullNight,veil)),a.a);}`
    });
    const mesh=new Mesh(geometry,material);mesh.frustumCulled=false;mesh.renderOrder=2;
    this.updateMesh=()=>{
      let k=0;
      for(const p of this.parts){
        for(let row=0;row<=rows;row++){
          const ry=p.y+p.h*row/rows-p.ay;
          // Bend a stem progressively from root to tip. Each cross-section is
          // rotated, preserving its width and the brushwork on its surface.
          const f=clamp(-ry/Math.max(3,p.ay-p.y),0,1);
          const theta=p.angle*(p.kind==='blade'?.23+.77*f:.72+.28*f);
          const co=Math.cos(theta),si=Math.sin(theta);
          for(let col=0;col<2;col++){
            const rx=(p.x+p.w*col-p.ax)*p.roll;
            positions[k++]=p.ax+p.liftX+rx*co-ry*si;
            positions[k++]=p.ay+p.liftY+rx*si+ry*co;k++;
          }
        }
      }
      attribute.needsUpdate=true;
    };
    this.updateMesh();return mesh;
  }
  paint(ctx,index,s){
    const atlas=this.images[index];
    for(const p of this.parts){
      if(s.left+(p.x+p.w+20)*s.scale<0||s.left+(p.x-20)*s.scale>s.w)continue;
      ctx.save();ctx.translate(p.ax+p.liftX,p.ay+p.liftY);ctx.rotate(p.angle);ctx.scale(p.roll,1);
      ctx.drawImage(atlas,p.u,p.v,p.w,p.h,p.x-p.ax,p.y-p.ay,p.w,p.h);ctx.restore();
    }
  }
}
