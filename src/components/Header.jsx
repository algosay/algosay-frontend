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
      {/* Smooth Floating Animations (subtle, and switched off for reduced-motion users) */}
      <style>
        {`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          .animate-float-left {
            animation: floatSlow 4s ease-in-out infinite;
          }
          .animate-float-right {
            animation: floatSlow 4s ease-in-out infinite;
            animation-delay: 2s;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-float-left, .animate-float-right { animation: none; }
          }
        `}
      </style>

      {/* sticky just below the 56px top nav */}
      <header
        className={`sticky top-14 z-40 mb-3 w-full rounded-xl border border-[#DDE2E9] bg-white/90 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-1.5 shadow-[0_6px_20px_rgba(18,26,43,0.08)]' : 'py-3'
        }`}
      >
        {/* MAIN CONTAINER */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-row items-center justify-between gap-3 px-4 sm:gap-6 md:px-8">

          {/* Left Image (Brain) */}
          <div className="animate-float-left flex shrink-0 justify-center">
            <img
              src="/image/header left.png"
              alt="AI Brain"
              className={`object-contain drop-shadow-[0_4px_10px_rgba(18,26,43,0.18)] transition-all duration-300 ${
                isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24'
              }`}
            />
          </div>

          {/* Center Text Content */}
          <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-2 text-center">
            <h2
              className={`font-semibold leading-tight tracking-[-0.01em] text-[#121A2B] transition-all duration-300 ${
                isScrolled ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-xl lg:text-[24px]'
              }`}
            >
              Code-free custom strategies, powered by AI.
            </h2>

            {/* Subtext & Badge - Smooth max-height transition to avoid scroll bugs */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isScrolled ? 'pointer-events-none mt-0 max-h-0 opacity-0' : 'mt-1.5 max-h-[300px] opacity-100'
              }`}
            >
              <p className="mb-2 text-[12px] font-normal leading-relaxed text-[#5B667A] sm:text-[13px]">
                Explain your strategy in your own words, in English, Tamil or Tanglish. The AI engine builds a professional-grade Python backtest in seconds.
              </p>

              <div className="inline-block rounded-full border border-[#DDE2E9] bg-[#F7F8FA] px-4 py-1">
                <p className="text-[11px] font-semibold text-[#2B3547] sm:text-[12px]">Build, test, and trade with confidence.</p>
              </div>
            </div>
          </div>

          {/* Right Image (Bull) */}
          <div className="animate-float-right flex shrink-0 justify-center">
            <img
              src="/image/header right.png"
              alt="Bull Market"
              className={`object-contain drop-shadow-[0_4px_10px_rgba(18,26,43,0.18)] transition-all duration-300 ${
                isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24'
              }`}
            />
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;
