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
        {/* Premium App Background Gradient */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" /> {/* Blue 600 */}
          <stop offset="100%" stopColor="#4338CA" /> {/* Indigo 700 */}
        </linearGradient>
        
        {/* Right Bar Gradient (Slightly lighter for 3D depth) */}
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" /> {/* Blue 300 */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue 500 */}
        </linearGradient>
      </defs>

      {/* Background Icon Shape (Squircle) */}
      <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />

      {/* Left Upward Trading Bar */}
      <path 
        d="M176 368 L240 176" 
        stroke="white" 
        strokeWidth="56" 
        strokeLinecap="round" 
      />
      
      {/* Right Upward Trading Bar */}
      <path 
        d="M336 368 L272 176" 
        stroke="url(#barGrad)" 
        strokeWidth="56" 
        strokeLinecap="round" 
      />
      
      {/* Horizontal Connection (The 'A' bridge) */}
      <path 
        d="M192 288 L320 288" 
        stroke="white" 
        strokeWidth="48" 
        strokeLinecap="round" 
      />

      {/* AI Neural Node (Top Dot) */}
      <circle cx="256" cy="120" r="32" fill="#60A5FA" />
      <circle cx="256" cy="120" r="16" fill="white" />
    </svg>
  );
};

export default AlgoSayLogo;