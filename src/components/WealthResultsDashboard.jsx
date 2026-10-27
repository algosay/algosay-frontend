import React, { useState } from 'react';

const WealthResultsDashboard = ({ wealthData, onModifyPlan }) => {
  const [expandedSegment, setExpandedSegment] = useState(null);
  
  // 🌟 Time Horizon State: '1m', '3m', '6m', '1yr', '3yr', '5yr'
  const [selectedHorizon, setSelectedHorizon] = useState('1yr');

  if (!wealthData) return null;

  const {
    initial_capital = 100000,
    target_return_requested = 18,
    estimated_max_drawdown = 0,
    risk_warning = '',
    portfolio_breakdown = [],
    selectedSegmentAssets = {},
    is_sip = false
  } = wealthData;

  // 🧮 Dynamically calculate weighted return based on selectedHorizon and user selected assets
  let currentWeightedReturn = 0;
  portfolio_breakdown.forEach((item) => {
    const weight = item.weight_percentage / 100;
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
    // initial_capital represents monthly installment (P) for SIP mode
    const monthlyRate = (currentWeightedReturn / 100) / 12;
    if (monthlyRate === 0) {
      projectedValue = initial_capital * months;
    } else {
      projectedValue = initial_capital * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    totalInvestedCapital = initial_capital * months;
  } else {
    // Lumpsum calculation
    projectedValue = t <= 1.0 
      ? initial_capital * (1 + (currentWeightedReturn / 100) * t)
      : initial_capital * Math.pow((1 + currentWeightedReturn / 100), t);
    totalInvestedCapital = initial_capital;
  }

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
    // 🌟 w-full min-h-screen for full-screen layout and clear visibility
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

      {/* TIME HORIZON SELECTOR TABS (1m, 3m, 6m, 1yr, 3yr, 5yr) */}
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

      {/* RISK WARNING BANNER */}
      {risk_warning && (
        <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-xl flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-xs text-red-300 font-mono">{risk_warning}</p>
        </div>
      )}

      {/* PORTFOLIO SEGMENTS DRILLDOWN LIST */}
      <div className="bg-[#070710] border border-[#1e1e30] p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🧬</span> {is_sip ? 'Monthly SIP' : 'Multi-Segment'} Breakdown & Selected Asset Performance ({selectedHorizon.toUpperCase()})
          </h3>
          <span className="text-xs text-gray-400 font-mono">Click segment to inspect individual instruments</span>
        </div>

        <div className="space-y-3">
          {portfolio_breakdown.map((item) => {
            const isExpanded = expandedSegment === item.segment;
            
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

            // Per-asset capital allocation
            const segmentAllocated = is_sip ? (initial_capital * (item.weight_percentage / 100)) : item.allocated_capital;
            const capitalPerAsset = displayedAssets.length > 0 ? segmentAllocated / displayedAssets.length : 0;

            return (
              <div 
                key={item.segment}
                className="bg-[#020205] border border-[#1e1e30] rounded-xl overflow-hidden transition-all"
              >
                {/* Segment Main Header */}
                <div 
                  onClick={() => toggleSegment(item.segment)}
                  className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-[#070710]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.segment}</span>
                      <span className="px-2 py-0.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-[10px] font-mono rounded">
                        {item.weight_percentage}% Weight ({formatCurrency(segmentAllocated)}{is_sip ? '/mo' : ''})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-cyan-400">Selected: {displayedAssets.length} Instruments</div>
                      <div className="text-[10px] text-gray-400">
                        Return ({selectedHorizon.toUpperCase()}): <span className="text-green-400 font-bold">{segmentReturn.toFixed(2)}%</span>
                      </div>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Selected Assets List with 1m, 3m, 6m, 1yr, 3yr, 5yr Returns */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#1e1e30] bg-[#05050a] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        🛡️ Allocated Capital per Instrument ({formatCurrency(capitalPerAsset)}{is_sip ? '/mo' : ''} each for {displayedAssets.length} funds)
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Direct Plans (0% Commission)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {displayedAssets.map((asset, idx) => {
                        const assetReturns = asset.returns || {};
                        return (
                          <div 
                            key={asset.ticker || asset.symbol || idx}
                            className="p-3 bg-[#070710] border border-[#1a1a2e] rounded-xl flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-bold text-white">{idx + 1}. {asset.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">Type: {asset.type} | Allocation: {formatCurrency(capitalPerAsset)}{is_sip ? '/mo' : ''}</div>
                              </div>
                              <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-600/30 text-cyan-300 font-mono text-[10px] rounded">
                                {asset.ticker || asset.symbol || 'N/A'}
                              </span>
                            </div>

                            {/* Individual Returns Badges (1m, 3m, 6m, 1yr, 3yr, 5yr) */}
                            <div className="grid grid-cols-6 gap-1 pt-2 border-t border-[#16162a] text-center font-mono">
                              {['1m', '3m', '6m', '1yr', '3yr', '5yr'].map((h) => {
                                const val = assetReturns[h];
                                const isSelectedTab = selectedHorizon === h;
                                return (
                                  <div 
                                    key={h} 
                                    className={`p-1 rounded text-[9px] border ${
                                      isSelectedTab 
                                        ? 'bg-purple-950/40 border-purple-500 text-purple-300 font-bold' 
                                        : 'bg-[#020205] border-[#1e1e30] text-gray-400'
                                    }`}
                                  >
                                    <div className="text-[8px] uppercase text-gray-500">{h}</div>
                                    <div className={val >= 0 ? 'text-green-400' : 'text-red-400'}>
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