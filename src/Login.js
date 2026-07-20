import React, { useState } from 'react';
import { signInWithGoogle } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Terminal, BarChart2, Activity, PlayCircle } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState(null);

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
    <div className="flex flex-col md:flex-row min-h-screen w-full font-sans text-slate-800 selection:bg-blue-300 relative pt-8">
      
      {/* 🔥 UPDATED FEATURE: EXTENDED LIVE FOMO TICKER (Top of the screen) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="whitespace-nowrap flex gap-16 text-xs font-semibold tracking-wide"
        >
          <span className="flex items-center gap-2"><span className="text-yellow-400">⚡</span> User Rahul just backtested a 0DTE strategy with 72% Win Rate</span>
          <span className="flex items-center gap-2"><span className="text-orange-500">🔥</span> 15,000+ strategies mapped by AI today</span>
          <span className="flex items-center gap-2"><span className="text-blue-400">💎</span> Karthik deployed an Iron Condor with 4.2 Profit Factor</span>
          <span className="flex items-center gap-2"><span className="text-green-400">🚀</span> System survival probability metrics unlocked for pro users</span>
          <span className="flex items-center gap-2"><span className="text-purple-400">📊</span> Priya executed a 5-year Options Backtest in 1.2 seconds</span>
          <span className="flex items-center gap-2"><span className="text-cyan-400">📈</span> BankNifty Straddle backtest showed 18% ROI this month</span>
          <span className="flex items-center gap-2"><span className="text-rose-400">🎯</span> User Vikram optimized SL trailing for Nifty 50</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">✅</span> AI automatically fixed a logical error in a Calendar Spread</span>
        </motion.div>
      </div>

      {/* LEFT SIDE: App Innovation (Now Pure White Background for high contrast) */}
      <div className="hidden md:flex flex-col w-1/2 bg-white relative overflow-hidden px-12 lg:px-16 py-8 z-10 border-r border-slate-200">
        
        {/* Very subtle background grids for technical feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        
        {/* 🔥 UPDATED: TOP LEFT - Big Logo & Name (No breaking) 🔥 */}
        <div className="flex flex-col items-start mb-8 mt-2 w-full">
          <div className="flex items-center gap-4 whitespace-nowrap">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 shrink-0">
              <span className="text-white font-black text-3xl">A</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-slate-900 leading-none">
              AlgoSay
            </h1>
          </div>
          <div className="mt-2 ml-[72px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} /> Options Backtesting Engine
          </div>
        </div>

        {/* MAIN CONTENT: Centered Vertically */}
        <div className="flex flex-col justify-start flex-grow pt-2">
          
          {/* 🔥 UPDATED: Focus heavily on "Backtesting" to make it instantly recognizable 🔥 */}
          <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.2] mb-4">
            Test Options Strategies <br/> <span className="text-blue-600">Without Writing Code.</span>
          </h2>
          <p className="text-base text-slate-700 mb-6 leading-relaxed max-w-lg font-medium">
            Stop manually crunching numbers. Just type your trading logic in plain English, and our AI Engine instantly backtests it across years of historical NSE data.
          </p>

          {/* EXISTING FEATURE: 5 STRATEGIES LIVE TYPING ANIMATION (Clearer Text) */}
          <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm shadow-inner min-h-[90px] flex items-center max-w-lg">
            <span className="text-emerald-600 mr-2 flex-shrink-0 font-bold">algo@backtest:~$</span>
            <TypeAnimation
              sequence={[
                'Backtest BankNifty ATM Straddle at 9:20 AM with 25% SL...',
                2500,
                'Check Nifty Call at 9:30 AM if India VIX < 15...',
                2500,
                'Run Iron Condor on Finnifty expiry day at 10:00 AM...',
                2500,
                'Backtest Short Straddle matching premium exactly 100...',
                2500,
                'Test BankNifty ATM Put if RSI > 70 and MACD crosses down...',
                2500
              ]}
              wrapper="span"
              speed={50}
              className="text-blue-700 font-bold tracking-tight"
              repeat={Infinity}
            />
          </div>

          {/* STEP-BY-STEP STAGGERED ENTRY ON SCROLL (High Contrast Text) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-3 max-w-lg"
          >
            
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm border border-blue-200">
                1
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">AI Logic Translation</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Explain your logic naturally. AI maps it directly into strike prices, legs, and execution rules instantly.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shadow-sm border border-purple-200">
                2
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Lightning Fast Execution</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Crunch years of tick-by-tick options data in seconds to validate your trading edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shadow-sm border border-green-200">
                3
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Deep Drawdown Analytics</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Slice data with 0DTE, Day-wise, and Buy/Sell filters to discover exactly where your strategy fails.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm shadow-sm border border-rose-200">
                4
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Institutional Metrics</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Unlock Profit Factor, System Survival Probability, Kelly Sizing, and Stress Level Indexes.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shadow-sm border border-amber-200">
                <BarChart2 size={16} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Visual Heatmaps & Reports</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Export ledgers and analyze PnL Curves visually to confidently deploy capital in live markets.</p>
              </div>
            </motion.div>

          </motion.div>

          {/* 10 FREE BACKTESTS CTA BOX */}
          <div 
            onClick={handleGoogleLogin}
            className={`mt-6 p-4 rounded-xl cursor-pointer transition-all border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-400 hover:shadow-lg flex items-center justify-between group max-w-md ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 text-white text-2xl group-hover:scale-110 transition-transform">
                 <PlayCircle size={24} />
               </div>
               <div>
                 <h4 className="text-base font-extrabold text-slate-900">Start Backtesting Now</h4>
                 <p className="text-sm text-blue-700 font-bold mt-0.5">Claim 10 Free Scans on Sign Up!</p>
               </div>
            </div>
            <div className="text-blue-600 bg-white p-2 rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-200">
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Login Action (🔥 NOW SOLID BLUE GRADIENT & BOX MOVED UP 🔥) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-start justify-center p-6 relative z-10 pt-24 lg:pt-32">
        
        {/* Decorative elements for the dark blue background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
           <div className="absolute bottom-10 -left-20 w-72 h-72 bg-blue-300 rounded-full blur-[120px]"></div>
        </div>

        {/* Glassmorphism/Floating Login Card (Kept white for high readability against blue bg) */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 lg:p-10 z-10 border border-white/20 relative">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-600 font-semibold text-center">
              Sign in to access your saved backtests and AI strategy reports.
            </p>
          </div>

          <div className="space-y-5">

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Secure Login</span>
            </div>

            {/* Standard Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                disabled
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-slate-700 font-bold group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <span className="text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 font-bold rounded-xl shadow-sm transition-all cursor-not-allowed border border-slate-200">
              Login via Email (Coming Soon)
            </button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Login With</span>
            </div>

            {/* 🔥 EXISTING: Google Login Button with Sweep Border & Ripple Effect 🔥 */}
            <div className="relative p-[2px] rounded-xl group overflow-hidden bg-slate-200">
              {/* Subtle Gradient Glow (Sweep Effect) on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
                />
              </div>

              {/* Main Button */}
              <button
                onMouseDown={handleRippleClick}
                disabled={isLoading}
                className={`relative w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {/* Smooth Ripple Effect Span */}
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
                  <svg className="animate-spin h-5 w-5 text-slate-600 relative z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 font-bold">
              Don't have an account? <span className="text-blue-600 font-extrabold hover:text-blue-800 hover:underline cursor-pointer transition-all">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;