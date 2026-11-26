import React from 'react';
import { INPUT, Panel } from './ui';

const IndicatorsPanel = ({ indicators, addIndicator, updateIndicator, removeIndicator }) => {
  return (
    <Panel
      accent="emerald"
      caption={`${indicators.length} added`}
      right={
        <button
          onClick={addIndicator}
          className="h-7 rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 px-3 text-[11.5px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(5,150,105,0.7)] transition-all hover:brightness-110"
        >
          + Add
        </button>
      }
    >
      {indicators.length === 0 ? (
        <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/40 py-3 text-center text-[12px] text-slate-500">
          No indicators added.
        </div>
      ) : (
        <div className="custom-scrollbar grid max-h-[190px] grid-cols-1 gap-1.5 overflow-y-auto pr-1 xl:grid-cols-2">
          {indicators.map((ind) => (
            <div key={ind.id} className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/40 p-1">
              <input
                type="text"
                value={ind.name || ''}
                onChange={(e) => updateIndicator(ind.id, 'name', e.target.value)}
                className="h-7 w-36 shrink-0 rounded-md border border-emerald-200 bg-white px-2 text-[12px] font-semibold text-emerald-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                placeholder="Name"
              />
              <input
                type="text"
                value={typeof ind.settings === 'object' && ind.settings !== null ? Object.entries(ind.settings).map(([k, v]) => `${k}: ${v}`).join(', ') : ind.settings || ''}
                onChange={(e) => updateIndicator(ind.id, 'settings', e.target.value)}
                className={`${INPUT} min-w-0 flex-1 font-num`}
                placeholder="Period: 14, Multiplier: 2"
              />
              <button
                onClick={() => removeIndicator(ind.id)}
                className="rounded-md px-1.5 text-[13px] leading-6 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                title="Remove indicator"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
};

export default IndicatorsPanel;