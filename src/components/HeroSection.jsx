import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Shield, Rocket, Users, Zap, ShieldCheck } from 'lucide-react'; 
import AlgoSayLogo from '../AlgoSayLogo'; // Update path if needed

const HeroSection = ({ onNavigate }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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

        <div className="flex items-center gap-6 ml-auto">
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
        
        {/* LEFT COLUMN */}
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

            {/* PRECISION MULTILINGUAL AI BOX */}
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

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-between h-full w-full relative z-20 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,136,255,0.15)] border border-white/10 group bg-[#0A0C14] mt-4 md:mt-6 flex items-center justify-center flex-grow"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060F] via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00E5FF]/20 blur-[80px] rounded-full -z-0"></div>

            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6 }}
              src="/image/front-image.png" 
              alt="Algosay Trader View"
              className="w-full h-full object-contain max-h-[380px] relative z-0 p-3"
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
    </>
  );
};

export default HeroSection;