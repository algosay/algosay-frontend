import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-[#05050A]/95 border-b border-[#2d2d30]/30 py-5 px-6 md:px-10 flex flex-col xl:flex-row items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden">
      
      {/* LEFT SECTION: Logo */}
      <div className="relative z-10 flex items-center gap-4 w-full xl:w-1/4 mb-6 xl:mb-0 justify-center xl:justify-start">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
          <span className="text-white text-xl">✦</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
            Algo<span className="text-blue-500">Say</span>
          </h1>
          <span className="text-[10px] md:text-[12px] font-bold text-blue-400/80 tracking-[0.3em] uppercase mt-0.5">Pro Quant Edge</span>
        </div>
      </div>

      {/* CENTER SECTION: Images + Glowing Text */}
      <div className="relative z-10 flex-1 flex flex-row items-center justify-center w-full xl:w-2/4">
        
        {/* 💎 Left Image (Brain) */}
        <img 
          src="/image/header left.png" 
          alt="AI Brain" 
          className="hidden lg:block w-32 h-32 lg:w-40 lg:h-40 object-contain mr-4 opacity-90 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform hover:scale-105"
        />

        {/* Center Text Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-[19px] md:text-2xl font-bold tracking-wide mb-3">
            <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
            <span className="text-white">Custom Strategies, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
              Powered by AI.
            </span>
          </h2>
          
          <p className="text-[13px] md:text-[14.5px] text-gray-300 font-medium leading-relaxed max-w-2xl px-2 mb-5">
            Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
          </p>

          <div className="px-6 py-2 rounded-full border border-blue-500/50 bg-blue-900/10 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <p className="text-[13px] md:text-[14px] text-gray-100 font-bold tracking-wide">
              Build, test, and trade with confidence.
            </p>
          </div>
        </div>

        {/* 💎 Right Image (Bull) */}
        <img 
          src="/image/header right.png" 
          alt="Bull Market" 
          className="hidden lg:block w-32 h-32 lg:w-40 lg:h-40 object-contain ml-4 opacity-90 drop-shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-transform hover:scale-105"
        />

      </div>

      {/* RIGHT SECTION: System Status */}
      <div className="relative z-10 hidden xl:flex w-1/4 justify-end">
         <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0F1A] border border-gray-800 rounded-full shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.6)]"></div>
           <span className="text-[11px] text-gray-400 font-mono font-semibold tracking-wider">SYSTEM ONLINE</span>
         </div>
      </div>
      
    </header>
  );
};

export default Header;