import React, { useState } from 'react';
import { Sparkles, Star } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; 
import { Wand2, Activity, Filter, BarChart3, Rocket, Users, Zap, Shield, ShieldCheck, PlayCircle, CheckCircle2, Languages, Globe } from 'lucide-react'; 

import ResultsShowcase from './components/ResultsShowcase';
import StrategyTemplates from './components/StrategyTemplates';
import Footer from './components/Footer';

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  const [zoomedImage, setZoomedImage] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeLangIndex, setActiveLangIndex] = useState(0);

  const multilingualExamples = [
    {
      lang: "Tamil (தமிழ்)",
      flag: "🇮🇳",
      input: "BANKNIFTY 9:20 AM Straddle போட்டு 25% Stoploss வை...period JAN 2025 TO DEC 2025",
      translated: "Sell Nifty/BankNifty Straddle at 9:20 AM with 25% Stoploss... period JAN 2025 TO DEC 2025",
      report: "AI Diagnostics: Win Rate 68.4% | Max DD: 4.2% | Optimized for 0DTE execution."
    },
    {
      lang: "Hindi (हिन्दी)",
      flag: "🇮🇳",
      input: "Nifty ATM Put खरीदो जब RSI 70 से ऊपर हो... period JAN 2025 TO DEC 2025",
      translated: "Buy Nifty ATM Put when RSI is above 70... period JAN 2025 TO DEC 2025",
      report: "AI विश्लेषण: जीत दर 71.2% | अधिकतम गिरावट: 3.8% | मोमेंटम फ़िल्टर पास।"
    },
    {
      lang: "Malayalam (മലയാളം)",
      flag: "🇮🇳",
      input: "RSI 30-ൽ താഴെയാകുമ്പോൾ Call Option വാങ്ങുക...",
      translated: "Buy Call Option when RSI drops below 30... period JAN 2025 TO DEC 2025",
      report: "AI വിശകലനം: വിജയ നിരക്ക് 69.5% | പ്രകടനം മികച്ചതാണ്."
    },
    {
      lang: "Telugu (తెలుగు)",
      flag: "🇮🇳",
      input: "RSI 70 దాటినప్పుడు BankNifty Put కొనండి...",
      translated: "Buy BankNifty Put when RSI crosses above 70...",
      report: "AI విశ్లేషణ: విజయ రేటు 70.8% | డ్రాడౌన్ ఆప్టిమైజ్ చేయబడింది."
    },
    {
      lang: "English (Global)",
      flag: "🌐",
      input: "Buy BankNifty ATM Put if RSI > 70 and MACD crosses...",
      translated: "Buy BankNifty ATM Put if RSI > 70 and MACD crosses...",
      report: "AI Diagnostics: Win Rate 72.1% | Sharpe Ratio: 2.14 | Institutional Grade."
    }
  ];

  const showcaseVideos = [
    { id: 1, src: "/video/ALGOSAY_SIGNUP-1.mp4", title: "Seamless Onboarding", desc: "Instant access to your AI edge" },
    { id: 2, src: "/video/ALGOSAY_STRATEGY ANALYSIS-2.mp4", title: "Strategy Analysis", desc: "Deep dive into precision metrics" },
    { id: 3, src: "/video/ALGOSAY_BACKTEST REPORT-3.mp4", title: "Backtest Engine", desc: "Lightning fast execution results" },
    { id: 4, src: "/video/ALGOSAY_ AI_Diagnostics-4.mp4", title: "AI Diagnostics", desc: "Neural engine trade optimizations" },
    { id: 5, src: "/video/ALGOSAY_FINAL REPORT  DOWNLOAD-5.mp4", title: "Institutional Export", desc: "Download & share your strategy" },
    { id: 6, src: "/video/ALGOSAY_Pan-India Native Support-6.mp4", title: "Pan-India Native Support", desc: "Multilingual AI in action" }
  ];

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

  const stepsData = [
    {
      num: "01",
      title: "Describe Naturally & AI Auto-Mapping",
      desc: "Explain your strategy in English, Tamil, Hindi, Malayalam, or Telugu. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
      icon: <Wand2 strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
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
      desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence with multilingual support.",
      icon: <Activity strokeWidth={2} size={24} />,
      theme: {
        cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
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
        cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
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
        cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
        borderHover: "border-[#3A1818] hover:border-[#FF5252] hover:shadow-[0_0_30px_rgba(255,82,82,0.2)]",
        iconText: "text-[#FF5252]",
        iconBorder: "border-[#FF5252]/30 shadow-[0_0_15px_rgba(255,82,82,0.4)]",
        hoverIconBg: "group-hover:bg-[#FF5252]/10 group-hover:shadow-[0_0_25px_rgba(255,82,82,0.6)]",
        badgeText: "text-[#FF5252]",
        gradientStart: "from-[#FF5252]/5"
      }
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect to test the waters with basic AI capabilities.",
      features: [
        "10 Free Backtests", 
        "Basic Performance Metrics", 
        "End of Day Data", 
        "Standard Community Support"
      ],
      buttonText: "Sign Up Free",
      theme: "from-slate-600 to-slate-800",
      accent: "text-slate-300",
      glow: "hover:shadow-[0_0_30px_rgba(148,163,184,0.2)]",
      popular: false
    },
    {
      name: "Pay-As-You-Go",
      price: "₹49",
      period: " onwards",
      desc: "Buy credits as you need. No hidden fees or expiry.",
      features: [
        "Starter: 10 Credits (₹49)", 
        "Value: 25 Credits (₹99)", 
        "🌟 Popular: 50 Credits (₹179)", 
        "Pro: 100 Credits (₹299)", 
        "Custom Credits: ₹3.00 - ₹4.90/credit"
      ],
      buttonText: "View Pay-As-You-Go",
      theme: "from-[#2B4CFF] to-[#00E5FF]",
      accent: "text-[#00E5FF]",
      glow: "hover:shadow-[0_0_40px_rgba(43,76,255,0.4)]",
      popular: false
    },
    {
      name: "Unlimited Pro",
      price: "₹599",
      period: " onwards",
      desc: "Unlimited AI backtests for serious day traders.",
      features: [
        "Weekly: 7 Days (₹599)", 
        "Monthly: 30 Days (₹1599)", 
        "🔥 Quarterly: 90 Days (₹3999)", 
        "Half-Yearly: 180 Days (₹7499)", 
        "Full Institutional Reports & Filters"
      ],
      buttonText: "View Unlimited Plans",
      theme: "from-[#FF007A] to-[#7928CA]",
      accent: "text-[#FF007A]",
      glow: "hover:shadow-[0_0_40px_rgba(255,0,122,0.4)]",
      popular: true
    }
  ];

  const advancedCapabilities = [
    {
      title: "Option Spreads",
      subtitle: "Intraday Directional & Non-Directional",
      desc: "Sell ATM Straddles or Strangles at 9:20 AM while simultaneously buying OTM CE/PE for margin benefits. Flawlessly backtest Iron Condors, Iron Flies, and Butterfly Spreads.",
      tags: ["#Iron Condor", "#Iron Fly", "#Butterfly Spread", "#Straddle"],
      icon: "⚖️",
      imgUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
      theme: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Advanced Execution",
      subtitle: "Multi-Time Overlay Strategies",
      desc: "Execute selling legs at a specific time (e.g., 9:20 AM) and hedging/buying legs at a completely different time (e.g., 9:45 AM) using our advanced Split Directional Mapping.",
      tags: ["#Time Delay Legs", "#Split Entry", "#Dynamic Hedging"],
      icon: "⏱️",
      imgUrl: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?auto=format&fit=crop&q=80&w=600",
      theme: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Hybrid Indicator Logic",
      subtitle: "Dynamic Trend Following (Spot + Options)",
      desc: "Trigger ATM option strikes or Spot Futures entries automatically when the underlying Spot chart breaks RSI 60 or executes a MACD crossover, complete with predefined Target/SL.",
      tags: ["#Spot-to-Options", "#RSI Breakout", "#MACD Crossover"],
      icon: "📈",
      imgUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600",
      theme: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "No-Indicator Pure PA",
      subtitle: "Pure Price Action Breakouts",
      desc: "Deploy strict trend breakout logic without any indicators. Trigger entries perfectly when the market breaks the High or Low of the first 15-minute Opening Range (ORB).",
      tags: ["#15-Min ORB", "#High/Low Breakout", "#Strict Trend"],
      icon: "🕯️",
      imgUrl: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=600",
      theme: "from-orange-500/20 to-amber-500/20"
    },
    {
      title: "Pro Risk Engine",
      subtitle: "High-Friction Risk-Adjusted Management",
      desc: "Implement pro-level risk engines: trail Stop Loss to Cost-to-Cost (C2C) when in profit, or configure advanced SL Re-entry logic if the market reverses back to your levels.",
      tags: ["#Trailing SL (C2C)", "#SL Re-Entry", "#Risk Management"],
      icon: "🛡️",
      imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      theme: "from-red-500/20 to-rose-500/20"
    },
    {
      title: "Infinite Customization",
      subtitle: "Limitless Custom Strategy Builder",
      desc: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
      tags: ["#Zero-Code Builder", "#Custom Logic", "#Limitless"],
      icon: "🧩",
      imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
      theme: "from-indigo-500/20 to-violet-500/20"
    }
  ];

  const userReviews = [
    { name: "Karthik R.", role: "Full-time Options Trader", img: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=150", text: "AlgoSay completely changed my trading game. Typing strategies in Tamil and seeing the AI map it to complex 0DTE options is magic. The execution is flawless!" },
    { name: "Sneha Patel", role: "Retail Investor", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150", text: "No more coding! I just typed 'BankNifty straddle at 9:20' in Hindi and it backtested 3 years of data in seconds. The Granular Filtering feature is absolutely mind-blowing." },
    { name: "Amit Sharma", role: "Quantitative Analyst", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", text: "As a quant, I need precision. The 'Pro Risk Engine' handles trailing SL (C2C) and SL Re-entry exactly like institutional bots. The Profit Factor and Sortino metrics are spot on." },
    { name: "Priya Menon", role: "Part-time Trader", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", text: "The Hybrid Indicator logic is brilliant. I tested a strategy where Spot RSI triggers Option strikes. Never seen an Indian platform execute Spot-to-Options this smoothly." },
    { name: "Rajesh Kumar", role: "Swing Trader", img: "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&q=80&w=150", text: "Finally, a platform that natively supports multiple languages! The Multi-Time Overlay lets me set delay legs perfectly. Pure Price Action backtesting without indicators is epic." },
    { name: "Divya T.", role: "Systematic Trader", img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=150", text: "Tested my complex Iron Condor strategy. The AI Diagnostics automatically found the hidden drawdown leaks and optimized my exits. Institutional export reports look super professional!" }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      custom={custom}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-4 z-10 bg-[#04060F] overflow-hidden font-sans"
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

      {/* HEADER */}
      <div className="flex items-center justify-between z-50 mb-6 w-full max-w-[1400px] mx-auto border-b border-white/5 pb-4">
        <div className="flex items-center gap-3 whitespace-nowrap cursor-pointer group" onClick={() => onNavigate(false)}>
          <div className="relative">
            <AlgoSayLogo className="w-10 h-10 shadow-lg shadow-blue-500/20 rounded-xl border border-white/10 relative z-10" />
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl lg:text-[28px] font-black tracking-tight whitespace-nowrap leading-normal py-0.5">
              <span className="text-white">Algo</span>
              <span className="text-[#0234ff] drop-shadow-[0_0_12px_rgba(30,58,138,0.9)]">Say</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase -mt-1">
              AI Quant Edge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 mr-4 bg-[#0A0C14]/80 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-md shadow-xl">
            <button 
              onClick={() => scrollToSection('capabilities')} 
              className="px-4 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#FF007A] to-[#7928CA] rounded-lg shadow-[0_0_10px_rgba(255,0,122,0.3)] hover:shadow-[0_0_15px_rgba(121,40,202,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('multilingual')} 
              className="px-4 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#00E5FF] to-[#0088FF] rounded-lg shadow-[0_0_10px_rgba(0,229,255,0.3)] hover:shadow-[0_0_15px_rgba(0,136,255,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                       >
              Workflow
            </button>
            <button 
              onClick={() => scrollToSection('templates')} 
              className="px-4 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#00E676] to-[#00BFFF] rounded-lg shadow-[0_0_10px_rgba(0,230,118,0.3)] hover:shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Strategies
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="px-4 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#FF5252] to-[#FFBD2E] rounded-lg shadow-[0_0_10px_rgba(255,82,82,0.3)] hover:shadow-[0_0_15px_rgba(255,189,46,0.5)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate(false)}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF007A] to-[#7928CA] rounded-lg shadow-[0_0_15px_rgba(255,0,122,0.3)] hover:shadow-[0_0_25px_rgba(121,40,202,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
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
      </div>

      {/* MAIN CONTENT AREA (HERO) */}
      <div id="hero" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 w-full max-w-[1400px] mx-auto min-h-min scroll-mt-24 z-10 relative items-stretch">
        
        {/* LEFT COLUMN - Aligned to stretch with right */}
        <div className="flex flex-col justify-between h-full w-full pt-1 relative z-20">
          <div>
            <h3 className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4D7CFF] to-[#9D4EDD] uppercase tracking-[0.15em] mb-3 drop-shadow-sm">
              NEXT-GEN AI BACKTESTING FOR INDIAN TRADERS
            </h3>
            
            <h1 className="font-black leading-[1.15] mb-4 tracking-tight flex flex-col drop-shadow-lg">
              <span className="whitespace-nowrap text-[44px] lg:text-[54px] text-white mb-1">
                India’s #1 
              </span>
              <span className="whitespace-nowrap text-[44px] lg:text-[54px]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6A00F4] drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">AI-Powered</span>
              </span>
              <span className="whitespace-nowrap text-[44px] lg:text-[54px] text-white">
                Backtesting Engine
              </span>
            </h1>
            
            <p className="text-[16px] text-slate-300 font-medium mb-2 leading-relaxed max-w-xl backdrop-blur-md bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl shadow-lg">
            Breaking free from traditional logic. We empower retail traders to think{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500 font-extrabold">
              out-of-the-box
            </span>{' '}
            and backtest their own unique,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-extrabold">
              custom strategies
            </span>. 
            True profitability comes from thinking like an{' '}
            <span className="text-amber-400 font-bold">
              institutional trader
            </span>.
            
            <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500 font-extrabold text-lg tracking-wider">
              JUST TYPE IT. WE TEST IT.
            </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xl relative mt-auto">
            {/* PRO TERMINAL ENGINE BOX */}
            <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#7928CA] to-[#00E5FF] shadow-[0_0_40px_rgba(121,40,202,0.3)] relative w-full backdrop-blur-md z-30">
              <motion.div className="rounded-2xl overflow-hidden bg-[#0A0C14]/95 flex flex-col w-full h-full relative">
                <div className="bg-[#0A0C14] px-4 py-3 flex items-center justify-between border-b border-white/5 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
                    <span className="text-slate-400 text-[12px] font-mono ml-4 tracking-wide">multilingual_engine.py</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold text-[#00E676] tracking-widest flex items-center gap-1.5">
                      NEURAL TRANSLATOR v2.5
                    </span>
                  </div>
                </div>
                <div className="p-5 font-mono text-[15px] flex items-start min-h-[100px] bg-transparent relative z-10">
                  <div className="text-slate-600 mr-4 select-none text-right font-medium text-sm pt-0.5">01</div>
                  <span className="text-[#00E676] mr-3 font-semibold shrink-0">Input &gt;</span>
                  <TypeAnimation
                    sequence={[
                      'BANKNIFTY 9:20 AM Straddle போட்டு 25% Stoploss வை...', 3000,
                      'Nifty ATM Put खरीदो जब RSI 70 से ऊपर हो...', 3000,
                      'Buy BankNifty ATM Put if RSI > 70 and MACD crosses |', 3000,
                    ]}
                    wrapper="span"
                    speed={50}
                    className="text-[#00E5FF] font-medium leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                    repeat={Infinity}
                  />
                </div>
              </motion.div>
            </div>

            {/* PRECISION MULTILINGUAL AI BOX (ALIGNED TO MATCH) */}
            <div className="w-full">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 flex items-center gap-4 backdrop-blur-md w-full">
                <div className="p-2.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0"><Shield size={24} /></div>
                <div>
                  <h4 className="text-[15px] sm:text-base font-bold text-[#00E5FF] tracking-wide mb-0.5">BUILT FOR PRECISION. DESIGNED FOR ALL LANGUAGES.</h4>
                  <p className="text-[13px] text-slate-400 font-medium">Multilingual AI • Lightning Fast • Institutional Grade</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Image properly pushed down and matching left column height */}
        <div className="flex flex-col justify-between h-full w-full relative z-20 gap-4">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,136,255,0.15)] border border-white/10 group bg-[#0A0C14] mt-10 md:mt-14 flex items-center justify-center flex-grow"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060F] via-transparent to-transparent z-10 pointer-events-none"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00E5FF]/20 blur-[80px] rounded-full -z-0"></div>

            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6 }}
              src="/image/front-image.png" 
              alt="Algosay Trader View"
              className="w-full h-full object-contain max-h-[450px] relative z-0 p-6"
              onError={(e) => { e.target.src = "/image/Front Image.png" }}
            />
            
            {/* Overlay Badges */}
            <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2">
               <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit shadow-lg hover:border-[#00E5FF]/50 transition-colors">
                 <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]"></span>
                 <span className="text-[11px] font-black text-white tracking-widest uppercase">Algosay Engine</span>
               </div>
            </div>
          </motion.div>

          {/* CTA CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => onNavigate(true)}
            className="w-full relative group cursor-pointer overflow-hidden rounded-2xl p-[2px] mt-auto bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:shadow-[0_0_50px_rgba(121,40,202,0.45)] transition-all duration-500 hover:-translate-y-1"
          >
            <div className="bg-[#0A0C14] hover:bg-[#0E111F] rounded-[14px] p-4 sm:p-5 flex items-center justify-between transition-colors duration-300 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00E5FF]/20 rounded-full blur-2xl group-hover:bg-[#00E5FF]/35 transition-all duration-500"></div>
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#FF007A]/20 rounded-full blur-2xl group-hover:bg-[#FF007A]/35 transition-all duration-500"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#6025F5]/30 border border-[#00E5FF]/40 flex items-center justify-center text-xl group-hover:scale-110 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-transform duration-300">
                    ⚡
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF]"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/30">
                      Signup Bonus
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      Instant Activation
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 group-hover:text-[#00E5FF] transition-colors">
                    Get 10 Free Backtests Credits Now
                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300 text-[#00E5FF]">➜</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Start testing your trading strategies with AI speed instantly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/5 mt-3">
             <div className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="p-1.5 rounded-lg bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 text-[#9D4EDD] shadow-[0_0_15px_rgba(157,78,221,0.2)]"><Rocket size={20} /></div>
                <div><h4 className="text-[17px] font-bold text-white tracking-tight leading-none mb-0.5">2.5M+</h4><p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Backtests Run</p></div>
             </div>
             <div className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="p-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]"><Users size={20} /></div>
                <div><h4 className="text-[17px] font-bold text-white tracking-tight leading-none mb-0.5">50K+</h4><p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Active Traders</p></div>
             </div>
             <div className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="p-1.5 rounded-lg bg-[#B14EFF]/10 border border-[#B14EFF]/30 text-[#B14EFF] shadow-[0_0_15px_rgba(177,78,255,0.2)]"><Zap size={20} /></div>
                <div><h4 className="text-[17px] font-bold text-white tracking-tight leading-none mb-0.5">AI Engine</h4><p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Neural Powered</p></div>
             </div> 
             <div className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="p-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]"><ShieldCheck size={20} /></div>
                <div><h4 className="text-[17px] font-bold text-white tracking-tight leading-none mb-0.5">99.9%</h4><p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Uptime</p></div>
             </div>
          </div>
        </div>
      </div>

      {/* INFINITE HORIZONTAL SCROLLING STEPS */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[1400px] mx-auto mt-24 overflow-hidden z-20 px-4"
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#04060F] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#04060F] to-transparent z-20 pointer-events-none"></div>
        
        <motion.div 
          className="flex gap-6 w-max hover:[animation-play-state:paused]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {[...stepsData, ...stepsData].map((step, index) => (
            <div 
              key={index}
              className={`flex-none w-[300px] sm:w-[320px] relative overflow-hidden group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${step.theme.cardBg} ${step.theme.borderHover}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border group-hover:scale-110 group-hover:animate-pulse ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg} bg-transparent`}>
                  {React.cloneElement(step.icon, { size: 20 })}
                </div>
                <span className={`text-[10px] font-black tracking-[0.1em] ${step.theme.badgeText} bg-white/5 px-2.5 py-1 rounded-full border border-white/10 shadow-sm`}>
                  STEP {step.num}
                </span>
              </div>
              
              <div className="relative z-10 flex flex-col flex-grow">
                <h4 className="text-[15px] font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors duration-300 mb-1.5">
                  {step.title}
                </h4>
                <p className="text-[12px] text-slate-400 font-medium leading-[1.5] group-hover:text-slate-200 transition-colors duration-300 mt-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ULTRA-PREMIUM MULTILINGUAL & AI DIAGNOSTICS INTERACTIVE SECTION */}
      <motion.div 
        id="multilingual"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[1400px] mx-auto mt-12 mb-16 relative z-20 scroll-mt-24"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#9D4EDD]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            <Globe size={14} className="animate-spin" /> Pan-India Native Support
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Type in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#9D4EDD] to-[#FF007A]">Your Mother Tongue</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-base">
            AlgoSay understands <strong className="text-white">English, Tamil, Hindi, Malayalam, and Telugu</strong> seamlessly. Get instant institutional backtests and AI Diagnostics reports in your preferred language.
          </p>
        </div>

        <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] shadow-[0_0_50px_rgba(121,40,202,0.3)] hover:shadow-[0_0_80px_rgba(0,229,255,0.4)] transition-shadow duration-700">
          <div className="bg-[#0A0C14] rounded-[22px] p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>

            <div className="w-full lg:w-[40%] flex flex-col gap-3">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Languages size={18} className="text-[#00E5FF]" /> Select Your Language:
              </h4>
              {multilingualExamples.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveLangIndex(idx)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer
                    ${activeLangIndex === idx 
                      ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#7928CA]/20 border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)] text-white' 
                      : 'bg-[#050711]/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.flag}</span>
                    <span className="font-bold text-base tracking-wide">{item.lang}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${activeLangIndex === idx ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'bg-slate-700'}`}></div>
                </motion.button>
              ))}
            </div>

            <div className="w-full lg:w-[60%] flex flex-col gap-6 bg-[#050711] p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative hover:border-[#00E5FF]/30 transition-colors duration-500">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#00E5FF] to-[#7928CA] text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                Live AI Neural Translation
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-pulse"></span> Your Native Input ({multilingualExamples[activeLangIndex].lang}):
                </span>
                <div className="p-4 rounded-xl bg-black/40 border border-[#FF007A]/20 font-mono text-base text-[#00E5FF] shadow-inner transition-all duration-300">
                  "{multilingualExamples[activeLangIndex].input}"
                </div>
              </div>

              <div className="flex justify-center -my-2">
                <div className="p-2 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 text-slate-400 animate-bounce shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  ↓
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span> Quant Engine Mapping (English Standard):
                </span>
                <div className="p-4 rounded-xl bg-black/40 border border-[#00E5FF]/30 font-mono text-sm text-white shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                  {multilingualExamples[activeLangIndex].translated}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-[#00E676] animate-pulse" /> AlgoSay AI Diagnostics Report:
                </span>
                <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/40 font-mono text-xs text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]">
                  {multilingualExamples[activeLangIndex].report}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CINEMATIC VIDEO SHOWCASE SECTION */}
      <motion.div 
        id="showcase"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[1400px] mx-auto mt-20 mb-10 relative z-20 scroll-mt-24"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">AlgoSay Workflow</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            See how our platform takes you from strategy creation to institutional-grade execution in seconds.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-center">
          
          <div className="w-full lg:w-[65%] relative group rounded-2xl p-[2px] bg-gradient-to-br from-[#00E5FF]/30 via-transparent to-[#7928CA]/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] hover:shadow-[0_0_80px_rgba(121,40,202,0.3)] transition-shadow duration-700">
            <div className="absolute inset-0 bg-[#00E5FF]/10 blur-3xl rounded-[30px] -z-10 group-hover:bg-[#00E5FF]/20 transition-all duration-700"></div>
            <div className="bg-[#050711] rounded-2xl overflow-hidden relative aspect-video shadow-2xl border border-white/10">
              <AnimatePresence mode='wait'>
                <motion.video
                  key={activeVideoIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={showcaseVideos[activeVideoIndex].src} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]"></span>
                    </span>
                    <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-md border border-[#00E5FF]/20">
                      Now Playing
                    </span>
                  </div>
                  <motion.h3 
                    key={`title-${activeVideoIndex}`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  >
                    {showcaseVideos[activeVideoIndex].title}
                  </motion.h3>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[35%] flex flex-col gap-3">
            {showcaseVideos.map((video, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setActiveVideoIndex(index)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex items-center gap-4
                  ${activeVideoIndex === index 
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.3)]' 
                    : 'bg-[#0A0C14]/60 border-white/5 hover:border-[#00E5FF]/20 hover:bg-white/5'
                  }`}
              >
                {activeVideoIndex === index && (
                  <motion.div layoutId="activeVideo" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                )}

                <div className={`p-3 rounded-full flex items-center justify-center transition-colors duration-300
                  ${activeVideoIndex === index ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-white/5 text-slate-400'}`}>
                  <PlayCircle size={20} className={activeVideoIndex === index ? "fill-black stroke-black" : ""} />
                </div>
                
                <div>
                  <h4 className={`text-sm font-bold tracking-wide transition-colors duration-300 ${activeVideoIndex === index ? 'text-[#00E5FF]' : 'text-slate-200'}`}>
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{video.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="w-full scroll-mt-24">
        <ResultsShowcase setZoomedImage={setZoomedImage} />

        <div id="templates" className="scroll-mt-24">
           <StrategyTemplates />
        </div>

        {/* FULLY ANIMATED 6 CAPABILITIES BOXES SECTION INLINE */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          id="capabilities" 
          className="w-full max-w-[1400px] mx-auto relative z-20 mt-20 border-t border-white/5 pt-16 scroll-mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
              Backtest the Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">Ultra-Complex & Customized</span> Strategies
            </h2>
            <p className="text-slate-400 font-medium max-w-3xl mx-auto text-base">
              Our architecture is engineered for limitless possibilities. Seamlessly merge Spot and Options data to execute intricate time-overlays, advanced risk-adjusted logic, and highly customized market conditions in just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 lg:px-0">
            {advancedCapabilities.map((cap, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="group relative flex flex-col rounded-[24px] overflow-hidden bg-[#0A0C14] border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.2)]"
              >
                {/* Image Section inside card */}
                <div className="w-full h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <motion.img 
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    src={cap.imgUrl} 
                    alt={cap.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Icon Over Image */}
                  <div className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-xl bg-gradient-to-br ${cap.theme} backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {cap.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#0A0C14] to-[#04060F]">
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#00E5FF] transition-colors drop-shadow-sm">{cap.title}</h3>
                  <h4 className="text-[13px] font-bold text-slate-400 mb-4 tracking-wide uppercase">{cap.subtitle}</h4>
                  <p className="text-[14px] text-slate-300 font-medium leading-relaxed mb-6 flex-grow">
                    {cap.desc}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cap.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-[11px] font-semibold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-md border border-[#00E5FF]/30 group-hover:bg-[#00E5FF]/20 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PROFESSIONAL 6 REVIEWS SCROLLING SECTION WITH INDIAN USERS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          id="reviews" 
          className="w-full max-w-[1400px] mx-auto mt-24 mb-10 relative z-20 scroll-mt-24 overflow-hidden px-4"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
              Trusted by 50,000+ Indian Traders
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <p className="text-slate-400 font-medium">Rated 4.9/5 by the Professional Trading Community</p>
          </div>

          <div className="relative w-full overflow-hidden flex items-center py-6">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#04060F] to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#04060F] to-transparent z-20 pointer-events-none"></div>
            
            <motion.div 
              className="flex gap-6 w-max hover:[animation-play-state:paused]"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {[...userReviews, ...userReviews].map((review, index) => (
                <div 
                  key={index}
                  className="flex-none w-[340px] md:w-[380px] p-6 rounded-2xl bg-gradient-to-b from-[#0A0C14] to-[#04060F] border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] flex flex-col group cursor-default"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#00E5FF]/50 p-0.5 group-hover:scale-110 group-hover:border-[#FF007A]/80 transition-all duration-500 shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight group-hover:text-[#00E5FF] transition-colors">{review.name}</h4>
                      <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{review.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-[14px] leading-relaxed italic relative z-10 group-hover:text-white transition-colors duration-300">
                    <span className="text-4xl text-[#00E5FF]/20 absolute -top-3 -left-2 -z-10 font-serif">"</span>
                    {review.text}
                    <span className="text-4xl text-[#00E5FF]/20 absolute -bottom-5 right-0 -z-10 font-serif">"</span>
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* PRICING SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        id="pricing" 
        className="w-full max-w-[1400px] mx-auto mt-24 mb-16 relative z-20 scroll-mt-24 border-t border-white/5 pt-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">Pricing</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            View our plans below. Start for free and upgrade when you are ready to unleash full AI power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 md:px-0">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-[2px] rounded-3xl transition-all duration-500 bg-gradient-to-b ${plan.theme} ${plan.glow}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2B4CFF] to-[#00E5FF] text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.5)] z-20 border border-white/20">
                  Most Popular
                </div>
              )}
              
              <div className="bg-[#0A0C14] rounded-[22px] p-8 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -z-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-black ${plan.accent}`}>{plan.price}</span>
                  {plan.period && <span className="text-sm font-medium text-slate-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-400 mb-8 min-h-[40px]">{plan.desc}</p>
                
                <div className="flex flex-col gap-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${plan.accent}`} />
                      <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => onNavigate(true)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                    ${plan.popular 
                      ? 'bg-gradient-to-r from-[#2B4CFF] to-[#6025F5] text-white shadow-[0_0_20px_rgba(43,76,255,0.4)] hover:shadow-[0_0_30px_rgba(96,37,245,0.6)] border border-white/10' 
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30'}`}
                >
                  {plan.buttonText}
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-3 font-medium uppercase tracking-wider">
                  Requires Account to Access
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* IMAGE ZOOM MODAL OVERLAY */}
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

      <Footer />

    </motion.div>
  );
};   

export default HomeView;