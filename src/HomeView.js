import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Cpu, Wand2, Activity, Filter, BarChart3, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'; // 💎 Added Live Ticker Icons

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  // 💎 Live Spot Prices State from Yahoo Finance (Nifty 50, Bank Nifty, Sensex)
  const [indices, setIndices] = useState([
    { symbol: '^NSEI', name: 'NIFTY 50', price: 24350.15, change: 85.40, percent: 0.35 },
    { symbol: '^NSEBANK', name: 'BANK NIFTY', price: 52120.80, change: -120.30, percent: -0.23 },
    { symbol: '^BSESN', name: 'SENSEX', price: 79890.50, change: 240.10, percent: 0.30 }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 💎 Yahoo Finance Live Spot Price Fetcher Function
  const fetchMarketData = async () => {
    setIsRefreshing(true);
    try {
      const symbols = [
        { sym: '^NSEI', name: 'NIFTY 50' },
        { sym: '^NSEBANK', name: 'BANK NIFTY' },
        { sym: '^BSESN', name: 'SENSEX' }
      ];

      const updatedData = await Promise.all(
        symbols.map(async (item) => {
          try {
            // Yahoo Finance Public Chart API endpoint
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.sym)}?interval=1m&range=1d`);
            if (res.ok) {
              const data = await res.json();
              const result = data?.chart?.result?.[0];
              const meta = result?.meta;
              if (meta) {
                const currentPrice = meta.regularMarketPrice;
                const prevClose = meta.previousClose || meta.chartPreviousClose || currentPrice;
                const change = currentPrice - prevClose;
                const percent = prevClose ? (change / prevClose) * 100 : 0;
                return {
                  symbol: item.sym,
                  name: item.name,
                  price: currentPrice,
                  change: change,
                  percent: percent
                };
              }
            }
          } catch (err) {
            console.warn(`Yahoo Finance Fetch Warning for ${item.name}:`, err);
          }
          return null;
        })
      );

      const validResults = updatedData.filter(Boolean);
      if (validResults.length > 0) {
        setIndices(prev => prev.map(old => {
          const matched = validResults.find(v => v.symbol === old.symbol);
          return matched ? matched : old;
        }));
      }
    } catch (error) {
      console.error("Market Ticker Error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 💎 Auto-Fetch on Mount & Auto Refresh Every 15 Seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => {
      fetchMarketData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 💎 Premium Spring Animations (High-end feel)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 }, 
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  // 💎 Premium High-End Step Cards Data
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2.5} size={22} />,
      theme: {
        borderHover: "hover:border-blue-400 hover:shadow-blue-500/10",
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
        iconBorder: "border-blue-100",
        hoverIconBg: "group-hover:bg-blue-500",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
        gradientStart: "from-blue-50/80"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.",
      icon: <Activity strokeWidth={2.5} size={22} />,
      theme: {
        borderHover: "hover:border-purple-400 hover:shadow-purple-500/10",
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        iconBorder: "border-purple-100",
        hoverIconBg: "group-hover:bg-purple-500",
        badgeBg: "bg-purple-50",
        badgeText: "text-purple-700",
        gradientStart: "from-purple-50/80"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports, Heatmaps, Drawdown Curve, PnL Charts, and AI Backtest Report Analyzer.",
      icon: <Filter strokeWidth={2.5} size={22} />,
      theme: {
        borderHover: "hover:border-emerald-400 hover:shadow-emerald-500/10",
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        iconBorder: "border-emerald-100",
        hoverIconBg: "group-hover:bg-emerald-500",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        gradientStart: "from-emerald-50/80"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.",
      icon: <BarChart3 strokeWidth={2.5} size={22} />,
      theme: {
        borderHover: "hover:border-rose-400 hover:shadow-rose-500/10",
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        iconBorder: "border-rose-100",
        hoverIconBg: "group-hover:bg-rose-500",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        gradientStart: "from-rose-50/80"
      }
    }
  ];

  return (
    <motion.div 
      custom={custom}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      // 💎 Clean, minimal off-white background like Zerodha
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-24 py-8 z-10 bg-[#FAFAFA]"
    >
      {/* 💎 Premium Subtle Background Details */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px), 
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-bl from-blue-100/50 via-indigo-50/30 to-transparent rounded-full mix-blend-multiply blur-[120px] opacity-80 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-slate-100 to-transparent rounded-full mix-blend-multiply blur-[100px] pointer-events-none z-0"></div>

      {/* 📈 💎 NEW: LIVE YAHOO FINANCE MARKET SPOT TICKER TAB (TOP BAR) */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-mono py-2.5 px-4 rounded-xl shadow-lg mb-6 border border-slate-800 relative z-50 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-700/80 pr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            LIVE MARKET SPOT
          </span>
          <button 
            onClick={fetchMarketData} 
            title="Refresh Live Spot Data"
            className="p-1 hover:text-blue-400 transition-colors ml-1"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin text-blue-400" : "text-slate-400"} />
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          {indices.map((idx, i) => {
            const isPositive = idx.change >= 0;
            return (
              <div key={i} className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 shadow-inner">
                <span className="font-bold text-slate-300 tracking-wide text-[11px]">{idx.name}</span>
                <span className="font-extrabold text-white">
                  {idx.price ? idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                </span>
                <span className={`flex items-center gap-0.5 text-[11px] font-extrabold px-1.5 py-0.5 rounded ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {isPositive ? '+' : ''}{idx.change ? idx.change.toFixed(2) : '0.00'} ({isPositive ? '+' : ''}{idx.percent ? idx.percent.toFixed(2) : '0.00'}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mt-2 mb-12">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer" onClick={() => onNavigate(false)}>
          <AlgoSayLogo className="w-12 h-12 shadow-lg shadow-blue-500/10 rounded-2xl border border-white" />
          <span className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 whitespace-nowrap pb-2 leading-[1.2]">
            AlgoSay
          </span>
        </div>
        
        {/* TOP RIGHT NAVIGATION BUTTONS */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button 
            onClick={() => onNavigate(false)}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(true)}
            className="px-6 py-2.5 bg-[#0052FF] hover:bg-[#0043D0] text-white text-sm font-bold rounded-lg shadow-[0_8px_20px_rgb(0,82,255,0.24)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Centered Layout */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-16 flex-grow relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Left Column Text & Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <h3 className="text-[11px] font-bold text-[#0052FF] uppercase tracking-[0.25em] mb-4 drop-shadow-sm">
            The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Turn Everyday Words into <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] to-indigo-600 drop-shadow-sm">
              Backtests.
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* PRO TERMINAL ENGINE BOX */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="mb-8 rounded-xl overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-slate-800 bg-[#0A0E17] flex flex-col w-full max-w-lg group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="bg-[#111827] px-4 py-3 flex items-center justify-between border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-slate-400 text-xs font-mono ml-3 tracking-wide">strategy_builder.exe</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu size={12} /> AI Neural Engine v2.4
                </span>
              </div>
            </div>
            <div className="p-6 font-mono text-[15px] flex items-start min-h-[120px] bg-[#0A0E17] relative z-10">
              <div className="text-slate-600 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
              <span className="text-emerald-400 mr-3 font-semibold shrink-0">prompt &gt;</span>
              <TypeAnimation
                sequence={[
                  'Sell BankNifty ATM Straddle at 9:20 AM with 25% SL...',
                  2500,
                  'Buy Nifty Call at 9:30 AM if India VIX < 15...',
                  2500,
                  'Iron Condor on Finnifty expiry day at 10:00 AM...',
                  2500,
                  'Short Straddle with premium matching exactly 100...',
                  2500,
                  'Buy BankNifty ATM Put if RSI > 70 and MACD crosses down...',
                  2500
                ]}
                wrapper="span"
                speed={50}
                className="text-blue-200 font-medium leading-relaxed tracking-wide"
                repeat={Infinity}
              />
            </div>
          </motion.div>

          {/* 10 FREE BACKTESTS CTA BOX */}
          <div 
            onClick={() => onNavigate(true)}
            className="p-4 rounded-xl cursor-pointer transition-all duration-300 border border-slate-200 bg-white hover:border-[#0052FF]/30 hover:shadow-[0_8px_30px_rgb(0,82,255,0.08)] flex items-center justify-between group max-w-lg"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                 🎁
               </div>
               <div>
                 <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Claim 10 Free Backtests</h4>
                 <p className="text-sm text-slate-500 font-medium mt-0.5">Click here to Sign Up and start building.</p>
               </div>
            </div>
            <div className="text-slate-400 p-2 group-hover:text-[#0052FF] transition-colors">
               <svg className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>
        </div>

        {/* Right Column Steps - 💎 ULTIMATE Premium Interactive Cards */}
        <div className="w-full lg:w-1/2 flex justify-end">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-4 max-w-lg w-full"
          >
            {stepsData.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                whileHover={{ 
                  y: -6, 
                  scale: 1.01,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" 
                }}
                className={`relative overflow-hidden group flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 cursor-default ${step.theme.borderHover}`}
              >
                {/* 💎 Subtle Glow Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
                
                {/* 💎 Animated Icon Box */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm border group-hover:scale-110 group-hover:text-white group-hover:rotate-3 ${step.theme.iconBg} ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg}`}>
                  {step.icon}
                </div>
                
                {/* 💎 Content Container */}
                <div className="relative z-10 flex flex-col pt-0.5">
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Tiny Premium STEP Badge */}
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border border-white/60 shadow-sm ${step.theme.badgeBg} ${step.theme.badgeText}`}>
                      STEP {step.num}
                    </span>
                    <h4 className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-black transition-colors duration-300">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[13.5px] text-slate-500 font-medium leading-[1.6] group-hover:text-slate-700 transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default HomeView;