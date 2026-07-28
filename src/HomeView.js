import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Wand2, Activity, Filter, BarChart3, Rocket, Users, Zap, Shield, ShieldCheck } from 'lucide-react'; 
import StrategyCapabilities from './components/StrategyCapabilities';

// Puthusa piricha 2 components import pandrom
import ResultsShowcase from './components/ResultsShowcase';
import StrategyTemplates from './components/StrategyTemplates';

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  // 💎 Image Zoom State (Ithu main laye iruku, ResultsShowcase ku prop aag pass agum)
  const [zoomedImage, setZoomedImage] = useState(null);

  // 💎 Premium Spring Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95 }, 
    show: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  // 💎 4 PREMIUM NEON BOXES
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in simple English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#1A2342] hover:border-[#0088FF] hover:shadow-[0_0_30px_rgba(0,136,255,0.2)]",
        iconText: "text-[#00BFFF]",
        iconBorder: "border-[#00BFFF]/30 shadow-[0_0_15px_rgba(0,191,255,0.4)]",
        hoverIconBg: "group-hover:bg-[#00BFFF]/10 group-hover:shadow-[0_0_25px_rgba(0,191,255,0.6)]",
        badgeText: "text-[#00BFFF]",
        gradientStart: "from-[#0088FF]/5"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence instantly.",
      icon: <Activity strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#1A1A3A] hover:border-[#9D4EDD] hover:shadow-[0_0_30px_rgba(157,78,221,0.2)]",
        iconText: "text-[#B14EFF]",
        iconBorder: "border-[#B14EFF]/30 shadow-[0_0_15px_rgba(177,78,255,0.4)]",
        hoverIconBg: "group-hover:bg-[#B14EFF]/10 group-hover:shadow-[0_0_25px_rgba(177,78,255,0.6)]",
        badgeText: "text-[#B14EFF]",
        gradientStart: "from-[#9D4EDD]/5"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports and AI Analyzer.",
      icon: <Filter strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#122A22] hover:border-[#00E676] hover:shadow-[0_0_30px_rgba(0,230,118,0.2)]",
        iconText: "text-[#00E676]",
        iconBorder: "border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.4)]",
        hoverIconBg: "group-hover:bg-[#00E676]/10 group-hover:shadow-[0_0_25px_rgba(0,230,118,0.6)]",
        badgeText: "text-[#00E676]",
        gradientStart: "from-[#00E676]/5"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, Expectancy, Max Adverse Excursion, Edge Ratio, and 50+ advanced metrics.",
      icon: <BarChart3 strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#3A1818] hover:border-[#FF5252] hover:shadow-[0_0_30px_rgba(255,82,82,0.2)]",
        iconText: "text-[#FF5252]",
        iconBorder: "border-[#FF5252]/30 shadow-[0_0_15px_rgba(255,82,82,0.4)]",
        hoverIconBg: "group-hover:bg-[#FF5252]/10 group-hover:shadow-[0_0_25px_rgba(255,82,82,0.6)]",
        badgeText: "text-[#FF5252]",
        gradientStart: "from-[#FF5252]/5"
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
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-6 z-10 bg-[#04060F] overflow-hidden font-sans"
    >
      <img src="/image/header right.png" alt="Right Glow" className="absolute top-0 right-0 w-full lg:w-[45%] h-full object-cover mix-blend-screen opacity-20 z-0 pointer-events-none" />

      {/* Grid layer */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #334155 1px, transparent 1px), 
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mb-10 w-full max-w-[1400px] mx-auto border-b border-white/5 pb-4">
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer group" onClick={() => onNavigate(false)}>
          <div className="relative">
            <AlgoSayLogo className="w-10 h-10 shadow-lg shadow-blue-500/20 rounded-xl border border-white/10 relative z-10" />
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[28px] font-black tracking-tight text-white whitespace-nowrap leading-none">
              AlgoSay
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">
              AI Quant Edge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate(false)}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-transparent border border-white/10 hover:border-white/30 hover:text-white rounded-lg transition-all duration-300"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(true)}
            className="relative overflow-hidden group px-6 py-2.5 bg-gradient-to-r from-[#2B4CFF] to-[#6025F5] text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(43,76,255,0.4)] hover:shadow-[0_0_30px_rgba(96,37,245,0.6)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign Up 
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA (HERO) */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 flex-grow relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Left Column Text, Terminal */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2 relative z-20">
          <h3 className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4D7CFF] to-[#9D4EDD] uppercase tracking-[0.15em] mb-4 drop-shadow-sm">
            NEXT-GEN AI BACKTESTING FOR INDIAN TRADERS
          </h3>
          
          <h1 className="font-black leading-[1.1] mb-6 tracking-tight flex flex-col drop-shadow-lg">
            <span className="whitespace-nowrap text-5xl lg:text-[64px] text-white mb-2">
              India’s #1 
            </span>
            <span className="whitespace-nowrap text-5xl lg:text-[64px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6A00F4] drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">AI-Powered</span>
            </span>
            <span className="whitespace-nowrap text-5xl lg:text-[64px] text-white">
              Backtesting Engine
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl backdrop-blur-sm bg-black/10 p-2 rounded-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your trading strategies.
            <br/><span className="text-[#00E5FF] font-bold mt-2 inline-block">Just type it, and we test it.</span>
          </p>

          {/* PRO TERMINAL ENGINE BOX */}
          <div className="mb-10 p-[1.5px] rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#7928CA] to-[#00E5FF] shadow-[0_0_40px_rgba(121,40,202,0.3)] relative max-w-xl backdrop-blur-md">
            <motion.div className="rounded-2xl overflow-hidden bg-[#0A0C14]/95 flex flex-col w-full h-full relative">
              <div className="bg-[#0A0C14] px-5 py-4 flex items-center justify-between border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
                  <span className="text-slate-400 text-[13px] font-mono ml-4 tracking-wide">strategy_backtest.py</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#00E676]/10 px-3 py-1.5 rounded-full border border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold text-[#00E676] tracking-widest flex items-center gap-1.5">
                    AI NEURAL ENGINE v2.1
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-[16px] flex items-start min-h-[120px] bg-transparent relative z-10">
                <div className="text-slate-600 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
                <span className="text-[#00E676] mr-3 font-semibold shrink-0">Strategy &gt;</span>
                <TypeAnimation
                  sequence={[
                    'Buy BankNifty ATM Put if RSI > 70 and MACD crosses |', 3000,
                    'Sell Nifty Straddle at 9:20 AM with 25% SL...', 3000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-[#00E5FF] font-medium leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                  repeat={Infinity}
                />
              </div>
            </motion.div>
          </div>

          {/* BUILT FOR PRECISION BANNER */}
          <div className="flex flex-col gap-4 max-w-xl relative">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 flex items-center gap-5 backdrop-blur-md">
              <div className="p-3 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)]"><Shield size={28} /></div>
              <div>
                <h4 className="text-lg font-bold text-[#00E5FF] tracking-wide mb-1">BUILT FOR PRECISION. DESIGNED FOR TRADERS.</h4>
                <p className="text-sm text-slate-400 font-medium">Advanced AI • Lightning Fast • Institutional Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 NEON BOXES + UNIQUE CTA BUTTON + STATS */}
        <div className="w-full lg:w-[55%] flex flex-col items-end relative z-20 pt-4 gap-6">
          {/* Steps Grid */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {stepsData.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative overflow-hidden group flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-default h-full ${step.theme.cardBg} ${step.theme.borderHover}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border group-hover:scale-110 ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg} bg-transparent`}>
                    {step.icon}
                  </div>
                  <span className={`text-[12px] font-black tracking-[0.1em] ${step.theme.badgeText} bg-white/5 px-3 py-1 rounded-full border border-white/10`}>
                    STEP {step.num}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h4 className="text-[17px] font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors duration-300 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-[13px] text-slate-400 font-medium leading-[1.6] group-hover:text-slate-300 transition-colors duration-300 mt-auto">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 💎 CTA CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => onNavigate(true)}
            className="w-full relative group cursor-pointer overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:shadow-[0_0_50px_rgba(121,40,202,0.45)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="bg-[#0A0C14] hover:bg-[#0E111F] rounded-[14px] p-5 sm:p-6 flex items-center justify-between transition-colors duration-300 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00E5FF]/20 rounded-full blur-2xl group-hover:bg-[#00E5FF]/35 transition-all duration-500"></div>
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#FF007A]/20 rounded-full blur-2xl group-hover:bg-[#FF007A]/35 transition-all duration-500"></div>
              
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#6025F5]/30 border border-[#00E5FF]/40 flex items-center justify-center text-2xl group-hover:scale-110 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-transform duration-300">
                    ⚡
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF]"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30">
                      Free Access
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      Instant Activation
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 group-hover:text-[#00E5FF] transition-colors">
                    Get 10 Free Backtests
                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300 text-[#00E5FF]">➜</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Start testing your trading strategies with AI speed instantly.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#00E5FF] text-slate-300 group-hover:text-black transition-all duration-300 border border-white/10 group-hover:border-[#00E5FF] shadow-md group-hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] shrink-0">
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* STATS SECTION */}
          <div className="flex flex-wrap justify-between items-center gap-4 w-full backdrop-blur-sm bg-black/10 p-5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 text-[#9D4EDD] shadow-[0_0_15px_rgba(157,78,221,0.2)]"><Rocket size={24} /></div>
                <div><h4 className="text-xl font-bold text-white tracking-tight">2.5M+</h4><p className="text-xs text-slate-400 uppercase tracking-wider">Backtests Run</p></div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]"><Users size={24} /></div>
                <div><h4 className="text-xl font-bold text-white tracking-tight">50K+</h4><p className="text-xs text-slate-400 uppercase tracking-wider">Active Traders</p></div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B14EFF]/10 border border-[#B14EFF]/30 text-[#B14EFF] shadow-[0_0_15px_rgba(177,78,255,0.2)]"><Zap size={24} /></div>
                <div><h4 className="text-xl font-bold text-white tracking-tight">AI Engine</h4><p className="text-xs text-slate-400 uppercase tracking-wider">Neural Powered</p></div>
             </div> 
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]"><ShieldCheck size={24} /></div>
                <div><h4 className="text-xl font-bold text-white tracking-tight">99.9%</h4><p className="text-xs text-slate-400 uppercase tracking-wider">Uptime</p></div>
             </div>
          </div>
          
        </div>
      </div>

      {/* 💎 COMPONENT RENDERS */}
      
      {/* 1. Results Images Showcase Component */}
      <ResultsShowcase setZoomedImage={setZoomedImage} />

      {/* 2. 50+ Strategies Component */}
      <StrategyTemplates />

      {/* 3. Strategy Capabilities Component (Already an external import) */}
      <div className="w-full relative z-20 mt-12 border-t border-white/5 pt-12">
        <StrategyCapabilities />
      </div>

      {/* 💎 IMAGE ZOOM MODAL OVERLAY */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 md:p-12 cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={zoomedImage} 
              alt="Zoomed Report" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,229,255,0.2)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default HomeView;