"use client";
import { useEffect, useRef } from "react";

export default function Logo({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const parts: any[] = [];

  useEffect(() => {
    const wrap = wrapRef.current!;
    const cvs = cvsRef.current!;
    const ctx = cvs.getContext("2d")!;
    function resize() {
      const r = wrap.getBoundingClientRect();
      cvs.width = r.width*2; cvs.height = (r.height+30)*2;
      cvs.style.width=r.width+'px'; cvs.style.height=r.height+30+'px';
    }
    resize(); window.addEventListener("resize",resize);

    function burst() {
      const colors=["#7C3AED","#06B6D4","#10B981"];
      for(let i=0;i<50;i++){
        const a=Math.random()*2*Math.PI;
        parts.push({
          x:cvs.width/2,y:cvs.height/2,
          vx:Math.cos(a)*2,vy:Math.sin(a)*2-1,
          life:80,color:colors[i%3]
        });
      }
    }
    function step() {
      ctx.fillStyle="rgba(0,0,0,0.08)";
      ctx.fillRect(0,0,cvs.width,cvs.height);
      for(let i=parts.length-1;i>=0;i--){
        const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.02;p.life--;
        ctx.beginPath();ctx.fillStyle=p.color;
        ctx.globalAlpha=Math.max(0,p.life/80);
        ctx.arc(p.x,p.y,2,0,2*Math.PI);ctx.fill();ctx.globalAlpha=1;
        if(p.life<=0) parts.splice(i,1);
      }
      animRef.current=requestAnimationFrame(step);
    }
    function start(){burst(); if(!animRef.current) step();}
    wrap.addEventListener("mouseenter",start);
    wrap.addEventListener("touchstart",()=>{start();}, {passive:true});
    return()=>{wrap.removeEventListener("mouseenter",start);}
  },[]);

  return(
    <div ref={wrapRef} className={`relative inline-block ${className}`}>
      <img src="/logo/ukalai-logo.svg" alt="ukalai" className="select-none"/>
      <canvas ref={cvsRef} className="absolute -inset-3 pointer-events-none"/>
    </div>
  );
}
