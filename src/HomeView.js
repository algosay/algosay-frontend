import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AlgoSayLogo from './AlgoSayLogo'; // Updated import path based on your screenshot
import { Terminal, Cpu } from 'lucide-react';

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      custom={custom}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-24 py-8 z-10"
    >
      {/* Background Details */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none" 
        style={{ 
          backgroundImage: `
            radial-gradient(#1e40af 1.2px, transparent 1.2px), 
            linear-gradient(to right, #cbd5e1 1px, transparent 1px), 
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `, 
          backgroundSize: '24px 24px, 48px 48px, 48px 48px' 
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50/30 via-white/80 to-white pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-200/40 to-indigo-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse z-0"></div>

      {/* HEADER: Logo & Login/Signup Buttons */}
      <div className="flex items-center justify-between z-50 mt-4 mb-12">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 whitespace-nowrap">
          <AlgoSayLogo className="w-12 h-12 shadow-lg shadow-blue-500/30 rounded-2xl" />
          <span className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 whitespace-nowrap">
            AlgoSay
          </span>
        </div>
        
        {/* TOP RIGHT NAVIGATION BUTTONS */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate(false)}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Centered Layout */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 flex-grow relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Left Column Text & Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h3 className="text-xs font-black text-blue-700 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
            <Terminal size={14} /> The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-4">
            Turn Everyday Words into <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Backtests.
            </span>
          </h1>
          <p className="text-base text-slate-600 font-medium mb-8 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* PRO TERMINAL ENGINE BOX */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-800 bg-slate-950 flex flex-col w-full max-w-lg transition-all duration-300 hover:shadow-blue-500/15 group">
            <div className="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/50"></div>
                <span className="text-slate-400 text-[11px] font-mono ml-2 tracking-wider">strategy_builder.exe</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Cpu size={10} /> AI Neural Engine v2.4
                </span>
              </div>
            </div>
            <div className="p-5 font-mono text-sm flex items-start min-h-[100px] bg-slate-950">
              <div className="text-slate-600 mr-3 select-none text-right font-bold text-xs pt-0.5">01</div>
              <span className="text-emerald-400 mr-2.5 font-bold shrink-0">prompt &gt;</span>
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
                className="text-blue-300 font-medium leading-relaxed"
                repeat={Infinity}
              />
            </div>
          </div>

          {/* 10 FREE BACKTESTS CTA BOX */}
          <div 
            onClick={() => onNavigate(true)}
            className="mt-2 p-3.5 rounded-xl cursor-pointer transition-all border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-100 hover:border-blue-500 hover:shadow-lg flex items-center justify-between group max-w-lg"
          >
            <div className="flex items-center gap-3.5">
               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 text-white text-2xl group-hover:scale-110 transition-transform">
                 🎁
               </div>
               <div>
                 <h4 className="text-base font-black text-slate-900">Claim 10 Free Backtests</h4>
                 <p className="text-xs text-blue-700 font-bold mt-0.5">Click here to Sign Up and start building.</p>
               </div>
            </div>
            <div className="text-blue-700 bg-white p-2.5 rounded-full shadow group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-200">
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>
        </div>

        {/* Right Column Steps */}
        <div className="w-full lg:w-1/2 flex justify-end">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-4 max-w-lg"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm shadow-inner border border-blue-300">
                1
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Describe Naturally & AI Auto-Mapping</h4>
                <p className="text-sm text-slate-600 font-medium mt-1">Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm shadow-inner border border-purple-300">
                2
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">AI Strategy Diagnostics & Improvement</h4>
                <p className="text-sm text-slate-600 font-medium mt-1">The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm shadow-inner border border-green-300">
                3
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Granular Deep Filtering Engine</h4>
                <p className="text-sm text-slate-600 font-medium mt-1">Slice your data with precision using 0DTE, Day-wise, Win/Loss, and Buy/Sell leg filters to find your true hidden edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-black text-sm shadow-inner border border-rose-300">
                4
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Institutional Pro Metrics</h4>
                <p className="text-sm text-slate-600 font-medium mt-1">Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default HomeView;