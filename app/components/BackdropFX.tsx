"use client";
import { useEffect, useRef } from "react";

/**
 * Güvenli HUD partikül arka planı.
 * - Canvas/context alınamazsa render etmez (null döner)
 * - Hata durumunda döngüyü sessizce durdurur
 */
export default function BackdropFX() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return; // SSR/ilk frame

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch (e) {
      console.error("BackdropFX getContext failed:", e);
      return;
    }
    if (!ctx) return;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, rafId = 0;
    const parts: {x:number;y:number;vx:number;vy:number;a:number}[] = [];
    const N = 48;

    const resizeSAFE = () => {
      try {
        if (!canvas) return;
        W = canvas.width  = Math.floor(window.innerWidth * DPR);
        H = canvas.height = Math.floor(window.innerHeight * DPR);
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        parts.length = 0;
        for (let i=0;i<N;i++) {
          parts.push({
            x: Math.random()*W,
            y: Math.random()*H,
            vx: (Math.random()-0.5)*0.08*DPR,
            vy: (Math.random()-0.5)*0.08*DPR,
            a: 0.25 + Math.random()*0.5,
          });
        }
      } catch (e) {
        console.error("BackdropFX resize failed:", e);
      }
    };

    const step = () => {
      try {
        ctx!.clearRect(0,0,W,H);
        for (const p of parts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          const g = ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,60*DPR);
          g.addColorStop(0, `rgba(124,58,237,${0.08*p.a})`);
          g.addColorStop(0.5, `rgba(6,182,212,${0.05*p.a})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.fillStyle = g;
          ctx!.beginPath(); ctx!.arc(p.x,p.y,60*DPR,0,Math.PI*2); ctx!.fill();
        }
        rafId = requestAnimationFrame(step);
      } catch (e) {
        console.error("BackdropFX step failed:", e);
        try { cancelAnimationFrame(rafId); } catch {}
      }
    };

    resizeSAFE();
    step();
    window.addEventListener("resize", resizeSAFE, { passive: true });

    return () => {
      try { cancelAnimationFrame(rafId); } catch {}
      window.removeEventListener("resize", resizeSAFE);
    };
  }, []);

  if (process.env.NEXT_PUBLIC_DISABLE_FX === "1") return null;
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 -z-10" />;
}
