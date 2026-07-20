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
  Zap
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

  // Custom handler for Button Click to generate Ripple effect + Login logic
  const handleRippleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now()
    });
    
    // Clear ripple after animation
    setTimeout(() => setRipple(null), 600);
    
    // Trigger Login
    handleGoogleLogin();
  };

  // Framer Motion Variants for Staggered Animation
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

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8">
      
      {/* 🔥 LIVE FOMO TICKER (Top of the screen) 🔥 */}
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

      {/* LEFT SIDE: App Innovation (NEW ULTRA PREMIUM SKY BLUE BACKGROUND) */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50/60 relative overflow-hidden px-8 lg:px-16 py-6 z-10 border-r border-sky-200/60">
        
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none" 
          style={{ 
            backgroundImage: `
              radial-gradient(#0284c7 1.2px, transparent 1.2px), 
              linear-gradient(to right, #bae6fd 1px, transparent 1px), 
              linear-gradient(to bottom, #bae6fd 1px, transparent 1px)
            `, 
            backgroundSize: '24px 24px, 48px 48px, 48px 48px' 
          }}
        ></div>
        <div className="absolute -left-28 -top-10 w-[30rem] h-[30rem] bg-sky-300/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse z-0 pointer-events-none"></div>
        <div className="absolute right-0 bottom-10 w-80 h-80 bg-blue-300/30 rounded-full filter blur-[90px] opacity-60 z-0 pointer-events-none"></div>

        {/* TOP-LEFT LOGO (Positioned High & Clean) */}
        <div className="absolute top-5 left-6 lg:left-12 flex items-center gap-3 z-50 whitespace-nowrap">
          <div className="w-11 h-11 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0 border border-sky-300/40">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <span className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 whitespace-nowrap">
            AlgoSay
          </span>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-col justify-center flex-grow pt-20 lg:pt-22 relative z-10">
          <h3 className="text-xs font-black text-sky-800 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
            <Terminal size={14} /> The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-[1.2] mb-3">
            Code-Free Custom Strategies, Powered by AI.
          </h1>
          <p className="text-sm text-slate-700 font-medium mb-5 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* ULTRA-PREMIUM PRO TERMINAL ENGINE BOX */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-sky-900/15 border border-slate-800 bg-slate-950 flex flex-col max-w-lg transition-all duration-300 hover:shadow-sky-500/20 group">
            {/* Terminal Header */}
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
            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs sm:text-sm flex items-start min-h-[90px] bg-slate-950">
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
                className="text-sky-300 font-medium leading-relaxed"
                repeat={Infinity}
              />
            </div>
          </div>

          {/* STEP-BY-STEP STAGGERED ENTRY ON SCROLL */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-2.5 max-w-lg"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-sky-100/50 transition-colors border border-transparent hover:border-sky-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-200/80 flex items-center justify-center text-sky-800 font-black text-xs shadow-inner border border-sky-300">
                1
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Describe Naturally & AI Auto-Mapping</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-sky-100/50 transition-colors border border-transparent hover:border-sky-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-black text-xs shadow-inner border border-purple-300">
                2
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">AI Strategy Diagnostics & Improvement</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-sky-100/50 transition-colors border border-transparent hover:border-sky-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs shadow-inner border border-emerald-300">
                3
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Granular Deep Filtering Engine</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">Slice your data with precision using 0DTE, Day-wise, Win/Loss, and Buy/Sell leg filters to find your true hidden edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-sky-100/50 transition-colors border border-transparent hover:border-sky-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-black text-xs shadow-inner border border-rose-300">
                4
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Institutional Pro Metrics</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-sky-100/50 transition-colors border border-transparent hover:border-sky-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs shadow-inner border border-amber-300">
                <BarChart2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Comprehensive Reports & Visuals</h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5">Export ledgers via PDF/CSV. Analyze performance with Heatmaps, PnL Curves, Drawdown charts, and deep AI insights in detailed backtest reports.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* 10 FREE BACKTESTS CTA BOX */}
          <div 
            onClick={handleGoogleLogin}
            className={`mt-5 p-3.5 rounded-xl cursor-pointer transition-all border border-sky-300 bg-white/80 backdrop-blur-md hover:border-sky-500 hover:shadow-lg flex items-center justify-between group max-w-md ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-3.5">
               <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center shadow-md shadow-sky-500/30 text-white text-2xl group-hover:scale-110 transition-transform">
                 🎁
               </div>
               <div>
                 <h4 className="text-base font-black text-slate-900">Claim 10 Free Backtests</h4>
                 <p className="text-xs text-sky-800 font-bold mt-0.5">Click here to Sign In and start building.</p>
               </div>
            </div>
            <div className="text-sky-700 bg-sky-50 p-2.5 rounded-full shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-colors border border-sky-200">
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE (ONLY LOGIN BOX ON INITIAL SCREEN FOLD, SCROLL FOR SEBI & REVIEWS) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-100 via-sky-50/60 to-indigo-100/60 flex flex-col items-center justify-start p-4 md:p-6 lg:p-8 relative z-10 overflow-y-auto h-screen">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none z-0">
           <div className="absolute top-10 right-10 w-96 h-96 bg-sky-300/30 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-[100px]"></div>
        </div>

        {/* 🔥 FIRST SCREEN VIEWPORT CONTAINER: ONLY LOGIN BOX VISIBLE ON PAGE OPEN 🔥 */}
        <div className="w-full min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center shrink-0 z-10 py-4">
          
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(14,165,233,0.15)] p-7 lg:p-9 border border-white/80 my-auto">
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0 border border-sky-300/30">
                  <span className="text-white font-black text-3xl">A</span>
                </div>
                <span className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                  AlgoSay
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-500">Sign in to your AlgoSay terminal</p>
            </div>

            <div className="space-y-4">

              <div className="relative flex items-center justify-center mb-2">
                <div className="absolute border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Secure Login</span>
              </div>

              {/* Standard Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 text-sky-600 bg-white border-slate-300 rounded focus:ring-sky-600" />
                  <span className="text-xs text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <span className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer transition-colors">Forgot Password?</span>
              </div>

              <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl shadow-sm transition-all cursor-not-allowed border border-slate-200 text-xs">
                Login via Email (Coming Soon)
              </button>

              <div className="relative flex items-center justify-center mt-2 mb-2">
                <div className="absolute border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Login With</span>
              </div>

              {/* Google Login Button with Sweep Border & Ripple Effect */}
              <div className="relative p-[2px] rounded-xl group overflow-hidden bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  />
                </div>

                <button
                  onMouseDown={handleRippleClick}
                  disabled={isLoading}
                  className={`relative w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 text-xs ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <AnimatePresence>
                    {ripple && (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.4 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute bg-sky-300 rounded-full pointer-events-none"
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
                    <svg className="animate-spin h-4 w-4 text-sky-600 relative z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 relative z-20" viewBox="0 0 24 24">
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
            
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-600 font-semibold">
                Don't have an account? <span className="text-sky-600 font-black hover:text-sky-800 hover:underline cursor-pointer transition-all">Sign up</span>
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 SECOND SECTION (SCROLL DOWN TO SEE): SEBI REALITY CHECK & TRADER REVIEWS 🔥 */}
        <div className="w-full max-w-md flex flex-col gap-6 pb-16 shrink-0 z-10 pt-4">
          
          {/* SEBI MARKET REALITY CHECK CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white rounded-2xl border border-rose-100 shadow-xl shadow-rose-900/5 p-5 relative overflow-hidden group"
          >
            {/* Top Gradient Accent Bar */}
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
                 
                 <p className="text-slate-600 text-xs leading-relaxed font-medium mb-3">
                   SEBI's latest report reveals individual traders lost over <span className="text-rose-600 font-black">₹1.81 Lakh Crore</span> in F&O due to unverified gut feelings without systematic testing.
                 </p>

                 <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 shadow-sm">
                   <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                   <span className="text-slate-800 text-xs font-semibold leading-snug">
                     Join the <span className="text-emerald-700 font-black text-xs uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded">Top 1% Disciplined Traders</span> by backtesting every strategy with AlgoSay first.
                   </span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* TRADER REVIEWS & INNOVATION CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/5 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Trader Reviews & Innovation</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveReview((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                    title="Previous Review"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveReview((prev) => (prev + 1) % testimonials.length)}
                    className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                    title="Next Review"
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
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
                          {testimonials[activeReview].name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="text-slate-900 font-extrabold text-xs sm:text-sm">{testimonials[activeReview].name}</h5>
                            {testimonials[activeReview].verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 fill-sky-100" />
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

                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 mb-3 relative">
                      <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                        "{testimonials[activeReview].text}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {testimonials[activeReview].tag}
                    </span>
                    <div className="flex gap-1.5">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveReview(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            activeReview === idx ? 'bg-sky-600 w-5' : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Login;