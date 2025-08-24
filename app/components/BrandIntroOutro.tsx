"use client";
export default function BrandIntroOutro({ src="/logo/intro-outro.webm" }) {
  return (
    <video autoPlay playsInline muted loop
      src={src}
      className="w-full h-16 object-contain opacity-90" />
  );
}
