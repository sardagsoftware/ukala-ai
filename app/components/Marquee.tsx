"use client";
export default function Marquee({
  text="ukalai • ai director • cinematic • generative •", className=""
}:{text?: string; className?: string}) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-block animate-marquee">
        <span className="opacity-80">{text}</span>
        <span className="opacity-80">{text}</span>
        <span className="opacity-80">{text}</span>
      </div>
    </div>
  );
}
