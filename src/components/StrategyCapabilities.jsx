import React from 'react';
import { motion } from 'framer-motion';

const strategyList = [
  {
    id: 1,
    title: "Intraday Directional & Non-Directional Spreads",
    badge: "Option Spreads",
    theme: {
      borderHover: "border-white/10 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
      iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      gradientStart: "from-blue-600/15",
      titleHover: "group-hover:text-blue-400",
      tagHover: "group-hover:bg-blue-500/10 group-hover:text-blue-300 group-hover:border-blue-500/30"
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
      borderHover: "border-white/10 hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
      iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      gradientStart: "from-purple-600/15",
      titleHover: "group-hover:text-purple-400",
      tagHover: "group-hover:bg-purple-500/10 group-hover:text-purple-300 group-hover:border-purple-500/30"
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
      borderHover: "border-white/10 hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      gradientStart: "from-emerald-600/15",
      titleHover: "group-hover:text-emerald-400",
      tagHover: "group-hover:bg-emerald-500/10 group-hover:text-emerald-300 group-hover:border-emerald-500/30"
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
      borderHover: "border-white/10 hover:border-amber-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]",
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      gradientStart: "from-amber-600/15",
      titleHover: "group-hover:text-amber-400",
      tagHover: "group-hover:bg-amber-500/10 group-hover:text-amber-300 group-hover:border-amber-500/30"
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
      borderHover: "border-white/10 hover:border-rose-500 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]",
      iconBg: "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      gradientStart: "from-rose-600/15",
      titleHover: "group-hover:text-rose-400",
      tagHover: "group-hover:bg-rose-500/10 group-hover:text-rose-300 group-hover:border-rose-500/30"
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
      borderHover: "border-white/10 hover:border-[#00E5FF] hover:shadow-[0_0_40px_rgba(0,229,255,0.3)]",
      iconBg: "bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]",
      badgeColor: "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30",
      gradientStart: "from-[#00E5FF]/15",
      titleHover: "group-hover:text-[#00E5FF]",
      tagHover: "group-hover:bg-[#00E5FF]/10 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/30"
    },
    description: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
    tags: ["Zero-Code Builder", "Custom Logic", "Limitless Variations"],
    icon: "🧩"
  }
];

const StrategyCapabilities = () => {
  // 💎 Ultra-smooth Spring config for a premium app feel & 3D Pop
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96, rotateX: 5 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 80, damping: 14 } 
    }
  };

  return (
    // 💎 Background transparent for seamless integration, text changed for dark mode
    <section className="w-full pb-24 text-white relative z-10 bg-transparent overflow-hidden" style={{ perspective: '1000px' }}>
      
      {/* 💎 Soft Pro Ambient Lights adapted for Dark Mode (Mix-blend screen for glowing effect) */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full mix-blend-screen blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[45rem] h-[45rem] bg-gradient-to-bl from-purple-600/10 via-[#00E5FF]/5 to-transparent rounded-full mix-blend-screen blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-0">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 pt-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold tracking-[0.2em] text-[#00E5FF] uppercase bg-[#00E5FF]/10 px-5 py-2 rounded-full border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            Institutional-Grade Backtesting Engine
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mt-7 text-white tracking-tight leading-[1.15] drop-shadow-lg"
          >
            Backtest the Most <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              Ultra-Complex & Customized Strategies
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-medium text-base sm:text-[1.1rem] mt-6 leading-relaxed max-w-3xl mx-auto"
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
                y: -10, 
                scale: 1.02,
                rotateX: 2,
                rotateY: -2
              }}
              // 💎 Ultra 3D Black Glassmorphism Design
              className={`bg-[#0A0C14]/90 backdrop-blur-xl border p-8 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.05)] flex flex-col justify-between transition-all duration-500 group cursor-default relative overflow-hidden transform-gpu ${item.theme.borderHover}`}
            >
              {/* Vibrant Glow Background on Scroll/Hover */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }} 
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                className={`absolute inset-0 bg-gradient-to-br to-transparent group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${item.theme.gradientStart}`}
              ></motion.div>

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-7">
                  {/* Glowing 3D Icon Box */}
                  <span className={`text-3xl p-3 rounded-2xl border flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${item.theme.iconBg}`}>
                    <span className="drop-shadow-lg">{item.icon}</span>
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-md border tracking-[0.1em] uppercase ${item.theme.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-[18px] font-extrabold text-white transition-colors duration-300 mb-4 tracking-tight leading-snug ${item.theme.titleHover}`}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 font-medium text-[14.5px] leading-[1.65] mb-8 group-hover:text-slate-300 transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-5 border-t border-white/10">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[11px] font-bold bg-white/5 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${item.theme.tagHover}`}
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