import React from 'react';

const DailyHeatmap = ({ result, withTax }) => {
  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-4">Daily profit/loss heatmap</h3>
      <div className="overflow-x-auto custom-scrollbar-horizontal pb-4 pt-16 -mt-12 w-full">
        <div className="flex items-start gap-4 min-w-max">
          <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium h-[120px] pt-1 pb-1 pr-4 border-r border-slate-200">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          {(() => {
            const sorted = [...result.Heatmap_Data].sort((a,b) => new Date(a.date) - new Date(b.date));
            const startDate = new Date(sorted[0].date);
            const endDate = new Date(sorted[sorted.length-1].date);
            
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);

            const grid = [];
            let current = new Date(startDate);
            
            while (current <= endDate || current.getDay() !== 6) {
              if (current.getDay() !== 0 && current.getDay() !== 6) { 
                const yr = current.getFullYear();
                const mo = String(current.getMonth() + 1).padStart(2, '0');
                const dy = String(current.getDate()).padStart(2, '0');
                const dateStr = `${yr}-${mo}-${dy}`;
                
                const tradeDay = sorted.find(d => d.date === dateStr);
                let finalPnl = tradeDay ? parseFloat(tradeDay.pnl || 0) : 0;
                if (tradeDay && withTax) {
                  finalPnl = tradeDay.net_pnl !== undefined ? parseFloat(tradeDay.net_pnl) : finalPnl;
                }
                
                grid.push({ date: dateStr, pnl: finalPnl, hasTrade: !!tradeDay });
              }
              current.setDate(current.getDate() + 1);
              if (current > endDate && current.getDay() === 6) break;
            }

            return (
              <div className="grid grid-rows-5 grid-flow-col gap-1.5 h-[120px]">
                {grid.map((day, idx) => {
                  const isProfit = day.pnl > 0;
                  const isLoss = day.pnl < 0;
                  let intensity = "bg-slate-200"; 
                  
                  if (day.hasTrade) {
                    if (isProfit) {
                      if (day.pnl > 10000) intensity = "bg-emerald-600";
                      else if (day.pnl > 3000) intensity = "bg-emerald-500";
                      else intensity = "bg-emerald-300";
                    } else if (isLoss) {
                      if (day.pnl < -10000) intensity = "bg-rose-600";
                      else if (day.pnl < -3000) intensity = "bg-rose-500";
                      else intensity = "bg-rose-300";
                    } else {
                      intensity = "bg-slate-400"; 
                    }
                  }

                  return (
                    <div key={idx} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm cursor-pointer relative group ${intensity}`}>
                      {day.hasTrade && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center justify-center z-50 bg-[#0F1B2D] px-3 py-1.5 rounded shadow-lg min-w-[100px]">
                          <span className="text-[10px] text-slate-300 mb-0.5">{day.date}</span>
                          <span className={`text-xs font-semibold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}₹{Math.round(day.pnl).toLocaleString('en-IN')}
                          </span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[4px] border-transparent border-t-[#0F1B2D]"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
      <div className="flex justify-end items-center mt-3 text-[11px] text-slate-500 gap-3">
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-600 rounded-sm"></div> High loss</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-300 rounded-sm"></div> Loss</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded-sm"></div> Nil</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-300 rounded-sm"></div> Profit</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-600 rounded-sm"></div> High profit</span>
      </div>
    </div>
  );
};

export default DailyHeatmap;
