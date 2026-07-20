import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Cpu } from 'lucide-react'; // Removed Terminal icon as requested

const HomeView = ({ onNavigate, custom, viewVariants }) => {
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

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mt-4 mb-12">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer" onClick={() => onNavigate(false)}>
          <AlgoSayLogo className="w-12 h-12 shadow-lg shadow-blue-500/10 rounded-2xl border border-white" />
          {/* 🛠️ FIX: Added pb-2 and leading-[1.2] to prevent bottom clipping of 'y' */}
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
          {/* 🛠️ FIX: Removed Terminal symbol */}
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

          {/* 💎 PRO TERMINAL ENGINE BOX - Added Floating Animation */}
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

          {/* 💎 10 FREE BACKTESTS CTA BOX - Minimal High-End Card */}
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

        {/* Right Column Steps - 💎 Premium Glass/Minimalist Cards */}
        <div className="w-full lg:w-1/2 flex justify-end">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-5 max-w-lg"
          >
            {[
              {
                num: 1,
                title: "Describe Naturally & AI Auto-Mapping",
                desc: "Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
                color: "blue"
              },
              {
                num: 2,
                title: "AI Strategy Diagnostics & Improvement",
                desc: "The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.",
                color: "purple"
              },
              {
                num: 3,
                title: "Granular Deep Filtering Engine",
                // 🛠️ FIX: Added requested features (Ledger, PDF/CSV, Heatmap, Drawdown, PnL, AI Backtest Analyzer)
                desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports, Heatmaps, Drawdown Curve, PnL Charts, and AI Backtest Report Analyzer.",
                color: "green"
              },
              {
                num: 4,
                title: "Institutional Pro Metrics",
                desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.",
                color: "rose"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)" }}
                className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-slate-150 shadow-sm transition-all duration-300"
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-full bg-${step.color}-50 flex items-center justify-center text-${step.color}-600 font-black text-sm border border-${step.color}-100`}>
                  {step.num}
                </div>
                <div>
                  <h4 className="text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">{step.title}</h4>
                  <p className="text-[14px] text-slate-500 font-medium mt-2 leading-relaxed">{step.desc}</p>
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