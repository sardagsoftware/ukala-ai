"use client";
export default function ProTextarea({
  label, placeholder="", value, onChange, rows=6, help, className=""
}:{
  label: string; placeholder?: string; value: string;
  onChange: (v:string)=>void; rows?: number; help?: string; className?: string;
}) {
  return (
    <div className={`pro-field ${className}`}>
      <label className="pro-label">{label}</label>
      <textarea
        className="pro-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        rows={rows}
      />
      {help && <div className="pro-help">{help}</div>}
    </div>
  );
}
