import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Activity, Filter, BarChart3 } from 'lucide-react';

const stepsData = [
  {
    num: "01",
    title: "Describe Naturally & AI Auto-Mapping",
    desc: "Explain your strategy in English, Tamil, Hindi, Malayalam, or Telugu. Our AI instantly translates your text into precision options legs, strikes, and execution rules.",
    icon: <Wand2 strokeWidth={2} size={24} />,
    theme: {
      cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
      borderHover: "border-[#1A2342] hover:border-[#0088FF] hover:shadow-[0_0_30px_rgba(0,136,255,0.2)]",
      iconText: "text-[#00BFFF]",
      iconBorder: "border-[#00BFFF]/30 shadow-[0_0_15px_rgba(0,191,255,0.4)]",
      hoverIconBg: "group-hover:bg-[#00BFFF]/10 group-hover:shadow-[0_0_25px_rgba(0,191,255,0.6)]",
      badgeText: "text-[#00BFFF]",
      gradientStart: "from-[#0088FF]/5"
    }
  },
  {
    num: "02",
    title: "AI Strategy Diagnostics & Improvement",
    desc: "The moment your backtest completes, our AI analyzes turnover, hidden drawdown leaks & optimizes your trade sequence with multilingual support.",
    icon: <Activity strokeWidth={2} size={24} />,
    theme: {
      cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
      borderHover: "border-[#1A1A3A] hover:border-[#9D4EDD] hover:shadow-[0_0_30px_rgba(157,78,221,0.2)]",
      iconText: "text-[#B14EFF]",
      iconBorder: "border-[#B14EFF]/30 shadow-[0_0_15px_rgba(177,78,255,0.4)]",
      hoverIconBg: "group-hover:bg-[#B14EFF]/10 group-hover:shadow-[0_0_25px_rgba(177,78,255,0.6)]",
      badgeText: "text-[#B14EFF]",
      gradientStart: "from-[#9D4EDD]/5"
    }
  },
  {
    num: "03",
    title: "Granular Deep Filtering Engine",
    desc: "Slice your data with precision using 0DTE & Day-wise filters. Includes detailed Ledger with PDF & CSV exports and AI Analyzer.",
    icon: <Filter strokeWidth={2} size={24} />,
    theme: {
      cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
      borderHover: "border-[#122A22] hover:border-[#00E676] hover:shadow-[0_0_30px_rgba(0,230,118,0.2)]",
      iconText: "text-[#00E676]",
      iconBorder: "border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.4)]",
      hoverIconBg: "group-hover:bg-[#00E676]/10 group-hover:shadow-[0_0_25px_rgba(0,230,118,0.6)]",
      badgeText: "text-[#00E676]",
      gradientStart: "from-[#00E676]/5"
    }
  },
  {
    num: "04",
    title: "Institutional Pro Metrics",
    desc: "Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, Expectancy, Max Adverse Excursion, Edge Ratio, and 50+ advanced metrics.",
    icon: <BarChart3 strokeWidth={2} size={24} />,
    theme: {
      cardBg: "bg-[#0A0B14]/90 backdrop-blur-xl",
      borderHover: "border-[#3A1818] hover:border-[#FF5252] hover:shadow-[0_0_30px_rgba(255,82,82,0.2)]",
      iconText: "text-[#FF5252]",
      iconBorder: "border-[#FF5252]/30 shadow-[0_0_15px_rgba(255,82,82,0.4)]",
      hoverIconBg: "group-hover:bg-[#FF5252]/10 group-hover:shadow-[0_0_25px_rgba(255,82,82,0.6)]",
      badgeText: "text-[#FF5252]",
      gradientStart: "from-[#FF5252]/5"
    }
  }
];

const StepsSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-[1400px] mx-auto mt-24 overflow-hidden z-20 px-4"
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#04060F] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#04060F] to-transparent z-20 pointer-events-none"></div>
      
      <motion.div 
        className="flex gap-6 w-max hover:[animation-play-state:paused]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {[...stepsData, ...stepsData].map((step, index) => (
          <div 
            key={index}
            className={`flex-none w-[300px] sm:w-[320px] relative overflow-hidden group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${step.theme.cardBg} ${step.theme.borderHover}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${step.theme.gradientStart}`}></div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border group-hover:scale-110 group-hover:animate-pulse ${step.theme.iconText} ${step.theme.iconBorder} ${step.theme.hoverIconBg} bg-transparent`}>
                {React.cloneElement(step.icon, { size: 20 })}
              </div>
              <span className={`text-[10px] font-black tracking-[0.1em] ${step.theme.badgeText} bg-white/5 px-2.5 py-1 rounded-full border border-white/10 shadow-sm`}>
                STEP {step.num}
              </span>
            </div>
            
            <div className="relative z-10 flex flex-col flex-grow">
              <h4 className="text-[15px] font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors duration-300 mb-1.5">
                {step.title}
              </h4>
              <p className="text-[12px] text-slate-400 font-medium leading-[1.5] group-hover:text-slate-200 transition-colors duration-300 mt-auto">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StepsSection;