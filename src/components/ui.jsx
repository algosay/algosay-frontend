import React from 'react';

// 🎨 DESIGN TOKENS (used as full class strings so Tailwind can see them)
// ink #121A2B · muted #5B667A · soft #7C879A · hairline #DDE2E9 · paper #F2F4F7 · focus #2F5BEA

export const INPUT =
  'h-7 w-full rounded-md border border-[#DDE2E9] bg-white px-2 text-[12px] text-[#121A2B] outline-none transition-colors placeholder:text-[#9AA4B5] focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15 disabled:bg-[#F2F4F7] disabled:text-[#9AA4B5]';

export const SELECT =
  'h-7 w-full cursor-pointer rounded-md border border-[#DDE2E9] bg-white px-1.5 text-[12px] text-[#121A2B] outline-none transition-colors focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15';

export const NUM =
  'h-7 w-full rounded-md border border-[#DDE2E9] bg-white px-2 font-num text-[12px] tabular-nums text-[#121A2B] outline-none transition-colors placeholder:text-[#9AA4B5] focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15';

export const Label = ({ children }) => (
  <label className="mb-1 block text-[10.5px] font-medium text-[#5B667A]">{children}</label>
);

export const Field = ({ label, className = '', children }) => (
  <div className={`min-w-0 ${className}`}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);

// Number input + unit dropdown joined into ONE control (saves space, reads as one value)
export const UnitField = ({ value, onValue, unit, onUnit, units = ['Pts', '%'], placeholder = '0', step }) => (
  <div className="flex h-7 w-full overflow-hidden rounded-md border border-[#DDE2E9] bg-white transition-colors focus-within:border-[#2F5BEA] focus-within:ring-2 focus-within:ring-[#2F5BEA]/15">
    <input
      type="number"
      step={step}
      value={value}
      onChange={onValue}
      placeholder={placeholder}
      className="min-w-0 flex-1 bg-transparent px-2 font-num text-[12px] tabular-nums text-[#121A2B] outline-none placeholder:text-[#9AA4B5]"
    />
    <select
      value={unit}
      onChange={onUnit}
      className="w-[50px] cursor-pointer border-l border-[#DDE2E9] bg-[#F7F8FA] px-1 text-[11px] font-medium text-[#5B667A] outline-none"
    >
      {units.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  </div>
);

export const Check = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-[#2B3547]">
    <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#C3CAD6] accent-[#121A2B]" checked={checked} onChange={onChange} />
    {label}
  </label>
);

export const SubHead = ({ title, caption }) => (
  <div className="mb-1.5">
    <div className="text-[11.5px] font-semibold text-[#2B3547]">{title}</div>
    {caption && <div className="text-[10.5px] leading-snug text-[#7C879A]">{caption}</div>}
  </div>
);

export const Panel = ({ title, caption, right, className = '', bodyClass = 'p-3', children }) => (
  <section className={`rounded-xl border border-[#DDE2E9] bg-white ${className}`}>
    {(title || right) && (
      <header className="flex items-center justify-between gap-3 border-b border-[#E9EDF2] px-3 py-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <h3 className="text-[12px] font-semibold text-[#121A2B]">{title}</h3>
          {caption && <span className="truncate text-[11px] text-[#7C879A]">{caption}</span>}
        </div>
        {right}
      </header>
    )}
    <div className={bodyClass}>{children}</div>
  </section>
);
