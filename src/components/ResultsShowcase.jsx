import React from 'react';
import { motion } from 'framer-motion';

const ResultsShowcase = ({ setZoomedImage }) => {
  // 💎 Result Images Array
  const resultImages = [
    { id: 1, src: '/image/PnL Ledger.png', title: 'PnL Ledger', color: 'from-[#00E5FF] to-[#0088FF]' },
    { id: 2, src: '/image/Drawdown Curve.png', title: 'Drawdown Curve', color: 'from-[#9D4EDD] to-[#6025F5]' },
    { id: 3, src: '/image/Heatmap Matrix.png', title: 'Heatmap Matrix', color: 'from-[#00E676] to-[#00B259]' },
    { id: 4, src: '/image/AI Diagnostics.png', title: 'AI Diagnostics', color: 'from-[#FF007A] to-[#C5005E]' },
    { id: 5, src: '/image/Advanced Metrics.png', title: 'Advanced Metrics', color: 'from-[#FFBD2E] to-[#E6A01A]' },
    { id: 6, src: '/image/AI Neural Engine.png', title: 'AI Neural Engine', color: 'from-[#2B4CFF] to-[#00E5FF]' }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-32 mb-16 relative z-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#4D7CFF]/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      
      <div className="text-center mb-16 relative z-10">
        <h3 className="text-[#00E5FF] text-[13px] font-black uppercase tracking-[0.2em] mb-4">Unmatched Analytical Power</h3>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#00E5FF]">Result Metrics</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          Explore absolute precision. Click on any report to zoom and view our institutional-grade clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 place-items-center">
        {resultImages.map((img) => (
          <motion.div 
            key={img.id}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
            onClick={() => setZoomedImage(img.src)}
            className="relative group rounded-2xl overflow-hidden p-[2px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-500 cursor-zoom-in shadow-xl shadow-black/50 w-full min-h-[250px] max-w-md"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out z-10 pointer-events-none ${img.color}`}></div>
            <div className="bg-[#0A0C14] rounded-2xl h-full flex flex-col items-center justify-center overflow-hidden">
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                 <div className="bg-black/80 text-white px-4 py-2 rounded-full border border-white/20 text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                   Click to Enlarge
                 </div>
              </div>
              <div className="w-full p-4 border-t border-white/5 bg-[#080910] z-20 absolute bottom-0">
                <h4 className="text-center font-bold text-slate-200 text-base tracking-wide group-hover:text-white transition-colors">
                  {img.title}
                </h4>
                <div className={`h-[2px] w-8 mx-auto mt-2 bg-gradient-to-r ${img.color} rounded-full group-hover:w-16 transition-all duration-300`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResultsShowcase;