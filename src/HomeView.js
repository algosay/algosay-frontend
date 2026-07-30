import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Wand2, Activity, Filter, BarChart3, Rocket, Users, Zap, Shield, ShieldCheck } from 'lucide-react'; 
import StrategyCapabilities from './components/StrategyCapabilities';

// Puthusa piricha 2 components import pandrom
import ResultsShowcase from './components/ResultsShowcase';
import StrategyTemplates from './components/StrategyTemplates';

// 💎 Footer Component Import
import Footer from './components/Footer';

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

  // 💎 4 PREMIUM CORPORATE BOXES (White & Blue Theme)
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in simple English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-white/90 backdrop-blur-xl",
        borderHover: "border-slate-200 hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)]",
        iconText: "text-blue-600",
        iconBorder: "border-blue-100 shadow-sm bg-blue-50",
        hoverIconBg: "group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(37,99,235,0.3)]",
        badgeText: "text-blue-700 bg-blue-50 border-blue-100",
        gradientStart: "from-blue-50/50"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence instantly.",
      icon: <Activity strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-white/90 backdrop-blur-xl",
        borderHover: "border-slate-200 hover:border-indigo-500 hover:shadow-[0_8px_30px_rgba(79,70,229,0.12)]",
        iconText: "text-indigo-600",
        iconBorder: "border-indigo-100 shadow-sm bg-indigo-50",
        hoverIconBg: "group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(79,70,229,0.3)]",
        badgeText: "text-indigo-700 bg-indigo-50 border-indigo-100",
        gradientStart: "from-indigo-50/50"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports and AI Analyzer.",
      icon: <Filter strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-white/90 backdrop-blur-xl",
        borderHover: "border-slate-200 hover:border-emerald-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]",
        iconText: "text-emerald-600",
        iconBorder: "border-emerald-100 shadow-sm bg-emerald-50",
        hoverIconBg: "group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)]",
        badgeText: "text-emerald-700 bg-emerald-50 border-emerald-100",
        gradientStart: "from-emerald-50/50"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, Expectancy, Max Adverse Excursion, Edge Ratio, and 50+ advanced metrics.",
      icon: <BarChart3 strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-white/90 backdrop-blur-xl",
        borderHover: "border-slate-200 hover:border-violet-500 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]",
        iconText: "text-violet-600",
        iconBorder: "border-violet-100 shadow-sm bg-violet-50",
        hoverIconBg: "group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)]",
        badgeText: "text-violet-700 bg-violet-50 border-violet-100",
        gradientStart: "from-violet-50/50"
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
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-6 z-10 bg-[#F8FAFC] overflow-hidden font-sans"
    >
      {/* Background Corporate Glow */}
      <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-gradient-to-bl from-blue-100/60 via-[#F8FAFC] to-transparent z-0 pointer-events-none blur-3xl"></div>

      {/* Subtle Corporate Grid layer */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px), 
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mb-10 w-full max-w-[1400px] mx-auto border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer group" onClick={() => onNavigate(false)}>
          <div className="relative">
            <AlgoSayLogo className="w-10 h-10 shadow-md shadow-blue-500/10 rounded-xl border border-slate-200 bg-white relative z-10" />
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[28px] font-black tracking-tight text-slate-900 whitespace-nowrap leading-none">
              AlgoSay
            </span>
            <span className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase mt-1">
              AI Quant Edge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate(false)}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm rounded-lg transition-all duration-300"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(true)}
            className="relative overflow-hidden group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-[0_4px_15px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
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
          <h3 className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-[0.15em] mb-4 drop-shadow-sm">
            NEXT-GEN AI BACKTESTING FOR INDIAN TRADERS
          </h3>
          
          <h1 className="font-black leading-[1.1] mb-6 tracking-tight flex flex-col">
            <span className="whitespace-nowrap text-5xl lg:text-[64px] text-slate-900 mb-2">
              India’s #1 
            </span>
            <span className="whitespace-nowrap text-5xl lg:text-[64px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">AI-Powered</span>
            </span>
            <span className="whitespace-nowrap text-5xl lg:text-[64px] text-slate-900">
              Backtesting Engine
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed max-w-xl bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-slate-200/50 shadow-sm">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your trading strategies.
            <br/><span className="text-blue-700 font-bold mt-2 inline-block">Just type it, and we test it.</span>
          </p>

          {/* PRO TERMINAL ENGINE BOX - Kept Dark for the Premium Developer/Pro Look */}
          <div className="mb-10 p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 shadow-[0_8px_30px_rgba(37,99,235,0.15)] relative max-w-xl backdrop-blur-md hover:shadow-[0_12px_40px_rgba(79,70,229,0.25)] transition-shadow duration-500">
            <motion.div className="rounded-2xl overflow-hidden bg-[#0F172A] flex flex-col w-full h-full relative">
              <div className="bg-[#0B1120] px-5 py-4 flex items-center justify-between border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
                  <span className="text-slate-400 text-[13px] font-mono ml-4 tracking-wide">strategy_backtest.py</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest flex items-center gap-1.5">
                    AI NEURAL ENGINE v2.1
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-[16px] flex items-start min-h-[120px] bg-transparent relative z-10">
                <div className="text-slate-500 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
                <span className="text-cyan-400 mr-3 font-semibold shrink-0">Strategy &gt;</span>
                <TypeAnimation
                  sequence={[
                    'Buy BankNifty ATM Put if RSI > 70 and MACD crosses |', 3000,
                    'Sell Nifty Straddle at 9:20 AM with 25% SL...', 3000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-slate-100 font-medium leading-relaxed tracking-wide"
                  repeat={Infinity}
                />
              </div>
            </motion.div>
          </div>

          {/* BUILT FOR PRECISION BANNER */}
          <div className="flex flex-col gap-4 max-w-xl relative">
            <div className="p-5 rounded-2xl bg-white border border-blue-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600"><Shield size={28} /></div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-wide mb-1">BUILT FOR PRECISION. DESIGNED FOR TRADERS.</h4>
                <p className="text-sm text-slate-500 font-medium">Advanced AI • Lightning Fast • Institutional Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 CORPORATE BOXES + UNIQUE CTA BUTTON + STATS */}
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
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border group-hover:scale-110 ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg}`}>
                    {step.icon}
                  </div>
                  <span className={`text-[12px] font-black tracking-[0.1em] px-3 py-1 rounded-full border ${step.theme.badgeText}`}>
                    STEP {step.num}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h4 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-900 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[13px] text-slate-600 font-medium leading-[1.6] mt-auto group-hover:text-slate-700 transition-colors">
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
            className="w-full relative group cursor-pointer overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_35px_rgba(79,70,229,0.3)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="bg-white hover:bg-slate-50 rounded-[14px] p-5 sm:p-6 flex items-center justify-between transition-colors duration-300 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-100 rounded-full blur-2xl group-hover:bg-blue-200 transition-all duration-500"></div>
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-100 rounded-full blur-2xl group-hover:bg-indigo-200 transition-all duration-500"></div>
              
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 flex items-center justify-center text-2xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                    ⚡
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Free Access
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      Instant Activation
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-blue-700 transition-colors">
                    Get 10 Free Backtests Credits Now
                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300 text-blue-600">➜</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Start testing your trading strategies with AI speed instantly.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition-all duration-300 border border-slate-200 group-hover:border-blue-600 shadow-sm group-hover:shadow-md shrink-0">
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* STATS SECTION */}
          <div className="flex flex-wrap justify-between items-center gap-4 w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600"><Rocket size={24} /></div>
                <div><h4 className="text-xl font-bold text-slate-900 tracking-tight">2.5M+</h4><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Backtests Run</p></div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600"><Users size={24} /></div>
                <div><h4 className="text-xl font-bold text-slate-900 tracking-tight">50K+</h4><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Traders</p></div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-50 border border-violet-100 text-violet-600"><Zap size={24} /></div>
                <div><h4 className="text-xl font-bold text-slate-900 tracking-tight">AI Engine</h4><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Neural Powered</p></div>
             </div> 
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600"><ShieldCheck size={24} /></div>
                <div><h4 className="text-xl font-bold text-slate-900 tracking-tight">99.9%</h4><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Uptime</p></div>
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
      <div className="w-full relative z-20 mt-12 border-t border-slate-200 pt-12">
        <StrategyCapabilities />
      </div>

      {/* 💎 IMAGE ZOOM MODAL OVERLAY (Kept Dark for contrast while viewing image) */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-lg p-4 md:p-12 cursor-zoom-out"
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
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💎 Global Footer Added Here */}
      <Footer />

    </motion.div>
  );
};   

export default HomeView;