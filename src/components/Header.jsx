import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-[#05050A]/95 border-b border-[#2d2d30]/30 py-6 px-4 md:py-8 md:px-6 flex flex-col items-center justify-center sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden">
      
      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[1500px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 px-2">
        
        {/* 💎 Left Image (Brain) - Responsive: Smaller on mobile/tablet, larger on desktop */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header left.png" 
            alt="AI Brain" 
            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 object-contain opacity-95 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Center Text Content */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto flex-1 px-2">
          <h2 className="text-[18px] sm:text-2xl md:text-3xl lg:text-[30px] font-bold tracking-wide mb-3 leading-snug">
            <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
            <span className="text-white">Custom Strategies, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
              Powered by AI.
            </span>
          </h2>
          
          <p className="text-[12.5px] sm:text-[14px] md:text-[15px] text-gray-300 font-medium leading-relaxed mb-5">
            Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
          </p>

          <div className="px-5 sm:px-7 py-2 rounded-full border border-blue-500/50 bg-blue-900/10 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <p className="text-[12px] sm:text-[14px] text-gray-100 font-bold tracking-wide">
              Build, test, and trade with confidence.
            </p>
          </div>
        </div>

        {/* 💎 Right Image (Bull) - Responsive: Smaller on mobile/tablet, larger on desktop */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header right.png" 
            alt="Bull Market" 
            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 object-contain opacity-95 drop-shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-transform duration-500 hover:scale-105"
          />
        </div>

      </div>
      
    </header>
  );
};

export default Header;