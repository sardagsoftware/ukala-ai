"use client";
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`inline-flex items-center gap-3 group ${className}`} aria-label="UkAlai">
      <img src="/logo/ukalai-mark.svg" alt="" className="h-8 w-8 rounded-full group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,.45)] transition" />
      <img src="/logo/ukalai-pro.svg" alt="UkAlai" className="h-8 w-auto hidden sm:block group-hover:drop-shadow-[0_0_16px_rgba(6,182,212,.45)] transition" />
    </a>
  );
}
