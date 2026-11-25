import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Hysteresis: collapse and expand ku vera vera threshold (blink / flicker loop thadukka)
    const COLLAPSE_AT = 80; // 80px thaandina mattum chinna aagum
    const EXPAND_AT = 10;   // 10px ku keela vandha mattum thirumba perusa aagum

    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > COLLAPSE_AT) return true;
        if (prev && y < EXPAND_AT) return false;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gridMask = 'radial-gradient(ellipse at center, black 30%, transparent 80%)';

  return (
    <>
      {/* Fonts + Smooth Floating Animations (subtle, and switched off for reduced-motion users) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .hd-root {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
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
        className={`hd-root sticky top-14 z-40 mb-3 w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#0B1220_0%,#111C33_55%,#16254A_100%)] backdrop-blur-md transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-1.5 shadow-[0_10px_30px_rgba(11,18,32,0.35)]' : 'py-3 shadow-[0_2px_8px_rgba(11,18,32,0.12)]'
        }`}
      >
        {/* Decorative layers: grid pattern, glow blobs, bottom accent line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: gridMask,
            WebkitMaskImage: gridMask,
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent" />

        {/* MAIN CONTAINER */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-row items-center justify-between gap-3 px-4 sm:gap-6 md:px-8">

          {/* Left Image (Brain) */}
          <div className="animate-float-left flex shrink-0 justify-center">
            <div className="rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15 backdrop-blur-sm">
              <img
                src="/image/header left.png"
                alt="AI Brain"
                className={`object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                  isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24'
                }`}
              />
            </div>
          </div>

          {/* Center Text Content */}
          <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-2 text-center">
            <h2
              className={`font-bold leading-tight tracking-[-0.02em] text-white transition-all duration-300 ${
                isScrolled ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-xl lg:text-[26px]'
              }`}
            >
              Code-free custom strategies, powered by{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">AI.</span>
            </h2>

            {/* Subtext & Badge - Smooth max-height transition to avoid scroll bugs */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isScrolled ? 'pointer-events-none mt-0 max-h-0 opacity-0' : 'mt-2 max-h-[300px] opacity-100'
              }`}
            >
              <p className="mb-2.5 text-[12px] font-normal leading-relaxed text-slate-300 sm:text-[13.5px]">
                Explain your strategy in your own words, in English, Tamil or Tanglish. The AI engine builds a professional-grade Python backtest in seconds.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[11px] font-semibold tracking-wide text-slate-100 sm:text-[12px]">Build, test, and trade with confidence.</p>
              </div>
            </div>
          </div>

          {/* Right Image (Bull) */}
          <div className="animate-float-right flex shrink-0 justify-center">
            <div className="rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15 backdrop-blur-sm">
              <img
                src="/image/header right.png"
                alt="Bull Market"
                className={`object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                  isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24'
                }`}
              />
            </div>
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;