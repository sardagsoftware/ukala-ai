"use client";
export default function CinematicBG({ src="/hero/cinematic.webm" }: { src?: string }) {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <video autoPlay playsInline muted loop
        src={src}
        className="w-full h-full object-cover opacity-90" />
    </div>
  );
}
