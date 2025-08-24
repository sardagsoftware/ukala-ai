"use client";
import { useEffect, useRef } from "react";

export default function BubbleFX() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;

    const context = cvs.getContext("2d");
    if (!(context instanceof CanvasRenderingContext2D)) return;
    const ctx: CanvasRenderingContext2D = context;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const DENS = Number(process.env.NEXT_PUBLIC_BUBBLES_DENSITY ?? 1);
    const SPEED = Number(process.env.NEXT_PUBLIC_BUBBLES_SPEED ?? 1);
    const mobile = /Mobi|Android/i.test(navigator.userAgent);

    type Bubble = { x:number; y:number; r:number; vy:number; vx:number; hue:number; a:number };
    let W = 0, H = 0, raf = 0;
    const bubbles: Bubble[] = [];
    const BASE = 65;

    function resize() {
      W = cvs.width  = Math.floor(window.innerWidth * DPR);
      H = cvs.height = Math.floor(window.innerHeight * DPR);
      cvs.style.width = "100%";
      cvs.style.height = "100%";

      bubbles.length = 0;
      const count = Math.round((mobile ? BASE * 0.6 : BASE) * DENS);
      for (let i = 0; i < count; i++) {
        const r = 8*DPR + Math.random()*22*DPR;
        bubbles.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r,
          vy: (-0.15 - Math.random()*0.35) * DPR * SPEED,
          vx: (Math.random()-0.5)*0.06*DPR,
          hue: 195 + Math.random()*120,
          a: 0.35 + Math.random()*0.4,
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      for (const b of bubbles) {
        b.y += b.vy;
        b.x += b.vx + Math.sin(b.y * 0.002) * 0.05;

        if (b.y + b.r < 0) { b.y = H + b.r; b.x = Math.random()*W; }

        const g1 = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*1.6);
        g1.addColorStop(0, `hsla(${b.hue}, 80%, 60%, ${0.18*b.a})`);
        g1.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = g1;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r*1.6,0,Math.PI*2); ctx.fill();

        const g2 = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*0.9);
        g2.addColorStop(0, `hsla(${b.hue+20}, 90%, 70%, ${0.55*b.a})`);
        g2.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r*0.9,0,Math.PI*2); ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      try { cancelAnimationFrame(raf); } catch {}
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (process.env.NEXT_PUBLIC_BUBBLES === "0") return null;
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 -z-10" />;
}
