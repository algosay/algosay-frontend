import React from 'react';

// 🎨 Helper Function: Premium Unique SVG Icons & Color Matching based on Metric Name
const getIconConfig = (key, strVal) => {
  const lowerKey = key.toLowerCase();
  const isNegative = strVal.includes('-');
  const numericVal = parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
  const isPositiveNumber = !isNegative && /[1-9]/.test(strVal) && !isNaN(numericVal);

  let valColor = 'text-slate-200';
  let ring = 'border-slate-700 text-slate-400 bg-slate-800/30 shadow-[0_0_10px_rgba(148,163,184,0.1)]';

  // 🌟 Unique, High-Quality SVG Icons (Each Metric Has Its Own Specific Icon)
  const Wallet = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;
  const TrendingUp = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
  const TrendingDown = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>;
  const Arrows = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>;
  const Coins = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 8v2m0-10e-5a7 7 0 110-14 7 7 0 010 14z"></path></svg>;
  const Trophy = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
  const Percent = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>;
  const ArrowUpRight = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>;
  const ArrowDownRight = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17L7 7M17 17H7M17 17V7"></path></svg>;
  const Rocket = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m0 0a6 6 0 01-7.38-5.84h4.8m2.58-5.84A14.98 14.98 0 003.63 3.16 14.98 14.98 0 0015.75 9.32m-5.96 5.96L15.59 14.37z"></path></svg>;
  const Flame = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>;
  const PieChart = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path></svg>;
  const Clock = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  const Activity = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
  const Scale = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>;
  const Calculator = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>;
  const Crosshair = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6v4m0 12v4m10-10h-4M6 12H2"></path></svg>;
  const Sparkles = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
  const ShieldAlert = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
  const Calendar = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
  const BarChart = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
  const ShieldCheck = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;
  const Gauge = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  const Waveform = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-4-7v7m16-4v4"></path></svg>;
  const Expand = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>;

  let icon = Calculator; // Fallback default

  // 1. Color Logic (Preserved intact)
  if (isNegative) {
    valColor = 'text-[#ff4444]';
    ring = 'border-[#ff4444]/30 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (isPositiveNumber && (lowerKey.includes('pnl') || lowerKey.includes('profit') || lowerKey.includes('win') || lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return') || lowerKey.includes('margin'))) {
    valColor = lowerKey.includes('margin') ? 'text-[#00f0ff]' : 'text-[#00ff88]';
  }

  // 2. Precise Unique Matching Logic for every card
  if (lowerKey.includes('margin')) {
    icon = Wallet;
    ring = 'border-[#00f0ff]/40 text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]';
  } else if (lowerKey.includes('overall profit') || lowerKey.includes('gross profit')) {
    icon = TrendingUp;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('no. of trades') || lowerKey.includes('trades')) {
    icon = Arrows;
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('average profit per') || lowerKey.includes('avg profit per')) {
    icon = Coins;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('win %') || lowerKey.includes('win rate')) {
    icon = Trophy;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('loss %')) {
    icon = Percent;
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('average profit on') || lowerKey.includes('avg profit on')) {
    icon = ArrowUpRight;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('average loss on') || lowerKey.includes('avg loss on')) {
    icon = ArrowDownRight;
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('max profit in single') || lowerKey.includes('max profit')) {
    icon = Rocket;
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('max loss in single') || lowerKey.includes('max loss')) {
    icon = Flame;
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('max drawdown') || lowerKey.includes('max dd')) {
    icon = PieChart;
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('duration of max')) {
    icon = Clock;
    ring = 'border-[#b580ff]/40 text-[#b580ff] bg-[#b580ff]/10 shadow-[0_0_15px_rgba(181,128,255,0.2)]';
  } else if (lowerKey.includes('return / max dd') || lowerKey.includes('return / max')) {
    icon = Activity;
    valColor = 'text-[#00a3ff]';
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('reward to risk') || lowerKey.includes('risk ratio')) {
    icon = Scale;
    valColor = 'text-[#b580ff]';
    ring = 'border-[#b580ff]/40 text-[#b580ff] bg-[#b580ff]/10 shadow-[0_0_15px_rgba(181,128,255,0.2)]';
  } else if (lowerKey.includes('profit factor')) {
    icon = Calculator;
    valColor = 'text-[#00ff88]';
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('expectancy')) {
    icon = Crosshair;
    valColor = 'text-[#00ff88]';
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('max win streak')) {
    icon = Sparkles;
    valColor = 'text-[#00ff88]';
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('max losing streak')) {
    icon = ShieldAlert;
    valColor = 'text-[#ff4444]';
    ring = 'border-[#ff4444]/40 text-[#ff4444] bg-[#ff4444]/10 shadow-[0_0_15px_rgba(255,68,68,0.2)]';
  } else if (lowerKey.includes('max dd occurrence') || lowerKey.includes('occurrence')) {
    icon = Calendar;
    valColor = 'text-[#b580ff]';
    ring = 'border-[#b580ff]/40 text-[#b580ff] bg-[#b580ff]/10 shadow-[0_0_15px_rgba(181,128,255,0.2)]';
  } else if (lowerKey.includes('sortino')) {
    icon = BarChart;
    valColor = 'text-[#00a3ff]';
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('probability') || lowerKey.includes('survival')) {
    icon = ShieldCheck;
    valColor = 'text-[#00a3ff]';
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('kelly') || lowerKey.includes('sizing')) {
    icon = Gauge;
    valColor = 'text-[#00ff88]';
    ring = 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)]';
  } else if (lowerKey.includes('stress level') || lowerKey.includes('stress')) {
    icon = ShieldAlert;
    valColor = 'text-[#ff9900]';
    ring = 'border-[#ff9900]/40 text-[#ff9900] bg-[#ff9900]/10 shadow-[0_0_15px_rgba(255,153,0,0.2)]';
  } else if (lowerKey.includes('tail ratio') || lowerKey.includes('tail')) {
    icon = Waveform;
    valColor = 'text-[#00a3ff]';
    ring = 'border-[#00a3ff]/40 text-[#00a3ff] bg-[#00a3ff]/10 shadow-[0_0_15px_rgba(0,163,255,0.2)]';
  } else if (lowerKey.includes('scalability')) {
    icon = Expand;
    valColor = 'text-[#b580ff]';
    ring = 'border-[#b580ff]/40 text-[#b580ff] bg-[#b580ff]/10 shadow-[0_0_15px_rgba(181,128,255,0.2)]';
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
          <p className="text-2xl sm:text-3xl font-black text-[#ff4444] drop-shadow-[0_0_10px_rgba(255,68,68,0.5)]">
            -₹{Math.round(totalTax).toLocaleString('en-IN')}
          </p>
        </div>
      )}

      {/* 🚀 METRICS GRID - PREMIUM & NEAT FIT DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        
        {/* ✨ ESTIMATED MARGIN MOVED HERE AS 1ST ITEM */}
        {(() => {
           const marginVal = strategyStats.estimated_margin !== undefined && strategyStats.estimated_margin !== null
             ? `₹${Math.round(strategyStats.estimated_margin).toLocaleString('en-IN')}` 
             : 'N/A';
           const config = getIconConfig('Estimated Margin', marginVal);
           
           return (
            <div className="bg-[#0a0f18] border border-[#1e293b] p-3.5 sm:p-4 rounded-xl flex items-center gap-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-slate-500 transition-all duration-300">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${config.ring}`}>
                 {config.icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 truncate" title="Estimated Margin Required">Estimated Margin</p>
                <p className="text-base sm:text-lg font-bold tracking-tight text-[#00f0ff] truncate">{marginVal}</p>
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

          // Fetch Premium Unique Icon & Color mapping based on string
          const config = getIconConfig(key, strVal);

          return (
            <div key={key} className="bg-[#0a0f18] border border-[#1e293b] p-3.5 sm:p-4 rounded-xl flex items-center gap-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-slate-500 transition-all duration-300 hover:-translate-y-0.5">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${config.ring}`}>
                 {config.icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 truncate" title={key}>{key.replace(/_/g, ' ')}</p>
                <p className={`text-base sm:text-lg font-bold tracking-tight ${config.valColor} truncate`}>{strVal}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceStats;