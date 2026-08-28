import React from 'react';
import { motion } from 'framer-motion';

const StrategyTemplates = () => {
  // 💎 14 Custom Strategies Database based on user updates (NOT A SINGLE LINE MISSED in UI)
  const defaultStrategies = [
    { 
      title: "Short Straddle Recurring (15M)", 
      category: "TIME-BASED NEUTRAL", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot (CE & PE Short). Entry: 09:30 AM & repeats every 15 mins till 15:15 PM (ATM Strike). Risk: 35% Stop Loss & 85% Target per leg. Universal square-off at 15:15 PM." 
    },
    { 
      title: "Multi-Timeframe Color Trend Short", 
      category: "TREND & MOMENTUM", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. Entry > 09:30 AM. PE Leg: If prev 15-min candle Green, short ATM PE. CE Leg: If prev candle Red, short ATM CE. Runs till 14:00. Risk: 22% SL & 65% Target per leg. Exit: 15:15 PM." 
    },
    { 
      title: "Multi-Timeframe Color Reverse Short", 
      category: "TREND & MOMENTUM", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. Entry > 09:30 AM. PE Leg: If prev 15-min candle RED, short ATM PE. CE Leg: If prev candle GREEN, short ATM CE. Runs till 14:00. Risk: 22% SL & 65% Target per leg. Exit: 15:15 PM." 
    },
    { 
      title: "3-Candle Momentum Short (15M)", 
      category: "TREND & MOMENTUM", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. 09:30 AM to 15:00 PM. CE Short: If 3 consecutive Green candles, short ATM CE next open. PE Short: If 3 consecutive Red candles, short ATM PE next open. Risk: 22% SL & 65% Target. Exit: 15:15 PM." 
    },
    { 
      title: "Candle Reverse Short Strategy (15M)", 
      category: "TREND & MOMENTUM", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. 09:30 AM to 15:00 PM. CE Short: If 3 consecutive Red candles, short ATM CE next open. PE Short: If 3 consecutive Green candles, short ATM PE next open. Risk: 22% SL & 65% Target. Exit: 15:15 PM." 
    },
    { 
      title: "Combined Premium Short Straddle", 
      category: "CORE NON-DIR", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot (CE & PE Short). Entry: 09:30 AM repeats every 15 mins till 15:15 PM (ATM Strike). Risk: Combined Premium SL 20% & Target 20%. Exit: 15:15 PM or when combined targets/SL trigger." 
    },
    { 
      title: "Inside Bar Premium Crush (15M)", 
      category: "PRICE ACTION", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot (CE & PE Short). 09:45 AM - 14:30 PM. Check prev 2 candles; if prev is an Inside Bar, short ATM Straddle at current open. Risk: 30% SL & 75% Target per leg. Exit: 15:15 PM." 
    },
    { 
      title: "Doji Breakout Close Confirmation", 
      category: "PRICE ACTION", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. 09:30 AM - 14:00 PM. Check T-2 for Doji. Bullish (T-1 closes > Doji High): Short ATM PE. Bearish (T-1 closes < Doji Low): Short ATM CE. Risk: 20% SL & 50% Target. Exit: 15:15 PM." 
    },
    { 
      title: "Doji Color Directional Short", 
      category: "PRICE ACTION", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. 09:30 AM - 14:00 PM. If T-1 is Doji: Red Doji -> Short ATM CE at current Open. Green Doji -> Short ATM PE at current Open. Risk: 20% SL & 50% Target per leg. Exit: 15:15 PM." 
    },
    { 
      title: "First-Hour ORB Mean Reversion", 
      category: "TIME-BASED DIR", 
      desc: "Asset: Sensex | 15 Mins | 1 Lot. 10:15 AM - 14:00 PM. T-1 breaks 1st HR High but closes Red -> Short ATM CE. T-1 breaks 1st HR Low but closes Green -> Short ATM PE. Risk: 25% SL & 70% Target. Exit: 15:15 PM." 
    },
    { 
      title: "Sensex 5-Min Supertrend Intraday", 
      category: "INDICATORS", 
      desc: "Asset: Sensex | 5 Mins | 10 Lots. Supertrend (10,3). ST Green -> Sell PE. ST Red -> Sell CE. Max daily limit: 1 CE trade & 1 PE trade. Risk: 100 Points SL & 200 Points Target per leg. Complete exit on SL/TG." 
    },
    { 
      title: "Sensex 5-Min MACD Crossover", 
      category: "INDICATORS", 
      desc: "Asset: Sensex | 5 Mins | 10 Lots. MACD (12,26,9). Bullish Crossover (MACD > Signal) -> Sell PE. Bearish Crossover (MACD < Signal) -> Sell CE. Max 1 CE & 1 PE trade per day. Risk: 100 Points SL & 200 Points Target." 
    },
    { 
      title: "Sensex 5-Min EMA Crossover", 
      category: "INDICATORS", 
      desc: "Asset: Sensex | 5 Mins | 10 Lots. 09:20 AM - 15:00 PM. 9 EMA crosses above 21 EMA -> Sell PE. 9 EMA crosses below 21 EMA -> Sell CE. Risk: 100 Points SL & 200 Points Target from entry price." 
    },
    { 
      title: "Sensex 5-Min RSI Crossover", 
      category: "INDICATORS", 
      desc: "Asset: Sensex | 5 Mins | 10 Lots. RSI (14). Crosses above 30 (Bullish) -> Sell PE. Crosses below 70 (Bearish) -> Sell CE. Max daily limit: 1 CE trade & 1 PE trade. Risk: 100 Points SL & 200 Points Target." 
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-24 mb-12 relative z-20 border-t border-white/5 pt-20" style={{ perspective: '1200px' }}>
      
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[50%] bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>
      
      <div className="text-center mb-16 relative z-10">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-5 py-1.5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
        >
          No Coding. No Blocks. Just Type.
        </motion.h3>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg"
        >
          Ready-to-Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FDB931] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Strategy Templates</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg max-w-2xl mx-auto font-medium"
        >
          Instantly deploy from our vast library of pre-built options and equity strategies, or use them as a base to create your own unique logic.
        </motion.p>
      </div>

      {/* Scrollable Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar p-4 relative z-10">
        {defaultStrategies.map((strategy, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // 💎 Ultra 3D Hover Animation
            whileHover={{ y: -6, scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            // 💎 3D Glassmorphism Card Box with GOLDEN Glowing effects & Border
            className="bg-[#0A0C14]/90 backdrop-blur-xl border border-[#FFD700]/30 hover:border-[#FFD700]/80 rounded-2xl p-6 transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,215,0,0.05)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] group flex flex-col justify-between h-full transform-gpu relative overflow-hidden"
          >
             {/* Golden Glow on hover inside the card */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/0 group-hover:from-[#FFD700]/10 transition-all duration-500 pointer-events-none z-0"></div>
             
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                 <h4 className="text-white font-extrabold text-lg leading-tight group-hover:text-[#FFD700] transition-colors drop-shadow-sm">
                   {strategy.title}
                 </h4>
                 <span className="text-[9px] font-black tracking-wider text-[#9D4EDD] bg-[#9D4EDD]/10 px-2.5 py-1 rounded border border-[#9D4EDD]/30 whitespace-nowrap ml-3 shadow-[0_0_10px_rgba(157,78,221,0.0)] group-hover:shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all">
                   {strategy.category}
                 </span>
               </div>
               <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium group-hover:text-slate-200 transition-colors">
                 {strategy.desc}
               </p>
             </div>
             
             {/* 💎 3D Premium Golden Number replacing the Button */}
             <div className="relative z-10 mt-auto pt-4 flex items-end justify-between border-t border-[#FFD700]/20 group-hover:border-[#FFD700]/50 transition-colors duration-300">
               <span className="text-[#FFD700]/50 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[#FFD700] transition-colors">
                 Template
               </span>
               <span className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF200] via-[#FFD700] to-[#B8860B] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:scale-110 transition-transform origin-bottom-right">
                 #{String(idx + 1).padStart(2, '0')}
               </span>
             </div>
          </motion.div>
        ))}
      </div>
      
      {/* Fade out bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04060F] via-[#04060F]/80 to-transparent pointer-events-none z-20"></div>

      {/* Custom CSS for Scrollbar - Updated with Gold Theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 12, 20, 0.5);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
      `}} />
    </div>
  );
};

export default StrategyTemplates;