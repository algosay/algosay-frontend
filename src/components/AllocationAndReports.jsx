import React from 'react';

export const AllocationAndReports = ({
  currentStep,
  wealthData,
  expandedSegment,
  setExpandedSegment,
  selectedSegmentAssets,
  onAssetToggle,
  capital,
  formatCurrency,
  onStepChange,
  onPlanCalculated
}) => {
  if (currentStep === 6 && wealthData) {
    return (
      <div className="space-y-6 py-4 animate-fadeIn">
        <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
          <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 6 of 8</span>
          <h3 className="text-2xl font-extrabold mt-2">Select Specific Instruments & Capital Split</h3>
          <p className="text-gray-300 text-sm">Tick preferred instruments; your allocated capital will be automatically split among them!</p>
        </div>

        <div className="space-y-4">
          {wealthData.portfolio_breakdown.map((item) => {
            const isExpanded = expandedSegment === item.segment;
            const selectedAssetsInSegment = selectedSegmentAssets[item.segment] || [];
            const selectedCount = selectedAssetsInSegment.length;
            const totalSegmentCapital = item.allocated_capital || (Number(capital) * (item.weight_percentage / 100));
            const splitAmountPerFund = selectedCount > 0 ? Math.round(totalSegmentCapital / selectedCount) : 0;

            return (
              <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] rounded-2xl overflow-hidden">
                <div onClick={() => setExpandedSegment(isExpanded ? null : item.segment)} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#0a0a14]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">📊 {item.segment}</span>
                    <span className="text-xs px-2.5 py-1 bg-purple-950/50 border border-purple-500/40 text-purple-300 font-mono rounded-lg">
                      Allocated: {formatCurrency(totalSegmentCapital)} ({item.weight_percentage}%)
                    </span>
                  </div>
                  <span className="text-cyan-400 text-xs font-mono">{selectedCount} Selected {isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[#1e1e30] bg-[#05050a] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.assets.map((asset, idx) => {
                        const isChecked = selectedAssetsInSegment.includes(asset.name);
                        return (
                          <div key={idx} onClick={() => onAssetToggle(item.segment, asset.name)} className={`p-4 border rounded-xl flex flex-col justify-between gap-2 cursor-pointer ${isChecked ? 'bg-purple-950/30 border-purple-400' : 'bg-[#070710] border-[#1a1a2e]'}`}>
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-bold text-white">{asset.name}</span>
                              <input type="checkbox" checked={isChecked} onChange={() => {}} className="accent-purple-500 h-5 w-5 cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-xs font-mono">
                              <span className="text-gray-400">{asset.type}</span>
                              {isChecked ? <span className="text-green-400 font-bold">⚡ {formatCurrency(splitAmountPerFund)}</span> : <span className="text-gray-500">Not Selected</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-6 flex justify-between">
          <button onClick={() => onStepChange(5)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">← Back</button>
          <button onClick={() => onStepChange(7)} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">Next: Backtest Report →</button>
        </div>
      </div>
    );
  }

  if (currentStep === 7 && wealthData) {
    return (
      <div className="space-y-6 py-4 max-w-6xl mx-auto animate-fadeIn">
        <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
          <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 7 of 8</span>
          <h3 className="text-2xl font-extrabold mt-2">5-Year Historical Backtest Report</h3>
        </div>

        <div className="pt-6 flex justify-between">
          <button onClick={() => onStepChange(6)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">← Back</button>
          <button onClick={() => { onStepChange(8); if (onPlanCalculated) onPlanCalculated({ ...wealthData, selectedSegmentAssets }); }} className="px-9 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">View Final Results 🚀</button>
        </div>
      </div>
    );
  }

  if (currentStep === 8 && wealthData) {
    return (
      <div className="text-center space-y-8 py-12 animate-fadeIn">
        <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-3xl">✓</div>
        <h3 className="text-3xl font-extrabold">Wealth Blueprint Generated Successfully!</h3>
        <div className="flex justify-center gap-5 pt-4">
          <button onClick={() => onStepChange(1)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">Retake Quiz & New Plan</button>
          <button onClick={() => window.print()} className="px-8 py-3.5 bg-cyan-600 text-white font-bold rounded-xl text-sm cursor-pointer">📥 Download PDF Report</button>
        </div>
      </div>
    );
  }

  return null;
};