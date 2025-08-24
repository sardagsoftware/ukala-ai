"use client";
import React from "react";
export default class ErrorBoundary extends React.Component<{fallback?:React.ReactNode;children:React.ReactNode},{hasError:boolean}>{
  constructor(p:any){ super(p); this.state={hasError:false}; }
  static getDerivedStateFromError(){ return {hasError:true}; }
  componentDidCatch(err:any){ console.error("UI boundary:", err); }
  render(){ return this.state.hasError ? (this.props.fallback ?? null) : this.props.children; }
}
