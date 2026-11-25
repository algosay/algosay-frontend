import React from 'react';
import { INPUT, Panel } from './ui';

const IndicatorsPanel = ({ indicators, addIndicator, updateIndicator, removeIndicator }) => {
  return (
    <Panel
      title="Indicators"
      caption={`${indicators.length} added`}
      right={
        <button onClick={addIndicator} className="h-7 rounded-md border border-[#DDE2E9] bg-white px-3 text-[11.5px] font-semibold text-[#121A2B] transition-colors hover:bg-[#F2F4F7]">
          + Add
        </button>
      }
    >
      {indicators.length === 0 ? (
        <div className="py-2 text-center text-[12px] text-[#7C879A]">No indicators added.</div>
      ) : (
        <div className="custom-scrollbar grid max-h-[190px] grid-cols-1 gap-1.5 overflow-y-auto pr-1 xl:grid-cols-2">
          {indicators.map((ind) => (
            <div key={ind.id} className="flex items-center gap-1.5 rounded-md border border-[#E9EDF2] bg-[#FAFBFC] p-1">
              {/* 🚀 Added fallback || '' to avoid uncontrolled input warning */}
              <input
                type="text"
                value={ind.name || ''}
                onChange={(e) => updateIndicator(ind.id, 'name', e.target.value)}
                className="h-7 w-36 shrink-0 rounded-md border border-[#DDE2E9] bg-white px-2 text-[12px] font-semibold text-[#2F5BEA] outline-none transition-colors placeholder:text-[#9AA4B5] focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15"
                placeholder="Name"
              />
              {/* 🚀 Safely handle object to string conversion so form state always works perfectly */}
              <input
                type="text"
                value={typeof ind.settings === 'object' && ind.settings !== null ? Object.entries(ind.settings).map(([k, v]) => `${k}: ${v}`).join(', ') : ind.settings || ''}
                onChange={(e) => updateIndicator(ind.id, 'settings', e.target.value)}
                className={`${INPUT} min-w-0 flex-1 font-num`}
                placeholder="Period: 14, Multiplier: 2"
              />
              <button onClick={() => removeIndicator(ind.id)} className="rounded px-1.5 text-[13px] leading-6 text-[#9AA4B5] transition-colors hover:bg-[#FDECEC] hover:text-[#B42F2F]" title="Remove indicator">✕</button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
};

export default IndicatorsPanel;