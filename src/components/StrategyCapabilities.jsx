import React from 'react';
import { motion } from 'framer-motion';

const strategyList = [
  {
    id: 1,
    title: "Intraday Directional & Non-Directional Spreads",
    badge: "Option Spreads",
    theme: {
      borderHover: "hover:border-blue-400 hover:shadow-blue-500/10",
      iconBg: "bg-blue-50 border-blue-100/70",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      gradientStart: "from-blue-50/60"
    },
    description: "Sell ATM Straddles or Strangles at 9:20 AM while simultaneously buying OTM CE/PE for margin benefits. Flawlessly backtest Iron Condors, Iron Flies, and Butterfly Spreads.",
    tags: ["Iron Condor", "Iron Fly", "Butterfly Spread", "Straddle/Strangle"],
    icon: "⚖️"
  },
  {
    id: 2,
    title: "Multi-Time Overlay Strategies",
    badge: "Advanced Execution",
    theme: {
      borderHover: "hover:border-purple-400 hover:shadow-purple-500/10",
      iconBg: "bg-purple-50 border-purple-100/70",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      gradientStart: "from-purple-50/60"
    },
    description: "Execute selling legs at a specific time (e.g., 9:20 AM) and hedging/buying legs at a completely different time (e.g., 9:45 AM) using our advanced Split Directional Mapping.",
    tags: ["Time Delay Legs", "Split Entry", "Dynamic Hedging"],
    icon: "⏱️"
  },
  {
    id: 3,
    title: "Dynamic Trend Following (Spot + Options)",
    badge: "Hybrid Indicator Logic",
    theme: {
      borderHover: "hover:border-emerald-400 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-50 border-emerald-100/70",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      gradientStart: "from-emerald-50/60"
    },
    description: "Trigger ATM option strikes or Spot Futures entries automatically when the underlying Spot chart breaks RSI 60 or executes a MACD crossover, complete with predefined Target/SL.",
    tags: ["Spot-to-Options", "RSI Breakout", "MACD Crossover", "ATM Trading"],
    icon: "📈"
  },
  {
    id: 4,
    title: "Pure Price Action Breakouts",
    badge: "No-Indicator Pure PA",
    theme: {
      borderHover: "hover:border-amber-400 hover:shadow-amber-500/10",
      iconBg: "bg-amber-50 border-amber-100/70",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      gradientStart: "from-amber-50/60"
    },
    description: "Deploy strict trend breakout logic without any indicators. Trigger entries perfectly when the market breaks the High or Low of the first 15-minute Opening Range (ORB).",
    tags: ["15-Min ORB", "High/Low Breakout", "Strict Trend"],
    icon: "🕯️"
  },
  {
    id: 5,
    title: "High-Friction Risk-Adjusted Management",
    badge: "Pro Risk Engine",
    theme: {
      borderHover: "hover:border-rose-400 hover:shadow-rose-500/10",
      iconBg: "bg-rose-50 border-rose-100/70",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      gradientStart: "from-rose-50/60"
    },
    description: "Implement pro-level risk engines: trail Stop Loss to Cost-to-Cost (C2C) when in profit, or configure advanced SL Re-entry logic if the market reverses back to your levels.",
    tags: ["Trailing SL (C2C)", "SL Re-Entry", "Risk Management"],
    icon: "🛡️"
  },
  {
    id: 6,
    title: "Limitless Custom Strategy Builder",
    badge: "Infinite Customization",
    theme: {
      borderHover: "hover:border-cyan-400 hover:shadow-cyan-500/10",
      iconBg: "bg-cyan-50 border-cyan-100/70",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100",
      gradientStart: "from-cyan-50/60"
    },
    description: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
    tags: ["Zero-Code Builder", "Custom Logic", "Limitless Variations"],
    icon: "🧩"
  }
];

const StrategyCapabilities = () => {
  // Premium spring configs that match HomeView's elite physics
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 16 } 
    }
  };

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-[#FAFAFA] text-slate-900 relative overflow-hidden">
      
      {/* 💎 Premium Minimal Grid Background Sync */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px), 
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* Soft Premium Ambient Lights */}
      <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full mix-blend-multiply blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-gradient-to-bl from-purple-100/30 via-indigo-50/20 to-transparent rounded-full mix-blend-multiply blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-[11px] font-bold tracking-[0.2em] text-[#0052FF] uppercase bg-blue-50 px-4 py-1.5 rounded-md border border-blue-100/80 shadow-sm"
          >
            Institutional-Grade Backtesting Engine
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mt-6 text-slate-900 tracking-tight leading-[1.15]"
          >
            Backtest the Most <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0052FF] via-indigo-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
              Ultra-Complex & Customized Strategies
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto"
          >
            Our architecture is engineered for limitless possibilities. Seamlessly merge Spot and Options data to execute intricate time-overlays, advanced risk-adjusted logic, and highly customized market conditions in just a few clicks.
          </motion.p>
        </div>

        {/* Strategy Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {strategyList.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.01,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"
              }}
              className={`bg-white border border-slate-200 p-7 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-300 group cursor-default relative overflow-hidden ${item.theme.borderHover}`}
            >
              {/* Subtle Color Accent Glow Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${item.theme.gradientStart}`}></div>

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-2xl p-2 rounded-xl border flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm ${item.theme.iconBg}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md border tracking-[0.12em] uppercase shadow-sm ${item.theme.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-extrabold text-slate-900 group-hover:text-black transition-colors duration-200 mb-3 tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 font-medium text-[13.5px] leading-[1.6] mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-200/60 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StrategyCapabilities;