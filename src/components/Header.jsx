import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 30px scroll panna mattum trigger aagum
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Smooth Floating Animations */}
      <style>
        {`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float-left {
            animation: floatSlow 4s ease-in-out infinite;
          }
          .animate-float-right {
            animation: floatSlow 4s ease-in-out infinite;
            animation-delay: 2s;
          }
        `}
      </style>

      <header 
        className={`w-full sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'bg-[#05050A]/90 backdrop-blur-xl border-b border-[#2d2d30]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3' 
            : 'bg-[#05050A]/60 backdrop-blur-md border-b border-[#2d2d30]/30 py-5'
        }`}
      >
        {/* MAIN CONTAINER */}
        <div className="relative z-10 w-full max-w-[1500px] flex flex-row items-center justify-between gap-3 sm:gap-6 px-4 md:px-8 mx-auto">
          
          {/* 💎 Left Image (Brain) - Proper Large Size */}
          <div className="flex justify-center shrink-0">
            <img 
              src="/image/header left.png" 
              alt="AI Brain" 
              className={`object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,229,255,0.5)] animate-float-left transition-all duration-300 ${
                isScrolled 
                  ? 'w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28' 
                  : 'w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44'
              }`}
            />
          </div>

          {/* Center Text Content */}
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto flex-1 px-2">
            <h2 className={`font-bold tracking-wide leading-tight transition-all duration-300 ${
              isScrolled 
                ? 'text-sm sm:text-lg md:text-xl lg:text-2xl mb-0' 
                : 'text-base sm:text-2xl md:text-3xl lg:text-[28px] mb-2'
            }`}>
              <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
              <span className="text-white">Custom Strategies, </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
                Powered by AI.
              </span>
            </h2>
            
            {/* Subtext & Badge - Smooth max-height transition to avoid scroll bugs */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isScrolled 
                ? 'max-h-0 opacity-0 mt-0 pointer-events-none' 
                : 'max-h-[300px] opacity-100 mt-2'
            }`}>
              <p className="text-[12px] sm:text-[14px] md:text-[15px] text-gray-300 font-medium leading-relaxed mb-3">
                Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
              </p>

              <div className="px-5 py-1.5 rounded-full border border-blue-500/50 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] inline-block">
                <p className="text-[11px] sm:text-[13px] text-gray-100 font-bold tracking-wide">
                  Build, test, and trade with confidence.
                </p>
              </div>
            </div>
          </div>

          {/* 💎 Right Image (Bull) - Proper Large Size */}
          <div className="flex justify-center shrink-0">
            <img 
              src="/image/header right.png" 
              alt="Bull Market" 
              className={`object-contain opacity-95 drop-shadow-[0_0_20px_rgba(0,255,136,0.4)] animate-float-right transition-all duration-300 ${
                isScrolled 
                  ? 'w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28' 
                  : 'w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44'
              }`}
            />
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;