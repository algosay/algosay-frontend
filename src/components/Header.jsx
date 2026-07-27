import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-[#05050A]/95 border-b border-[#2d2d30]/30 py-8 px-6 flex flex-col items-center justify-center sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden min-h-[180px]">
      
      {/* CENTER SECTION: Large Images + Glowing Text - Full Width Coverage */}
      <div className="relative z-10 w-full max-w-[1500px] flex flex-row items-center justify-between gap-6 md:gap-12 lg:gap-20 px-4">
        
        {/* 💎 Left Image (Brain) - Made Larger */}
        <img 
          src="/image/header left.png" 
          alt="AI Brain" 
          className="hidden md:block w-40 h-40 lg:w-60 lg:h-60 object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-transform duration-500 hover:scale-105 shrink-0"
        />

        {/* Center Text Content */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto flex-1">
          <h2 className="text-[22px] md:text-3xl lg:text-[32px] font-bold tracking-wide mb-4 whitespace-nowrap">
            <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
            <span className="text-white">Custom Strategies, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
              Powered by AI.
            </span>
          </h2>
          
          <p className="text-[13.5px] md:text-[15.5px] text-gray-300 font-medium leading-relaxed px-2 mb-6">
            Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
          </p>

          <div className="px-8 py-2.5 rounded-full border border-blue-500/50 bg-blue-900/10 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <p className="text-[13px] md:text-[15px] text-gray-100 font-bold tracking-wide">
              Build, test, and trade with confidence.
            </p>
          </div>
        </div>

        {/* 💎 Right Image (Bull) - Made Larger */}
        <img 
          src="/image/header right.png" 
          alt="Bull Market" 
          className="hidden md:block w-40 h-40 lg:w-60 lg:h-60 object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-transform duration-500 hover:scale-105 shrink-0"
        />

      </div>
      
    </header>
  );
};

export default Header;