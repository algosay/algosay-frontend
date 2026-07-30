import React from 'react';
import { motion } from 'framer-motion';

const ResultsShowcase = ({ setZoomedImage }) => {
  // 💎 Result Images Array
  const resultImages = [
    { id: 1, src: '/image/PnL Ledger.png', title: 'PnL Ledger', color: 'from-[#00E5FF] to-[#0088FF]', shadow: 'shadow-[0_0_30px_rgba(0,229,255,0.3)]' },
    { id: 2, src: '/image/Drawdown Curve.png', title: 'Drawdown Curve', color: 'from-[#9D4EDD] to-[#6025F5]', shadow: 'shadow-[0_0_30px_rgba(157,78,221,0.3)]' },
    { id: 3, src: '/image/Heatmap Matrix.png', title: 'Heatmap Matrix', color: 'from-[#00E676] to-[#00B259]', shadow: 'shadow-[0_0_30px_rgba(0,230,118,0.3)]' },
    { id: 4, src: '/image/AI Diagnostics.png', title: 'AI Diagnostics', color: 'from-[#FF007A] to-[#C5005E]', shadow: 'shadow-[0_0_30px_rgba(255,0,122,0.3)]' },
    { id: 5, src: '/image/Advanced Metrics.png', title: 'Advanced Metrics', color: 'from-[#FFBD2E] to-[#E6A01A]', shadow: 'shadow-[0_0_30px_rgba(255,189,46,0.3)]' },
    { id: 6, src: '/image/AI Neural Engine.png', title: 'AI Neural Engine', color: 'from-[#2B4CFF] to-[#00E5FF]', shadow: 'shadow-[0_0_30px_rgba(43,76,255,0.3)]' }
  ];

  return (
    // 💎 Added perspective for 3D depth
    <div className="w-full max-w-[1400px] mx-auto mt-32 mb-16 relative z-20 overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* 💎 Upgraded Ambient Background Glows for Dark Mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] bg-gradient-to-r from-[#4D7CFF]/10 via-[#9D4EDD]/10 to-[#00E5FF]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
      
      <div className="text-center mb-16 relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00E5FF] text-[12px] font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
        >
          Unmatched Analytical Power
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg"
        >
          Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] via-[#FF007A] to-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">Result Metrics</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg max-w-2xl mx-auto font-medium"
        >
          Explore absolute precision. Click on any report to zoom and view our institutional-grade clarity.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 place-items-center px-6 lg:px-0">
        {resultImages.map((img, index) => (
          <motion.div 
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.1 }}
            // 💎 Ultra 3D Hover Animation with rotateX and rotateY
            whileHover={{ y: -12, scale: 1.03, rotateX: 4, rotateY: -4 }}
            onClick={() => setZoomedImage(img.src)}
            // 💎 3D Glassmorphism Box Design with Drop Shadows
            className={`relative group rounded-2xl p-[2px] bg-gradient-to-b from-white/15 to-white/5 hover:from-white/30 transition-all duration-500 cursor-zoom-in shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.05)] w-full min-h-[260px] max-w-md transform-gpu ${img.shadow} hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]`}
          >
            {/* Inner Glowing Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-700 ease-out z-10 pointer-events-none rounded-2xl ${img.color}`}></div>
            
            <div className="bg-[#0A0C14]/90 backdrop-blur-xl rounded-2xl h-full flex flex-col items-center justify-center overflow-hidden relative">
              
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-[80%] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
              
              {/* Enlarge Button Overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pb-12">
                 <div className="bg-black/80 text-white px-5 py-2.5 rounded-full border border-white/20 text-sm font-bold backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                   <svg className="w-4 h-4 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                   </svg>
                   Click to Enlarge
                 </div>
              </div>
              
              {/* Bottom Title Area */}
              <div className="w-full p-4 border-t border-white/10 bg-[#0A0C14]/90 backdrop-blur-md z-20 absolute bottom-0">
                <h4 className="text-center font-extrabold text-slate-300 text-[15px] tracking-wide group-hover:text-white transition-colors drop-shadow-md">
                  {img.title}
                </h4>
                {/* Expanding Glowing Line */}
                <div className={`h-[3px] w-8 mx-auto mt-2 bg-gradient-to-r ${img.color} rounded-full group-hover:w-20 transition-all duration-500 shadow-lg`}></div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResultsShowcase;