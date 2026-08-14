import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

const advancedCapabilities = [
  {
    title: "Option Spreads",
    subtitle: "Intraday Directional & Non-Directional",
    desc: "Sell ATM Straddles or Strangles at 9:20 AM while simultaneously buying OTM CE/PE for margin benefits. Flawlessly backtest Iron Condors, Iron Flies, and Butterfly Spreads.",
    tags: ["#Iron Condor", "#Iron Fly", "#Butterfly Spread", "#Straddle"],
    icon: "⚖️",
    imgUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
    theme: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Advanced Execution",
    subtitle: "Multi-Time Overlay Strategies",
    desc: "Execute selling legs at a specific time (e.g., 9:20 AM) and hedging/buying legs at a completely different time (e.g., 9:45 AM) using our advanced Split Directional Mapping.",
    tags: ["#Time Delay Legs", "#Split Entry", "#Dynamic Hedging"],
    icon: "⏱️",
    imgUrl: "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?auto=format&fit=crop&q=80&w=600",
    theme: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Hybrid Indicator Logic",
    subtitle: "Dynamic Trend Following (Spot + Options)",
    desc: "Trigger ATM option strikes or Spot Futures entries automatically when the underlying Spot chart breaks RSI 60 or executes a MACD crossover, complete with predefined Target/SL.",
    tags: ["#Spot-to-Options", "#RSI Breakout", "#MACD Crossover"],
    icon: "📈",
    imgUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600",
    theme: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "No-Indicator Pure PA",
    subtitle: "Pure Price Action Breakouts",
    desc: "Deploy strict trend breakout logic without any indicators. Trigger entries perfectly when the market breaks the High or Low of the first 15-minute Opening Range (ORB).",
    tags: ["#15-Min ORB", "#High/Low Breakout", "#Strict Trend"],
    icon: "🕯️",
    imgUrl: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=600",
    theme: "from-orange-500/20 to-amber-500/20"
  },
  {
    title: "Pro Risk Engine",
    subtitle: "High-Friction Risk-Adjusted Management",
    desc: "Implement pro-level risk engines: trail Stop Loss to Cost-to-Cost (C2C) when in profit, or configure advanced SL Re-entry logic if the market reverses back to your levels.",
    tags: ["#Trailing SL (C2C)", "#SL Re-Entry", "#Risk Management"],
    icon: "🛡️",
    imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    theme: "from-red-500/20 to-rose-500/20"
  },
  {
    title: "Infinite Customization",
    subtitle: "Limitless Custom Strategy Builder",
    desc: "If you can think it, you can backtest it. Combine any indicator, timeframe, multi-leg option logic, or custom condition to build strategies that defy traditional limits.",
    tags: ["#Zero-Code Builder", "#Custom Logic", "#Limitless"],
    icon: "🧩",
    imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    theme: "from-indigo-500/20 to-violet-500/20"
  }
];

