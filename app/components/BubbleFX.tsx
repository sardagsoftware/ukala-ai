"use client";
import { useEffect, useRef } from "react";

/**
 * Bioluminescent Bubble FX (Avatar vibes)
 * - Canvas tabanlı, GPU'ya hafif yük
 * - Yoğunluk/hız env ile kontrol: NEXT_PUBLIC_BUBBLES_DENSITY, NEXT_PUBLIC_BUBBLES_SPEED
 */
export default function BubbleFX(){
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d");
    if(!ctx) return;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const DENS = Number(process.env.NEXT_PUBLIC_BUBBLES_DENSITY ?? 1); // 0.5 ~ 2
    const SPEED = Number(process.env.NEXT_PUBLIC_BUBBLES_SPEED ?? 1); // 0.5 ~ 2
    let W = 0, H = 0, raf = 0;

    type B = { x:number; y:number; r:number; vy:number; vx:number; hue:number; a:number; };
    const bubbles: B[] = [];
    const baseCount = 65; // desktop için
    const mobile = /Mobi|Android/i.test(navigator.userAgent);

    function resize(){
      W = cvs.width  = Math.floor(window.innerWidth * DPR);
      H = cvs.height = Math.floor(window.innerHeight * DPR);
      cvs.style.width = "100%"; cvs.style.height = "100%";
      bubbles.length = 0;
      const count = Math.round((mobile ? baseCount*0.6 : baseCount) * DENS);
      for(let i=0;i<count;i++){
        const r = 8*DPR + Math.random()*22*DPR;
        bubbles.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r,
          vy: (-0.15 - Math.random()*0.35) * DPR * SPEED,
          vx: (Math.random()-0.5)*0.06*DPR,
          hue: 195 + Math.random()*120, // cyan→emerald arası
          a: 0.35 + Math.random()*0.4
        });
      }
    }

    function step(){
      ctx.clearRect(0,0,W,H);
      // hafif arka plan parıltısı
      for(const b of bubbles){
        b.y += b.vy; b.x += b.vx + Math.sin(b.y*0.002)*0.05; // sway
        if(b.y + b.r < 0){ b.y = H + b.r; b.x = Math.random()*W; }
        const grad = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*1.6);
        grad.addColorStop(0, `hsla(${b.hue}, 80%, 60%, ${0.18*b.a})`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r*1.6,0,Math.PI*2); ctx.fill();

        // çekirdek (daha parlak)
        const g2 = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*0.9);
        g2.addColorStop(0, `hsla(${b.hue+20}, 90%, 70%, ${0.55*b.a})`);
        g2.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r*0.9,0,Math.PI*2); ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    resize(); step();
    window.addEventListener("resize", resize, { passive:true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Kill-switch: NEXT_PUBLIC_BUBBLES=0 ile tamamen kapat
  if (process.env.NEXT_PUBLIC_BUBBLES === "0") return null;
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 -z-10" />;
}
