import React, { useState } from 'react';
import { signInWithGoogle } from './firebase'; // Ensure this path is correct
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Terminal, Activity, Filter, TrendingUp } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

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

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-white bg-slate-950 relative overflow-hidden">
      
      {/* LEFT SIDE: AI Innovation & Animations */}
      <div className="hidden md:flex flex-col w-1/2 relative overflow-hidden px-12 lg:px-20 py-10 z-10">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -left-32 top-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute right-10 bottom-10 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>
        
        {/* TOP LEFT: App Name & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            AlgoSay
          </span>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col justify-center flex-grow mt-6">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Terminal size={14} /> The Next Evolution in Quant Trading
          </h3>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-6">
            Code-Free Strategies,<br/> Powered by AI.
          </h1>

          {/* 🔥 LIVE TYPING ANIMATION 🔥 */}
          <div className="mb-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl font-mono text-sm shadow-inner min-h-[80px] flex items-center">
            <span className="text-green-400 mr-2">~ %</span>
            <TypeAnimation
              sequence={[
                'Sell BankNifty ATM Straddle at 9:20 AM',
                1000,
                'AI Processing logic...',
                500,
                'Strategy Ready! ✅ Win Rate: 68%',
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="text-blue-300"
              repeat={Infinity}
            />
          </div>

          {/* STEP-BY-STEP FEATURES (Animated) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-lg"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                <Terminal size={18} />
              </div>
              <div>
                <h4 className="text-md font-bold text-slate-200">Describe & Auto-Map</h4>
                <p className="text-sm text-slate-400 mt-1">Explain your logic in plain text. Our AI instantly translates it into precision execution rules.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
                <Activity size={18} />
              </div>
              <div>
                <h4 className="text-md font-bold text-slate-200">AI Strategy Diagnostics</h4>
                <p className="text-sm text-slate-400 mt-1">Get personalized reports on MFE/MAE and exactly how to improve your strategy.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shadow-inner">
                <Filter size={18} />
              </div>
              <div>
                <h4 className="text-md font-bold text-slate-200">Deep Filtering Engine</h4>
                <p className="text-sm text-slate-400 mt-1">Slice data with 0DTE, Day-wise, and Buy/Sell leg filters to find your hidden edge.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-md font-bold text-slate-200">Institutional Metrics</h4>
                <p className="text-sm text-slate-400 mt-1">Profit Factor, Sortino Ratio, Kelly Sizing, and System Survival Probability.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Glassmorphism Login Action */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative z-10">
        
        {/* Right Side Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* 🧊 Glassmorphism Login Card */}
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-8 lg:p-10 z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to your AlgoSay terminal</p>
          </div>

          <div className="space-y-6">
            
            {/* Google Login Button (Primary) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-4 px-4 bg-white text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-white/10 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-slate-50'}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              {isLoading ? 'Authenticating...' : 'Continue with Google'}
            </motion.button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute border-t border-slate-700 w-full"></div>
              <span className="bg-slate-900/40 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Or</span>
            </div>

            {/* Email Login (Disabled State) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                disabled
              />
            </div>
            
            <button disabled className="w-full py-3.5 bg-blue-600/50 text-white/50 font-bold rounded-xl transition-all cursor-not-allowed border border-blue-500/20">
              Login via Email (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;