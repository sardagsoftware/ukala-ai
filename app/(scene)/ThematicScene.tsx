"use client";
// Hotfix: Geçici olarak sahneyi devre dışı bırakıyoruz.
// Bu bileşen hiçbir şey render etmez, crash ihtimali sıfır.
export default function ThematicScene(_: { prompt?: string; energy?: number }) {
  return null;
}
