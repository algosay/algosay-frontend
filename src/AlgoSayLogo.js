import React from 'react';

const AlgoSayLogo = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Deep Dark Space Background for Premium Institutional Feel */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" /> {/* Slate 900 */}
          <stop offset="100%" stopColor="#020617" /> {/* Slate 950 */}
        </linearGradient>
        
        {/* Subtle Glassy Border */}
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" /> 
          <stop offset="50%" stopColor="#0F172A" /> 
          <stop offset="100%" stopColor="#1E293B" /> 
        </linearGradient>

        {/* Neon Blue-Indigo Gradient for the 'A' Legs (AI/Tech Vibe) */}
        <linearGradient id="aGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" /> {/* Light Cyber Blue */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* Deep Blue */}
          <stop offset="100%" stopColor="#6366F1" /> {/* Indigo */}
        </linearGradient>

        {/* Emerald Green Gradient for Trading Chart (Profit Vibe) */}
        <linearGradient id="profitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" /> {/* Bright Emerald */}
          <stop offset="100%" stopColor="#059669" /> {/* Dark Emerald */}
        </linearGradient>

        {/* Premium Neon Drop Shadow for 3D Pop */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#3B82F6" floodOpacity="0.4"/>
        </filter>
        
        {/* Ambient Back Glow to make it look active */}
        <filter id="ambientBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {/* 1. Base App Icon Background (Squircle) */}
      <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
      
      {/* 2. Glassy Stroke Border */}
      <rect x="2" y="2" width="508" height="508" rx="126" stroke="url(#borderGrad)" strokeWidth="4" />

      {/* 3. Ambient Glowing Sphere in the background center */}
      <circle cx="256" cy="256" r="140" fill="#3B82F6" opacity="0.15" filter="url(#ambientBlur)" />

      {/* 4. The Main 'A' Shape (Left and Right Legs) */}
      <path 
        d="M 256 120 L 130 380" 
        stroke="url(#aGrad)" 
        strokeWidth="56" 
        strokeLinecap="round" 
        filter="url(#neonGlow)"
      />
      <path 
        d="M 256 120 L 382 380" 
        stroke="url(#aGrad)" 
        strokeWidth="56" 
        strokeLinecap="round" 
        filter="url(#neonGlow)"
      />

      {/* 5. The Algorithmic Trading Line (Acts as the 'A' Crossbar!) */}
      {/* It zig-zags up like a successful backtested strategy */}
      <path 
        d="M 150 310 L 220 230 L 270 270 L 370 160" 
        stroke="url(#profitGrad)" 
        strokeWidth="40" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 6. AI Target / Profit Node at the peak of the chart */}
      <circle cx="370" cy="160" r="20" fill="#34D399" />
      <circle cx="370" cy="160" r="10" fill="#022C22" />
    </svg>
  );
};

export default AlgoSayLogo;