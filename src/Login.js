import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeView from './HomeView';
import AuthView from './AuthView';

const Login = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('home');
  const [isSignUp, setIsSignUp] = useState(false);

  // 💎 Live Spot Prices State - Default எண்கள் கொடுக்கப்பட்டுள்ளது. (API எரர் அடித்தாலும் Blank ஆகாது!)
  const [indices, setIndices] = useState([
    { symbol: '^NSEI', name: 'NIFTY 50', price: 24350.15, change: 85.40, percent: 0.35 },
    { symbol: '^NSEBANK', name: 'BANK NIFTY', price: 52120.80, change: -120.30, percent: -0.23 },
    { symbol: '^BSESN', name: 'SENSEX', price: 79890.50, change: 240.10, percent: 0.30 }
  ]);

  // 💎 Yahoo Finance Live Spot Price Fetcher Function (WITH CORS PROXY)
  const fetchMarketData = async () => {
    try {
      const symbols = [
        { sym: '^NSEI', name: 'NIFTY 50' },
        { sym: '^NSEBANK', name: 'BANK NIFTY' },
        { sym: '^BSESN', name: 'SENSEX' }
      ];

      const updatedData = await Promise.all(
        symbols.map(async (item) => {
          try {
            // Yahoo API URL
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.sym)}?interval=1m&range=1d`;
            // Browser CORS எரரைத் தடுக்க Proxy பயன்படுத்தப்படுகிறது
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            
            const res = await fetch(proxyUrl);
            
            if (res.ok) {
              const data = await res.json();
              const result = data?.chart?.result?.[0];
              const meta = result?.meta;
              if (meta) {
                const currentPrice = meta.regularMarketPrice;
                const prevClose = meta.previousClose || meta.chartPreviousClose || currentPrice;
                const change = currentPrice - prevClose;
                const percent = prevClose ? (change / prevClose) * 100 : 0;
                return {
                  symbol: item.sym,
                  name: item.name,
                  price: currentPrice,
                  change: change,
                  percent: percent
                };
              }
            }
          } catch (err) {
            // Proxy பிளாக் ஆனால் பழைய எண்களே தொடர்ந்து திரையில் தெரியும்.
            console.warn(`Fetch Warning for ${item.name}: CORS or Adblocker issue`, err);
          }
          return null;
        })
      );

      const validResults = updatedData.filter(Boolean);
      if (validResults.length > 0) {
        setIndices(prev => prev.map(old => {
          const matched = validResults.find(v => v.symbol === old.symbol);
          return matched ? matched : old;
        }));
      }
    } catch (error) {
      console.error("Market Ticker Error:", error);
    }
  };

  // 💎 Auto-Fetch on Mount & Auto Refresh Every 15 Seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => {
      fetchMarketData();
    }, 15000); // Fetches new data every 15 seconds

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8 overflow-hidden bg-white">
      
      {/* 🔥 LIVE FOMO & MARKET TICKER (Always at Top) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-xs font-semibold tracking-wide px-4"
        >
          {/* 💎 LIVE MARKET DATA RENDER */}
          {indices.map((idx, i) => {
            if (!idx.price) return null;
            const isPositive = idx.change >= 0;
            return (
              <span key={`market-${i}`} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-sm">
                <span className="text-slate-300 font-bold tracking-wider">{idx.name}</span>
                <span className={`font-extrabold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} ({Math.abs(idx.percent).toFixed(2)}%)
                </span>
              </span>
            );
          })}
          
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
            onLoginSuccess={onLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;