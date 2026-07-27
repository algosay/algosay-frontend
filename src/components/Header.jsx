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
          : 'py-5 px-4 md:py-7 md:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
      }`}
    >
      
      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[1500px] flex flex-row items-center justify-between gap-3 md:gap-8 px-2 mx-auto">
        
        {/* 💎 Left Image (Brain) - Larger default size, scales down nicely */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header left.png" 
            alt="AI Brain" 
            className={`object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14' 
                : 'w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56'
            }`}
          />
        </div>

        {/* Center Text Content */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto flex-1 px-2 min-w-0">
          <h2 className={`font-bold tracking-wide leading-snug transition-all duration-300 ${
            isScrolled 
              ? 'text-xs sm:text-sm md:text-base lg:text-lg mb-0' 
              : 'text-[16px] sm:text-2xl md:text-3xl lg:text-[28px] mb-2 sm:mb-3'
          }`}>
            <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
            <span className="text-white">Custom Strategies, </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
              Powered by AI.
            </span>
          </h2>
          
          {/* Subtext & Badge - Smooth Fade & Collapse */}
          <div className={`grid transition-all duration-300 ease-in-out ${
            isScrolled ? 'grid-rows-[0fr] opacity-0 mt-0' : 'grid-rows-[1fr] opacity-100 mt-2'
          }`}>
            <div className="overflow-hidden">
              <p className="text-[12px] sm:text-[14px] md:text-[15px] text-gray-300 font-medium leading-relaxed mb-4">
                Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
              </p>

              <div className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-blue-500/50 bg-blue-900/10 shadow-[0_0_20px_rgba(59,130,246,0.25)] inline-block">
                <p className="text-[11.5px] sm:text-[13.5px] text-gray-100 font-bold tracking-wide">
                  Build, test, and trade with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 💎 Right Image (Bull) - Larger default size, scales down nicely */}
        <div className="flex justify-center shrink-0">
          <img 
            src="/image/header right.png" 
            alt="Bull Market" 
            className={`object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14' 
                : 'w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56'
            }`}
          />
        </div>

      </div>
      
    </header>
  );
};

export default Header;