import React from 'react';

const PerformanceStats = ({ result, withTax }) => {
  // 1. Console-la data epdi varuthu nu check panna (Debugging)
  console.log("BACKEND DATA RECEIVED:", result);

  // 2. Data varalana loading kaata
  if (!result) {
    return <div className="p-4 text-slate-500 font-medium">Loading metrics...</div>;
  }

  // 🚨 Extract Strategy_Stats from the result object securely
  const strategyStats = result.Strategy_Stats || {};

  // 3. Mismatch aana error kaata
  if (!strategyStats.NET && !strategyStats.GROSS) {
    return (
      <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
        <p className="font-semibold mb-1">Data structure mismatch</p>
        <p className="text-sm">Backend is not sending 'NET' and 'GROSS' keys inside Strategy_Stats.</p>
      </div>
    );
  }

  // 🚨 SIMPLE SOURCE SELECTION (Targeting the nested Strategy_Stats)
  const statsSource = withTax ? strategyStats.NET : strategyStats.GROSS;
  const totalTax = strategyStats["Total Tax & Charges"] || 0;

  if (!statsSource) return null;

  // 2. EXCLUDE UNWANTED KEYS
  const excludedKeys = ['sharpe', 'max days in any drawdown', 'gross pnl', 'net pnl', 'recovery speed', 'system edge', 'equity smoothness'];
  
  const finalStats = Object.entries(statsSource).filter(([key]) => {
    const lowerKey = key.toLowerCase();
    return !excludedKeys.some(exclude => lowerKey.includes(exclude));
  });

  return (
    <div className="w-full">
      {/* TOTAL TAX HIGHLIGHT (Shows only when toggle is NET) */}
      {withTax && totalTax > 0 && (
        <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-rose-700 font-semibold">Total brokerage & taxes deducted</p>
            <p className="text-xs text-slate-500 mt-0.5">This amount has been removed from your gross profit to show the real net metrics below.</p>
          </div>
          <p className="text-xl font-semibold font-mono text-rose-600 shrink-0">-₹{Math.round(totalTax).toLocaleString('en-IN')}</p>
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
        
        {/* ESTIMATED MARGIN AS 1ST ITEM */}
        <div className="bg-white border border-slate-200 border-t-2 border-t-indigo-500 px-3.5 py-3 rounded-lg flex flex-col justify-center hover:border-slate-300 transition-all">
          <p className="text-[11px] text-slate-500 font-medium mb-1 truncate" title="Estimated Margin Required">Estimated margin</p>
          <p className="text-lg font-semibold font-mono text-indigo-600">
            {/* 🚨 FIX: Checking if it's undefined instead of truthy to prevent 0 from becoming N/A */}
            {strategyStats.estimated_margin !== undefined && strategyStats.estimated_margin !== null
               ? `₹${Math.round(strategyStats.estimated_margin).toLocaleString('en-IN')}` 
               : 'N/A'}
          </p>
        </div>

        {finalStats.map(([key, value]) => {
          let strVal = String(value);
          const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
          let numericVal = parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
          
          const isNotMoney = lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('%') || lowerKey.includes('days') || lowerKey.includes('periods') || lowerKey.includes('probability') || lowerKey.includes('index') || lowerKey.includes('streak') || lowerKey.includes('return') || lowerKey.includes('smoothness') || lowerKey.includes('kelly') || lowerKey.includes('sizing') || lowerKey.includes('scalability');
          const isMoney = !isNotMoney && !isNaN(numericVal);

          // 3. CLEAN FORMATTING LOGIC
          if (lowerKey.includes('duration') || lowerKey.includes('streak') || lowerKey.includes('occurrence') || lowerKey.includes('trades') || lowerKey.includes('periods')) {
            strVal = isNaN(numericVal) ? strVal : Math.round(numericVal).toString();
          } else if (isMoney && !lowerKey.includes('totaltrades')) {
            strVal = numericVal >= 0 ? `₹${Math.round(numericVal).toLocaleString('en-IN')}` : `-₹${Math.round(Math.abs(numericVal)).toLocaleString('en-IN')}`;
          } else if (lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return')) {
            strVal = isNaN(numericVal) ? strVal : numericVal.toFixed(2);
          } else if (lowerKey.includes('%') && !strVal.includes('%')) {
            strVal = `${strVal}%`;
          }

          // 4. COLOR LOGIC
          const isNegative = strVal.includes('-');
          const isPositiveNumber = !isNegative && /[1-9]/.test(strVal) && !isNaN(parseFloat(strVal.replace(/[^0-9.-]+/g,"")));
          
          let colorClass = 'text-[#0F1B2D]';
          if (isNegative) {
             colorClass = 'text-rose-600';
          } else if (isPositiveNumber && (lowerKey.includes('pnl') || lowerKey.includes('profit') || lowerKey.includes('win') || lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return'))) {
            colorClass = 'text-emerald-600';
          }

          return (
            <div key={key} className="bg-white border border-slate-200 px-3.5 py-3 rounded-lg flex flex-col justify-center hover:border-slate-300 transition-all">
              <p className="text-[11px] text-slate-500 font-medium mb-1 truncate capitalize" title={key}>{key.replace(/_/g, ' ').toLowerCase()}</p>
              <p className={`text-lg font-semibold font-mono ${colorClass}`}>{strVal}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceStats;
