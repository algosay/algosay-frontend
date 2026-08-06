import React from 'react';

const IndicatorsPanel = ({ indicators, addIndicator, updateIndicator, removeIndicator }) => {
  return (
    <div className="bg-[#1e1e1e] p-5 rounded-xl border border-[#2d2d2d] mb-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4 border-b border-[#2d2d2d] pb-2">
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-1.5">
            <span>📊</span> Indicators Matrix
          </h3>
          <button onClick={addIndicator} className="text-[10px] bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-2 py-1 rounded transition-colors">+ Add</button>
        </div>
        {indicators.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-500">No indicators added.</div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar pr-1 mb-3">
            {indicators.map((ind) => (
              <div key={ind.id} className="bg-[#121212] p-2 rounded border border-[#333] relative group">
                <button onClick={() => removeIndicator(ind.id)} className="absolute top-1.5 right-1.5 text-gray-500 hover:text-red-400 text-xs">✕</button>
                <input type="text" value={ind.name} onChange={(e) => updateIndicator(ind.id, 'name', e.target.value)} className="w-[80%] bg-transparent border-b border-[#333] text-xs text-blue-400 font-semibold focus:outline-none focus:border-blue-500 mb-1" placeholder="Name" />
                <input type="text" value={ind.settings} onChange={(e) => updateIndicator(ind.id, 'settings', e.target.value)} className="w-full bg-transparent border-b border-[#333] text-[11px] text-gray-400 focus:outline-none focus:border-gray-500" placeholder="Settings" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorsPanel;