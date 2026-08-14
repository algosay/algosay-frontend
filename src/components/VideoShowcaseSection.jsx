import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const showcaseVideos = [
  { id: 1, src: "/video/ALGOSAY_SIGNUP-1.mp4", title: "Seamless Onboarding", desc: "Instant access to your AI edge" },
  { id: 2, src: "/video/ALGOSAY_STRATEGY ANALYSIS-2.mp4", title: "Strategy Analysis", desc: "Deep dive into precision metrics" },
  { id: 3, src: "/video/ALGOSAY_BACKTEST REPORT-3.mp4", title: "Backtest Engine", desc: "Lightning fast execution results" },
  { id: 4, src: "/video/ALGOSAY_ AI_Diagnostics-4.mp4", title: "AI Diagnostics", desc: "Neural engine trade optimizations" },
  { id: 5, src: "/video/ALGOSAY_FINAL REPORT  DOWNLOAD-5.mp4", title: "Institutional Export", desc: "Download & share your strategy" },
  { id: 6, src: "/video/ALGOSAY_Pan-India Native Support-6.mp4", title: "Pan-India Native Support", desc: "Multilingual AI in action" }
];

const VideoShowcaseSection = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <motion.div 
      id="showcase"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-[1400px] mx-auto mt-20 mb-10 relative z-20 scroll-mt-24"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
          Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">AlgoSay Workflow</span>
        </h2>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">
          See how our platform takes you from strategy creation to institutional-grade execution in seconds.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-center">
        
        <div className="w-full lg:w-[65%] relative group rounded-2xl p-[2px] bg-gradient-to-br from-[#00E5FF]/30 via-transparent to-[#7928CA]/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] hover:shadow-[0_0_80px_rgba(121,40,202,0.3)] transition-shadow duration-700">
          <div className="absolute inset-0 bg-[#00E5FF]/10 blur-3xl rounded-[30px] -z-10 group-hover:bg-[#00E5FF]/20 transition-all duration-700"></div>
          <div className="bg-[#050711] rounded-2xl overflow-hidden relative aspect-video shadow-2xl border border-white/10">
            <AnimatePresence mode='wait'>
              <motion.video
                key={activeVideoIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={showcaseVideos[activeVideoIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </motion.video>
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]"></span>
                  </span>
                  <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-md border border-[#00E5FF]/20">
                    Now Playing
                  </span>
                </div>
                <motion.h3 
                  key={`title-${activeVideoIndex}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                >
                  {showcaseVideos[activeVideoIndex].title}
                </motion.h3>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%] flex flex-col gap-3">
          {showcaseVideos.map((video, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, x: 5 }}
              onClick={() => setActiveVideoIndex(index)}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex items-center gap-4
                ${activeVideoIndex === index 
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.3)]' 
                  : 'bg-[#0A0C14]/60 border-white/5 hover:border-[#00E5FF]/20 hover:bg-white/5'
                }`}
            >
              {activeVideoIndex === index && (
                <motion.div layoutId="activeVideo" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
              )}

              <div className={`p-3 rounded-full flex items-center justify-center transition-colors duration-300
                ${activeVideoIndex === index ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-white/5 text-slate-400'}`}>
                <PlayCircle size={20} className={activeVideoIndex === index ? "fill-black stroke-black" : ""} />
              </div>
              
              <div>
                <h4 className={`text-sm font-bold tracking-wide transition-colors duration-300 ${activeVideoIndex === index ? 'text-[#00E5FF]' : 'text-slate-200'}`}>
                  {video.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{video.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VideoShowcaseSection;