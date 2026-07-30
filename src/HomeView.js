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

  // 💎 Premium Spring Animations for extra WOW factor
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 }, 
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 } 
    }
  };

  // 💎 4 ULTRA-COLORFUL PREMIUM BOXES (White Background Friendly)
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in simple English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-xl",
        borderHover: "border-blue-200 hover:border-blue-500 hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)]",
        iconText: "text-blue-600",
        iconBorder: "border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-100",
        hoverIconBg: "group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:scale-110",
        badgeText: "text-blue-700 bg-blue-100 border-blue-300",
        titleText: "text-blue-950 group-hover:text-blue-700",
        descText: "text-blue-900/70 group-hover:text-blue-900/90",
        glow: "from-blue-400/20"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence instantly.",
      icon: <Activity strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-gradient-to-br from-fuchsia-50/80 to-purple-50/80 backdrop-blur-xl",
        borderHover: "border-fuchsia-200 hover:border-fuchsia-500 hover:shadow-[0_10px_40px_rgba(217,70,239,0.3)]",
        iconText: "text-fuchsia-600",
        iconBorder: "border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.2)] bg-fuchsia-100",
        hoverIconBg: "group-hover:bg-fuchsia-600 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] group-hover:scale-110",
        badgeText: "text-fuchsia-700 bg-fuchsia-100 border-fuchsia-300",
        titleText: "text-fuchsia-950 group-hover:text-fuchsia-700",
        descText: "text-fuchsia-900/70 group-hover:text-fuchsia-900/90",
        glow: "from-fuchsia-400/20"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports and AI Analyzer.",
      icon: <Filter strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-xl",
        borderHover: "border-emerald-200 hover:border-emerald-500 hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)]",
        iconText: "text-emerald-600",
        iconBorder: "border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-100",
        hoverIconBg: "group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] group-hover:scale-110",
        badgeText: "text-emerald-700 bg-emerald-100 border-emerald-300",
        titleText: "text-emerald-950 group-hover:text-emerald-700",
        descText: "text-emerald-900/70 group-hover:text-emerald-900/90",
        glow: "from-emerald-400/20"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, Expectancy, Max Adverse Excursion, Edge Ratio, and 50+ advanced metrics.",
      icon: <BarChart3 strokeWidth={2.5} size={24} />,
      theme: {
        cardBg: "bg-gradient-to-br from-rose-50/80 to-orange-50/80 backdrop-blur-xl",
        borderHover: "border-rose-200 hover:border-rose-500 hover:shadow-[0_10px_40px_rgba(244,63,94,0.3)]",
        iconText: "text-rose-600",
        iconBorder: "border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-rose-100",
        hoverIconBg: "group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] group-hover:scale-110",
        badgeText: "text-rose-700 bg-rose-100 border-rose-300",
        titleText: "text-rose-950 group-hover:text-rose-700",
        descText: "text-rose-900/70 group-hover:text-rose-900/90",
        glow: "from-rose-400/20"
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
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-6 z-10 bg-white overflow-hidden font-sans"
    >
      {/* Super Colorful Gradient Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-300/40 via-purple-300/30 to-pink-300/40 rounded-full blur-[100px] z-0 pointer-events-none mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-300/30 via-cyan-300/30 to-blue-300/30 rounded-full blur-[120px] z-0 pointer-events-none mix-blend-multiply"></div>

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mb-10 w-full max-w-[1400px] mx-auto border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer group" onClick={() => onNavigate(false)}>
          <div className="relative">
            <AlgoSayLogo className="w-10 h-10 shadow-[0_5px_15px_rgba(99,102,241,0.3)] rounded-xl border-2 border-indigo-100 bg-white relative z-10 transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl lg:text-[28px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-purple-900 whitespace-nowrap leading-none">
              AlgoSay
            </span>
            <span className="text-[10px] text-pink-600 font-extrabold tracking-[0.2em] uppercase mt-1">
              AI Quant Edge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate(false)}
            className="px-5 py-2.5 text-sm font-extrabold text-indigo-700 bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-xl transition-all duration-300"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(true)}
            className="relative overflow-hidden group px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-[0_5px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.5)] transition-all duration-300 hover:-translate-y-1"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10 flex items-center gap-2">
              Sign Up 
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA (HERO) */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 flex-grow relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Left Column Text, Terminal */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2 relative z-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="inline-block px-4 py-1.5 rounded-full border-2 border-blue-200 bg-blue-50 text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 uppercase tracking-[0.15em] mb-6 shadow-sm">
              NEXT-GEN AI BACKTESTING FOR INDIAN TRADERS
            </h3>
            
            <h1 className="font-black leading-[1.15] mb-6 tracking-tight flex flex-col">
              <span className="whitespace-nowrap text-5xl lg:text-[64px] text-slate-900 mb-2 drop-shadow-sm">
                India’s #1 
              </span>
              <span className="whitespace-nowrap text-5xl lg:text-[64px]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">AI-Powered</span>
              </span>
              <span className="whitespace-nowrap text-5xl lg:text-[64px] text-slate-900">
                Backtesting Engine
              </span>
            </h1>
            
            <p className="text-lg text-slate-700 font-bold mb-8 leading-relaxed max-w-xl bg-white/60 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your trading strategies.
              <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500 font-black mt-2 inline-block text-xl">Just type it, and we test it.</span>
            </p>
          </motion.div>

          {/* PRO TERMINAL ENGINE BOX - Dark vibrant look inside to make neon colors pop, glowing vibrant border outside */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-10 p-[3px] rounded-[20px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_15px_40px_rgba(168,85,247,0.3)] relative max-w-xl hover:shadow-[0_20px_50px_rgba(236,72,153,0.4)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="rounded-[17px] overflow-hidden bg-[#0A0F24] flex flex-col w-full h-full relative">
              <div className="bg-[#111836] px-5 py-4 flex items-center justify-between border-b border-indigo-500/30 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_15px_rgba(255,95,86,0.6)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_15px_rgba(255,189,46,0.6)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_15px_rgba(39,201,63,0.6)]"></div>
                  <span className="text-indigo-300 text-[13px] font-mono ml-4 tracking-wide font-bold">strategy_ai_core.py</span>
                </div>
                <div className="flex items-center gap-1.5 bg-cyan-500/20 px-3 py-1.5 rounded-full border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono font-black text-cyan-300 tracking-widest flex items-center gap-1.5">
                    NEURAL ENGINE
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-[16px] flex items-start min-h-[120px] bg-transparent relative z-10">
                <div className="text-indigo-500 mr-4 select-none text-right font-bold text-sm pt-0.5">01</div>
                <span className="text-pink-400 mr-3 font-bold shrink-0">Strategy &gt;</span>
                <TypeAnimation
                  sequence={[
                    'Buy BankNifty ATM Put if RSI > 70 and MACD crosses |', 3000,
                    'Sell Nifty Straddle at 9:20 AM with 25% SL...', 3000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-cyan-300 font-bold leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  repeat={Infinity}
                />
              </div>
            </div>
          </motion.div>

          {/* BUILT FOR PRECISION BANNER - Colorful */}
          <div className="flex flex-col gap-4 max-w-xl relative">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 flex items-center gap-5 shadow-[0_8px_20px_rgba(59,130,246,0.1)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.2)] transition-all">
              <div className="p-3 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-700 shadow-inner"><Shield size={28} /></div>
              <div>
                <h4 className="text-lg font-black text-indigo-950 tracking-wide mb-1">BUILT FOR PRECISION. DESIGNED FOR TRADERS.</h4>
                <p className="text-sm text-indigo-700/80 font-bold">Advanced AI • Lightning Fast • Institutional Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 COLORFUL BOXES + UNIQUE CTA BUTTON + STATS */}
        <div className="w-full lg:w-[55%] flex flex-col items-end relative z-20 pt-4 gap-6">
          {/* Steps Grid */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {stepsData.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                whileHover={{ y: -8, scale: 1.03 }}
                className={`relative overflow-hidden group flex flex-col p-6 rounded-[20px] border-2 transition-all duration-400 cursor-default h-full ${step.theme.cardBg} ${step.theme.borderHover}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.glow}`}></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg}`}>
                    {step.icon}
                  </div>
                  <span className={`text-[11px] font-black tracking-[0.15em] px-3 py-1.5 rounded-lg border-2 shadow-sm ${step.theme.badgeText}`}>
                    STEP {step.num}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  <h4 className={`text-[18px] font-black tracking-tight leading-tight mb-3 transition-colors duration-300 ${step.theme.titleText}`}>
                    {step.title}
                  </h4>
                  <p className={`text-[14px] font-bold leading-[1.6] mt-auto transition-colors duration-300 ${step.theme.descText}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 💎 ULTRA VIBRANT CTA CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            onClick={() => onNavigate(true)}
            className="w-full relative group cursor-pointer overflow-hidden rounded-[24px] p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_15px_40px_rgba(168,85,247,0.35)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.5)] transition-all duration-500 hover:-translate-y-1.5"
          >
            <div className="bg-white rounded-[21px] p-6 sm:p-7 flex items-center justify-between transition-colors duration-300 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-100/80 rounded-full blur-2xl group-hover:bg-pink-200 transition-all duration-700"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-100/80 rounded-full blur-2xl group-hover:bg-blue-200 transition-all duration-700"></div>
              
              <div className="flex items-center gap-5 sm:gap-6 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 border-2 border-purple-200 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 shadow-[0_5px_15px_rgba(168,85,247,0.2)] transition-transform duration-500">
                    🚀
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-600 border-2 border-white"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-lg border-2 border-blue-200 shadow-sm">
                      Free Access
                    </span>
                    <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-lg border-2 border-orange-200 shadow-sm">
                      Instant Activation
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-purple-900 tracking-tight flex items-center gap-2 group-hover:from-blue-600 group-hover:to-pink-600 transition-all">
                    Get 10 Free Backtests Credits
                    <span className="inline-block group-hover:translate-x-2 transition-transform duration-300 text-pink-500">➜</span>
                  </h4>
                  <p className="text-sm text-slate-600 font-bold mt-1">
                    Start testing your trading strategies with AI speed instantly.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 text-slate-400 group-hover:text-white transition-all duration-500 border-2 border-slate-200 group-hover:border-transparent shadow-md shrink-0">
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* COLORFUL STATS SECTION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2">
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center text-center p-4 rounded-[16px] bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-100 shadow-[0_5px_15px_rgba(79,70,229,0.08)]">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 mb-2 shadow-sm"><Rocket size={22} /></div>
                <h4 className="text-xl font-black text-indigo-950 tracking-tight">2.5M+</h4>
                <p className="text-[10px] text-indigo-700/80 font-black uppercase tracking-widest mt-1">Backtests Run</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center text-center p-4 rounded-[16px] bg-gradient-to-b from-blue-50 to-white border-2 border-blue-100 shadow-[0_5px_15px_rgba(59,130,246,0.08)]">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 mb-2 shadow-sm"><Users size={22} /></div>
                <h4 className="text-xl font-black text-blue-950 tracking-tight">50K+</h4>
                <p className="text-[10px] text-blue-700/80 font-black uppercase tracking-widest mt-1">Active Traders</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center text-center p-4 rounded-[16px] bg-gradient-to-b from-purple-50 to-white border-2 border-purple-100 shadow-[0_5px_15px_rgba(168,85,247,0.08)]">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 mb-2 shadow-sm"><Zap size={22} /></div>
                <h4 className="text-xl font-black text-purple-950 tracking-tight">AI Engine</h4>
                <p className="text-[10px] text-purple-700/80 font-black uppercase tracking-widest mt-1">Neural Powered</p>
             </motion.div> 
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center text-center p-4 rounded-[16px] bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-100 shadow-[0_5px_15px_rgba(16,185,129,0.08)]">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 mb-2 shadow-sm"><ShieldCheck size={22} /></div>
                <h4 className="text-xl font-black text-emerald-950 tracking-tight">99.9%</h4>
                <p className="text-[10px] text-emerald-700/80 font-black uppercase tracking-widest mt-1">Uptime</p>
             </motion.div>
          </div>
          
        </div>
      </div>

      {/* 💎 COMPONENT RENDERS */}
      
      {/* 1. Results Images Showcase Component */}
      <div className="w-full relative z-20 mt-10">
        <ResultsShowcase setZoomedImage={setZoomedImage} />
      </div>

      {/* 2. 50+ Strategies Component */}
      <div className="w-full relative z-20 mt-8">
        <StrategyTemplates />
      </div>

      {/* 3. Strategy Capabilities Component */}
      <div className="w-full relative z-20 mt-12 border-t-2 border-slate-100 pt-12">
        <StrategyCapabilities />
      </div>

      {/* 💎 IMAGE ZOOM MODAL OVERLAY (Dark for viewing clear images) */}
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
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-pink-500 hover:text-white p-3 rounded-full transition-colors shadow-lg"
              onClick={() => setZoomedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              src={zoomedImage} 
              alt="Zoomed Report" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(236,72,153,0.3)] border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💎 Global Footer */}
      <Footer />

    </motion.div>
  );
};   

export default HomeView;