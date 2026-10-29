import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// 🌟 Custom Tooltip Component to fix black/empty box problem in dark theme
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#020205] border border-cyan-500/40 p-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white text-xs font-mono">
        <p className="font-bold text-cyan-400 mb-1">{data.name}</p>
        <p className="text-green-400 font-bold">Return Contribution: +{data.value}%</p>
      </div>
    );
  }
  return null;
};

const WealthResultsDashboard = ({ wealthData, onModifyPlan }) => {
  // 🌟 FIX: ALL HOOKS MUST BE DECLARED AT THE VERY TOP BEFORE ANY CONDITIONAL RETURN!
  const [expandedSegment, setExpandedSegment] = useState(null);
  const [selectedHorizon, setSelectedHorizon] = useState('1yr');

  // Extract properties safely or fallback
  const initial_capital = wealthData?.initial_capital ?? 100000;
  const target_return_requested = wealthData?.target_return_requested ?? 18;
  const estimated_max_drawdown = wealthData?.estimated_max_drawdown ?? 0;
  const risk_warning = wealthData?.risk_warning ?? '';
  const portfolio_breakdown = wealthData?.portfolio_breakdown ?? [];
  const selectedSegmentAssets = wealthData?.selectedSegmentAssets ?? {};
  const is_sip = wealthData?.is_sip ?? false;

  // 🌟 Interactive Weights State for Rebalancing Tool (Hook placed at top)
  const [customWeights, setCustomWeights] = useState(
    portfolio_breakdown.reduce((acc, item) => {
      acc[item.segment] = item.weight_percentage;
      return acc;
    }, {})
  );

  // Now conditional check can safely happen AFTER hooks
  if (!wealthData) return null;

  // Handle Weight Slider Change
  const handleWeightChange = (segmentName, newWeight) => {
    setCustomWeights(prev => ({
      ...prev,
      [segmentName]: Number(newWeight)
    }));
  };

  // Check total weight percentage
  const totalCustomWeight = Object.values(customWeights).reduce((a, b) => a + b, 0);

  // Neon Colors for Performance Donut Chart Slices
  const COLORS = ['#06b6d4', '#10b981', '#a855f7', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

  // 🧮 Dynamically calculate weighted return based on selectedHorizon, customWeights and user selected assets
  let currentWeightedReturn = 0;
  portfolio_breakdown.forEach((item) => {
    const weight = (customWeights[item.segment] !== undefined ? customWeights[item.segment] : item.weight_percentage) / 100;
    const userChosenNames = selectedSegmentAssets?.[item.segment] || [];
    const chosenAssets = item.assets ? item.assets.filter(asset => userChosenNames.includes(asset.name)) : (item.selected_assets || []);
    
    if (chosenAssets.length > 0) {
      const validReturns = chosenAssets
        .map(ast => (ast.returns ? ast.returns[selectedHorizon] : ast.return))
        .filter(val => val !== undefined && val !== null);
      
      const avgAssetReturn = validReturns.length > 0 
        ? validReturns.reduce((acc, v) => acc + v, 0) / validReturns.length 
        : (item.period_return || 0);
      
      currentWeightedReturn += avgAssetReturn * weight;
    } else {
      currentWeightedReturn += (item.period_return || 0) * weight;
    }
  });

  // Time mapping in years and months
  const yearsMap = { '1m': 0.083, '3m': 0.25, '6m': 0.5, '1yr': 1.0, '3yr': 3.0, '5yr': 5.0 };
  const t = yearsMap[selectedHorizon] || 1.0;
  const months = Math.round(t * 12);
  
  // 🧮 Projected Value calculation (Lumpsum vs Monthly SIP)
  let projectedValue = 0;
  let totalInvestedCapital = initial_capital;

  if (is_sip) {
    const monthlyRate = (currentWeightedReturn / 100) / 12;
    if (monthlyRate === 0) {
      projectedValue = initial_capital * months;
    } else {
      projectedValue = initial_capital * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    totalInvestedCapital = initial_capital * months;
  } else {
    projectedValue = t <= 1.0 
      ? initial_capital * (1 + (currentWeightedReturn / 100) * t)
      : initial_capital * Math.pow((1 + currentWeightedReturn / 100), t);
    totalInvestedCapital = initial_capital;
  }

  // 🌟 Prepare Data for Performance Donut Chart (Calculates individual segment return % for chart distribution)
  const performanceDonutData = portfolio_breakdown.map((item) => {
    const userChosenNames = selectedSegmentAssets?.[item.segment] || [];
    const chosenAssets = item.assets ? item.assets.filter(asset => userChosenNames.includes(asset.name)) : (item.selected_assets || []);
    
    let segRet = item.period_return || 15;
    if (chosenAssets.length > 0) {
      const validReturns = chosenAssets
        .map(ast => (ast.returns ? ast.returns[selectedHorizon] : ast.return))
        .filter(val => val !== undefined && val !== null);
      if (validReturns.length > 0) {
        segRet = validReturns.reduce((acc, v) => acc + v, 0) / validReturns.length;
      }
    }
    return {
      name: item.segment,
      value: Math.max(Number(segRet.toFixed(2)), 1) // Ensure positive value for pie slice representation
    };
  });

  const toggleSegment = (segmentName) => {
    setExpandedSegment(expandedSegment === segmentName ? null : segmentName);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 lg:p-12 space-y-6 text-white bg-[#070710]">
      
      {/* TOP NAVIGATION / BACK BUTTON */}
      <div className="flex justify-between items-center bg-[#070710] border border-[#1e1e30] p-4 rounded-2xl">
        <button
          onClick={onModifyPlan}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <span>←</span> Modify Input Plan
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
        >
          <span>📥</span> Download Wealth Blueprint (PDF)
        </button>
      </div>

      {/* TIME HORIZON SELECTOR TABS */}
      <div className="bg-[#070710] border border-[#1e1e30] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-mono text-cyan-400">📊 Select Performance Time Horizon:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { key: '1m', label: '1 Month' },
            { key: '3m', label: '3 Months' },
            { key: '6m', label: '6 Months' },
            { key: '1yr', label: '1 Year' },
            { key: '3yr', label: '3 Years' },
            { key: '5yr', label: '5 Years (CAGR)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedHorizon(tab.key)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                selectedHorizon === tab.key
                  ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-[#020205] border-[#1e1e30] text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">
            {is_sip ? `Total Invested (${selectedHorizon.toUpperCase()})` : 'Initial Capital'}
          </div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{formatCurrency(totalInvestedCapital)}</div>
          <div className="text-[10px] text-cyan-400 mt-1">
            {is_sip ? `Monthly SIP: ${formatCurrency(initial_capital)}/mo` : `Target: ${target_return_requested}% p.a.`}
          </div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Projected Value ({selectedHorizon.toUpperCase()})</div>
          <div className="text-2xl font-extrabold text-green-400 mt-1 font-mono">
            {formatCurrency(projectedValue)}
          </div>
          <div className="text-[10px] text-green-500 mt-1">{is_sip ? 'SIP Compounding Growth' : 'Compound Growth'}</div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Weighted Return ({selectedHorizon.toUpperCase()})</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">{currentWeightedReturn.toFixed(2)}%</div>
          <div className="text-[10px] text-purple-300 mt-1">Expected Return</div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Max Drawdown Risk</div>
          <div className="text-2xl font-extrabold text-red-400 mt-1 font-mono">{estimated_max_drawdown}%</div>
          <div className="text-[10px] text-red-300 mt-1">Worst-case Correction</div>
        </div>

      </div>

      {/* 🌟 PERFORMANCE DONUT CHART WITH ANIMATION & SIDE-BY-SIDE INFO & REBALANCE SLIDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#070710] border border-[#1e1e30] p-6 rounded-2xl">
        
        {/* Column 1 & 2: Animated Performance Donut Chart + Side-by-Side Breakdown */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#020205] p-5 rounded-2xl border border-[#1e1e30]">
          
          {/* Animated Performance Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">📈 Performance Donut ({selectedHorizon.toUpperCase()})</h4>
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {performanceDonutData.map((entry, index) => (
                      <Cell key={`cell-perf-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] font-mono font-bold text-green-400 mt-1">
              Weighted Return: +{currentWeightedReturn.toFixed(2)}% p.a.
            </div>
          </div>

          {/* Side-by-Side Performance Legend / Information */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-1">📋 Return Share Breakdown</h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {portfolio_breakdown.map((item, index) => {
                const userChosenNames = selectedSegmentAssets?.[item.segment] || [];
                const displayedAssets = item.assets 
                  ? item.assets.filter(asset => userChosenNames.includes(asset.name))
                  : (item.selected_assets || []);

                const validReturns = displayedAssets
                  .map(ast => (ast.returns ? ast.returns[selectedHorizon] : ast.return))
                  .filter(val => val !== undefined && val !== null);
                
                const segmentReturn = validReturns.length > 0 
                  ? validReturns.reduce((acc, v) => acc + v, 0) / validReturns.length 
                  : (item.period_return || 15);

                const dotColor = COLORS[index % COLORS.length];

                return (
                  <div key={item.segment} className="p-2.5 bg-[#070710] border border-[#1e1e30] rounded-xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }}></span>
                      <span className="font-bold text-white truncate max-w-[110px]">{item.segment}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold">+{segmentReturn.toFixed(1)}%</span>
                      <div className="text-[10px] text-gray-400">{selectedHorizon.toUpperCase()} Return</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Column 3: One-Click Rebalance Sliders */}
        <div className="space-y-3 bg-[#020205] p-5 rounded-2xl border border-[#1e1e30] flex flex-col justify-center">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">🎚️ Rebalance Sliders</h4>
          <p className="text-[11px] text-gray-400">Drag sliders to adjust segment weight dynamically.</p>
          
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-2">
            {portfolio_breakdown.map((item) => {
              const currentW = customWeights[item.segment] !== undefined ? customWeights[item.segment] : item.weight_percentage;
              return (
                <div key={item.segment} className="bg-[#070710] p-2.5 rounded-xl border border-[#1e1e30] space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.segment}</span>
                    <span className="text-cyan-400 font-mono">{currentW}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={currentW}
                    onChange={(e) => handleWeightChange(item.segment, e.target.value)}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                  />
                </div>
              );
            })}
          </div>
          <div className={`text-[10px] font-mono font-bold text-center ${totalCustomWeight === 100 ? 'text-green-400' : 'text-orange-400'}`}>
            Total Weight: {totalCustomWeight}% {totalCustomWeight !== 100 && '(Target: 100%)'}
          </div>
        </div>

      </div>

      {/* RISK WARNING BANNER */}
      {risk_warning && (
        <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-xl flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-xs text-red-300 font-mono">{risk_warning}</p>
        </div>
      )}

      {/* PORTFOLIO SEGMENTS DRILLDOWN LIST (Enhanced with Larger Cards & Amount Display) */}
      <div className="bg-[#070710] border border-[#1e1e30] p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <span>🧬</span> {is_sip ? 'Monthly SIP' : 'Multi-Segment'} Breakdown & Selected Asset Performance ({selectedHorizon.toUpperCase()})
          </h3>
          <span className="text-xs text-cyan-400 font-mono">Click segment to inspect individual instruments</span>
        </div>

        <div className="space-y-4">
          {portfolio_breakdown.map((item) => {
            const isExpanded = expandedSegment === item.segment;
            const currentW = customWeights[item.segment] !== undefined ? customWeights[item.segment] : item.weight_percentage;
            
            // Filter assets based on user selection in Step 4
            const userChosenAssetNames = selectedSegmentAssets?.[item.segment] || [];
            const displayedAssets = item.assets 
              ? item.assets.filter(asset => userChosenAssetNames.includes(asset.name))
              : (item.selected_assets || []);

            // Calculate segment return for selected horizon
            const validReturns = displayedAssets
              .map(ast => (ast.returns ? ast.returns[selectedHorizon] : ast.return))
              .filter(val => val !== undefined && val !== null);
            
            const segmentReturn = validReturns.length > 0 
              ? validReturns.reduce((acc, v) => acc + v, 0) / validReturns.length 
              : 0;

            // Per-asset capital allocation amount calculation
            const segmentAllocated = initial_capital * (currentW / 100);
            const capitalPerAsset = displayedAssets.length > 0 ? segmentAllocated / displayedAssets.length : 0;

            return (
              <div 
                key={item.segment}
                className="bg-[#020205] border border-[#2a2a40] rounded-2xl overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                {/* Segment Main Header (Enlarged & Clear) */}
                <div 
                  onClick={() => toggleSegment(item.segment)}
                  className="p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-[#080814] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-base md:text-lg font-extrabold text-white">{item.segment}</span>
                      <span className="px-3 py-1 bg-purple-950/60 border border-purple-500/50 text-purple-300 text-xs font-mono rounded-xl font-bold">
                        {currentW}% Weight ({formatCurrency(segmentAllocated)}{is_sip ? '/mo' : ''})
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-300">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#1e1e30]">
                    <div className="text-right font-mono">
                      <div className="text-sm font-extrabold text-cyan-400">Selected: {displayedAssets.length} Instruments</div>
                      <div className="text-xs text-gray-300 mt-0.5">
                        Return: <span className="text-green-400 font-extrabold">+{segmentReturn.toFixed(2)}%</span> ({selectedHorizon.toUpperCase()})
                      </div>
                    </div>
                    <span className={`text-cyan-400 font-bold transition-transform duration-300 text-base ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Selected Assets List with Clear Amount & Return Badges */}
                {isExpanded && (
                  <div className="p-5 md:p-6 border-t border-[#2a2a40] bg-[#05050f] space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#090916] p-3.5 rounded-xl border border-[#222238]">
                      <span className="text-xs md:text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        🛡️ Allocated Capital: <span className="text-white font-mono">{formatCurrency(capitalPerAsset)}{is_sip ? '/mo' : ''}</span> each for {displayedAssets.length} funds
                      </span>
                      <span className="text-xs text-gray-400 font-mono">Direct Plans (0% Commission)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayedAssets.map((asset, idx) => {
                        const assetReturns = asset.returns || {};
                        return (
                          <div 
                            key={asset.ticker || asset.symbol || idx}
                            className="p-4 bg-[#070710] border border-[#202036] rounded-xl flex flex-col gap-3 shadow-inner"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <div className="text-sm font-bold text-white leading-snug">{idx + 1}. {asset.name}</div>
                                <div className="text-xs text-cyan-400/90 font-mono mt-0.5">
                                  Type: {asset.type} | <span className="text-green-300 font-bold">Amt: {formatCurrency(capitalPerAsset)}{is_sip ? '/mo' : ''}</span>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-600/40 text-cyan-300 font-mono text-xs rounded-lg font-bold flex-shrink-0">
                                {asset.ticker || asset.symbol || 'N/A'}
                              </span>
                            </div>

                            {/* Individual Returns Badges (1m, 3m, 6m, 1yr, 3yr, 5yr) */}
                            <div className="grid grid-cols-6 gap-1 pt-2.5 border-t border-[#1a1a2e] text-center font-mono">
                              {['1m', '3m', '6m', '1yr', '3yr', '5yr'].map((h) => {
                                const val = assetReturns[h];
                                const isSelectedTab = selectedHorizon === h;
                                return (
                                  <div 
                                    key={h} 
                                    className={`p-1.5 rounded-lg text-[10px] border ${
                                      isSelectedTab 
                                        ? 'bg-purple-900/55 border-purple-400 text-purple-200 font-bold shadow-[0_0_8px_rgba(168,85,247,0.4)]' 
                                        : 'bg-[#020205] border-[#1e1e30] text-gray-300'
                                    }`}
                                  >
                                    <div className="text-[9px] uppercase text-gray-400">{h}</div>
                                    <div className={`font-bold ${val >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {val !== undefined && val !== null ? `${val}%` : 'N/A'}
                                    </div>
                                  </div>
                                );
                              })}
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

      </div>

    </div>
  );
};

export default WealthResultsDashboard;