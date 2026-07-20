import React from 'react';
import { motion } from 'framer-motion';

const strategyList = [
  {
    id: 1,
    title: "Intraday Directional & Non-Directional Spreads",
    badge: "Option Spreads",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description: "Sell ATM Straddles or Strangles at 9:20 AM while simultaneously buying OTM CE/PE for margin benefits. Flawlessly backtest Iron Condors, Iron Flies, and Butterfly Spreads.",
    tags: ["Iron Condor", "Iron Fly", "Butterfly Spread", "Straddle/Strangle"],
    icon: "⚖️"
  },
  {
    id: 2,
    title: "Multi-Time Overlay Strategies",
    badge: "Advanced Execution",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Execute selling legs at a specific time (e.g., 9:20 AM) and hedging/buying legs at a completely different time (e.g., 9:45 AM) using our advanced Split Directional Mapping.",
    tags: ["Time Delay Legs", "Split Entry", "Dynamic Hedging"],
    icon: "⏱️"
  },
  {
    id: 3,
    title: "Dynamic Trend Following (Spot + Options)",
    badge: "Hybrid Indicator Logic",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Trigger ATM option strikes or Spot Futures entries automatically when the underlying Spot chart breaks RSI 60 or executes a MACD crossover, complete with predefined Target/SL.",
    tags: ["Spot-to-Options", "RSI Breakout", "MACD Crossover", "ATM Trading"],
    icon: "📈"
  },
  {
    id: 4,
    title: "Pure Price Action Breakouts",
    badge: "No-Indicator Pure PA",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Deploy strict trend breakout logic without any indicators. Trigger entries perfectly when the market breaks the High or Low of the first 15-minute Opening Range (ORB).",
    tags: ["15-Min ORB", "High/Low Breakout", "Strict Trend"],
    icon: "🕯️"
  },
  {
    id: 5,
    title: "High-Friction Risk-Adjusted Management",
    badge: "Pro Risk Engine",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    description: "Implement pro-level risk engines: trail Stop Loss to Cost-to-Cost (C2C) when in profit, or configure advanced SL Re-entry logic if the market reverses back to your levels.",
    tags: ["Trailing SL (C2C)", "SL Re-Entry", "Risk Management"],
    icon: "🛡️"
  },
  {
    id: 6,
    title: "Limitless Custom Strategy Builder",
    badge: "Infinite Customization",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    description: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
    tags: ["Zero-Code Builder", "Custom Logic", "Limitless Variations"],
    icon: "🧩"
  }
];

const StrategyCapabilities = () => {
  return (
    <section className="w-full py-20 px-4 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glow Deco */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Institutional-Grade Backtesting Engine
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold mt-6 text-slate-100 tracking-tight leading-tight"
          >
            Backtest the Most <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Ultra-Complex & Customized Strategies
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg mt-5 leading-relaxed"
          >
            Our architecture is engineered for limitless possibilities. Seamlessly merge Spot and Options data to execute intricate time-overlays, advanced risk-adjusted logic, and highly customized market conditions in just a few clicks.
          </motion.p>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategyList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-7 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 group cursor-default"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {item.icon}
                  </span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-semibold bg-slate-800/60 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StrategyCapabilities;