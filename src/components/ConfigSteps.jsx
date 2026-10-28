import React from 'react';

export const ConfigSteps = ({
  currentStep,
  investmentMode,
  setInvestmentMode,
  capital,
  setCapital,
  targetReturn,
  setTargetReturn,
  loading,
  wealthData,
  activeDonutSegment,
  setActiveDonutSegment,
  presetLumpsum,
  presetSip,
  targetProfiles,
  formatCurrency,
  onFetchWealthPlan,
  onStepChange
}) => {
  if (currentStep === 3) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-6 animate-fadeIn">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 3 of 8</span>
          <h3 className="text-2xl md:text-3xl font-extrabold">Choose Investment Mode & Amount</h3>
        </div>

        <div className="flex justify-center bg-[#020205] p-2 rounded-2xl border border-[#1e1e30] max-w-lg mx-auto">
          <button onClick={() => { setInvestmentMode('lumpsum'); setCapital(100000); }} className={`flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer ${investmentMode === 'lumpsum' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}>
            💼 Lumpsum
          </button>
          <button onClick={() => { setInvestmentMode('sip'); setCapital(5000); }} className={`flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer ${investmentMode === 'sip' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
            🔄 Monthly SIP
          </button>
        </div>

        <div className="space-y-4 pt-2">
          <div className="text-center text-sm font-mono text-cyan-400 font-bold">
            {investmentMode === 'sip' ? 'Enter Monthly SIP Contribution (₹)' : 'Enter Total Initial Capital (₹)'}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-cyan-400 font-bold text-2xl">₹</span>
            <input type="number" min="500" step="500" value={capital} onChange={(e) => setCapital(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-[#020205] border border-[#2a2a40] rounded-2xl text-white text-2xl font-mono focus:outline-none" />
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            {(investmentMode === 'sip' ? presetSip : presetLumpsum).map((amt) => (
              <button key={amt} onClick={() => setCapital(amt)} className={`px-5 py-2.5 text-sm font-mono rounded-xl border cursor-pointer ${Number(capital) === amt ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-[#020205] border-[#1e1e30] text-gray-300'}`}>
                {investmentMode === 'sip' ? `₹${amt.toLocaleString('en-IN')} / mo` : `₹${amt / 1000}K`}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <button onClick={() => onStepChange(2)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">← Back</button>
          <button onClick={() => onStepChange(4)} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">Next: Target Return →</button>
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto py-6 animate-fadeIn">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 4 of 8</span>
          <h3 className="text-2xl md:text-3xl font-extrabold">Review & Adjust Target Return (%)</h3>
        </div>

        <div className="flex justify-between items-center bg-[#020205] p-5 rounded-2xl border border-[#1e1e30]">
          <span className="text-base font-bold text-gray-200">Selected Target Return:</span>
          <span className="px-5 py-2 bg-purple-950/40 border border-purple-500/50 rounded-xl text-purple-300 font-mono font-extrabold text-xl">{targetReturn}% p.a.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {targetProfiles.map((profile) => (
            <div key={profile.value} onClick={() => setTargetReturn(profile.value)} className={`p-5 rounded-2xl border cursor-pointer transition-all ${Number(targetReturn) === profile.value ? 'bg-purple-900/20 border-purple-500' : 'bg-[#020205] border-[#1e1e30]'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-base font-bold text-white">{profile.label.split(' ')[0]}</span>
                <span className={`text-xs px-2.5 py-1 rounded border ${profile.color}`}>{profile.tag}</span>
              </div>
              <div className="text-lg font-mono font-bold text-purple-300 pt-2">Target: {profile.value}%</div>
            </div>
          ))}
        </div>

        <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30]">
          <input type="range" min="8" max="120" step="1" value={targetReturn} onChange={(e) => setTargetReturn(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer h-3 bg-gray-800 rounded-lg" />
        </div>

        <div className="pt-6 flex justify-between">
          <button onClick={() => onStepChange(3)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">← Back</button>
          <button onClick={onFetchWealthPlan} disabled={loading} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">
            {loading ? 'Generating...' : 'Next: Asset Allocation →'}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 5 && wealthData) {
    return (
      <div className="space-y-6 py-4 animate-fadeIn">
        <div className="flex justify-between items-center bg-[#020205] p-6 rounded-2xl border border-[#1e1e30]">
          <div>
            <span className="px-3.5 py-1.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono rounded-full font-bold">Step 5 of 8</span>
            <h3 className="text-2xl font-extrabold mt-2">Multi-Segment Asset Allocation & 3D Interactive Insights</h3>
          </div>
          <div className="text-right font-mono bg-[#070710] p-4 rounded-xl border border-[#1e1e30]">
            <div className="text-xs text-gray-400">Projected 5Y CAGR</div>
            <div className="text-xl font-extrabold text-green-400">{wealthData.projected_weighted_cagr}% p.a.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {wealthData.portfolio_breakdown.map((item) => {
            const isActive = activeDonutSegment === item.segment;
            return (
              <div key={item.segment} onClick={() => setActiveDonutSegment(isActive ? null : item.segment)} className={`bg-[#020205] border p-6 rounded-2xl space-y-4 cursor-pointer transition-all transform ${isActive ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] -translate-y-2 bg-[#0b0b18]' : 'border-[#1e1e30]'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-base font-bold text-white">📊 {item.segment}</span>
                  <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-sm rounded-lg font-bold">{item.weight_percentage}%</span>
                </div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400">{formatCurrency(item.allocated_capital)}</div>
                <p className="text-sm text-gray-300">{item.description}</p>
                {isActive && (
                  <div className="mt-4 p-4 bg-[#070710] border border-cyan-500/50 rounded-xl space-y-2">
                    <div className="text-xs font-mono font-bold text-cyan-300">💡 3D Segment Insights:</div>
                    <div className="text-xs text-gray-300 font-mono">Instruments: {item.assets?.map(a => a.name).join(', ')}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-6 flex justify-between">
          <button onClick={() => onStepChange(4)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">← Back</button>
          <button onClick={() => onStepChange(6)} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">Next: Select Funds →</button>
        </div>
      </div>
    );
  }

  return null;
};