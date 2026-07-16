import React from 'react';

const DailyHeatmap = ({ result, withTax }) => {
  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 md:p-6 rounded-xl overflow-hidden">
      <h3 className="text-sm font-bold text-gray-300 mb-6">Daily Profit/Loss Heatmap</h3>
      <div className="overflow-x-auto custom-scrollbar-horizontal pb-4 pt-16 -mt-12 w-full">
        <div className="flex items-start gap-4 min-w-max">
          <div className="flex flex-col justify-between text-[10px] text-gray-500 font-bold uppercase h-[120px] pt-1 pb-1 pr-4 border-r border-[#333]">
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
                  let intensity = "bg-[#2a2a2a]"; 
                  
                  if (day.hasTrade) {
                    if (isProfit) {
                      if (day.pnl > 10000) intensity = "bg-green-500";
                      else if (day.pnl > 3000) intensity = "bg-green-600";
                      else intensity = "bg-green-800";
                    } else if (isLoss) {
                      if (day.pnl < -10000) intensity = "bg-red-500";
                      else if (day.pnl < -3000) intensity = "bg-red-600";
                      else intensity = "bg-red-800";
                    } else {
                      intensity = "bg-gray-500"; 
                    }
                  }

                  return (
                    <div key={idx} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm cursor-pointer relative group ${intensity}`}>
                      {day.hasTrade && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center justify-center z-50 bg-[#2d2d2d] border border-gray-600 px-3 py-1.5 rounded shadow-lg min-w-[100px]">
                          <span className="text-[10px] text-gray-400 mb-0.5">{day.date}</span>
                          <span className={`text-xs font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : ''}₹{Math.round(day.pnl).toLocaleString('en-IN')}
                          </span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[4px] border-transparent border-t-[#2d2d2d]"></div>
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
      <div className="flex justify-end items-center mt-4 text-[10px] text-gray-400 gap-3">
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> High Loss</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-800 rounded-sm"></div> Loss</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#2a2a2a] rounded-sm"></div> Nil</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-800 rounded-sm"></div> Profit</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> High Profit</span>
      </div>
    </div>
  );
};

export default DailyHeatmap;