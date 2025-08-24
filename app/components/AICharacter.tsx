"use client";
import { motion } from "framer-motion";

export default function AICharacter({ src }: { src?: string }) {
  if (src) {
    return (
      <motion.video
        autoPlay muted loop playsInline
        src={src}
        className="w-[360px] h-[360px] object-contain mix-blend-screen opacity-90"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
      />
    );
  }
  // Video asset yoksa: neon glow placeholder
  return (
    <motion.div
      className="w-[320px] h-[320px] rounded-full bg-gradient-to-br from-fuchsia-500/30 via-cyan-400/20 to-emerald-400/20 backdrop-blur-md border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.25)]"
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: .6 }}
    />
  );
}
