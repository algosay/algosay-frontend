import React, { useState, useEffect } from 'react';
import { signInWithGoogle } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { 
  Terminal, 
  BarChart2, 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  Quote, 
  Sparkles, 
  AlertTriangle, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Cpu,
  Zap,
  ArrowLeft
} from 'lucide-react';

// REALISTIC PRO USER REVIEWS / INNOVATION SHOWCASE DATA
const testimonials = [
  {
    name: "Vikramaditya S.",
    role: "Quantitative Options Trader",
    location: "Mumbai",
    rating: 5,
    tag: "0DTE & BankNifty Specialist",
    text: "I've tried almost every backtesting platform in India, but nothing comes close to AlgoSay. Being able to type complex multi-leg 0DTE logic in natural language and get precision option leg results in seconds feels like magic. Hats off team!",
    verified: true
  },
  {
    name: "Kavitha Raman",
    role: "Systematic Portfolio Manager",
    location: "Chennai",
    rating: 5,
    tag: "Custom Indicator Strategies",
    text: "Earlier I had to hire freelancers or write complex Python code just to backtest customized RSI+VIX strategies with trailing SL. AlgoSay handled my most difficult strategy seamlessly on the first attempt. Genuine game changer!",
    verified: true
  },
  {
    name: "Anirudh Mehta",
    role: "Full-time F&O Trader",
    location: "Bengaluru",
    rating: 5,
    tag: "Iron Condor & Straddle Trader",
    text: "The institutional MFE/MAE diagnostics and System Survival metrics completely transformed my risk management. Never seen such deep analysis in any retail backtest app before. Pure innovation!",
    verified: true
  },
  {
    name: "Rajesh Nair",
    role: "Algorithmic Trader",
    location: "Hyderabad",
    rating: 5,
    tag: "Positional Option Buyer",
    text: "From natural language prompt input to granular day-wise drawdown heatmaps in 5 seconds... this platform is unreal. Joining the profitable top 1% is finally realistic without writing a single line of code.",
    verified: true
  }
];

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [activeReview, setActiveReview] = useState(0);
  
  // NEW STATE: To toggle between Landing ('home') and Login ('login') views
  const [currentView, setCurrentView] = useState('home');

  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRippleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now()
    });
    
    setTimeout(() => setRipple(null), 600);
    handleGoogleLogin();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, 
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // View Transition Variants
  const viewVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === 'right' ? 50 : -50
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === 'right' ? -50 : 50,
      transition: { duration: 0.3, ease: "easeInOut" }
    })
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8 overflow-hidden bg-white">
      
      {/* 🔥 LIVE FOMO TICKER (Always at Top) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-xs font-semibold tracking-wide"
        >
          <span className="flex items-center gap-2"><span className="text-yellow-400">⚡</span> User Rahul just backtested a 0DTE strategy with 72% Win Rate</span>
          <span className="flex items-center gap-2"><span className="text-orange-500">🔥</span> 15,000+ strategies mapped by AI today</span>
          <span className="flex items-center gap-2"><span className="text-blue-400">💎</span> Karthik deployed an Iron Condor with 4.2 Profit Factor</span>
          <span className="flex items-center gap-2"><span className="text-green-400">🚀</span> System survival probability metrics unlocked for pro users</span>
          <span className="flex items-center gap-2"><span className="text-purple-400">✨</span> FEATURE: Zero-Code Natural Language Strategy Builder</span>
          <span className="flex items-center gap-2"><span className="text-cyan-400">🎯</span> Priya executed a Calendar Spread with 85% accuracy</span>
          <span className="flex items-center gap-2"><span className="text-red-400">📊</span> FEATURE: Institutional Grade Profit Factor & Drawdown Heatmaps</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🛡️</span> FEATURE: Automated MFE/MAE Diagnostics for Risk Management</span>
          <span className="flex items-center gap-2"><span className="text-pink-400">📈</span> 1 Lakh+ Backtests run this week across Nifty & BankNifty</span>
          <span className="flex items-center gap-2"><span className="text-yellow-300">💡</span> FEATURE: Granular 0DTE & Day-wise Filters added</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" custom={currentView === 'login' ? 'right' : 'left'}>
        {currentView === 'home' ? (
          
          /* ================= PAGE 1: LANDING & INNOVATION ================= */
          <motion.div 
            key="home"
            custom="right"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-24 py-8 z-10"
          >
            {/* Background Details */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none" 
              style={{ 
                backgroundImage: `
                  radial-gradient(#1e40af 1.2px, transparent 1.2px), 
                  linear-gradient(to right, #cbd5e1 1px, transparent 1px), 
                  linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                `, 
                backgroundSize: '24px 24px, 48px 48px, 48px 48px' 
              }}
            ></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50/30 via-white/80 to-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-200/40 to-indigo-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse z-0"></div>

            {/* HEADER: Logo & Login/Signup Buttons */}
            <div className="flex items-center justify-between z-50 mt-4 mb-12">
              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 border border-blue-400/30">
                  <span className="text-white font-black text-2xl">A</span>
                </div>
                <span className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 whitespace-nowrap">
                  AlgoSay
                </span>
              </div>
              
              {/* TOP RIGHT NAVIGATION BUTTONS */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* MAIN CONTENT AREA - Centered Layout */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 flex-grow relative z-10 w-full max-w-7xl mx-auto">
              
              {/* Left Column Text & Terminal */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-xs font-black text-blue-700 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
                  <Terminal size={14} /> The Next Evolution in Quant Trading
                </h3>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-4">
                  Code-Free Custom Strategies, Powered by AI.
                </h1>
                <p className="text-base text-slate-600 font-medium mb-8 leading-relaxed max-w-lg">
                  Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
                </p>

                {/* PRO TERMINAL ENGINE BOX */}
                <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-800 bg-slate-950 flex flex-col w-full max-w-lg transition-all duration-300 hover:shadow-blue-500/15 group">
                  <div className="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/50"></div>
                      <span className="text-slate-400 text-[11px] font-mono ml-2 tracking-wider">strategy_builder.exe</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Cpu size={10} /> AI Neural Engine v2.4
                      </span>
                    </div>
                  </div>
                  <div className="p-5 font-mono text-sm flex items-start min-h-[100px] bg-slate-950">
                    <div className="text-slate-600 mr-3 select-none text-right font-bold text-xs pt-0.5">01</div>
                    <span className="text-emerald-400 mr-2.5 font-bold shrink-0">prompt &gt;</span>
                    <TypeAnimation
                      sequence={[
                        'Sell BankNifty ATM Straddle at 9:20 AM with 25% SL...',
                        2500,
                        'Buy Nifty Call at 9:30 AM if India VIX < 15...',
                        2500,
                        'Iron Condor on Finnifty expiry day at 10:00 AM...',
                        2500,
                        'Short Straddle with premium matching exactly 100...',
                        2500,
                        'Buy BankNifty ATM Put if RSI > 70 and MACD crosses down...',
                        2500
                      ]}
                      wrapper="span"
                      speed={50}
                      className="text-blue-300 font-medium leading-relaxed"
                      repeat={Infinity}
                    />
                  </div>
                </div>

                {/* 10 FREE BACKTESTS CTA BOX */}
                <div 
                  onClick={() => setCurrentView('login')}
                  className="mt-2 p-3.5 rounded-xl cursor-pointer transition-all border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-100 hover:border-blue-500 hover:shadow-lg flex items-center justify-between group max-w-lg"
                >
                  <div className="flex items-center gap-3.5">
                     <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 text-white text-2xl group-hover:scale-110 transition-transform">
                       🎁
                     </div>
                     <div>
                       <h4 className="text-base font-black text-slate-900">Claim 10 Free Backtests</h4>
                       <p className="text-xs text-blue-700 font-bold mt-0.5">Click here to Sign In and start building.</p>
                     </div>
                  </div>
                  <div className="text-blue-700 bg-white p-2.5 rounded-full shadow group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-200">
                     <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>
              </div>

              {/* Right Column Steps */}
              <div className="w-full lg:w-1/2 flex justify-end">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                  className="space-y-4 max-w-lg"
                >
                  <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm shadow-inner border border-blue-300">
                      1
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">Describe Naturally & AI Auto-Mapping</h4>
                      <p className="text-sm text-slate-600 font-medium mt-1">Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm shadow-inner border border-purple-300">
                      2
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">AI Strategy Diagnostics & Improvement</h4>
                      <p className="text-sm text-slate-600 font-medium mt-1">The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-green-300 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm shadow-inner border border-green-300">
                      3
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">Granular Deep Filtering Engine</h4>
                      <p className="text-sm text-slate-600 font-medium mt-1">Slice your data with precision using 0DTE, Day-wise, Win/Loss, and Buy/Sell leg filters to find your true hidden edge.</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-black text-sm shadow-inner border border-rose-300">
                      4
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">Institutional Pro Metrics</h4>
                      <p className="text-sm text-slate-600 font-medium mt-1">Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>
          </motion.div>

        ) : (

          /* ================= PAGE 2: PREMIUM SPLIT-SCREEN LOGIN VIEW ================= */
          <motion.div 
            key="login"
            custom="left"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // CHANGED: min-h-screen for mobile scrolling, lg:h-screen for desktop. Added flex-col (mobile) & lg:flex-row (desktop)
            className="w-full min-h-screen lg:h-screen flex flex-col lg:flex-row relative z-10 pt-0"
          >
            {/* Back Button - MOVED HERE so it is always on top-left of the entire screen even on mobile */}
            <button 
              onClick={() => setCurrentView('home')}
              className="absolute top-6 left-6 lg:left-10 flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all z-[60] hover:-translate-x-1"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>

            {/* --- LEFT SIDE: White Theme (Reviews & Reality Check) --- */}
            {/* CHANGED: Added `order-2 lg:order-1` so this goes to bottom on mobile, but stays left on desktop */}
            <div className="w-full lg:w-1/2 lg:h-full bg-white flex flex-col justify-center items-center p-6 pt-16 pb-20 lg:p-12 relative overflow-y-visible lg:overflow-y-auto z-10 border-r border-slate-100 order-2 lg:order-1">
              
              <div className="w-full max-w-md space-y-6 mt-8 lg:mt-0">
                {/* Header for Left Side */}
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Join the top 1% Traders.</h2>
                  <p className="text-sm font-medium text-slate-500">Don't rely on gut feelings. Backtest everything with Algosay.</p>
                </div>

                {/* SEBI Reality Check Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="w-full bg-white rounded-2xl border border-rose-100 shadow-xl shadow-rose-900/5 p-5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"></div>
                  <div className="flex items-start gap-3.5 relative z-10">
                     <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200/80 shrink-0 shadow-sm mt-0.5">
                       <AlertTriangle className="w-6 h-6 text-rose-600 animate-pulse" />
                     </div>
                     <div className="flex-grow">
                       <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-black tracking-wider uppercase text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                           SEBI Market Reality
                         </span>
                         <span className="text-[10px] font-extrabold text-slate-400">Official Study</span>
                       </div>
                       <h4 className="text-slate-900 font-black text-base mb-1 leading-snug">
                         93% of Retail F&O Traders Suffer Losses
                       </h4>
                       <p className="text-slate-600 text-xs leading-relaxed font-medium mb-1">
                         SEBI's latest report reveals individual traders lost over <span className="text-rose-600 font-black">₹1.81 Lakh Crore</span> in F&O due to unverified gut feelings without systematic testing.
                       </p>
                     </div>
                  </div>
                </motion.div>

                {/* Trader Reviews Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                          <Sparkles size={16} />
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Trader Reviews</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setActiveReview((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                          className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          onClick={() => setActiveReview((prev) => (prev + 1) % testimonials.length)}
                          className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeReview}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
                                {testimonials[activeReview].name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <h5 className="text-slate-900 font-extrabold text-xs sm:text-sm">{testimonials[activeReview].name}</h5>
                                  {testimonials[activeReview].verified && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold">{testimonials[activeReview].role} • {testimonials[activeReview].location}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(testimonials[activeReview].rating)].map((_, i) => (
                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 relative">
                            <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                              "{testimonials[activeReview].text}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* --- RIGHT SIDE: Light Blue Theme (Login Form) --- */}
            {/* CHANGED: Added `order-1 lg:order-2` so this stays on TOP on mobile, but Right side on desktop */}
            <div className="w-full lg:w-1/2 lg:h-full bg-gradient-to-br from-slate-100 via-blue-50/80 to-indigo-100/70 flex flex-col items-center justify-center p-6 pt-24 pb-12 lg:p-12 relative overflow-y-visible lg:overflow-y-auto z-0 order-1 lg:order-2">
              
              {/* Soft Decorative Ambient Background Elements for Right Side */}
              <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/40 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none"></div>

              {/* Login Card - CHANGED: max-w-md to max-w-lg and increased padding (p-8 lg:p-10) to make it larger */}
              <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.12)] p-8 lg:p-10 z-10 border border-white my-auto">
                
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 border border-blue-400/20">
                      <span className="text-white font-black text-2xl">A</span>
                    </div>
                    <span className="text-4xl font-black tracking-tight text-slate-900">
                      AlgoSay
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-500">Sign in to your AlgoSay terminal</p>
                </div>

                <div className="space-y-4">

                  <div className="relative flex items-center justify-center mb-4">
                    <div className="absolute border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Secure Login</span>
                  </div>

                  {/* Standard Email Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600" />
                      <span className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Remember me</span>
                    </label>
                    <span className="text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Forgot Password?</span>
                  </div>

                  <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl shadow-sm transition-all cursor-not-allowed border border-slate-200 text-sm mt-2">
                    Login via Email (Coming Soon)
                  </button>

                  <div className="relative flex items-center justify-center mt-5 mb-5">
                    <div className="absolute border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Login With</span>
                  </div>

                  {/* Google Login Button */}
                  <div className="relative p-[2px] rounded-xl group overflow-hidden bg-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <button
                      onMouseDown={handleRippleClick}
                      disabled={isLoading}
                      className={`relative w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 text-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      <AnimatePresence>
                        {ripple && (
                          <motion.span
                            key={ripple.id}
                            initial={{ scale: 0, opacity: 0.4 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute bg-blue-300 rounded-full pointer-events-none"
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                              width: 100,
                              height: 100,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-blue-600 relative z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-5 h-5 relative z-20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      )}
                      <span className="relative z-20">{isLoading ? 'Signing In...' : 'Sign in with Google'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Login;