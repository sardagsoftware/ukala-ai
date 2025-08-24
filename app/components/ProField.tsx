"use client";
export default function ProField({
  label, placeholder="", value, onChange, help, type="text"
}:{
  label: string; placeholder?: string; value: string|number;
  onChange: (v:string)=>void; help?: string; type?: "text"|"number";
}) {
  return (
    <div className="pro-field">
      <label className="pro-label">{label}</label>
      <input
        className="pro-input"
        placeholder={placeholder}
        value={String(value ?? "")}
        onChange={(e)=>onChange(e.target.value)}
        inputMode={type==="number" ? "numeric" : undefined}
      />
      {help && <div className="pro-help">{help}</div>}
    </div>
  );
}
