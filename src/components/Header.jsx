import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic Scroll Listener with Throttling for Mobile Performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full bg-[#05050A]/95 border-b border-[#2d2d30]/30 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${
        isScrolled 
          ? 'py-2 px-3 md:py-2.5 md:px-6 shadow-[0_4px_20px_rgba(0,0,0,0.95)]' 
          : 'py-4 px-3 md:py-6 md:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
      }`}
    >
      
      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[1500px] flex flex-row items-center justify-between gap-2 md:gap-6 px-1 mx-auto">
        
        {/* 💎 Left Image (Brain) */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header left.png" 
            alt="AI Brain" 
            className={`object-contain opacity-95 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12' 
                : 'w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48'
            }`}
          />
        </div>

        {/* Center Text Content */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto flex-1 px-1 min-w-0">
          <h2 className={`font-bold tracking-wide leading-snug transition-all duration-300 ${
            isScrolled 
              ? 'text-xs sm:text-sm md:text-base lg:text-lg mb-0' 
              : 'text-sm sm:text-xl md:text-2xl lg:text-[26px] mb-2'
          }`}>
            <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
            <span className="text-white">Custom Strategies, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
              Powered by AI.
            </span>
          </h2>
          
          {/* Subtext & Badge - Smooth Fade & Scale using Grid/Opacity instead of Height */}
          <div className={`grid transition-all duration-300 ease-in-out ${
            isScrolled ? 'grid-rows-[0fr] opacity-0 mt-0' : 'grid-rows-[1fr] opacity-100 mt-1 sm:mt-2'
          }`}>
            <div className="overflow-hidden">
              <p className="text-[11.5px] sm:text-[13px] md:text-[14px] text-gray-300 font-medium leading-relaxed mb-3 sm:mb-4">
                Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
              </p>

              <div className="px-4 sm:px-6 py-1.5 rounded-full border border-blue-500/50 bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.25)] inline-block">
                <p className="text-[11px] sm:text-[13px] text-gray-100 font-bold tracking-wide">
                  Build, test, and trade with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 💎 Right Image (Bull) */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header right.png" 
            alt="Bull Market" 
            className={`object-contain opacity-95 drop-shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12' 
                : 'w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48'
            }`}
          />
        </div>

      </div>
      
    </header>
  );
};

export default Header;