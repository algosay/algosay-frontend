import React from 'react';

// 🎨 Helper Function: Premium SVG Icons & Color Matching based on Metric Name
const getIconConfig = (key, strVal) => {
  const lowerKey = key.toLowerCase();
  const isNegative = strVal.includes('-');
  const numericVal = parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
  const isPositiveNumber = !isNegative && /[1-9]/.test(strVal) && !isNaN(numericVal);

  let valColor = 'text-slate-200';
  let ring = 'border-slate-700 text-slate-400 bg-slate-800/30 shadow-[0_0_10px_rgba(148,163,184,0.1)]';
  
  // Icon SVGs
  const Wallet = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;
  const TrendingUp = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
  const TrendingDown = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>;
  const Arrows = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>;
  const Target = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
  const Trophy = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
  const PieChart = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>;
  const Scale = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>;
  const Shield = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;
  const Calculator = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>;

  let icon = Calculator; // Default

  // 1. Core Color Logic matching the existing file logic perfectly
  if (isNegative) {
    valColor = 'text-[#ff4444]';
    ring = 'border-[#ff4444]/30 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
    icon = TrendingDown;
  } else if (isPositiveNumber && (lowerKey.includes('pnl') || lowerKey.includes('profit') || lowerKey.includes('win') || lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return') || lowerKey.includes('margin'))) {
    valColor = lowerKey.includes('margin') ? 'text-[#00f0ff]' : 'text-[#00ff88]';
  }

  // 2. Specific Icon and Ring mappings based on the reference image
  if (lowerKey.includes('margin')) {
    icon = Wallet;
    ring = 'border-[#00f0ff]/40 text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]';
  } else if (lowerKey.includes('trades') || lowerKey.includes('periods')) {
    icon = Arrows;
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('profit') || lowerKey.includes('win streak') || lowerKey.includes('sizing')) {
    icon = lowerKey.includes('win %') ? Trophy : TrendingUp;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('loss') || lowerKey.includes('drawdown')) {
    icon = lowerKey.includes('drawdown') ? PieChart : TrendingDown;
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('ratio') || lowerKey.includes('factor')) {
    icon = lowerKey.includes('risk') ? Scale : Calculator;
    valColor = 'text-[#b580ff]';
    ring = 'border-[#b580ff]/40 text-[#b580ff] bg-[#b580ff]/10 shadow-[0_0_15px_rgba(181,128,255,0.2)]';
  } else if (lowerKey.includes('probability') || lowerKey.includes('scalability')) {
    icon = Shield;
    valColor = 'text-[#00a3ff]';
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('expectancy') || lowerKey.includes('index')) {
    icon = Target;
    valColor = 'text-[#ff9900]';
    ring = 'border-[#ff9900]/40 text-[#ff9900] bg-[#ff9900]/10 shadow-[0_0_15px_rgba(255,153,0,0.2)]';
  }

  return { icon, ring, valColor };
};

const PerformanceStats = ({ result, withTax }) => {
  // 1. Console-la data epdi varuthu nu check panna (Debugging)
  console.log("BACKEND DATA RECEIVED:", result);

  // 2. Data varalana loading kaata
  if (!result) {
    return <div className="p-4 text-slate-500 font-bold animate-pulse">Loading metrics...</div>;
  }

  // 🚨 UPDATE: Extract Strategy_Stats from the result object securely
  const strategyStats = result.Strategy_Stats || {};

  // 3. Mismatch aana Red Error kaata
  if (!strategyStats.NET && !strategyStats.GROSS) {
    return (
      <div className="mt-4 p-5 bg-[#2a0812] border-l-4 border-l-red-500 border border-red-900/50 rounded-xl text-red-400 shadow-lg">
        <p className="font-extrabold mb-1 flex items-center gap-2"><span className="text-xl">⚠️</span> Data Structure Mismatch!</p>
        <p className="text-sm text-red-300">Backend is not sending 'NET' and 'GROSS' keys inside Strategy_Stats.</p>
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
        <div className="mb-8 p-5 bg-gradient-to-r from-[#1c0812] to-[#0f0714] border border-red-900/40 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_8px_30px_rgba(255,0,0,0.1)] transition-all">
          <div className="flex items-center gap-4 mb-3 md:mb-0">
             <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(255,68,68,0.2)]">
                <span className="text-xl">🏛️</span>
             </div>
             <div>
                <p className="text-[11px] text-red-400 font-extrabold uppercase tracking-widest mb-1">Total Brokerage & Taxes Deducted</p>
                <p className="text-sm text-red-300/70 font-medium">This amount has been removed from your Gross Profit to show the real Net metrics below.</p>
             </div>
          </div>
          <p className="text-3xl font-black text-[#ff4444] drop-shadow-[0_0_10px_rgba(255,68,68,0.5)]">
            -₹{Math.round(totalTax).toLocaleString('en-IN')}
          </p>
        </div>
      )}

      {/* 🚀 METRICS GRID - PREMIUM REDESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
        
        {/* ✨ PUDHU UPDATE: ESTIMATED MARGIN MOVED HERE AS 1ST ITEM */}
        {(() => {
           const marginVal = strategyStats.estimated_margin !== undefined && strategyStats.estimated_margin !== null
             ? `₹${Math.round(strategyStats.estimated_margin).toLocaleString('en-IN')}` 
             : 'N/A';
           const config = getIconConfig('Estimated Margin', marginVal);
           
           return (
            <div className="bg-[#0a0f18] border border-[#1e293b] p-4 rounded-xl flex items-center gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-slate-500 transition-all duration-300">
              <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${config.ring}`}>
                 {config.icon}
              </div>
              <div className="flex flex-col overflow-hidden w-full">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 truncate" title="Estimated Margin Required">Estimated Margin</p>
                <p className="text-xl font-black tracking-wide text-[#00f0ff]">{marginVal}</p>
              </div>
            </div>
           );
        })()}

        {/* REST OF THE METRICS */}
        {finalStats.map(([key, value]) => {
          let strVal = String(value);
          const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
          let numericVal = parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
          
          // 🚨 EXACT SAME LOGIC PRESERVED
          const isNotMoney = lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('%') || lowerKey.includes('days') || lowerKey.includes('periods') || lowerKey.includes('probability') || lowerKey.includes('index') || lowerKey.includes('streak') || lowerKey.includes('return') || lowerKey.includes('smoothness') || lowerKey.includes('kelly') || lowerKey.includes('sizing') || lowerKey.includes('scalability');
          const isMoney = !isNotMoney && !isNaN(numericVal);

          // 3. CLEAN FORMATTING LOGIC (PRESERVED)
          if (lowerKey.includes('duration') || lowerKey.includes('streak') || lowerKey.includes('occurrence') || lowerKey.includes('trades') || lowerKey.includes('periods')) {
            strVal = isNaN(numericVal) ? strVal : Math.round(numericVal).toString();
          } else if (isMoney && !lowerKey.includes('totaltrades')) {
            strVal = numericVal >= 0 ? `₹${Math.round(numericVal).toLocaleString('en-IN')}` : `-₹${Math.round(Math.abs(numericVal)).toLocaleString('en-IN')}`;
          } else if (lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return')) {
            strVal = isNaN(numericVal) ? strVal : numericVal.toFixed(2);
          } else if (lowerKey.includes('%') && !strVal.includes('%')) {
            strVal = `${strVal}%`;
          }

          // Fetch Premium Icon & Color mapping based on string
          const config = getIconConfig(key, strVal);

          return (
            <div key={key} className="bg-[#0a0f18] border border-[#1e293b] p-4 rounded-xl flex items-center gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-slate-500 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${config.ring}`}>
                 {config.icon}
              </div>
              <div className="flex flex-col overflow-hidden w-full">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 truncate" title={key}>{key.replace(/_/g, ' ')}</p>
                <p className={`text-xl font-black tracking-wide ${config.valColor}`}>{strVal}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceStats;