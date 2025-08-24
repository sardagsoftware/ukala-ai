"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import BeatTimeline, { useBeatEnergy } from "./components/BeatTimeline";
import CinematicBG from "./components/CinematicBG";
import BackdropFX from "./components/BackdropFX";
import BubbleFX from "./components/BubbleFX";
import ErrorBoundary from "./components/ErrorBoundary";
import ProField from "./components/ProField";
import ProTextarea from "./components/ProTextarea";
const CharacterViewer = dynamic(()=>import("./(scene)/CharacterViewer"), { ssr:false });

export default function Home(){
  const [title,setTitle]=useState(""); const [prompt,setPrompt]=useState("");
  const [duration,setDuration]=useState(300);
  const [result,setResult]=useState<any>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState<string|null>(null);
  const { trigger } = useBeatEnergy();

  const def=(process.env.NEXT_PUBLIC_SCENE_MODE||"VIDEO") as "VIDEO"|"R3F";
  const [sceneMode,setSceneMode]=useState<"VIDEO"|"R3F">(def);
  useEffect(()=>{ const v=localStorage.getItem("sceneMode") as any; if(v) setSceneMode(v); },[]);
  useEffect(()=>{ localStorage.setItem("sceneMode",sceneMode); },[sceneMode]);

  async function submit(){
    setBusy(true); setError(null); setResult(null);
    try{
      const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,prompt,targetDurationSec:Number(duration)})});
      const j=await r.json(); if(!r.ok) throw new Error(typeof j?.error==="string"?j.error:"Bilinmeyen hata");
      setResult(j);
    }catch(e:any){ setError(e.message); } finally{ setBusy(false); }
  }

  const hasFallback=!!result?.storyboard?.some((f:any)=>String(f.caption).includes("(fallback)")||String(f.caption).includes("(placeholder)"));

  return (
    <main className="min-h-screen relative">
      <ErrorBoundary>
        {sceneMode==="R3F" ? <CharacterViewer/> : <CinematicBG/>}
        <BubbleFX />
        <BackdropFX/>

        <div className="fixed top-4 right-4 z-50 glass flex items-center gap-2 px-3 py-2">
          <span className="text-[11px] opacity-80">Scene</span>
          <button onClick={()=>setSceneMode("VIDEO")} className={`tag ${sceneMode==="VIDEO"?"tag-active":""}`}>VIDEO</button>
          <button onClick={()=>setSceneMode("R3F")} className={`tag ${sceneMode==="R3F"?"tag-active":""}`}>R3F</button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10">
          <div className="panel grid gap-6">
            <ProField
              label="Proje başlığı"
              placeholder="Örn: Neon şehirde yağmur sahnesi"
              value={title}
              onChange={setTitle}
            />
            <ProTextarea
              label="Sahne açıklaması / prompt"
              placeholder="Hikâyeyi, atmosferi ve görsel stili anlat..."
              value={prompt}
              onChange={setPrompt}
              rows={8}
              help="Stil ipuçları: 'sinematik ışık', 'volumetrik sis', '35mm lens', 'noir'..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-end">
              <ProField
                label="Süre (sn)"
                placeholder="300"
                value={duration}
                onChange={(v)=>setDuration(Number(v || 0))}
                type="number"
                help="Hedef video süresi. Beat-sheet otomatik oluşturulur (300 = 5 dakika)."
              />
              <motion.button onClick={submit} disabled={busy}
                className="btn-pro"
                whileTap={{scale:.98}}>
                <span className="btn-pro__label">{busy?"Üretiliyor…":"Storyboard ÜRET"}</span>
                <span className="btn-pro__glow" aria-hidden="true"></span>
              </motion.button>
            </div>

            {error && <div className="alert-error">{error}</div>}
            {hasFallback && (
              <div className="alert-warn">
                Üretimler şu an sınırlı modda. Görseller placeholder/fallback ile verildi.
              </div>
            )}
          </div>

          {result?.storyboard && (
            <div className="panel p-4 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.storyboard.map((f:any,i:number)=>(
                  <figure key={i} className="card">
                    <img src={f.url} alt={f.caption} className="w-full h-40 object-cover"/>
                    <figcaption className="text-xs opacity-80 p-2">{f.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {result?.beats && (
            <div className="panel p-4 mt-6">
              <BeatTimeline beats={result.beats} total={result.targetDurationSec} onPulse={trigger}/>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </main>
  );
}
