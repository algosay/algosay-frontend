import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Cpu, Wand2, Activity, Filter, BarChart3, Rocket, Users, Zap, Shield, ShieldCheck, Box, Tag, FileText, Code, PenTool } from 'lucide-react'; // 💎 Added new Premium Icons for stats and nav
import StrategyCapabilities from './components/StrategyCapabilities';

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
    hidden: { opacity: 0, x: 30, scale: 0.95 }, 
    show: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  // 💎 Ultra Premium High-End Step Cards Data (UPDATED WITH DARK NEON GLOW THEMES)
  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in simple English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#1A2342] hover:border-[#0088FF] hover:shadow-[0_0_30px_rgba(0,136,255,0.2)]",
        iconBg: "bg-transparent",
        iconText: "text-[#00BFFF]",
        iconBorder: "border-[#00BFFF]/30 shadow-[0_0_15px_rgba(0,191,255,0.4)]",
        hoverIconBg: "group-hover:bg-[#00BFFF]/10 group-hover:shadow-[0_0_25px_rgba(0,191,255,0.6)]",
        badgeBg: "bg-transparent",
        badgeText: "text-[#00BFFF]",
        gradientStart: "from-[#0088FF]/5"
      }
    },
    {
      num: "02",
      title: "AI Strategy Diagnostics & Improvement",
      desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence instantly to generate a personalized report on exactly how to improve your strategy.",
      icon: <Activity strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#1A1A3A] hover:border-[#9D4EDD] hover:shadow-[0_0_30px_rgba(157,78,221,0.2)]",
        iconBg: "bg-transparent",
        iconText: "text-[#B14EFF]",
        iconBorder: "border-[#B14EFF]/30 shadow-[0_0_15px_rgba(177,78,255,0.4)]",
        hoverIconBg: "group-hover:bg-[#B14EFF]/10 group-hover:shadow-[0_0_25px_rgba(177,78,255,0.6)]",
        badgeBg: "bg-transparent",
        badgeText: "text-[#B14EFF]",
        gradientStart: "from-[#9D4EDD]/5"
      }
    },
    {
      num: "03",
      title: "Granular Deep Filtering Engine",
      desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports, Heatmaps, Drawdown Curve, PnL Charts, and AI Backtest Report Analyzer.",
      icon: <Filter strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#122A22] hover:border-[#00E676] hover:shadow-[0_0_30px_rgba(0,230,118,0.2)]",
        iconBg: "bg-transparent",
        iconText: "text-[#00E676]",
        iconBorder: "border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.4)]",
        hoverIconBg: "group-hover:bg-[#00E676]/10 group-hover:shadow-[0_0_25px_rgba(0,230,118,0.6)]",
        badgeBg: "bg-transparent",
        badgeText: "text-[#00E676]",
        gradientStart: "from-[#00E676]/5"
      }
    },
    {
      num: "04",
      title: "Institutional Pro Metrics",
      desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, Expectancy, Max Adverse Excursion, Edge Ratio, and 50+ advanced metrics — all in one place.",
      icon: <BarChart3 strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/80 backdrop-blur-xl",
        borderHover: "border-[#3A1818] hover:border-[#FF5252] hover:shadow-[0_0_30px_rgba(255,82,82,0.2)]",
        iconBg: "bg-transparent",
        iconText: "text-[#FF5252]",
        iconBorder: "border-[#FF5252]/30 shadow-[0_0_15px_rgba(255,82,82,0.4)]",
        hoverIconBg: "group-hover:bg-[#FF5252]/10 group-hover:shadow-[0_0_25px_rgba(255,82,82,0.6)]",
        badgeBg: "bg-transparent",
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
      // 💎 Ultra Premium Dark Background matching the image
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-6 z-10 bg-[#04060F] overflow-hidden font-sans"
    >
      {/* 💎 Background Image Integrations (Placed perfectly using your paths) */}
      <img src="/image/header left.png" alt="Bull Graphic" className="absolute top-[10%] left-[-5%] w-[120%] lg:w-[65%] object-contain mix-blend-screen opacity-90 z-0 pointer-events-none" />
      <img src="/image/header right.png" alt="Right Glow" className="absolute top-0 right-0 w-full lg:w-[45%] h-full object-cover mix-blend-screen opacity-20 z-0 pointer-events-none" />

      {/* 💎 Added subtle grid layer for depth */}
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

      {/* HEADER: Logo, Navbar & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mb-10 w-full max-w-[1400px] mx-auto border-b border-white/5 pb-4">
        
        {/* LOGO SECTION */}
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

        {/* 💎 Added Middle Navigation (Features, Pricing, etc.) from Image */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="flex items-center gap-2 hover:text-white transition-colors"><Box size={16}/> Features</a>
          <a href="#pricing" className="flex items-center gap-2 hover:text-white transition-colors"><Tag size={16}/> Pricing</a>
          <a href="#docs" className="flex items-center gap-2 hover:text-white transition-colors"><FileText size={16}/> Docs</a>
          <a href="#api" className="flex items-center gap-2 hover:text-white transition-colors"><Code size={16}/> API</a>
          <a href="#blog" className="flex items-center gap-2 hover:text-white transition-colors"><PenTool size={16}/> Blog</a>
        </div>
        
        {/* TOP RIGHT NAVIGATION BUTTONS */}
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

      {/* MAIN CONTENT AREA - Grid Layout matching the image */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 flex-grow relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Left Column Text, Terminal & Stats */}
        <div className="w-full lg:w-[55%] flex flex-col pt-2">
          <h3 className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4D7CFF] to-[#9D4EDD] uppercase tracking-[0.15em] mb-4 drop-shadow-sm">
            NEXT-GEN AI BACKTESTING FOR INDIAN TRADERS
          </h3>
          
          <h1 className="font-black leading-[1.1] mb-6 tracking-tight flex flex-col">
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
          
          <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your trading strategies.
            <br/><span className="text-[#00E5FF] font-bold mt-2 inline-block">Just type it, and we test it.</span>
          </p>

          {/* PRO TERMINAL ENGINE BOX - NEON GLOW STYLE */}
          <div className="mb-10 p-[1.5px] rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#7928CA] to-[#00E5FF] shadow-[0_0_40px_rgba(121,40,202,0.3)] relative max-w-xl">
            <motion.div 
              className="rounded-2xl overflow-hidden bg-[#0A0C14] flex flex-col w-full h-full relative"
            >
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
              <div className="p-6 font-mono text-[16px] flex items-start min-h-[120px] bg-[#0A0C14] relative z-10">
                <div className="text-slate-600 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
                <span className="text-[#00E676] mr-3 font-semibold shrink-0">Strategy &gt;</span>
                <TypeAnimation
                  sequence={[
                    'Buy BankNifty ATM Put if RSI > 70 and MACD crosses |',
                    3000,
                    'Sell Nifty Straddle at 9:20 AM with 25% SL...',
                    3000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-[#00E5FF] font-medium leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                  repeat={Infinity}
                />
              </div>
            </motion.div>
          </div>

          {/* 💎 NEW STATS SECTION (Replacing but keeping feature essence) */}
          <div className="flex flex-wrap items-center gap-8 mb-8">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 text-[#9D4EDD] shadow-[0_0_15px_rgba(157,78,221,0.2)]">
                  <Rocket size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">2.5M+</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Backtests Run</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">50K+</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Active Traders</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B14EFF]/10 border border-[#B14EFF]/30 text-[#B14EFF] shadow-[0_0_15px_rgba(177,78,255,0.2)]">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">AI Engine</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Neural Powered</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight">99.9%</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Uptime</p>
                </div>
             </div>
          </div>

          {/* 💎 BUILT FOR PRECISION BANNER & 10 FREE BACKTEST CTA (Combined to ensure no line/feature is missed) */}
          <div className="flex flex-col gap-4 max-w-xl relative">
            {/* Precision Banner matching image */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 flex items-center gap-5">
              <div className="p-3 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                 <Shield size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#00E5FF] tracking-wide mb-1">BUILT FOR PRECISION. DESIGNED FOR TRADERS.</h4>
                <p className="text-sm text-slate-400 font-medium">Advanced AI • Lightning Fast • Institutional Grade</p>
              </div>
            </div>

            {/* Original CTA kept intact but styled for dark mode */}
            <div 
              onClick={() => onNavigate(true)}
              className="p-4 rounded-xl cursor-pointer transition-all duration-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#4D7CFF]/50 hover:shadow-[0_0_20px_rgba(77,124,255,0.2)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#4D7CFF]/10 border border-[#4D7CFF]/30 text-[#4D7CFF] rounded-full flex items-center justify-center text-xl group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(77,124,255,0.4)] transition-all duration-300">
                    📊     
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-white tracking-tight">Get 10 Free Backtests➜</h4>
                   <p className="text-xs text-slate-400 font-medium mt-0.5">Click here to Sign Up and start backtesting.</p>
                 </div>
              </div>
              <div className="text-slate-500 p-2 group-hover:text-[#4D7CFF] transition-colors">
                 <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Steps - 💎 ULTIMATE Premium Interactive Cards (DARK NEON THEME) */}
        <div className="w-full lg:w-[45%] flex justify-end relative z-10 pt-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-5 w-full"
          >
            {stepsData.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                whileHover={{ 
                  x: -6, 
                  scale: 1.01 
                }}
                className={`relative overflow-hidden group flex items-start gap-5 p-6 rounded-2xl border transition-all duration-300 cursor-default ${step.theme.cardBg} ${step.theme.borderHover}`}
              >
                {/* 💎 Subtle Glow Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
                
                {/* 💎 Animated Icon Box */}
                <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border group-hover:scale-110 ${step.theme.iconBg} ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg}`}>
                  {step.icon}
                </div>
                
                {/* 💎 Content Container */}
                <div className="relative z-10 flex flex-col pt-1">
                  <div className="flex flex-col mb-1.5">
                    {/* Tiny Premium STEP Badge */}
                    <span className={`text-[11px] font-black tracking-[0.1em] mb-1 ${step.theme.badgeText}`}>
                      STEP {step.num}
                    </span>
                    {/* 💎 Bright Title Text */}
                    <h4 className="text-[17px] font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors duration-300">
                      {step.title}
                    </h4>
                  </div>
                  {/* 💎 Light Gray Description Text */}
                  <p className="text-[14px] text-slate-400 font-medium leading-[1.6] group-hover:text-slate-300 transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* 💎 STRATEGY CAPABILITIES SECTION ADDED AT THE BOTTOM */}
      <div className="w-full relative z-10 mt-24">
        <StrategyCapabilities />
      </div>

    </motion.div>
  );
};
export default HomeView;