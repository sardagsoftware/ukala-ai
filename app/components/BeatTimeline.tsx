"use client";
import { useState } from "react";

export function useBeatEnergy() {
  const [energy, setEnergy] = useState(0);
  const trigger = () => {
    setEnergy(1);
    setTimeout(() => setEnergy(0), 700);
  };
  return { energy, trigger };
}

export default function BeatTimeline({ beats = [], total = 0, onPulse }: { beats: any[]; total: number; onPulse: () => void }) {
  return (
    <div className="w-full rounded-xl bg-zinc-900/70 p-3">
      <div className="relative h-6 rounded-lg bg-zinc-800 overflow-hidden">
        {beats.map((b: any) => {
          const left = (b.startSec / total) * 100;
          const w = (b.durationSec / total) * 100;
          return (
            <div
              key={b.index}
              className="absolute top-0 h-full bg-white/80 hover:bg-white cursor-pointer transition"
              style={{ left: `${left}%`, width: `${Math.max(w, 1)}%` }}
              title={`#${b.index + 1} ${b.caption} (${b.durationSec}s)`}
              onMouseEnter={onPulse}
              onClick={onPulse}
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
