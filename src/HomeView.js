import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Cpu, Wand2, Activity, Filter, BarChart3 } from 'lucide-react'; 
import StrategyCapabilities from './components/StrategyCapabilities'; 

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  // Premium Spring Animations (High-end feel)
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

  // Right Side: Light Professional Theme Cards
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in simple English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2.5} size={22} />,
      theme: {
        cardBg: "bg-white/80 backdrop-blur-md",
        borderHover: "hover:border-blue-400 hover:shadow-[0_12px_30px_rgba(0,82,255,0.15)]",
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
        iconBorder: "border-blue-100 shadow-sm",
        hoverIconBg: "group-hover:bg-blue-600 group-hover:text-white",
        badgeBg: "bg-blue-100/80",
        badgeText: "text-blue-800",
        gradientStart: "from-blue-100/30"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes Uncover Hidden Drawdown Leaks & Optimize Your Trade Sequence Instantly to generate a personalized report.",
      icon: <Activity strokeWidth={2.5} size={22} />,
      theme: {
        cardBg: "bg-white/80 backdrop-blur-md",
        borderHover: "hover:border-purple-400 hover:shadow-[0_12px_30px_rgba(147,51,234,0.15)]",
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        iconBorder: "border-purple-100 shadow-sm",
        hoverIconBg: "group-hover:bg-purple-600 group-hover:text-white",
        badgeBg: "bg-purple-100/80",
        badgeText: "text-purple-800",
        gradientStart: "from-purple-100/30"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports, Heatmaps, Drawdown Curve, PnL Charts.",
      icon: <Filter strokeWidth={2.5} size={22} />,
      theme: {
        cardBg: "bg-white/80 backdrop-blur-md",
        borderHover: "hover:border-emerald-400 hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)]",
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        iconBorder: "border-emerald-100 shadow-sm",
        hoverIconBg: "group-hover:bg-emerald-600 group-hover:text-white",
        badgeBg: "bg-emerald-100/80",
        badgeText: "text-emerald-800",
        gradientStart: "from-emerald-100/30"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.",
      icon: <BarChart3 strokeWidth={2.5} size={22} />,
      theme: {
        cardBg: "bg-white/80 backdrop-blur-md",
        borderHover: "hover:border-rose-400 hover:shadow-[0_12px_30px_rgba(244,63,94,0.15)]",
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        iconBorder: "border-rose-100 shadow-sm",
        hoverIconBg: "group-hover:bg-rose-600 group-hover:text-white",
        badgeBg: "bg-rose-100/80",
        badgeText: "text-rose-800",
        gradientStart: "from-rose-100/30"
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
      className="flex flex-col w-full min-h-screen relative overflow-hidden"
    >
      {/* 
        💎 UNIQUE SPLIT BACKGROUND DESIGN 
        Left Side: Dark Neon (AI World) | Right Side: Light Professional (Human World)
      */}
      <div className="absolute inset-0 z-0 flex w-full h-full pointer-events-none">
        {/* Left - Dark/Neon Side */}
        <div className="w-full lg:w-[55%] h-full bg-[#070A11] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          {/* Neon Glows */}
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full mix-blend-screen blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full mix-blend-screen blur-[100px]"></div>
        </div>
        
        {/* Right - Light/Clean Side */}
        <div className="hidden lg:block w-[45%] h-full bg-[#F8FAFC] relative overflow-hidden border-l border-white/20 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          {/* Soft Professional Glows */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-100/60 via-transparent to-transparent"></div>
        </div>
        
        {/* Mobile Fallback gradient overlay */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-transparent via-[#F8FAFC] to-[#F8FAFC]"></div>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-24 py-8 z-10 flex flex-col min-h-screen">
        
        {/* HEADER: Dynamic color based on background */}
        <div className="flex items-center justify-between z-50 mt-4 mb-12">
          
          {/* LOGO SECTION - Adapted for Dark Background */}
          <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer" onClick={() => onNavigate(false)}>
            <AlgoSayLogo className="w-12 h-12 shadow-[0_0_20px_rgba(0,229,255,0.3)] rounded-2xl border border-white/10" />
            <span className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] whitespace-nowrap pb-2 leading-[1.2]">
              AlgoSay
            </span>
          </div>
          
          {/* TOP RIGHT NAVIGATION BUTTONS */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate(false)}
              className="px-5 py-2.5 text-sm font-bold text-white/80 lg:text-slate-600 lg:bg-white/70 bg-white/5 backdrop-blur-md border border-white/10 lg:border-slate-200/80 hover:bg-white hover:text-slate-900 rounded-xl shadow-sm transition-all duration-300"
            >
              Log In
            </button>
            <button 
              onClick={() => onNavigate(true)}
              className="relative overflow-hidden group px-6 py-2.5 bg-gradient-to-r from-[#00e5ff] to-[#0052FF] text-white text-sm font-bold rounded-xl shadow-[0_8px_20px_rgba(0,229,255,0.25)] hover:shadow-[0_12px_25px_rgba(0,229,255,0.4)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-6 -z-10"></span>
              <span className="relative z-10 flex items-center gap-1.5 text-slate-900">
                Sign Up 
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA - Split Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16 flex-grow relative z-10 w-full max-w-[1400px] mx-auto">
          
          {/* LEFT COLUMN: Neon AI Dark Theme */}
          <div className="w-full lg:w-[50%] flex flex-col pt-4 pr-0 lg:pr-8">
            <h3 className="text-[11px] font-bold text-[#00e5ff] uppercase tracking-[0.25em] mb-4 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
              Next-Gen AI Backtesting for Indian Traders
            </h3>
            
            <h1 className="font-black leading-[1.2] mb-6 tracking-tight flex flex-col">
              <span className="whitespace-nowrap text-4xl lg:text-5xl text-white mb-1 drop-shadow-md">India’s #1 AI-Powered</span>
              <span className="text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_15px_rgba(255,71,217,0.3)] pb-2 leading-tight">
                Backtesting Engine
              </span>
            </h1>
            <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed max-w-lg">
              Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your trading strategies. Just type it, and we test it.
            </p>

            {/* PRO TERMINAL ENGINE BOX - Ultra HD Glowing */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mb-8 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#2d2d30]/50 bg-[#05050A]/80 backdrop-blur-xl flex flex-col w-full max-w-lg group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff]/10 to-[#b347ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="bg-[#0f0f15] px-4 py-3 flex items-center justify-between border-b border-[#2d2d30]/80 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-slate-400 text-xs font-mono ml-3 tracking-wide">strategy_backtesting.py</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#00e5ff]/10 px-2.5 py-1 rounded-md border border-[#00e5ff]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
                  <span className="text-[10px] font-mono font-bold text-[#00e5ff] uppercase tracking-widest flex items-center gap-1.5 drop-shadow-sm">
                    <Cpu size={12} /> AI Neural Engine v2.4
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-[15px] flex items-start min-h-[120px] relative z-10">
                <div className="text-slate-600 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
                <span className="text-[#00e5ff] mr-3 font-semibold shrink-0">Strategy &gt;</span>
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
                  className="text-gray-100 font-medium leading-relaxed tracking-wide drop-shadow-sm"
                  repeat={Infinity}
                />
              </div>
            </motion.div>

            {/* 10 FREE BACKTESTS CTA BOX - Glow Design */}
            <div 
              onClick={() => onNavigate(true)}
              className="relative p-4 rounded-xl cursor-pointer transition-all duration-300 border border-blue-500/30 bg-blue-900/20 hover:bg-blue-900/30 hover:shadow-[0_0_30px_rgba(0,82,255,0.2)] flex items-center justify-between group max-w-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-[#00e5ff]/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    📊 
                 </div>
                 <div>
                   <h4 className="text-base font-extrabold text-white tracking-tight drop-shadow-sm">Get 10 Free Backtests➜</h4>
                   <p className="text-sm text-slate-300 font-medium mt-0.5">Click here to Sign Up and start backtesting.</p>
                 </div>
              </div>
              <div className="text-[#00e5ff] p-2 group-hover:translate-x-1.5 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Light Professional Theme Cards */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-12 lg:mt-0">
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
                    scale: 1.02 
                  }}
                  className={`relative overflow-hidden group flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-300 cursor-default ${step.theme.cardBg} ${step.theme.borderHover}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
                  
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border group-hover:scale-110 group-hover:rotate-3 ${step.theme.iconBg} ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg}`}>
                    {step.icon}
                  </div>
                  
                  <div className="relative z-10 flex flex-col pt-0.5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border border-white/60 shadow-sm ${step.theme.badgeBg} ${step.theme.badgeText}`}>
                        STEP {step.num}
                      </span>
                      <h4 className="text-[16px] font-black text-slate-900 tracking-tight leading-tight group-hover:text-black transition-colors duration-300">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[13.5px] text-slate-600 font-medium leading-[1.6] group-hover:text-slate-800 transition-colors duration-300">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
        
        {/* STRATEGY CAPABILITIES SECTION - Adjusting padding for contrast match */}
        <div className="w-full relative z-10 mt-24 mb-10 pt-10 border-t border-white/10 lg:border-slate-200">
          <StrategyCapabilities />
        </div>

      </div>
    </motion.div>
  );
};
export default HomeView;