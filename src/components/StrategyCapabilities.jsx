import React from 'react';
import { motion } from 'framer-motion';

const strategyList = [
  {
    id: 1,
    title: "Intraday Directional & Non-Directional Spreads",
    badge: "Option Spreads",
    theme: {
      borderHover: "border-blue-200/80 hover:border-blue-400 hover:shadow-blue-500/25",
      iconBg: "bg-blue-50 border-blue-200 text-blue-600",
      badgeColor: "bg-blue-100/50 text-blue-700 border-blue-200/50",
      gradientStart: "from-blue-100/80"
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
      borderHover: "border-purple-200/80 hover:border-purple-400 hover:shadow-purple-500/25",
      iconBg: "bg-purple-50 border-purple-200 text-purple-600",
      badgeColor: "bg-purple-100/50 text-purple-700 border-purple-200/50",
      gradientStart: "from-purple-100/80"
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
      borderHover: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-emerald-500/25",
      iconBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
      badgeColor: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
      gradientStart: "from-emerald-100/80"
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
      borderHover: "border-amber-200/80 hover:border-amber-400 hover:shadow-amber-500/25",
      iconBg: "bg-amber-50 border-amber-200 text-amber-600",
      badgeColor: "bg-amber-100/50 text-amber-700 border-amber-200/50",
      gradientStart: "from-amber-100/80"
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
      borderHover: "border-rose-200/80 hover:border-rose-400 hover:shadow-rose-500/25",
      iconBg: "bg-rose-50 border-rose-200 text-rose-600",
      badgeColor: "bg-rose-100/50 text-rose-700 border-rose-200/50",
      gradientStart: "from-rose-100/80"
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
      borderHover: "border-cyan-200/80 hover:border-cyan-400 hover:shadow-cyan-500/25",
      iconBg: "bg-cyan-50 border-cyan-200 text-cyan-600",
      badgeColor: "bg-cyan-100/50 text-cyan-700 border-cyan-200/50",
      gradientStart: "from-cyan-100/80"
    },
    description: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
    tags: ["Zero-Code Builder", "Custom Logic", "Limitless Variations"],
    icon: "🧩"
  }
];

const StrategyCapabilities = () => {
  // 💎 Ultra-smooth Spring config for a premium app feel
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 14 } 
    }
  };

  return (
    // 💎 Background color removed to make it blend 100% seamlessly with HomeView
    <section className="w-full pb-24 text-slate-900 relative z-10 bg-transparent">
      
      {/* 💎 Soft Pro Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full mix-blend-multiply blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[45rem] h-[45rem] bg-gradient-to-bl from-purple-200/20 via-indigo-100/10 to-transparent rounded-full mix-blend-multiply blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-0">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 pt-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold tracking-[0.2em] text-[#0052FF] uppercase bg-white px-5 py-2 rounded-full border border-blue-100 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Institutional-Grade Backtesting Engine
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mt-7 text-slate-900 tracking-tight leading-[1.15]"
          >
            Backtest the Most <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0052FF] via-indigo-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
              Ultra-Complex & Customized Strategies
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 font-medium text-base sm:text-[1.1rem] mt-6 leading-relaxed max-w-3xl mx-auto"
          >
            Our architecture is engineered for limitless possibilities. Seamlessly merge Spot and Options data to execute intricate time-overlays, advanced risk-adjusted logic, and highly customized market conditions in just a few clicks.
          </motion.p>
        </div>

        {/* Strategy Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {strategyList.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 25px 40px -10px rgba(0, 0, 0, 0.08)"
              }}
              // 💎 Borders are now colorful by default via {item.theme.borderHover}
              className={`bg-white/80 backdrop-blur-xl border p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between transition-all duration-500 group cursor-default relative overflow-hidden ${item.theme.borderHover}`}
            >
              {/* Vibrant Glow Background on Scroll (No click/hover required to show up) */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.65 }} // Automatically blooms to 65% opacity when scrolled into view
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                className={`absolute inset-0 bg-gradient-to-br to-transparent group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${item.theme.gradientStart}`}
              ></motion.div>

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-7">
                  {/* Realistic Emoji Restored */}
                  <span className={`text-3xl p-3 rounded-2xl border flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm ${item.theme.iconBg}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-md border tracking-[0.1em] uppercase shadow-sm ${item.theme.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-extrabold text-slate-900 group-hover:text-black transition-colors duration-300 mb-4 tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 font-medium text-[14.5px] leading-[1.65] mb-8 group-hover:text-slate-800 transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-5 border-t border-slate-200/80">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/60 group-hover:bg-white group-hover:shadow-sm transition-all duration-300"
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