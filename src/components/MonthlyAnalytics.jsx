import React from 'react';

const MonthlyAnalytics = ({ result, withTax }) => {
  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;

  // 🚨 NEW: Extracting Estimated Margin safely
  const statsSourceBase = result.Strategy_Stats || result.Metrics || result || {};
  const estimatedMargin = statsSourceBase.estimated_margin || statsSourceBase.Estimated_Margin || 0;

  const getMonthlyPnL = () => {
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const sourceData = result?.Heatmap_Data || [];
    sourceData.forEach(item => {
      if (!item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return;
      const year = d.getFullYear().toString();
      const monthStr = months[d.getMonth()];
      
      let pnl = parseFloat(item.pnl || 0);
      if (withTax) {
        pnl = item.net_pnl ? parseFloat(item.net_pnl) : pnl * 0.94;
      }
      
      if (!monthlyData[year]) {
        monthlyData[year] = {};
        months.forEach(m => { monthlyData[year][m] = 0; });
      }
      monthlyData[year][monthStr] += pnl;
    });
    return monthlyData;
  };

  const monthlyPnL = getMonthlyPnL();
  const years = Object.keys(monthlyPnL).sort((a, b) => b - a);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (years.length === 0) return null;

  const base = result.Strategy_Stats || result.Metrics || result || {};
  const modeData = withTax ? (result.NET || base.NET || {}) : (result.GROSS || base.GROSS || {});
  const statsSource = withTax
    ? (modeData.Net_Strategy_Stats || modeData.Strategy_Stats || modeData || base.NET || base.Net_Strategy_Stats || base)
    : (modeData.Gross_Strategy_Stats || modeData.Strategy_Stats || modeData || base.GROSS || base.Gross_Strategy_Stats || base);

  const yearlySource = withTax 
    ? (result.NET_Yearly_Stats || modeData.Yearly_Stats || base.Yearly_Stats || result.Yearly_Stats || {}) 
    : (result.GROSS_Yearly_Stats || modeData.Yearly_Stats || base.Yearly_Stats || result.Yearly_Stats || {});

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 md:p-6 rounded-xl flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-300">Monthly Analytics</h3>
        <span className="text-[10px] bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded font-mono font-bold">
          MODE: {withTax ? 'NET (AFTER TAX)' : 'GROSS'}
        </span>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar-horizontal border border-[#2d2d2d] rounded-lg">
        <table className="w-full min-w-[900px] text-left text-xs border-collapse">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="p-3 text-gray-400 font-semibold uppercase">Year</th>
              {months.map(m => <th key={m} className="p-3 text-center text-gray-400 font-semibold uppercase">{m}</th>)}
              <th className="p-3 text-center text-blue-400 font-semibold uppercase border-l border-[#333]">Total</th>
              <th className="p-3 text-center text-yellow-400 font-semibold uppercase border-l border-[#333]">ROI %</th>
              <th className="p-3 text-center text-gray-400 font-semibold uppercase border-l border-[#333]">Max DD</th>
              <th className="p-3 text-center text-gray-400 font-semibold uppercase border-l border-[#333]">Days MDD</th>
              <th className="p-3 text-center text-gray-400 font-semibold uppercase border-l border-[#333]">R/MDD</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year, idx) => {
              let yearlyTotal = 0;
              const yData = yearlySource?.[year] || yearlySource?.[parseInt(year)] || {};
              
              // Calculate ROI logic
              const calculateROI = (total) => {
                if (estimatedMargin <= 0) return '—';
                const roi = (total / estimatedMargin) * 100;
                return `${roi.toFixed(2)}%`;
              };

              return (
                <tr key={year} className={`border-t border-[#333] hover:bg-[#252525] ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#1e1e1e]'}`}>
                  <td className="p-3 font-bold text-gray-300">{year}</td>
                  {months.map(month => {
                    const val = monthlyPnL[year][month] || 0;
                    yearlyTotal += val;
                    const isProfit = val > 0;
                    const isLoss = val < 0;
                    let textColor = "text-gray-500";
                    if (isProfit) textColor = "text-green-400 font-semibold bg-green-500/10 rounded px-1";
                    if (isLoss) textColor = "text-red-400 font-semibold bg-red-500/10 rounded px-1";
                    return (
                      <td key={month} className="p-3 text-center">
                        <span className={textColor}>
                          {val !== 0 ? `₹${Math.round(val).toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center border-l border-[#333]">
                    <span className={`font-bold ${yearlyTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {yearlyTotal >= 0 ? '+' : ''}₹{Math.round(yearlyTotal).toLocaleString('en-IN')}
                    </span>
                  </td>
                  
                  {/* 🚨 NEW ROI COLUMN */}
                  <td className="p-3 text-center border-l border-[#333] font-bold text-yellow-500">
                    {calculateROI(yearlyTotal)}
                  </td>

                  <td className="p-3 text-center border-l border-[#333] text-red-400 font-medium">
                    {(() => {
                      const val = yData?.Max_Drawdown ?? statsSource?.['Max Drawdown'] ?? statsSource?.['Max_Drawdown'];
                      return (val !== undefined && val !== null && !isNaN(val)) ? Math.round(Number(val)) : '—';
                    })()}
                  </td>
                  <td className="p-3 text-center border-l border-[#333] text-gray-400 font-medium">
                    {yData?.Days_for_MDD ?? statsSource?.['Duration of Max Drawdown (Periods)'] ?? statsSource?.['Days_for_MDD'] ?? '—'}
                  </td>
                  <td className="p-3 text-center border-l border-[#333] font-medium">
                    {(() => {
                      const val = yData?.R_MDD ?? statsSource?.['Return / Max DD'] ?? statsSource?.['Reward_To_MDD'];
                      if (val !== undefined && val !== null && !isNaN(val)) {
                        const numVal = Number(val);
                        return <span className={numVal >= 0 ? "text-green-400" : "text-red-400"}>{numVal.toFixed(2)}</span>;
                      }
                      return <span className="text-gray-400">—</span>;
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;