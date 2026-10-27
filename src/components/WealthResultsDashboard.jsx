import React, { useState } from 'react';

const WealthResultsDashboard = ({ wealthData, onModifyPlan }) => {
  const [expandedSegment, setExpandedSegment] = useState(null);

  if (!wealthData) return null;

  const {
    initial_capital,
    target_return_requested,
    projected_weighted_cagr,
    estimated_max_drawdown,
    projected_5yr_value,
    risk_warning,
    portfolio_breakdown,
    selectedSegmentAssets // 🌟 User selected assets from Step 4
  } = wealthData;

  const toggleSegment = (segmentName) => {
    setExpandedSegment(expandedSegment === segmentName ? null : segmentName);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadPDF = () => {
    window.print(); // Triggers browser print/save as PDF layout
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-white">
      
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

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Initial Capital</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{formatCurrency(initial_capital)}</div>
          <div className="text-[10px] text-cyan-400 mt-1">Target: {target_return_requested}% p.a.</div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Projected 5-Yr Value</div>
          <div className="text-2xl font-extrabold text-green-400 mt-1 font-mono">{formatCurrency(projected_5yr_value)}</div>
          <div className="text-[10px] text-green-500 mt-1">Compound Growth (CAGR)</div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-600/10 rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Weighted 5-Yr CAGR</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">{projected_weighted_cagr}%</div>
          <div className="text-[10px] text-purple-300 mt-1">Expected Annual Return</div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/10 rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-[#070710] border border-[#1e1e30] p-5 rounded-2xl relative overflow-hidden">
          <div className="text-gray-400 text-xs font-mono uppercase">Max Drawdown Risk</div>
          <div className="text-2xl font-extrabold text-red-400 mt-1 font-mono">{estimated_max_drawdown}%</div>
          <div className="text-[10px] text-red-300 mt-1">Worst-case Correction</div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rounded-bl-full pointer-events-none"></div>
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
            <span>🧬</span> Multi-Segment Portfolio Breakdown & Selected Asset Allocations
          </h3>
          <span className="text-xs text-gray-400 font-mono">Click segment to view your selected instruments</span>
        </div>

        <div className="space-y-3">
          {portfolio_breakdown.map((item) => {
            const isExpanded = expandedSegment === item.segment;
            
            // Filter assets based on user selection in Step 4 (if available)
            const userChosenAssetNames = selectedSegmentAssets?.[item.segment];
            const displayedAssets = userChosenAssetNames 
              ? item.assets.filter(asset => userChosenAssetNames.includes(asset.name))
              : item.assets;

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
                        {item.weight_percentage}% Weight
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-cyan-400">{formatCurrency(item.allocated_capital)}</div>
                      <div className="text-[10px] text-gray-500">5Y CAGR: ~{item.avg_5yr_cagr}%</div>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Selected Assets List */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#1e1e30] bg-[#05050a] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        🛡️ Selected Instruments & Funds for {item.segment}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Direct Plans (0% Commission)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {displayedAssets.map((asset, idx) => (
                        <div 
                          key={asset.ticker || idx}
                          className="p-2.5 bg-[#070710] border border-[#1a1a2e] rounded-lg flex justify-between items-center"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white">{idx + 1}. {asset.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">Type: {asset.type}</div>
                          </div>
                          <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-600/30 text-cyan-300 font-mono text-[10px] rounded">
                            {asset.ticker}
                          </span>
                        </div>
                      ))}
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