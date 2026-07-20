import React, { useState } from 'react';
import { signInWithGoogle } from './firebase';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Terminal, Wand2, BarChart2 } from 'lucide-react'; // Added BarChart2 for the 5th point

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sandboxText, setSandboxText] = useState("");

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

  const handleSandboxSubmit = () => {
    if (sandboxText.trim() !== "") {
      alert("AI Generated the strategy! To view the full backtest report and metrics, please Sign in with Google.");
    }
  };

  // Framer Motion Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* LEFT SIDE: App Innovation (Color 1: Deep Indigo/Blue Dark Theme) */}
      <div className="hidden md:flex flex-col w-1/2 bg-[#0B132B] relative overflow-hidden px-12 lg:px-20 py-8 z-10">
        
        {/* Abstract Premium Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0B132B] to-[#0B132B] -z-10"></div>
        <div className="absolute -left-32 top-32 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        
        {/* TOP LEFT: App Name & Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/20">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            AlgoSay
          </span>
        </div>

        {/* MAIN CONTENT: Centered Vertically */}
        <div className="flex flex-col justify-center flex-grow">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Terminal size={14} /> The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-3">
            Code-Free Custom Strategies, Powered by AI.
          </h1>
          <p className="text-sm text-blue-100/70 mb-5 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* 🔥 UPDATED FEATURE: 5 STRATEGIES LIVE TYPING ANIMATION 🔥 */}
          <div className="mb-6 p-4 bg-[#060B19]/60 border border-blue-900/50 rounded-xl font-mono text-sm shadow-inner min-h-[80px] flex items-center max-w-lg backdrop-blur-sm">
            <span className="text-green-400 mr-2 flex-shrink-0">algo@ai:~$</span>
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
              className="text-blue-300"
              repeat={Infinity}
            />
          </div>

          {/* STEP-BY-STEP INNOVATION EXPLANATION (Now with 5 Points) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-2 max-w-lg"
          >
            
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-inner border border-blue-500/30">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Describe Naturally & AI Auto-Mapping</h4>
                <p className="text-xs text-slate-400 mt-1">Explain your logic in plain English or Tanglish. Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shadow-inner border border-purple-500/30">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">AI Strategy Diagnostics & Improvement</h4>
                <p className="text-xs text-slate-400 mt-1">The moment your backtest completes, our AI analyzes your MFE/MAE and trade sequence to generate a personalized report on exactly how to improve your strategy.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm shadow-inner border border-green-500/30">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Granular Deep Filtering Engine</h4>
                <p className="text-xs text-slate-400 mt-1">Slice your data with precision using 0DTE, Day-wise, Win/Loss, and Buy/Sell leg filters to find your true hidden edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm shadow-inner border border-rose-500/30">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Institutional Pro Metrics</h4>
                <p className="text-xs text-slate-400 mt-1">Go beyond basic PnL. We provide Profit Factor, Sortino Ratio, System Survival Probability, Kelly Sizing, Stress Level Index, Tail Ratio & Scalability.</p>
              </div>
            </motion.div>

            {/* 🔥 NEW 5TH FEATURE POINT 🔥 */}
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm shadow-inner border border-amber-500/30">
                <BarChart2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Comprehensive Reports & Visuals</h4>
                <p className="text-xs text-slate-400 mt-1">Export ledgers via PDF/CSV. Analyze performance with Heatmaps, PnL Curves, Drawdown charts, and deep AI insights in detailed backtest reports.</p>
              </div>
            </motion.div>

          </motion.div>

          {/* 10 FREE BACKTESTS CTA BOX (Acts as Login Trigger) */}
          <div 
            onClick={handleGoogleLogin}
            className={`mt-4 p-4 rounded-xl cursor-pointer transition-all border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-between group max-w-md backdrop-blur-md ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 text-white text-2xl group-hover:scale-110 transition-transform">
                 🎁
               </div>
               <div>
                 <h4 className="text-base font-extrabold text-white">Claim 10 Free Backtests</h4>
                 <p className="text-xs text-blue-300 font-semibold mt-0.5">Click here to Sign In and start building.</p>
               </div>
            </div>
            <div className="text-blue-400 bg-blue-950/50 p-2 rounded-full shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors border border-blue-500/20">
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Login Action (Color 2: Very Dark Slate/Gray) */}
      <div className="w-full md:w-1/2 bg-[#0F172A] flex items-center justify-center p-6 relative z-10">
        
        {/* Decorative elements for the dark background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-10 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="w-full max-w-md bg-[#1E293B]/60 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 lg:p-10 z-10 border border-slate-700/50">
          
          {/* 🔥 UPDATED: Replaced "Welcome Back" with App Name and Logo 🔥 */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/20">
                <span className="text-white font-black text-3xl">A</span>
              </div>
              <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AlgoSay
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium mt-1">Sign in to your AlgoSay terminal</p>
          </div>

          <div className="space-y-6">
            
            {/* Try AI Sandbox (No Login Required) */}
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-2">
                <Wand2 size={16} /> Try AI Prompt (Sandbox Mode)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder="e.g. Buy Nifty Call at 9:30..." 
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <button 
                  onClick={handleSandboxSubmit}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-sm transition-colors border border-slate-600"
                >
                  Test
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute border-t border-slate-700/80 w-full"></div>
              <span className="bg-[#1E293B] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Secure Login</span>
            </div>

            {/* Standard Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-900/50 text-white placeholder-slate-600"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-slate-900/50 text-white placeholder-slate-600"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-blue-500 bg-slate-900 border-slate-600 rounded focus:ring-blue-500 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <span className="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            <button disabled className="w-full py-3.5 bg-blue-600/30 hover:bg-blue-600/40 text-white/50 font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all cursor-not-allowed border border-blue-500/20">
              Login via Email (Coming Soon)
            </button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute border-t border-slate-700/80 w-full"></div>
              <span className="bg-[#1E293B] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Login With</span>
            </div>

            {/* Google Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              {isLoading ? 'Signing In...' : 'Sign in with Google'}
            </motion.button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Don't have an account? <span className="text-blue-400 font-bold hover:text-blue-300 hover:underline cursor-pointer transition-all">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;