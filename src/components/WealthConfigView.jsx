import React, { useState } from 'react';
import axios from 'axios';

const WealthConfigView = ({ onPlanCalculated, onError }) => {
  // Wizard Steps: 1: Capital, 2: Return, 3: Allocation, 4: Specific Funds & Selection, 5: Backtest Report, 6: Final
  const [currentStep, setCurrentStep] = useState(1);
  
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18); // Default Balanced
  const [loading, setLoading] = useState(false);
  const [wealthData, setWealthData] = useState(null);
  const [expandedSegment, setExpandedSegment] = useState(null);

  // 🌟 NEW: State to store user selected assets per segment { "Large Cap": ["Nippon India ETF Nifty 50 BeES", ...] }
  const [selectedSegmentAssets, setSelectedSegmentAssets] = useState({});

  const presetCapitals = [50000, 100000, 250000, 500000, 1000000];

  const targetProfiles = [
    { label: 'Conservative (10-12%)', value: 12, tag: 'Safe Buffer', color: 'border-green-500/40 text-green-400 bg-green-950/20' },
    { label: 'Balanced (15-20%)', value: 18, tag: 'Moderate Growth', color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { label: 'Aggressive (30-50%)', value: 35, tag: 'High Alpha', color: 'border-orange-500/40 text-orange-400 bg-orange-950/20' },
    { label: 'Extreme High (100%+)', value: 85, tag: 'High Beta / Risk', color: 'border-red-500/40 text-red-400 bg-red-950/20' },
  ];

  // Fetch data from FastAPI backend when moving past Step 2
  const fetchWealthPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://algosay-backend.onrender.com/api/wealth/calculate-plan', {
        capital: Number(capital),
        target_return: Number(targetReturn)
      });

      if (response.data && response.data.status === 'success') {
        const data = response.data.data;
        setWealthData(data);

        // Initialize all assets as selected by default for every segment
        const initialSelections = {};
        if (data.portfolio_breakdown) {
          data.portfolio_breakdown.forEach((item) => {
            initialSelections[item.segment] = item.assets.map((asset) => asset.name);
          });
        }
        setSelectedSegmentAssets(initialSelections);

        setCurrentStep(3); // Move to Allocation view
      } else {
        if (onError) onError("Failed to fetch wealth plan from backend.");
      }
    } catch (err) {
      console.error("Wealth calculation error:", err);
      if (onError) onError("Server communication error. Please check FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual asset selection in a segment
  const handleAssetToggle = (segmentName, assetName) => {
    setSelectedSegmentAssets((prev) => {
      const currentSelected = prev[segmentName] || [];
      if (currentSelected.includes(assetName)) {
        // Remove if already selected (keep at least 1)
        if (currentSelected.length === 1) return prev;
        return { ...prev, [segmentName]: currentSelected.filter((name) => name !== assetName) };
      } else {
        // Add asset
        return { ...prev, [segmentName]: [...currentSelected, assetName] };
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-10 bg-[#070710] border border-[#1e1e30] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] my-6 relative overflow-hidden text-white">
      
      {/* Background Neon Glow Effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER & STEP PROGRESS BAR */}
      <div className="mb-8 border-b border-[#1e1e30] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            💎 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AlgoSay Wealth Allocator Engine</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Step-by-step institutional-grade multi-segment asset allocation & historical backtest blueprint.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 bg-[#020205] border border-[#1e1e30] px-4 py-2 rounded-xl">
          <span className="text-xs font-mono text-cyan-400">Step {currentStep} of 6</span>
          <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STEP 1: CAPITAL INPUT */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 1 && (
        <div className="space-y-6 max-w-3xl mx-auto py-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full">Step 1 of 6</span>
            <h3 className="text-xl md:text-2xl font-bold">Enter Your Investment Capital</h3>
            <p className="text-gray-400 text-sm">How much capital are you planning to deploy into long-term wealth assets?</p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-cyan-400 font-bold text-xl">₹</span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-[#020205] border border-[#2a2a40] focus:border-cyan-500 rounded-2xl text-white text-xl font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="e.g., 100000"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 justify-center">
              {presetCapitals.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCapital(amt)}
                  className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    Number(capital) === amt 
                      ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'bg-[#020205] border-[#1e1e30] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  ₹{(amt / 1000 >= 100 ? `${amt / 100000}L` : `${amt / 1000}K`)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Next: Select Target Return</span> <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 2: TARGET RETURN SELECTION */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 2 && (
        <div className="space-y-6 max-w-4xl mx-auto py-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full">Step 2 of 6</span>
            <h3 className="text-xl md:text-2xl font-bold">What is your Target Yearly Return (%)?</h3>
            <p className="text-gray-400 text-sm">Choose your expected annual compound growth rate or risk appetite.</p>
          </div>

          <div className="flex justify-between items-center bg-[#020205] p-4 rounded-xl border border-[#1e1e30]">
            <span className="text-sm font-bold text-gray-300">Selected Target:</span>
            <span className="px-4 py-1.5 bg-purple-950/40 border border-purple-500/50 rounded-xl text-purple-400 font-mono font-bold text-lg">
              {targetReturn}% p.a.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targetProfiles.map((profile) => (
              <div
                key={profile.value}
                onClick={() => setTargetReturn(profile.value)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  Number(targetReturn) === profile.value
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#020205] border-[#1e1e30] hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-white">{profile.label.split(' ')[0]}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${profile.color}`}>
                    {profile.tag}
                  </span>
                </div>
                <div className="text-base font-mono font-bold text-purple-300">
                  Target: {profile.value}%
                </div>
              </div>
            ))}
          </div>

          {/* Range Slider */}
          <div className="bg-[#020205] p-5 rounded-2xl border border-[#1e1e30]">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
              <span>Conservative (10%)</span>
              <span>Balanced (20%)</span>
              <span>Aggressive (50%)</span>
              <span>Extreme (100%+)</span>
            </div>
            <input
              type="range"
              min="8"
              max="120"
              step="1"
              value={targetReturn}
              onChange={(e) => setTargetReturn(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={fetchWealthPlan}
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  <span>Generating Allocation...</span>
                </>
              ) : (
                <>
                  <span>Next: View Asset Allocation</span> <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 3: ASSET ALLOCATION BREAKDOWN */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 3 && wealthData && (
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="px-3 py-1 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono rounded-full">Step 3 of 6</span>
              <h3 className="text-xl md:text-2xl font-bold mt-1">Multi-Segment Asset Allocation</h3>
              <p className="text-gray-400 text-xs">How your ₹{Number(capital).toLocaleString('en-IN')} is intelligently split across asset classes.</p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-gray-400">Projected 5Y CAGR</div>
              <div className="text-lg font-bold text-green-400">{wealthData.projected_weighted_cagr}% p.a.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wealthData.portfolio_breakdown.map((item) => (
              <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-white">{item.segment}</span>
                  <span className="px-2.5 py-0.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-xs rounded-lg">
                    {item.weight_percentage}%
                  </span>
                </div>
                <div className="text-xl font-mono font-extrabold text-cyan-400">
                  {formatCurrency(item.allocated_capital)}
                </div>
                <p className="text-xs text-gray-400">{item.description}</p>
                <div className="text-[10px] text-gray-500 font-mono pt-2 border-t border-[#16162a]">
                  Historical 5Y CAGR: ~{item.avg_5yr_cagr}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Next: Select Specific Funds & ETFs</span> <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 4: SPECIFIC FUND RECOMMENDATIONS & SELECTION (CHECKBOXES) */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 4 && wealthData && (
        <div className="space-y-6 py-4">
          <div>
            <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full">Step 4 of 6</span>
            <h3 className="text-xl md:text-2xl font-bold mt-1">Select Specific Instruments & Funds</h3>
            <p className="text-gray-400 text-xs">Tick/untick the instruments you want to include in your portfolio calculation per segment.</p>
          </div>

          <div className="space-y-3">
            {wealthData.portfolio_breakdown.map((item) => {
              const isExpanded = expandedSegment === item.segment;
              const selectedCount = (selectedSegmentAssets[item.segment] || []).length;
              return (
                <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] rounded-xl overflow-hidden">
                  <div 
                    onClick={() => setExpandedSegment(isExpanded ? null : item.segment)}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#070710]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{item.segment}</span>
                      <span className="px-2 py-0.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-[10px] font-mono rounded">
                        {item.weight_percentage}% Allocation ({formatCurrency(item.allocated_capital)})
                      </span>
                      <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono rounded">
                        {selectedCount} of {item.assets.length} Selected
                      </span>
                    </div>
                    <span className="text-cyan-400 text-xs font-bold flex items-center gap-1">
                      {isExpanded ? 'Hide Instruments ▲' : 'Configure Funds ▼'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-[#1e1e30] bg-[#05050a] grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.assets.map((asset, idx) => {
                        const isChecked = (selectedSegmentAssets[item.segment] || []).includes(asset.name);
                        return (
                          <div 
                            key={asset.ticker || idx} 
                            onClick={() => handleAssetToggle(item.segment, asset.name)}
                            className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                                : 'bg-[#070710] border-[#1a1a2e] opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // Handled by parent div click
                                className="accent-purple-500 h-4 w-4 rounded cursor-pointer"
                              />
                              <div>
                                <div className="text-xs font-bold text-white">{idx + 1}. {asset.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">Type: {asset.type}</div>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-600/30 text-cyan-300 font-mono text-[10px] rounded">
                              {asset.ticker}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Next: View 5-Year Backtest Report</span> <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 5: 5-YEAR BACKTEST REPORT & RISK ANALYSIS */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 5 && wealthData && (
        <div className="space-y-6 py-4 max-w-4xl mx-auto">
          <div>
            <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full">Step 5 of 6</span>
            <h3 className="text-xl md:text-2xl font-bold mt-1">5-Year Historical Backtest Report & Risk Analysis</h3>
            <p className="text-gray-400 text-xs">Simulated performance across past market cycles and corrections.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#020205] border border-[#1e1e30] p-5 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono">Initial Capital</div>
              <div className="text-xl font-bold text-white mt-1 font-mono">{formatCurrency(wealthData.initial_capital)}</div>
            </div>
            <div className="bg-[#020205] border border-[#1e1e30] p-5 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono">Projected 5-Yr Value</div>
              <div className="text-xl font-bold text-green-400 mt-1 font-mono">{formatCurrency(wealthData.projected_5yr_value)}</div>
            </div>
            <div className="bg-[#020205] border border-[#1e1e30] p-5 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono">Max Drawdown Risk</div>
              <div className="text-xl font-bold text-red-400 mt-1 font-mono">{wealthData.estimated_max_drawdown}%</div>
            </div>
          </div>

          {wealthData.risk_warning && (
            <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-xl flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-xs text-red-300 font-mono">{wealthData.risk_warning}</p>
            </div>
          )}

          <div className="bg-[#020205] border border-[#1e1e30] p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Historical Simulation Highlights</h4>
            <ul className="space-y-2 text-xs text-gray-300 font-mono">
              <li>✅ Tested across 2021 bull run and 2022 correction cycles.</li>
              <li>✅ Zero-fee direct index fund routing minimizing expense ratios.</li>
              <li>✅ Automated asset class rebalancing threshold protection.</li>
            </ul>
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                setCurrentStep(6);
                if (onPlanCalculated) onPlanCalculated({ ...wealthData, selectedSegmentAssets });
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>View Final Results & Download Blueprint</span> <span>🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 6: FINAL RESULTS DASHBOARD HANDOFF */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 6 && wealthData && (
        <div className="text-center space-y-6 py-10">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-2xl">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Wealth Blueprint Generated Successfully!</h3>
            <p className="text-gray-400 text-xs">Your institutional-grade multi-segment allocation with custom selected instruments is ready.</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Create New Plan
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              📥 Download PDF Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WealthConfigView;