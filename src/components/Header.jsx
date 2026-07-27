import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Simple and optimized scroll listener
  useEffect(() => {
    const handleScroll = () => {
      // 20px scroll panathum background effect trigger aagum
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Unique Floating Animations for Images */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 5s ease-in-out infinite;
            animation-delay: 2.5s; /* Sync aagama vera timing-la float aaga */
          }
        `}
      </style>

      <header 
        className={`w-full sticky top-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-[#05050A]/85 backdrop-blur-2xl border-b border-[#2d2d30]/50 shadow-[0_10px_40px_rgba(0,229,255,0.08)] py-3' 
            : 'bg-transparent border-b border-transparent py-6 md:py-8'
        }`}
      >
        
        {/* MAIN CONTAINER */}
        <div className="relative z-10 w-full max-w-[1500px] flex flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 mx-auto">
          
          {/* 💎 Left Image (Brain) - with Floating effect */}
          <div className="flex justify-center shrink-0">
            <img 
              src="/image/header left.png" 
              alt="AI Brain" 
              className={`object-contain opacity-95 drop-shadow-[0_0_25px_rgba(0,229,255,0.4)] animate-float transition-all duration-500 ${
                isScrolled ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40'
              }`}
            />
          </div>

          {/* Center Text Content */}
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto flex-1 px-2">
            <h2 className={`font-bold tracking-wide leading-tight transition-all duration-500 ${
              isScrolled ? 'text-lg sm:text-xl md:text-2xl mb-1' : 'text-xl sm:text-3xl md:text-4xl mb-3'
            }`}>
              <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Code-Free </span>
              <span className="text-white">Custom Strategies, </span>
              <br className={isScrolled ? 'hidden' : 'hidden sm:block'} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b347ff] to-[#ff47d9] drop-shadow-[0_0_10px_rgba(255,71,217,0.3)]">
                Powered by AI.
              </span>
            </h2>
            
            {/* Subtext & Badge - Smooth Opacity transition instead of collapsing height */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col items-center ${
              isScrolled ? 'opacity-0 h-0 overflow-hidden scale-95' : 'opacity-100 h-auto scale-100 mt-2'
            }`}>
              <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed mb-5 max-w-xl">
                Trading logic made easy. Explain your strategy in your own words—whether in English, Tamil, or Tanglish. Our AI engine builds professional-grade Python backtests in seconds.
              </p>

              {/* Glowing Badge Effect */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-300"></div>
                <div className="relative px-6 py-2 sm:px-8 sm:py-2.5 rounded-full border border-blue-500/50 bg-[#070710] shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center">
                  <span className="text-xs sm:text-sm text-gray-100 font-bold tracking-wide">
                    Build, test, and trade with confidence.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 💎 Right Image (Bull) - with Delayed Floating effect */}
          <div className="flex justify-center shrink-0">
            <img 
              src="/image/header right.png" 
              alt="Bull Market" 
              className={`object-contain opacity-95 drop-shadow-[0_0_25px_rgba(0,255,136,0.3)] animate-float-delayed transition-all duration-500 ${
                isScrolled ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40'
              }`}
            />
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;