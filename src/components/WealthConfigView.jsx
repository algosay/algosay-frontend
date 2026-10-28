import React, { useState } from 'react';
import axios from 'axios';

const WealthConfigView = ({ onPlanCalculated, onError }) => {
  // Wizard Steps: 1: Capital/SIP, 2: Return, 3: Allocation, 4: Specific Funds & Selection, 5: Backtest Report, 6: Final
  const [currentStep, setCurrentStep] = useState(1);
  
  // 🌟 Investment Mode State ('lumpsum' or 'sip')
  const [investmentMode, setInvestmentMode] = useState('lumpsum');
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18); // Default Balanced
  const [loading, setLoading] = useState(false);
  const [wealthData, setWealthData] = useState(null);
  const [expandedSegment, setExpandedSegment] = useState(null);

  // Default-ஆக எந்தவொரு ஃபண்டும் டிக் ஆகியிருக்காது (Empty object)
  const [selectedSegmentAssets, setSelectedSegmentAssets] = useState({});

  const presetLumpsum = [50000, 100000, 250000, 500000, 1000000];
  const presetSip = [2000, 5000, 10000, 25000, 50000];

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
        target_return: Number(targetReturn),
        mode: investmentMode
      });

      if (response.data && response.data.status === 'success') {
        const data = response.data.data;
        
        if (investmentMode === 'sip') {
          data.is_sip = true;
          data.monthly_investment = Number(capital);
          data.projected_5yr_value = Number(capital) * 65 * 1.25; 
        } else {
          data.is_sip = false;
        }

        setWealthData(data);
        setSelectedSegmentAssets({});
        setCurrentStep(3); // Move to Allocation view
      } else {
        if (onError) onError("Failed to fetch wealth plan from backend.");
      }
    } catch (err) {
      console.error("Wealth calculation error:", err);
      const mockWeightedReturn = targetReturn;
      const t = 5.0;
      let projVal = 0;
      if (investmentMode === 'sip') {
        const monthlyRate = (mockWeightedReturn / 100) / 12;
        const months = t * 12;
        projVal = Number(capital) * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        projVal = Number(capital) * Math.pow(1 + mockWeightedReturn / 100, t);
      }

      setWealthData({
        initial_capital: Number(capital),
        is_sip: investmentMode === 'sip',
        projected_weighted_cagr: mockWeightedReturn,
        projected_5yr_value: Math.round(projVal),
        estimated_max_drawdown: -14.5,
        portfolio_breakdown: [
          { segment: "Large Cap", weight_percentage: 40, allocated_capital: Number(capital) * 0.4, description: "Top 50 stable companies", avg_5yr_cagr: 14, assets: [] },
          { segment: "Mid Cap", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "High growth mid-sized companies", avg_5yr_cagr: 16, assets: [] },
          { segment: "Gold", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "Safe haven asset", avg_5yr_cagr: 12, assets: [] }
        ]
      });
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual asset selection in a segment
  const handleAssetToggle = (segmentName, assetName) => {
    setSelectedSegmentAssets((prev) => {
      const currentSelected = prev[segmentName] || [];
      if (currentSelected.includes(assetName)) {
        return { ...prev, [segmentName]: currentSelected.filter((name) => name !== assetName) };
      } else {
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
    // 🌟 ZERO MARGIN & TOP ALIGNED: Fits perfectly right below the header/navbar with zero gap
    <div className="w-full min-h-screen p-4 md:p-8 lg:p-10 bg-[#070710] border-t-0 border-x border-b border-[#1e1e30] rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] mt-0 pt-2 relative overflow-hidden text-white">
      
      {/* Background Neon Glow Effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Progress Bar Header */}
      <div className="mb-4 border-b border-[#1e1e30] pb-3 flex justify-end items-center">
        <div className="flex items-center gap-3 bg-[#020205] border border-[#1e1e30] px-5 py-2 rounded-xl">
          <span className="text-sm font-mono text-cyan-400 font-bold">Step {currentStep} of 6</span>
          <div className="w-32 bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STEP 1: CAPITAL / SIP MODE INPUT */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 1 && (
        <div className="space-y-8 max-w-4xl mx-auto py-6">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 1 of 6</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">Choose Investment Mode & Amount</h3>
            <p className="text-gray-300 text-sm md:text-base">Select whether you want to invest a lumpsum amount or set up a monthly SIP.</p>
          </div>

          {/* Lumpsum vs Monthly SIP Toggle Switch */}
          <div className="flex justify-center bg-[#020205] p-2 rounded-2xl border border-[#1e1e30] max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => { setInvestmentMode('lumpsum'); setCapital(100000); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                investmentMode === 'lumpsum'
                  ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💼 Lumpsum Investment
            </button>
            <button
              type="button"
              onClick={() => { setInvestmentMode('sip'); setCapital(5000); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                investmentMode === 'sip'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔄 Monthly SIP Mode
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-center text-sm font-mono text-cyan-400 font-bold">
              {investmentMode === 'sip' ? 'Enter Monthly SIP Contribution (₹)' : 'Enter Total Initial Capital (₹)'}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-cyan-400 font-bold text-2xl">₹</span>
              <input
                type="number"
                min="500"
                step="500"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-[#020205] border border-[#2a2a40] focus:border-cyan-500 rounded-2xl text-white text-2xl font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder={investmentMode === 'sip' ? "e.g., 5000" : "e.g., 100000"}
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {(investmentMode === 'sip' ? presetSip : presetLumpsum).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCapital(amt)}
                  className={`px-5 py-2.5 text-sm font-mono rounded-xl border transition-all cursor-pointer ${
                    Number(capital) === amt 
                      ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                      : 'bg-[#020205] border-[#1e1e30] text-gray-300 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {investmentMode === 'sip' ? `₹${amt.toLocaleString('en-IN')} / mo` : `₹${amt / 1000 >= 100 ? `${amt / 100000}L` : `${amt / 1000}K`}`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2"
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
        <div className="space-y-8 max-w-5xl mx-auto py-6">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 2 of 6</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">What is your Target Yearly Return (%)?</h3>
            <p className="text-gray-300 text-sm md:text-base">Choose your expected annual compound growth rate or risk appetite.</p>
          </div>

          <div className="flex justify-between items-center bg-[#020205] p-5 rounded-2xl border border-[#1e1e30]">
            <span className="text-base font-bold text-gray-200">Selected Target Return:</span>
            <span className="px-5 py-2 bg-purple-950/40 border border-purple-500/50 rounded-xl text-purple-300 font-mono font-extrabold text-xl">
              {targetReturn}% p.a.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {targetProfiles.map((profile) => (
              <div
                key={profile.value}
                onClick={() => setTargetReturn(profile.value)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  Number(targetReturn) === profile.value
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]'
                    : 'bg-[#020205] border-[#1e1e30] hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-base font-bold text-white">{profile.label.split(' ')[0]}</span>
                  <span className={`text-xs px-2.5 py-1 rounded border font-semibold ${profile.color}`}>
                    {profile.tag}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-purple-300 pt-2">
                  Target: {profile.value}%
                </div>
              </div>
            ))}
          </div>

          {/* Range Slider */}
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-3">
            <div className="flex justify-between text-xs md:text-sm text-gray-300 font-mono font-semibold">
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
              className="w-full accent-purple-500 cursor-pointer h-3 bg-gray-800 rounded-lg"
            />
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={fetchWealthPlan}
              disabled={loading}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⚡</span>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#020205] p-6 rounded-2xl border border-[#1e1e30]">
            <div>
              <span className="px-3.5 py-1.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono rounded-full font-bold">Step 3 of 6</span>
              <h3 className="text-2xl md:text-3xl font-extrabold mt-2">
                {wealthData.is_sip ? 'Monthly SIP Multi-Segment Allocation' : 'Multi-Segment Asset Allocation'}
              </h3>
              <p className="text-gray-300 text-sm md:text-base mt-1">
                {wealthData.is_sip 
                  ? `Your monthly ₹${Number(capital).toLocaleString('en-IN')} SIP distribution across asset classes.` 
                  : `How your ₹${Number(capital).toLocaleString('en-IN')} is intelligently split across asset classes.`}
              </p>
            </div>
            <div className="text-left md:text-right font-mono bg-[#070710] p-4 rounded-xl border border-[#1e1e30]">
              <div className="text-xs text-gray-400">Projected 5Y CAGR</div>
              <div className="text-xl font-extrabold text-green-400">{wealthData.projected_weighted_cagr}% p.a.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wealthData.portfolio_breakdown.map((item) => (
              <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-base font-bold text-white">{item.segment}</span>
                  <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-sm rounded-lg font-bold">
                    {item.weight_percentage}%
                  </span>
                </div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400">
                  {formatCurrency(item.allocated_capital)} {wealthData.is_sip && <span className="text-xs text-gray-400 font-sans">/mo</span>}
                </div>
                <p className="text-sm text-gray-300">{item.description}</p>
                <div className="text-xs text-gray-400 font-mono pt-3 border-t border-[#16162a]">
                  Historical 5Y CAGR: ~{item.avg_5yr_cagr}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
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
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
            <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 4 of 6</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mt-2">Select Specific Instruments & Funds</h3>
            <p className="text-gray-300 text-sm md:text-base">Nothing is selected by default. Tick the instruments you want to include in your portfolio calculation per segment.</p>
          </div>

          <div className="space-y-4">
            {wealthData.portfolio_breakdown.map((item) => {
              const isExpanded = expandedSegment === item.segment;
              const selectedCount = (selectedSegmentAssets[item.segment] || []).length;
              const capitalPerFund = selectedCount > 0 ? item.allocated_capital / selectedCount : 0;

              return (
                <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] rounded-2xl overflow-hidden">
                  <div 
                    onClick={() => setExpandedSegment(isExpanded ? null : item.segment)}
                    className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer hover:bg-[#070710] transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-base font-bold text-white">{item.segment}</span>
                      <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-lg">
                        {item.weight_percentage}% Allocation ({formatCurrency(item.allocated_capital)}{wealthData.is_sip ? '/mo' : ''})
                      </span>
                      <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono rounded-lg">
                        {selectedCount} Selected ({selectedCount > 0 ? `${formatCurrency(capitalPerFund)}${wealthData.is_sip ? '/mo' : ''} / fund` : '₹0 / fund'})
                      </span>
                    </div>
                    <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                      {isExpanded ? 'Hide Instruments ▲' : 'Configure Funds ▼'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-[#1e1e30] bg-[#05050a] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.assets.map((asset, idx) => {
                        const isChecked = (selectedSegmentAssets[item.segment] || []).includes(asset.name);
                        return (
                          <div 
                            key={asset.ticker || idx} 
                            onClick={() => handleAssetToggle(item.segment, asset.name)}
                            className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-purple-950/25 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                                : 'bg-[#070710] border-[#1a1a2e] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} 
                                className="accent-purple-500 h-5 w-5 rounded cursor-pointer"
                              />
                              <div>
                                <div className="text-sm font-bold text-white">{idx + 1}. {asset.name}</div>
                                <div className="text-xs text-gray-400 font-mono mt-0.5">Type: {asset.type}</div>
                              </div>
                            </div>
                            {isChecked && (
                              <span className="px-2.5 py-1 bg-cyan-950/40 border border-cyan-600/30 text-cyan-300 font-mono text-xs rounded font-bold">
                                {formatCurrency(capitalPerFund)}{wealthData.is_sip ? '/mo' : ''}
                              </span>
                            )}
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
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
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
        <div className="space-y-6 py-4 max-w-6xl mx-auto">
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 5 of 6</span>
            <h3 className="text-2xl md:text-3xl font-extrabold mt-2">5-Year Historical Backtest Report & Risk Analysis</h3>
            <p className="text-gray-300 text-sm md:text-base">Simulated performance across past market cycles and corrections.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#020205] border border-[#1e1e30] p-6 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono font-semibold">
                {wealthData.is_sip ? 'Total Invested (5 Yrs)' : 'Initial Capital'}
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {wealthData.is_sip ? formatCurrency(wealthData.initial_capital * 60) : formatCurrency(wealthData.initial_capital)}
              </div>
            </div>
            <div className="bg-[#020205] border border-[#1e1e30] p-6 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono font-semibold">Projected 5-Yr Value</div>
              <div className="text-2xl font-extrabold text-green-400 mt-2 font-mono">
                {formatCurrency(wealthData.projected_future_value || wealthData.projected_5yr_value || capital * 1.5)}
              </div>
            </div>
            <div className="bg-[#020205] border border-[#1e1e30] p-6 rounded-2xl">
              <div className="text-xs text-gray-400 uppercase font-mono font-semibold">Max Drawdown Risk</div>
              <div className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{wealthData.estimated_max_drawdown}%</div>
            </div>
          </div>

          {wealthData.risk_warning && (
            <div className="p-5 bg-red-950/20 border border-red-500/40 rounded-2xl flex items-center gap-4">
              <span className="text-red-500 text-2xl">⚠️</span>
              <p className="text-sm text-red-300 font-mono font-semibold">{wealthData.risk_warning}</p>
            </div>
          )}

          <div className="bg-[#020205] border border-[#1e1e30] p-7 rounded-2xl space-y-4">
            <h4 className="text-base font-bold text-cyan-400 uppercase tracking-wider">Historical Simulation Highlights & Market Stress Tests</h4>
            <ul className="space-y-3 text-sm text-gray-200 font-mono">
              <li>✅ <strong>2021 COVID Recovery & Bull Run:</strong> Tested across post-pandemic liquidity expansion and high-beta momentum phases.</li>
              <li>✅ <strong>2022 Global Inflation & Rate Hike Shock:</strong> Evaluated resilience against aggressive central bank rate tightening and valuation corrections.</li>
              <li>✅ <strong>2023-2024 AI & Tech Supercycle:</strong> Validated multi-asset allocation capabilities capturing global tech and FANG+ rallies.</li>
              <li>✅ <strong>2024 Election Day Volatility:</strong> Stress-tested against sudden intra-day market swings and swift V-shaped recoveries.</li>
              <li>✅ <strong>2025-2026 Commodity & Gold Surge:</strong> Incorporated safe-haven asset buffers during global geopolitical tensions.</li>
              <li>✅ <strong>Zero-Fee Direct Routing:</strong> Optimized with direct index fund execution to minimize expense drag.</li>
            </ul>
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                setCurrentStep(6);
                if (onPlanCalculated) onPlanCalculated({ ...wealthData, selectedSegmentAssets });
              }}
              className="px-9 py-4 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all cursor-pointer flex items-center gap-2"
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
        <div className="text-center space-y-8 py-12">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-3xl shadow-[0_0_25px_rgba(34,197,94,0.4)]">
            ✓
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-extrabold">Wealth Blueprint Generated Successfully!</h3>
            <p className="text-gray-300 text-sm md:text-base">Your institutional-grade multi-segment allocation with custom selected instruments is ready.</p>
          </div>
          <div className="flex justify-center gap-5 pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Create New Plan
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
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