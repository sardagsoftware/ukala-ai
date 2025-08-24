"use client";
import { useEffect, useRef } from "react";
export default function ParallaxLayer({ children, strength=8, className="" }:{
  children: React.ReactNode; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current!;
    function onMove(e: MouseEvent){
      const rx = (e.clientX/window.innerWidth - .5) * strength;
      const ry = (e.clientY/window.innerHeight - .5) * strength;
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return ()=>window.removeEventListener("mousemove", onMove);
  },[strength]);
  return <div ref={ref} className={className} style={{ willChange: "transform" }}>{children}</div>;
}
