import "./globals.css";
import type { Metadata } from "next";
import Logo from "./components/Logo";

export const metadata: Metadata = {
  title: "ukala.ai — AI Director",
  description: "Prompt → storyboard → video",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-neon min-h-screen">
        <nav className="w-full border-b border-white/10 backdrop-blur-md bg-black/30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <a href="/" className="flex items-center gap-2"><Logo className="h-12" /></a>
            <a href="/dashboard" className="text-xs md:text-sm opacity-80 hover:opacity-100 transition">Dashboard</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
