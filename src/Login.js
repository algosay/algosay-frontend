import React, { useState } from 'react';
import { signInWithGoogle } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Terminal, BarChart2 } from 'lucide-react';

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
    <div className="flex min-h-screen w-full font-sans text-slate-700 selection:bg-blue-200 relative pt-8">
      
      {/* 🔥 NEW FEATURE: LIVE FOMO TICKER (Top of the screen) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex gap-16 text-xs font-medium tracking-wide"
        >
          <span className="flex items-center gap-2"><span className="text-yellow-400">⚡</span> User Rahul just backtested a 0DTE strategy with 72% Win Rate</span>
          <span className="flex items-center gap-2"><span className="text-orange-500">🔥</span> 15,000+ strategies mapped by AI today</span>
          <span className="flex items-center gap-2"><span className="text-blue-400">💎</span> Karthik deployed an Iron Condor with 4.2 Profit Factor</span>
          <span className="flex items-center gap-2"><span className="text-green-400">🚀</span> System survival probability metrics unlocked for pro users</span>
        </motion.div>
      </div>

      {/* LEFT SIDE: App Innovation (Premium Light Theme: White/Slate & Blue) */}
      <div className="hidden md:flex flex-col w-1/2 bg-slate-50 relative overflow-hidden px-12 lg:px-20 py-8 z-10">
        
        {/* Abstract Premium Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10"></div>
        <div className="absolute -left-32 top-32 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        
        {/* TOP LEFT: App Name & Logo */}
        <div className="flex items-center gap-3 mb-4 mt-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/20">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700">
            AlgoSay
          </span>
        </div>

        {/* MAIN CONTENT: Centered Vertically */}
        <div className="flex flex-col justify-center flex-grow pt-4">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Terminal size={14} /> The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-3">
            Code-Free Custom Strategies, Powered by AI.
          </h1>
          <p className="text-sm text-slate-600 mb-5 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* 🔥 EXISTING FEATURE: 5 STRATEGIES LIVE TYPING ANIMATION 🔥 */}
          <div className="mb-6 p-4 bg-white border border-blue-100 rounded-xl font-mono text-sm shadow-sm min-h-[80px] flex items-center max-w-lg">
            <span className="text-emerald-600 mr-2 flex-shrink-0">algo@ai:~$</span>
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
              className="text-blue-600 font-medium"
              repeat={Infinity}
            />
          </div>

          {/* 🔥 UPDATED: STEP-BY-STEP STAGGERED ENTRY ON SCROLL 🔥 */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-2 max-w-lg"
          >
            
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-inner border border-blue-200">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Describe Naturally & AI Auto-Mapping</h4>
                <p className="text-xs text-slate-500 mt-1">Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shadow-inner border border-purple-200">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">AI Strategy Diagnostics & Improvement</h4>
                <p className="text-xs text-slate-500 mt-1">The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shadow-inner border border-green-200">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Granular Deep Filtering Engine</h4>
                <p className="text-xs text-slate-500 mt-1">Slice your data with precision using 0DTE, Day-wise, Win/Loss, and Buy/Sell leg filters to find your true hidden edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shadow-inner border border-rose-200">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Institutional Pro Metrics</h4>
                <p className="text-xs text-slate-500 mt-1">Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shadow-inner border border-amber-200">
                <BarChart2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Comprehensive Reports & Visuals</h4>
                <p className="text-xs text-slate-500 mt-1">Export ledgers via PDF/CSV. Analyze performance with Heatmaps, PnL Curves, Drawdown charts, and deep AI insights in detailed backtest reports.</p>
              </div>
            </motion.div>

          </motion.div>

          {/* 10 FREE BACKTESTS CTA BOX */}
          <div 
            onClick={handleGoogleLogin}
            className={`mt-4 p-4 rounded-xl cursor-pointer transition-all border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-400 hover:shadow-lg flex items-center justify-between group max-w-md ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 text-white text-2xl group-hover:scale-110 transition-transform">
                 🎁
               </div>
               <div>
                 <h4 className="text-base font-extrabold text-slate-900">Claim 10 Free Backtests</h4>
                 <p className="text-xs text-blue-600 font-semibold mt-0.5">Click here to Sign In and start building.</p>
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

      {/* RIGHT SIDE: Login Action */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 relative z-10 pt-12">
        
        {/* Decorative elements for the light background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-10 -left-20 w-72 h-72 bg-indigo-100 rounded-full blur-[120px]"></div>
        </div>

        {/* Glassmorphism/Floating Login Card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 lg:p-10 z-10 border border-slate-100">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/20">
                <span className="text-white font-black text-3xl">A</span>
              </div>
              <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                AlgoSay
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">Sign in to your AlgoSay terminal</p>
          </div>

          <div className="space-y-6">

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Secure Login</span>
            </div>

            {/* Standard Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-800 placeholder-slate-400"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-800 placeholder-slate-400"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            <button disabled className="w-full py-3.5 bg-blue-50 text-blue-400 font-bold rounded-xl shadow-sm transition-all cursor-not-allowed border border-blue-100">
              Login via Email (Coming Soon)
            </button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Login With</span>
            </div>

            {/* 🔥 UPDATED: Google Login Button with Sweep Border & Ripple Effect 🔥 */}
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
                className={`relative w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
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
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <span className="text-blue-600 font-bold hover:text-blue-700 hover:underline cursor-pointer transition-all">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;