export type Beat = {
  index: number;
  startSec: number;
  durationSec: number;
  caption: string;
};

// Split total duration into 5–12 beats with slight randomness.
export function generateBeats(totalSec: number, prompt: string): Beat[] {
  const beatsCount = Math.min(12, Math.max(5, Math.round(totalSec / 25)));
  const base = totalSec / beatsCount;
  let remaining = totalSec;
  const beats: Beat[] = [];

  for (let i = 0; i < beatsCount; i++) {
    const jitter = Math.max(-base * 0.25, Math.min(base * 0.25, (Math.random() - 0.5) * base * 0.5));
    const dur = i === beatsCount - 1 ? remaining : Math.max(4, Math.round(base + jitter));
    const start = beats.reduce((s, b) => s + b.durationSec, 0);
    beats.push({
      index: i,
      startSec: start,
      durationSec: dur,
      caption: `Beat ${i + 1}: ${prompt.slice(0, 64)}${prompt.length > 64 ? "..." : ""}`,
    });
    remaining -= dur;
  }
  // Normalize to exact totalSec
  const delta = totalSec - beats.reduce((s, b) => s + b.durationSec, 0);
  beats[beats.length - 1].durationSec += delta;
  return beats;
}