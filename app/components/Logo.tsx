"use client";
export default function Logo({ className="" }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <video autoPlay muted playsInline loop src="/brand/logo.webm"
        className="h-full w-auto object-contain hidden"
        onCanPlay={(e)=>e.currentTarget.classList.remove("hidden")}
        onError={(e)=>{(e.currentTarget as HTMLVideoElement).style.display="none";}} />
      <img src="/logo/ukalai-logo.svg" alt="ukalai" className="h-full w-auto select-none" />
    </div>
  );
}
