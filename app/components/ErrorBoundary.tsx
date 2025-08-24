"use client";
import React from "react";

export default class ErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children: React.ReactNode },
  { hasError: boolean; err?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, err };
  }
  componentDidCatch(err: any) {
    console.error("UI ErrorBoundary caught:", err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-4 text-sm bg-red-500/10 border border-red-500/30 rounded-lg">
          Arka plan sahnesi devre dışı bırakıldı (cihaz desteği yetersiz). İçerik çalışmaya devam ediyor.
        </div>
      );
    }
    return this.props.children;
  }
}
