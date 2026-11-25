import React from 'react';

const MonthlyAnalytics = ({ result, withTax }) => {
  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;

  // 🚨 Extracting Estimated Margin safely
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
    <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-xl flex flex-col shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-[#0F1B2D]">Monthly analytics</h3>
        <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
          {withTax ? 'NET (AFTER TAX)' : 'GROSS'}
        </span>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar-horizontal border border-slate-200 rounded-lg">
        <table className="w-full min-w-[900px] text-left text-xs border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2.5 text-slate-500 font-semibold">Year</th>
              {months.map(m => <th key={m} className="p-2.5 text-center text-slate-500 font-semibold">{m}</th>)}
              <th className="p-2.5 text-center text-indigo-600 font-semibold border-l border-slate-200">Total</th>
              <th className="p-2.5 text-center text-amber-600 font-semibold border-l border-slate-200">ROI %</th>
              <th className="p-2.5 text-center text-slate-500 font-semibold border-l border-slate-200">Max DD</th>
              <th className="p-2.5 text-center text-slate-500 font-semibold border-l border-slate-200">Days MDD</th>
              <th className="p-2.5 text-center text-slate-500 font-semibold border-l border-slate-200">R/MDD</th>
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
                <tr key={year} className={`border-t border-slate-200 hover:bg-indigo-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                  <td className="p-2.5 font-semibold text-[#0F1B2D]">{year}</td>
                  {months.map(month => {
                    const val = monthlyPnL[year][month] || 0;
                    yearlyTotal += val;
                    const isProfit = val > 0;
                    const isLoss = val < 0;
                    let textColor = "text-slate-400";
                    if (isProfit) textColor = "text-emerald-700 font-semibold bg-emerald-50 rounded px-1";
                    if (isLoss) textColor = "text-rose-700 font-semibold bg-rose-50 rounded px-1";
                    return (
                      <td key={month} className="p-2.5 text-center font-mono">
                        <span className={textColor}>
                          {val !== 0 ? `₹${Math.round(val).toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-2.5 text-center border-l border-slate-200 font-mono">
                    <span className={`font-semibold ${yearlyTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {yearlyTotal >= 0 ? '+' : ''}₹{Math.round(yearlyTotal).toLocaleString('en-IN')}
                    </span>
                  </td>
                  
                  {/* ROI COLUMN */}
                  <td className="p-2.5 text-center border-l border-slate-200 font-semibold font-mono text-amber-600">
                    {calculateROI(yearlyTotal)}
                  </td>

                  <td className="p-2.5 text-center border-l border-slate-200 text-rose-600 font-medium font-mono">
                    {(() => {
                      const val = yData?.Max_Drawdown ?? statsSource?.['Max Drawdown'] ?? statsSource?.['Max_Drawdown'];
                      return (val !== undefined && val !== null && !isNaN(val)) ? Math.round(Number(val)) : '—';
                    })()}
                  </td>
                  <td className="p-2.5 text-center border-l border-slate-200 text-slate-600 font-medium font-mono">
                    {yData?.Days_for_MDD ?? statsSource?.['Duration of Max Drawdown (Periods)'] ?? statsSource?.['Days_for_MDD'] ?? '—'}
                  </td>
                  <td className="p-2.5 text-center border-l border-slate-200 font-medium font-mono">
                    {(() => {
                      const val = yData?.R_MDD ?? statsSource?.['Return / Max DD'] ?? statsSource?.['Reward_To_MDD'];
                      if (val !== undefined && val !== null && !isNaN(val)) {
                        const numVal = Number(val);
                        return <span className={numVal >= 0 ? "text-emerald-600" : "text-rose-600"}>{numVal.toFixed(2)}</span>;
                      }
                      return <span className="text-slate-400">—</span>;
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
