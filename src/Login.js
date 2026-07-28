import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeView from './HomeView';
import AuthView from './AuthView';
// 🚨 NEW: Import the database function from firebase
import { createUserProfile } from './firebase';

const Login = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('home');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginErrorState, setLoginErrorState] = useState(''); // 💎 NEW: Track error state to detect non-existent accounts

  // Common animation variants passed to both children
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

  // 🚨 NEW: Wrapper function to create user in database before letting them in
  const handleAuthSuccess = async (user) => {
    if (user) {
      await createUserProfile(user); // Adds the 50 free credits in Firestore
      onLoginSuccess(user); // Proceeds to the main app
    }
  };

  // 💎 NEW: Function to handle non-existent account catch from AuthView
  const handleLoginError = (errorMessage) => {
    setLoginErrorState(errorMessage);
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8 overflow-hidden bg-white">
      
      {/* 🔥 LIVE FOMO TICKER (Always at Top) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-xs font-semibold tracking-wide px-4"
        >
          {/* ORIGINAL FOMO ALERTS (Unchanged) */}
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

      {/* 💎 NEW: Global Account-Not-Found Alert Banner inside Login Container if triggered */}
      {loginErrorState && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-300 text-xs sm:text-sm animate-bounce">
          <span>⚠️ {loginErrorState}</span>
          <button 
            onClick={() => {
              setIsSignUp(true); // Switch to Sign Up mode
              setLoginErrorState(''); // Clear alert
            }}
            className="bg-slate-950 text-white px-3 py-1 rounded-xl text-xs font-black hover:bg-slate-800 transition-colors shadow-sm"
          >
            Account illaya? Inga Sign Up pannunga 🚀
          </button>
        </div>
      )}

      <AnimatePresence mode="wait" custom={currentView === 'login' ? 'right' : 'left'}>
        {currentView === 'home' ? (
          <HomeView 
            key="home" 
            custom="right" 
            viewVariants={viewVariants}
            onNavigate={(isSignUpMode) => {
              setIsSignUp(isSignUpMode);
              setLoginErrorState('');
              setCurrentView('login');
            }} 
          />
        ) : (
          <AuthView 
            key="login" 
            custom="left" 
            viewVariants={viewVariants}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            onBack={() => {
              setCurrentView('home');
              setLoginErrorState('');
            }}
            onLoginSuccess={handleAuthSuccess} 
            onErrorOccurred={handleLoginError} // 💎 NEW: Passing error handler callback down to AuthView
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;