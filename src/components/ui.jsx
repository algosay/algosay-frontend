import React from 'react';

// 🎨 DESIGN TOKENS (used as full class strings so Tailwind can see them)
// ink slate-900 · muted slate-500 · hairline slate-200 · focus indigo-500

export const INPUT =
  'h-7 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 disabled:bg-slate-100 disabled:text-slate-400';

export const SELECT =
  'h-7 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-[12px] text-slate-900 outline-none transition-colors hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15';

export const NUM =
  'h-7 w-full rounded-md border border-slate-200 bg-white px-2 font-num text-[12px] tabular-nums text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15';

export const Label = ({ children }) => (
  <label className="mb-1 block text-[10.5px] font-semibold tracking-wide text-slate-500">{children}</label>
);

export const Field = ({ label, className = '', children }) => (
  <div className={`min-w-0 ${className}`}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);

// Number input + unit dropdown joined into ONE control (saves space, reads as one value)
export const UnitField = ({ value, onValue, unit, onUnit, units = ['Pts', '%'], placeholder = '0', step }) => (
  <div className="flex h-7 w-full overflow-hidden rounded-md border border-slate-200 bg-white transition-colors hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15">
    <input
      type="number"
      step={step}
      value={value}
      onChange={onValue}
      placeholder={placeholder}
      className="min-w-0 flex-1 bg-transparent px-2 font-num text-[12px] tabular-nums text-slate-900 outline-none placeholder:text-slate-400"
    />
    <select
      value={unit}
      onChange={onUnit}
      className="w-[50px] cursor-pointer border-l border-indigo-100 bg-indigo-50 px-1 text-[11px] font-semibold text-indigo-600 outline-none"
    >
      {units.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  </div>
);

export const Check = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-slate-700">
    <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600" checked={checked} onChange={onChange} />
    {label}
  </label>
);

export const SubHead = ({ title, caption }) => (
  <div className="mb-1.5">
    <div className="text-[11.5px] font-semibold text-slate-800">{title}</div>
    {caption && <div className="text-[10.5px] leading-snug text-slate-500">{caption}</div>}
  </div>
);

const PANEL_ACCENT = {
  indigo:  { border: 'border-indigo-200',  bar: 'from-indigo-500 to-violet-500', head: 'from-indigo-50 via-white to-white',  glow: 'shadow-[0_8px_24px_-14px_rgba(79,70,229,0.4)]' },
  emerald: { border: 'border-emerald-200', bar: 'from-emerald-500 to-teal-400',  head: 'from-emerald-50 via-white to-white', glow: 'shadow-[0_8px_24px_-14px_rgba(5,150,105,0.4)]' },
  amber:   { border: 'border-amber-200',   bar: 'from-amber-400 to-orange-500',  head: 'from-amber-50 via-white to-white',   glow: 'shadow-[0_8px_24px_-14px_rgba(217,119,6,0.4)]' },
  rose:    { border: 'border-rose-200',    bar: 'from-rose-500 to-orange-400',   head: 'from-rose-50 via-white to-white',    glow: 'shadow-[0_8px_24px_-14px_rgba(225,29,72,0.4)]' },
  violet:  { border: 'border-violet-200',  bar: 'from-violet-500 to-fuchsia-500', head: 'from-violet-50 via-white to-white', glow: 'shadow-[0_8px_24px_-14px_rgba(124,58,237,0.4)]' },
};

export const Panel = ({ title, caption, right, className = '', bodyClass = 'p-3', accent = 'indigo', children }) => {
  const a = PANEL_ACCENT[accent] || PANEL_ACCENT.indigo;
  return (
    <section className={`overflow-hidden rounded-xl border bg-white ${a.border} ${a.glow} ${className}`}>
      <div className={`h-[3px] w-full bg-gradient-to-r ${a.bar}`} />
      {(title || caption || right) && (
        <header className={`flex items-center justify-between gap-3 border-b ${a.border} bg-gradient-to-r ${a.head} px-3 py-2`}>
          <div className="flex min-w-0 items-baseline gap-2">
            {title && <h3 className="text-[12px] font-semibold text-slate-900">{title}</h3>}
            {caption && <span className="truncate text-[11px] text-slate-500">{caption}</span>}
          </div>
          {right}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
};
