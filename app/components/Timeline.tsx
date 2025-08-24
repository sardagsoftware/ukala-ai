"use client";
import { motion } from "framer-motion";

type Beat = { index:number; startSec:number; durationSec:number; caption:string; };

export default function Timeline({ beats, total }:{ beats:Beat[]; total:number }){
  return (
    <div className="w-full rounded-xl bg-zinc-900/70 p-3">
      <div className="relative h-6 rounded-lg bg-zinc-800 overflow-hidden">
        {beats.map((b)=> {
          const left = (b.startSec/total)*100;
          const w = (b.durationSec/total)*100;
          return (
            <motion.div
              key={b.index}
              className="absolute top-0 h-full bg-white/70"
              initial={{ opacity: 0.2, width: 0 }}
              animate={{ opacity: 0.9, width: `${w}%` }}
              transition={{ duration: 0.6 }}
              style={{ left: `${left}%` }}
              title={`#${b.index+1} ${b.caption} (${b.durationSec}s)`}
            />
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs opacity-80">
        <div>Toplam: {total}s</div>
        <div className="text-right">{beats.length} beat</div>
      </div>
    </div>
  );
}
