import React from 'react';
import AlgoSayLogo from './AlgoSayLogo';

const Header = () => {
  return (
    <header className="w-full bg-[#0a0a0a]/90 border-b border-[#2d2d30]/50 py-5 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 w-full md:w-1/4 mb-4 md:mb-0 justify-center md:justify-start">
        
        {/* NEW PREMIUM LOGO INTEGRATED HERE */}
        <AlgoSayLogo className="w-12 h-12 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.30)] hover:scale-105 transition-transform duration-300" />
        
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
            Algo<span className="text-blue-500">Say</span>
          </h1>
          <span className="text-[10px] md:text-[12px] font-bold text-blue-400/80 tracking-[0.3em] uppercase mt-0.5">Pro Quant Edge</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center w-full md:w-2/4">
        <h2 className="text-[17px] md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 tracking-wide mb-1.5">
          Code-Free Custom Strategies, Powered by AI.
        </h2>
        <p className="text-[13px] md:text-[15px] text-gray-400 font-medium leading-relaxed max-w-2xl px-4">
          Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
        </p>

        <p className="text-[13px] md:text-[15px] text-gray-100 font-bold mt-2">
          Build, test, and trade with confidence.
        </p>
      </div>

      <div className="hidden md:flex w-1/4 justify-end">
         <div className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 rounded-full shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[11px] text-gray-400 font-mono font-semibold tracking-wider">SYSTEM ONLINE</span>
         </div>
      </div>
    </header>
  );
};

export default Header;