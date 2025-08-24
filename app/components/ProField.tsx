"use client";
export default function ProField({
  label, placeholder="", value, onChange, help, type="text", className=""
}:{
  label: string; placeholder?: string; value: string|number;
  onChange: (v:string)=>void; help?: string; type?: "text"|"number"; className?: string;
}) {
  return (
    <div className={`pro-field ${className}`}>
      <label className="pro-label">{label}</label>
      {type==="number" ? (
        <input
          inputMode="numeric"
          className="pro-input"
          placeholder={placeholder}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
        />
      ) : (
        <input
          className="pro-input"
          placeholder={placeholder}
          value={value as string}
          onChange={(e)=>onChange(e.target.value)}
        />
      )}
      {help && <div className="pro-help">{help}</div>}
    </div>
  );
}