const userReviews = [
  { name: "Karthik R.", role: "Full-time Options Trader", img: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=150", text: "AlgoSay completely changed my trading game. Typing strategies in Tamil and seeing the AI map it to complex 0DTE options is magic. The execution is flawless!" },
  { name: "Sneha Patel", role: "Retail Investor", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150", text: "No more coding! I just typed 'BankNifty straddle at 9:20' in Hindi and it backtested 3 years of data in seconds. The Granular Filtering feature is absolutely mind-blowing." },
  { name: "Amit Sharma", role: "Quantitative Analyst", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", text: "As a quant, I need precision. The 'Pro Risk Engine' handles trailing SL (C2C) and SL Re-entry exactly like institutional bots. The Profit Factor and Sortino metrics are spot on." },
  { name: "Priya Menon", role: "Part-time Trader", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", text: "The Hybrid Indicator logic is brilliant. I tested a strategy where Spot RSI triggers Option strikes. Never seen an Indian platform execute Spot-to-Options this smoothly." },
  { name: "Rajesh Kumar", role: "Swing Trader", img: "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&q=80&w=150", text: "Finally, a platform that natively supports multiple languages! The Multi-Time Overlay lets me set delay legs perfectly. Pure Price Action backtesting without indicators is epic." },
  { name: "Divya T.", role: "Systematic Trader", img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=150", text: "Tested my complex Iron Condor strategy. The AI Diagnostics automatically found the hidden drawdown leaks and optimized my exits. Institutional export reports look super professional!" }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect to test the waters with basic AI capabilities.",
    features: [
      "10 Free Backtests", 
      "Basic Performance Metrics", 
      "End of Day Data", 
      "Standard Community Support"
    ],
    buttonText: "Sign Up Free",
    theme: "from-slate-600 to-slate-800",
    accent: "text-slate-300",
    glow: "hover:shadow-[0_0_30px_rgba(148,163,184,0.2)]",
    popular: false
  },
  {
    name: "Pay-As-You-Go",
    price: "₹49",
    period: " onwards",
    desc: "Buy credits as you need. No hidden fees or expiry.",
    features: [
      "Starter: 10 Credits (₹49)", 
      "Value: 25 Credits (₹99)", 
      "🌟 Popular: 50 Credits (₹179)", 
      "Pro: 100 Credits (₹299)", 
      "Custom Credits: ₹3.00 - ₹4.90/credit"
    ],
    buttonText: "View Pay-As-You-Go",
    theme: "from-[#2B4CFF] to-[#00E5FF]",
    accent: "text-[#00E5FF]",
    glow: "hover:shadow-[0_0_40px_rgba(43,76,255,0.4)]",
    popular: false
  },
  {
    name: "Unlimited Pro",
    price: "₹599",
    period: " onwards",
    desc: "Unlimited AI backtests for serious day traders.",
    features: [
      "Weekly: 7 Days (₹599)", 
      "Monthly: 30 Days (₹1599)", 
      "🔥 Quarterly: 90 Days (₹3999)", 
      "Half-Yearly: 180 Days (₹7499)", 
      "Full Institutional Reports & Filters"
    ],
    buttonText: "View Unlimited Plans",
    theme: "from-[#FF007A] to-[#7928CA]",
    accent: "text-[#FF007A]",
    glow: "hover:shadow-[0_0_40px_rgba(255,0,122,0.4)]",
    popular: true
  }
];

const FeaturesAndPricing = ({ onNavigate }) => {
  return (
    <>
      {/* CAPABILITIES SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        id="capabilities" 
        className="w-full max-w-[1400px] mx-auto relative z-20 mt-20 border-t border-white/5 pt-16 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
            Backtest the Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">Ultra-Complex & Customized</span> Strategies
          </h2>
          <p className="text-slate-400 font-medium max-w-3xl mx-auto text-base">
            Our architecture is engineered for limitless possibilities. Seamlessly merge Spot and Options data to execute intricate time-overlays, advanced risk-adjusted logic, and highly customized market conditions in just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 lg:px-0">
          {advancedCapabilities.map((cap, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col rounded-[24px] overflow-hidden bg-[#0A0C14] border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.2)]"
            >
              <div className="w-full h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                <motion.img 
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.8 }}
                  src={cap.imgUrl} 
                  alt={cap.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-xl bg-gradient-to-br ${cap.theme} backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cap.icon}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#0A0C14] to-[#04060F]">
                <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#00E5FF] transition-colors drop-shadow-sm">{cap.title}</h3>
                <h4 className="text-[13px] font-bold text-slate-400 mb-4 tracking-wide uppercase">{cap.subtitle}</h4>
                <p className="text-[14px] text-slate-300 font-medium leading-relaxed mb-6 flex-grow">
                  {cap.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cap.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-[11px] font-semibold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-md border border-[#00E5FF]/30 group-hover:bg-[#00E5FF]/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* REVIEWS SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        id="reviews" 
        className="w-full max-w-[1400px] mx-auto mt-24 mb-10 relative z-20 scroll-mt-24 overflow-hidden px-4"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
            Trusted by 50,000+ Indian Traders
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <p className="text-slate-400 font-medium">Rated 4.9/5 by the Professional Trading Community</p>
        </div>

        <div className="relative w-full overflow-hidden flex items-center py-6">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#04060F] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#04060F] to-transparent z-20 pointer-events-none"></div>
          
          <motion.div 
            className="flex gap-6 w-max hover:[animation-play-state:paused]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[...userReviews, ...userReviews].map((review, index) => (
              <div 
                key={index}
                className="flex-none w-[340px] md:w-[380px] p-6 rounded-2xl bg-gradient-to-b from-[#0A0C14] to-[#04060F] border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] flex flex-col group cursor-default"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#00E5FF]/50 p-0.5 group-hover:scale-110 group-hover:border-[#FF007A]/80 transition-all duration-500 shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight group-hover:text-[#00E5FF] transition-colors">{review.name}</h4>
                    <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{review.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-[14px] leading-relaxed italic relative z-10 group-hover:text-white transition-colors duration-300">
                  <span className="text-4xl text-[#00E5FF]/20 absolute -top-3 -left-2 -z-10 font-serif">"</span>
                  {review.text}
                  <span className="text-4xl text-[#00E5FF]/20 absolute -bottom-5 right-0 -z-10 font-serif">"</span>
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* PRICING SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        id="pricing" 
        className="w-full max-w-[1400px] mx-auto mt-24 mb-16 relative z-20 scroll-mt-24 border-t border-white/5 pt-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#6025F5]">Pricing</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            View our plans below. Start for free and upgrade when you are ready to unleash full AI power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 md:px-0">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-[2px] rounded-3xl transition-all duration-500 bg-gradient-to-b ${plan.theme} ${plan.glow}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2B4CFF] to-[#00E5FF] text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.5)] z-20 border border-white/20">
                  Most Popular
                </div>
              )}
              
              <div className="bg-[#0A0C14] rounded-[22px] p-8 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -z-10 group-hover:bg-white/10 transition-colors duration-500"></div>
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-black ${plan.accent}`}>{plan.price}</span>
                  {plan.period && <span className="text-sm font-medium text-slate-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-400 mb-8 min-h-[40px]">{plan.desc}</p>
                
                <div className="flex flex-col gap-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${plan.accent}`} />
                      <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => onNavigate(true)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                    ${plan.popular 
                      ? 'bg-gradient-to-r from-[#2B4CFF] to-[#6025F5] text-white shadow-[0_0_20px_rgba(43,76,255,0.4)] hover:shadow-[0_0_30px_rgba(96,37,245,0.6)] border border-white/10' 
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30'}`}
                >
                  {plan.buttonText}
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-3 font-medium uppercase tracking-wider">
                  Requires Account to Access
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default FeaturesAndPricing;