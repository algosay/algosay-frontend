import React from 'react';

const PerformanceStats = ({ result, withTax }) => {
  // 1. Console-la data epdi varuthu nu check panna (Debugging)
  console.log("BACKEND DATA RECEIVED:", result);

  // 2. Data varalana loading kaata
  if (!result) {
    return <div className="p-4 text-gray-400 font-medium">Loading metrics...</div>;
  }

  // 🚨 UPDATE: Extract Strategy_Stats from the result object securely
  const strategyStats = result.Strategy_Stats || {};

  // 3. Mismatch aana Red Error kaata
  if (!strategyStats.NET && !strategyStats.GROSS) {
    return (
      <div className="mt-4 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-400">
        <p className="font-bold mb-1">⚠️ Data Structure Mismatch!</p>
        <p className="text-sm">Backend is not sending 'NET' and 'GROSS' keys inside Strategy_Stats.</p>
      </div>
    );
  }

  // 🚨 UPDATE: SIMPLE SOURCE SELECTION (Targeting the nested Strategy_Stats)
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
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-xl">🏛️</span>
             <div>
                <p className="text-[11px] text-red-400/80 font-bold uppercase tracking-wider">Total Brokerage & Taxes Deducted</p>
                <p className="text-sm text-gray-400">This amount has been removed from your Gross Profit to show the real Net metrics below.</p>
             </div>
          </div>
          <p className="text-2xl font-bold text-red-400">-₹{Math.round(totalTax).toLocaleString('en-IN')}</p>
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        
        {/* ✨ PUDHU UPDATE: ESTIMATED MARGIN MOVED HERE AS 1ST ITEM */}
        <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-4 rounded-lg flex flex-col justify-center shadow-sm hover:border-gray-700 transition-all">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 truncate" title="Estimated Margin Required">Estimated Margin</p>
          <p className="text-lg font-bold text-blue-400">
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
          
          let colorClass = 'text-gray-200';
          if (isNegative) {
             colorClass = 'text-red-400';
          } else if (isPositiveNumber && (lowerKey.includes('pnl') || lowerKey.includes('profit') || lowerKey.includes('win') || lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return'))) {
            colorClass = 'text-green-400';
          }

          return (
            <div key={key} className="bg-[#1e1e1e] border border-[#2d2d2d] p-4 rounded-lg flex flex-col justify-center shadow-sm hover:border-gray-700 transition-all">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 truncate" title={key}>{key.replace(/_/g, ' ')}</p>
              <p className={`text-lg font-bold ${colorClass}`}>{strVal}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceStats;