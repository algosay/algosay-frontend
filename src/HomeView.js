import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Cpu, Wand2, Activity, Filter, BarChart3, Rocket, Users, Zap, Shield, ShieldCheck, Box, Tag, FileText, Code, PenTool, Play, Server, Crosshair } from 'lucide-react'; 
import StrategyCapabilities from './components/StrategyCapabilities';

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  // 💎 Image Zoom State
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

  // 💎 4 PREMIUM NEON BOXES (Step 04 Updated as requested)
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

  // 💎 Result Images Array (Added AI Neural Engine next to Advanced Metrics)
  const resultImages = [
    { id: 1, src: '/image/PnL Ledger.png', title: 'PnL Ledger', color: 'from-[#00E5FF] to-[#0088FF]' },
    { id: 2, src: '/image/Drawdown Curve.png', title: 'Drawdown Curve', color: 'from-[#9D4EDD] to-[#6025F5]' },
    { id: 3, src: '/image/Heatmap Matrix.png', title: 'Heatmap Matrix', color: 'from-[#00E676] to-[#00B259]' },
    { id: 4, src: '/image/AI Diagnostics.png', title: 'AI Diagnostics', color: 'from-[#FF007A] to-[#C5005E]' },
    { id: 5, src: '/image/Advanced Metrics.png', title: 'Advanced Metrics', color: 'from-[#FFBD2E] to-[#E6A01A]' },
    { id: 6, src: '/image/AI Neural Engine.png', title: 'AI Neural Engine', color: 'from-[#2B4CFF] to-[#00E5FF]' }
  ];

  // 💎 50+ Default Strategies Database
  const defaultStrategies = [
    { title: "Long Call Breakout", category: "CORE DIRECTIONAL", desc: "Instrument: NIFTY 50 Options. Timeframe: 5-min candle. Execution: 09:30 AM on breaking previous day high. Action: Buy 10 LOT ATM CE Current Expiry. Target: 40% premium gain. Stoploss: 15% premium loss." },
    { title: "Long Put Breakdown", category: "CORE DIRECTIONAL", desc: "Instrument: BANKNIFTY Options. Timeframe: 15-min chart. Execution: 10:15 AM on breaking first hour low. Action: Buy 10 LOT ATM PE. Target: 60% premium gain. Stoploss: 25% premium loss." },
    { title: "Covered Call (Intraday)", category: "CORE DIRECTIONAL", desc: "Instrument: NIFTY 50. Timeframe: 15-min. Execution: Buy Future 10 LOT & Sell 10 LOT OTM CE (+150 pts) at 09:45 AM. Target: 30% of CE decay + 40 pts in Futures." },
    { title: "Long Straddle Event Play", category: "CORE DIRECTIONAL", desc: "Timeframe: 5-min. Execution: At 09:55 AM (pre-event), Buy 10 LOT ATM CE & Buy 10 LOT ATM PE. Target: 70% combined premium spike. Stoploss: 20% combined premium decay limit." },
    { title: "Long Strangle Gamma Blast", category: "CORE DIRECTIONAL", desc: "Execution: At 13:00 PM (European market open), Buy 10 LOT OTM (+100 pts) CE & Buy 10 LOT OTM (-100 pts) PE. Target: 50% combined target. Stoploss: 15% combined SL." },
    { title: "Bull Call Spread 1:2 RR", category: "CORE SPREADS", desc: "Execution: At 10:00 AM, Buy 10 LOT ATM CE, Sell 10 LOT OTM CE (+100 pts). Target: 60% of max spread profit. Stoploss: 30% of max spread loss. Exit: 15:00 PM." },
    { title: "Bear Put Spread Heavy", category: "CORE SPREADS", desc: "Execution: At 09:45 AM, Buy 10 LOT ATM PE, Sell 10 LOT OTM PE (-200 pts). Target: 70% of max spread profit (approx 80 points net)." },
    { title: "Bull Put Spread (Credit)", category: "CORE SPREADS", desc: "Execution: At 10:15 AM, Sell 10 LOT OTM PE (-100 pts), Buy 10 LOT Far OTM PE (-200 pts) for protection. Target: 80% premium decay collected." },
    { title: "Bear Call Spread (Credit)", category: "CORE SPREADS", desc: "Execution: At 10:30 AM (if rejecting R1), Sell 10 LOT OTM CE (+100 pts), Buy 10 LOT Far OTM CE (+200 pts). Target: 75% decay of net credit." },
    { title: "ITM Debit Call Spread", category: "CORE SPREADS", desc: "Execution: At 09:30 AM, Buy 10 LOT ITM CE (-100 pts), Sell 10 LOT ATM CE. Target: 50 points net strategy gain. Stoploss: 20 points net SL." },
    { title: "Safe Short Straddle", category: "CORE NON-DIR", desc: "Execution: At 09:20 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE. Target: 40% combined premium decay. Stoploss: 25% individual leg stoploss." },
    { title: "Wide Range Short Strangle", category: "CORE NON-DIR", desc: "Execution: At 09:30 AM, Sell 10 LOT OTM CE (Delta 20) & Sell 10 LOT OTM PE (Delta 20). Target: 60% decay of total premium. Stoploss: 30% SL." },
    { title: "Iron Condor (Risk Defined)", category: "CORE NON-DIR", desc: "Execution: At 10:00 AM, Sell OTM CE (+150), Buy CE (+250), Sell OTM PE (-150), Buy PE (-250). Target: 50% of max credit received." },
    { title: "Iron Butterfly (Pin Risk)", category: "CORE NON-DIR", desc: "Execution: At 09:45 AM, Sell ATM CE & PE, Buy OTM CE (+200) & OTM PE (-200). Target: 40% decay on short legs. Stoploss: 20% fixed loss." },
    { title: "Jade Lizard (Upward Bias)", category: "CORE NON-DIR", desc: "Execution: At 10:30 AM, Sell OTM PE (-100 pts), Sell OTM CE (+100 pts), Buy OTM CE (+150 pts). Target: 60% of total credit received." },
    { title: "Call Ratio Backspread", category: "CORE ADVANCED", desc: "Execution: At 10:00 AM, Sell 10 LOT ITM CE, Buy 20 LOT OTM CE. Target: 120 points explosive upside gain. Stoploss: 30 points if it hovers in the loss valley." },
    { title: "Put Ratio Backspread", category: "CORE ADVANCED", desc: "Execution: At 11:00 AM, Sell 10 LOT ITM PE, Buy 20 LOT OTM PE. Target: 150 points downside profit. Stoploss: 40 points in the trap zone." },
    { title: "Front Ratio Spread", category: "CORE ADVANCED", desc: "Execution: At 10:30 AM, Buy 10 LOT ATM CE, Sell 20 LOT OTM CE (+100 pts). Target: Max profit at short strike (approx 45 pts)." },
    { title: "Long Call Butterfly", category: "CORE ADVANCED", desc: "Execution: At 12:00 PM, Buy ITM CE (-100), Sell 2x ATM CE, Buy OTM CE (+100). Target: 80% of max reward near ATM strike." },
    { title: "Long Put Butterfly", category: "CORE ADVANCED", desc: "Execution: At 12:00 PM, Buy ITM PE (+100), Sell 2x ATM PE, Buy OTM PE (-100). Target: 75% max reward. Stoploss: 25% max loss." },
    { title: "9:16 AM Opening Drive Long", category: "TIME-BASED DIR", desc: "Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM CE. Target: Fast 30 points scalp. Stoploss: 15 points (tight SL)." },
    { title: "9:16 AM Opening Dump Short", category: "TIME-BASED DIR", desc: "Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM PE. Target: 40 points quick momentum fall. Stoploss: 20 points." },
    { title: "9:30 AM ORB Bullish", category: "TIME-BASED DIR", desc: "Execution: If 09:30 candle closes above opening 15-m high, Buy 10 LOT ATM CE. Target: 60 points. Stoploss: Low of the 09:15-09:30 candle." },
    { title: "9:30 AM ORB Bearish", category: "TIME-BASED DIR", desc: "Execution: If 09:30 candle closes below opening 15-m low, Buy 10 LOT ATM PE. Target: 75 points. Stoploss: High of the first 15-min candle." },
    { title: "1:30 PM European Breakout", category: "TIME-BASED DIR", desc: "Execution: At 13:30 PM, Buy CE if trading near day high, Buy PE if near day low. Target: 50 points momentum burst. Stoploss: 25 points." },
    { title: "9:20 AM Golden Straddle", category: "TIME-BASED NEUTRAL", desc: "Execution: Exactly at 09:20 AM, Sell ATM CE & ATM PE. Target: 60% of total premium. Stoploss: 25% individual leg SL." },
    { title: "9:30 AM Premium Strangle", category: "TIME-BASED NEUTRAL", desc: "Execution: At 09:30 AM, Sell OTM CE (+1% of spot) & Sell OTM PE (-1% of spot). Target: 70% premium decay. Stoploss: 30% individual leg SL." },
    { title: "10:30 AM Iron Condor (Low IV)", category: "TIME-BASED NEUTRAL", desc: "Execution: At 10:30 AM, Sell 15-delta CE/PE, Buy 5-delta CE/PE. Target: 50% max credit collected. Stoploss: 20% of credit received." },
    { title: "11:30 AM Lunch Theta Eater", category: "TIME-BASED NEUTRAL", desc: "Execution: At 11:30 AM, Sell ATM Straddle. Target: 30% decay (quick capture). Strict Time Exit: 13:30 PM." },
    { title: "2:30 PM Expiry Zero Hero Sell", category: "TIME-BASED NEUTRAL", desc: "Execution: At 14:30 PM on Expiry, Sell ATM CE & PE (Straddle). Target: 90% decay (holding to zero). Mandatory Exit: 15:15 PM." },
    { title: "VWAP Bounce Call (1:2 RR)", category: "INDICATORS", desc: "Execution: Buy ATM CE when price tests VWAP from above and closes green. Target: 40 points. Stoploss: 20 points (below VWAP line)." },
    { title: "VWAP Rejection Put (1:2.5 RR)", category: "INDICATORS", desc: "Execution: Buy ATM PE when price bounces to VWAP from below and forms red candle. Target: 50 points. Stoploss: 20 points." },
    { title: "RSI Extreme Reversal (<25)", category: "INDICATORS", desc: "Execution: Buy ATM CE when RSI drops below 25 and crosses back above 30. Target: 45 points gain. Stoploss: 15 points tight SL." },
    { title: "RSI Overbought Short (>80)", category: "INDICATORS", desc: "Execution: Buy ATM PE when RSI crosses below 75 from 80+. Target: 60 points target. Stoploss: 25 points stoploss." },
    { title: "MACD Zero Line Burst", category: "INDICATORS", desc: "Execution: Buy ATM CE when MACD histogram crosses above zero powerfully. Target: 50 points gain. Stoploss: 25 points." },
    { title: "EMA 9/15 Bullish Ride", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE when 9 EMA crosses above 15 EMA. Target: Open Target (Trail 9 EMA). Stoploss: 20 points." },
    { title: "EMA 9/15 Bearish Ride", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM PE when 9 EMA crosses below 15 EMA. Target: Open Target (Trail 15 EMA). Stoploss: 25 points." },
    { title: "Supertrend (10,3) Rider", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE when Supertrend turns green. Target: 80 points. Stoploss: Supertrend line value (dynamic SL)." },
    { title: "Supertrend (10,3) Crusher", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM PE when Supertrend turns red. Target: 100 points. Stoploss: Supertrend line value." },
    { title: "BB Squeeze Breakout", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE/PE on candle close outside narrowed Bollinger Bands. Target: 60 points momentum gain. Stoploss: 20 points." },
    { title: "Inside Bar Master Breakout", category: "PRICE ACTION", desc: "Execution: Buy ATM CE/PE on breaking the mother bar high/low. Target: 1:3 RR (Approx 60 pts). Stoploss: Below/Above the inside bar." },
    { title: "Pin Bar Sniper Reversal", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on bullish Pin Bar (long lower wick) close at S1/S2 support. Target: 50 points. Stoploss: 15 points." },
    { title: "Double Bottom (W) Breakout", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on W-pattern neckline breakout close. Target: 70 points. Stoploss: 25 points (below right leg)." },
    { title: "Bull Flag Continuation", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on flag resistance trendline breakout close. Target: Measured move of the pole. Stoploss: 25 points." },
    { title: "CPR Golden Bounce", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on bullish engulfing candle at CPR floor. Target: 60 points (R1). Stoploss: 20 points (below bottom CPR)." },
    { title: "1-Min Marubozu CE Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE immediately on strong 1-min solid green candle close. Target: 15 points premium spike. Stoploss: 7 points strict SL." },
    { title: "1-Min Marubozu PE Scalp", category: "SCALPING", desc: "Execution: Buy ATM PE immediately on strong 1-min solid red candle close. Target: 18 points premium drop. Stoploss: 8 points strict SL." },
    { title: "3-Min Engulfing Long Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE immediately after 3-min Bullish Engulfing close. Target: 25 points. Stoploss: 10 points." },
    { title: "3-Min Engulfing Short Scalp", category: "SCALPING", desc: "Execution: Buy ATM PE immediately after 3-min Bearish Engulfing close. Target: 30 points. Stoploss: 12 points." },
    { title: "3-Min ORB Lightning Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE/PE immediately on crossing first 3-min candle's high/low. Target: 20 points. Stoploss: 10 points." }
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

      {/* MAIN CONTENT AREA */}
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

        {/* RIGHT COLUMN: 4 NEON BOXES + UNIQUE RIGHT-SIDE CTA BUTTON + STATS */}
        <div className="w-full lg:w-[55%] flex flex-col items-end relative z-20 pt-4 gap-6">
          {/* Steps Grid (Now 4 Steps) */}
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

          {/* 💎 ULTRA-UNIQUE "GET 10 FREE BACKTESTS" CTA CARD ON THE RIGHT SIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => onNavigate(true)}
            className="w-full relative group cursor-pointer overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:shadow-[0_0_50px_rgba(121,40,202,0.45)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="bg-[#0A0C14] hover:bg-[#0E111F] rounded-[14px] p-5 sm:p-6 flex items-center justify-between transition-colors duration-300 relative overflow-hidden">
              {/* Glow effects */}
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

          {/* STATS SECTION (Moved right below the CTA Button) */}
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

      {/* 💎 RESULTS SHOWCASE SECTION */}
      <div className="w-full max-w-[1400px] mx-auto mt-32 mb-16 relative z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#4D7CFF]/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        <div className="text-center mb-16 relative z-10">
          <h3 className="text-[#00E5FF] text-[13px] font-black uppercase tracking-[0.2em] mb-4">Unmatched Analytical Power</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#00E5FF]">Result Metrics</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Explore absolute precision. Click on any report to zoom and view our institutional-grade clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 place-items-center">
          {resultImages.map((img, index) => (
            <motion.div 
              key={img.id}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={() => setZoomedImage(img.src)}
              className="relative group rounded-2xl overflow-hidden p-[2px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-500 cursor-zoom-in shadow-xl shadow-black/50 w-full min-h-[250px] max-w-md"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out z-10 pointer-events-none ${img.color}`}></div>
              <div className="bg-[#0A0C14] rounded-2xl h-full flex flex-col items-center justify-center overflow-hidden">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                   <div className="bg-black/80 text-white px-4 py-2 rounded-full border border-white/20 text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                     Click to Enlarge
                   </div>
                </div>
                <div className="w-full p-4 border-t border-white/5 bg-[#080910] z-20 absolute bottom-0">
                  <h4 className="text-center font-bold text-slate-200 text-base tracking-wide group-hover:text-white transition-colors">
                    {img.title}
                  </h4>
                  <div className={`h-[2px] w-8 mx-auto mt-2 bg-gradient-to-r ${img.color} rounded-full group-hover:w-16 transition-all duration-300`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 💎 50+ DEFAULT STRATEGIES SECTION */}
      <div className="w-full max-w-[1400px] mx-auto mt-24 mb-12 relative z-20 border-t border-white/5 pt-20">
        <div className="text-center mb-16 relative z-10">
          <h3 className="text-[#9D4EDD] text-[13px] font-black uppercase tracking-[0.2em] mb-4">No Coding. No Blocks. Just Type.</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            50+ Ready-to-Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0088FF]">Strategy Templates</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Instantly deploy from our vast library of pre-built options and equity strategies, or use them as a base to create your own unique logic.
          </p>
        </div>

        {/* Scrollable Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar p-2">
          {defaultStrategies.map((strategy, idx) => (
            <div key={idx} className="bg-[#0A0C14]/80 border border-white/10 hover:border-[#00E5FF]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] group flex flex-col justify-between h-full">
               <div>
                 <div className="flex justify-between items-start mb-3">
                   <h4 className="text-white font-bold text-lg leading-tight group-hover:text-[#00E5FF] transition-colors">{strategy.title}</h4>
                   <span className="text-[9px] font-black tracking-wider text-[#9D4EDD] bg-[#9D4EDD]/10 px-2 py-1 rounded border border-[#9D4EDD]/20 whitespace-nowrap ml-3">
                     {strategy.category}
                   </span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                   {strategy.desc}
                 </p>
               </div>
               <button className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-widest group-hover:bg-[#00E5FF]/10 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/30 transition-all flex justify-center items-center gap-2 mt-auto">
                 <Play size={14} /> USE TEMPLATE
               </button>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04060F] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* 💎 STRATEGY CAPABILITIES SECTION */}
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

      {/* Custom CSS for Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.5);
        }
      `}} />

    </motion.div>
  );
};

export default HomeView;