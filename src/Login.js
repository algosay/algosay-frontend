import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeView from './HomeView';
import AuthView from './AuthView';
// 🚨 NEW: Import the database function from firebase
import { createUserProfile } from './firebase';

const Login = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('home');
  const [isSignUp, setIsSignUp] = useState(false);

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

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8 overflow-hidden bg-white">
      
      {/* 🔥 LIVE FOMO TICKER (Always at Top) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }} // Move halfway since content is duplicated
          transition={{ repeat: Infinity, duration: 75, ease: "linear" }} // Slower duration
          className="whitespace-nowrap flex gap-12 text-xs font-semibold tracking-wide px-4"
        >
          {/* FIRST SET OF PREMIUM MESSAGES */}
          <span className="flex items-center gap-2">
            <span className="text-yellow-400">⚡</span> 
            <span className="text-yellow-300 font-bold">FIRST TIME IN INDIA:</span> Algosay combines Price Action, Time-Based, Indicator & Custom Strategies on ONE unified platform!
          </span>
          <span className="flex items-center gap-2">
            <span className="text-orange-500">🔥</span> 
            <span className="text-orange-400 font-bold">PRICE ACTION ENGINE:</span> Backtest Inside Bar Crushes, Doji Breakouts & Candle Reversals with institutional precision.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-blue-400">💎</span> 
            <span className="text-blue-300 font-bold">INDICATOR MATRIX:</span> Run Supertrend (10,3), MACD (12,26,9), 9/21 EMA & RSI Reversal strategies seamlessly on Sensex & Nifty.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">🚀</span> 
            <span className="text-green-300 font-bold">TIME-BASED & MULTI-LEG:</span> Deploy 15M Short Straddles, First-Hour ORB & Dual OTM/ITM Option Combos instantly.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-purple-400">✨</span> 
            <span className="text-purple-300 font-bold">CANDLE SEQUENCE MOMENTUM:</span> Master 3-Candle, 5-Candle & 7-Candle Trend Breakout algorithms with zero coding.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-cyan-400">🎯</span> 
            <span className="text-cyan-300 font-bold">ADVANCED RISK CONTROL:</span> Built-in Combined Premium SL, Leg-level Targets & Automated 15:15 PM Square-off.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-pink-400">📈</span> 
            <span className="text-pink-300 font-bold">ALGOSAY PRO:</span> India's most powerful backtesting engine for high-probability Sensex & Nifty strategies.
          </span>

          {/* DUPLICATE SET FOR CONTINUOUS SEAMLESS LOOP */}
          <span className="flex items-center gap-2">
            <span className="text-yellow-400">⚡</span> 
            <span className="text-yellow-300 font-bold">FIRST TIME IN INDIA:</span> Algosay combines Price Action, Time-Based, Indicator & Custom Strategies on ONE unified platform!
          </span>
          <span className="flex items-center gap-2">
            <span className="text-orange-500">🔥</span> 
            <span className="text-orange-400 font-bold">PRICE ACTION ENGINE:</span> Backtest Inside Bar Crushes, Doji Breakouts & Candle Reversals with institutional precision.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-blue-400">💎</span> 
            <span className="text-blue-300 font-bold">INDICATOR MATRIX:</span> Run Supertrend (10,3), MACD (12,26,9), 9/21 EMA & RSI Reversal strategies seamlessly on Sensex & Nifty.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">🚀</span> 
            <span className="text-green-300 font-bold">TIME-BASED & MULTI-LEG:</span> Deploy 15M Short Straddles, First-Hour ORB & Dual OTM/ITM Option Combos instantly.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-purple-400">✨</span> 
            <span className="text-purple-300 font-bold">CANDLE SEQUENCE MOMENTUM:</span> Master 3-Candle, 5-Candle & 7-Candle Trend Breakout algorithms with zero coding.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-cyan-400">🎯</span> 
            <span className="text-cyan-300 font-bold">ADVANCED RISK CONTROL:</span> Built-in Combined Premium SL, Leg-level Targets & Automated 15:15 PM Square-off.
          </span>
          <span className="flex items-center gap-2">
            <span className="text-pink-400">📈</span> 
            <span className="text-pink-300 font-bold">ALGOSAY PRO:</span> India's most powerful backtesting engine for high-probability Sensex & Nifty strategies.
          </span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" custom={currentView === 'login' ? 'right' : 'left'}>
        {currentView === 'home' ? (
          <HomeView 
            key="home" 
            custom="right" 
            viewVariants={viewVariants}
            onNavigate={(isSignUpMode) => {
              setIsSignUp(isSignUpMode);
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
            onBack={() => setCurrentView('home')}
            onLoginSuccess={handleAuthSuccess} // 🚨 NEW: Passing our new wrapper function here
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;