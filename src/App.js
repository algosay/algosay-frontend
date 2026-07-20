import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AIParseSection from './components/AIParseSection';
import StrategyConfig from './components/StrategyConfig';
import ResultsDashboard from './components/ResultsDashboard';

// 🚨 NEW: Firebase Auth & Database Imports 🚨
import { auth, getUserCredits, deductUserCredit } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';

function App() {
  // --- Auth & Credits State ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userCredits, setUserCredits] = useState(0); // 🚨 NEW: State to track credits

  // --- AI Input & Workflow State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExplanation, setAiExplanation] = useState(''); 
  const [isConfirmed, setIsConfirmed] = useState(false);   
  const [needsInfoQuestion, setNeedsInfoQuestion] = useState(''); 

  // --- Strategy State ---
  const [ticker, setTicker] = useState('BANKNIFTY');
  const [timeframe, setTimeframe] = useState('15m'); 
  const [underlyingFrom, setUnderlyingFrom] = useState('Futures');
  const [qty, setQty] = useState(150); 
  
  // Transaction Type State (Buy/Sell)
  const [transactionType, setTransactionType] = useState('BUY');

  // Dual Directional Configuration States (Added for Options/Multi-Leg Sync)
  const [buyConfiguration, setBuyConfiguration] = useState(null);
  const [sellConfiguration, setSellConfiguration] = useState(null);

  // ✨ INDEPENDENT SPLIT STATES FOR SELLING CONFIGURATION
  const [sellTicker, setSellTicker] = useState('BANKNIFTY');
  const [sellTimeframe, setSellTimeframe] = useState('15m');
  const [sellUnderlyingFrom, setSellUnderlyingFrom] = useState('Futures');
  const [sellEntryTime, setSellEntryTime] = useState('');
  const [sellExitTime, setSellExitTime] = useState('15:15');

  // ✨ INDEPENDENT SPLIT STATES FOR BUYING CONFIGURATION
  const [buyTicker, setBuyTicker] = useState('BANKNIFTY');
  const [buyTimeframe, setBuyTimeframe] = useState('15m');
  const [buyUnderlyingFrom, setBuyUnderlyingFrom] = useState('Futures');
  const [buyEntryTime, setBuyEntryTime] = useState('');
  const [buyExitTime, setBuyExitTime] = useState('15:15');

  const [strategyType, setStrategyType] = useState('Intraday');
  const [entryTime, setEntryTime] = useState('09:15');
  const [exitTime, setExitTime] = useState('15:15');
  
  // Date Range State
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Trailing States 
  const [trailMoveX, setTrailMoveX] = useState(0);
  const [trailPointY, setTrailPointY] = useState(0);

  // Lists State
  const [indicators, setIndicators] = useState([]);
  const [legs, setLegs] = useState([]);

  // --- Engine State ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // --- Premium Toggle Feature State ---
  const [withTax, setWithTax] = useState(false);

  // 🚨 UPDATED: Auth Effect Listener with Credits Fetch 🚨
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch credits from database when user logs in
        const credits = await getUserCredits(currentUser.uid);
        setUserCredits(credits);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // AIParseSection-la irunthu varum 'data'-vai vaangi UI-ai update pannum function
  const handleParsedDataSuccess = (data) => {
    if (data.buy_configuration) setBuyConfiguration(data.buy_configuration);
    if (data.sell_configuration) setSellConfiguration(data.sell_configuration);

    const inst = data.instrument_settings || {};
    const entry = data.entry_settings || {};
    const risk = data.risk_management || {};
    const dates = data.date_settings || {}; 

    const primaryConfig = data.buy_configuration || data.sell_configuration || inst || {};
    const primaryEntry = data.buy_configuration || data.sell_configuration || entry || {};

    const rawBuy = data.buy_configuration || {};
    const rawSell = data.sell_configuration || {};

    setSellTicker(rawSell.ticker || rawSell.asset || primaryConfig.ticker || 'NIFTY');
    setSellTimeframe(rawSell.timeframe || primaryConfig.timeframe || '5m');
    setSellUnderlyingFrom(rawSell.underlyingFrom || rawSell.segment || 'Options');
    setSellEntryTime(rawSell.entryTime || rawSell.entry_time || '09:20');
    setSellExitTime(rawSell.exitTime || rawSell.exit_time || primaryEntry.exitTime || '15:15');

    setBuyTicker(rawBuy.ticker || rawBuy.asset || primaryConfig.ticker || 'NIFTY');
    setBuyTimeframe(rawBuy.timeframe || primaryConfig.timeframe || '5m');
    setBuyUnderlyingFrom(rawBuy.underlyingFrom || rawBuy.segment || 'Options');
    setBuyEntryTime(rawBuy.entryTime || rawBuy.entry_time || '09:45');
    setBuyExitTime(rawBuy.exitTime || rawBuy.exit_time || primaryEntry.exitTime || '15:15');

    setTicker(primaryConfig.ticker || 'BANKNIFTY');
    setTimeframe(primaryConfig.timeframe || '15m'); 
    setUnderlyingFrom(primaryConfig.underlyingFrom || primaryConfig.segment || 'Futures');
    setQty(inst.qty || 150); 
    
    setTransactionType(primaryConfig.transactionType || inst.transactionType || 'BUY');
    
    setStrategyType(primaryEntry.strategyType || 'Intraday');
    setEntryTime(primaryEntry.entryTime || '09:15');
    setExitTime(primaryEntry.exitTime || '15:15');

    setFromDate(dates.fromDate || '');
    setToDate(dates.toDate || '');
    
    setTrailMoveX(risk.trailMoveX || 0);
    setTrailPointY(risk.trailPointY || 0);

    if (data.indicators && Array.isArray(data.indicators)) {
      const mappedIndicators = data.indicators.map((ind, idx) => {
        let parsedSettings = '';
        if (ind.settings) {
          parsedSettings = typeof ind.settings === 'object' ? JSON.stringify(ind.settings).replace(/["{}]/g, '').replace(/:/g, ': ') : ind.settings;
        } else {
          const { name, indicator, ...rest } = ind;
          parsedSettings = Object.entries(rest).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
        return { id: Date.now() + idx, name: ind.name || ind.indicator || 'Unknown', settings: parsedSettings || 'Default Settings' };
      });
      setIndicators(mappedIndicators);
    } else {
      setIndicators([]);
    }
    
    if (data.legs && Array.isArray(data.legs)) {
      const mappedLegs = data.legs.map((leg, idx) => ({
        id: leg.id || Date.now() + idx,
        segment: leg.segment || 'Options',
        position: leg.position || 'Buy',
        lots: leg.lots || 1,
        optionType: leg.optionType || 'CE', 
        expiry: leg.expiry || 'Weekly',
        strikeType: leg.strikeType || 'ATM',
        strikeDistance: leg.strikeDistance || leg.strike_distance || 0,
        entryTime: leg.entryTime || leg.entry_time || '', 
        exitTime: leg.exitTime || leg.exit_time || '',  
        stopLoss: leg.stop_loss || leg.stopLoss || '', 
        target: leg.target || '',
        slUnit: leg.sl_unit || leg.slUnit || '%',
        targetUnit: leg.target_unit || leg.targetUnit || '%',
        trailX: leg.trail_sl?.x || leg.trailX || '',
        trailY: leg.trail_sl?.y || leg.trailY || '',
        slReentry: leg.sl_reentry || leg.slReentry || 0,
        targetReexecute: leg.target_reexecute || leg.targetReexecute || 0,
        waitAndTrade: leg.wait_and_trade || leg.waitAndTrade || false,
        costToCost: leg.cost_to_cost || leg.costToCost || false,
        moveToStoploss: leg.move_to_stoploss || leg.moveToStoploss || false
      }));
      setLegs(mappedLegs);
    } else {
      setLegs([]);
    }

    setIsConfirmed(true); 
  };

  const addLeg = () => { 
    setLegs([...legs, { 
      id: Date.now(), segment: 'Options', position: 'Buy', lots: 1, optionType: 'CE', expiry: 'Weekly', strikeType: 'ATM', 
      strikeDistance: 0, entryTime: '', exitTime: '', 
      stopLoss: '', target: '', slUnit: '%', targetUnit: '%',
      trailX: 0, trailY: 0, slReentry: 0, targetReexecute: 0, waitAndTrade: false, costToCost: false, moveToStoploss: false
    }]); 
    setIsConfirmed(false); 
  };
  
  const updateLeg = (id, field, value) => { setLegs(legs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); setIsConfirmed(false); };
  const removeLeg = (id) => { setLegs(legs.filter(leg => leg.id !== id)); setIsConfirmed(false); };

  const addIndicator = () => { setIndicators([...indicators, { id: Date.now(), name: 'RSI', settings: 'Period: 14' }]); setIsConfirmed(false); };
  const updateIndicator = (id, field, value) => { setIndicators(indicators.map(ind => ind.id === id ? { ...ind, [field]: value } : ind)); setIsConfirmed(false); };
  const removeIndicator = (id) => { setIndicators(indicators.filter(ind => ind.id !== id)); setIsConfirmed(false); };

  // 🚨 UPDATED: API Call with Monetization Logic 🚨
  const runBacktest = async () => {
    if (!isConfirmed) return; 

    // 1️⃣ Check if user has enough credits
    if (userCredits <= 0) {
      alert("⚠️ Insufficient Credits! Please recharge your credits to run more backtests.");
      setError('Insufficient Credits. Please recharge your account.');
      return;
    }

    setLoading(true); setError(''); setResult(null);

    // 2️⃣ Deduct 1 Credit from Database
    const deductionSuccess = await deductUserCredit(user?.uid);
    if (deductionSuccess) {
      setUserCredits(prev => prev - 1); // Update UI instantly
    } else {
      setError('Failed to process credits. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    // 3️⃣ Payload Construction
    const payload = {
      user_id: user?.uid || "guest_123", 
      strategy_text: aiPrompt, 
      instrument_settings: { ticker, timeframe, underlyingFrom, qty, transactionType }, 
      
      buy_configuration: {
        ticker: buyTicker,
        timeframe: buyTimeframe,
        underlyingFrom: buyUnderlyingFrom,
        entryTime: buyEntryTime,
        exitTime: buyExitTime
      },
      sell_configuration: {
        ticker: sellTicker,
        timeframe: sellTimeframe,
        underlyingFrom: sellUnderlyingFrom,
        entryTime: sellEntryTime,
        exitTime: sellExitTime
      },
      
      date_settings: { fromDate, toDate },
      entry_settings: { strategyType, entryTime, exitTime },
      risk_management: { trailMoveX, trailPointY }, 
      indicators: indicators.map(i => ({ name: i.name, settings: i.settings })), 
      
      legs: legs.map(leg => ({
        id: leg.id,
        segment: leg.segment,
        position: leg.position, 
        lots: leg.lots,
        option_type: leg.optionType,
        expiry: leg.expiry,
        strike_type: leg.strikeType,
        strike_distance: parseInt(leg.strikeDistance) || 0,
        entry_time: leg.entryTime, 
        exit_time: leg.exitTime,  
        target: leg.target || 0,
        target_unit: leg.targetUnit || '%',
        stop_loss: leg.stopLoss || 0,
        sl_unit: leg.slUnit || '%',
        trail_sl: { x: leg.trailX || 0, y: leg.trailY || 0 },
        sl_reentry: leg.slReentry || 0,
        target_reexecute: leg.targetReexecute || 0,
        wait_and_trade: leg.waitAndTrade || false,
        cost_to_cost: leg.costToCost || false,
        move_to_stoploss: leg.moveToStoploss || false
      }))
    };

    try {
      const response = await fetch("https://algosay-backend.onrender.com/run_strategy", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Backtest execution encountered an error.');
      const data = await response.json();
      setResult(data.results || data); 
    } catch (err) {
      setError('Execution Error: Failed to retrieve backtest results from the engine.');
      // Optional: If you want to refund the credit on backend failure, you could add an increment(1) call here.
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
        <p className="text-lg animate-pulse font-semibold">Loading AlgoSay Environment...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* 🚨 UPDATED: Top Bar with Dynamic Credits Display 🚨 */}
      <div className="flex justify-end items-center p-3 bg-[#181818] border-b border-[#2d2d2d] gap-4">
        
        {/* Credits Pill Display */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full shadow-inner">
          <span className="text-yellow-500 text-sm">⚡</span>
          <span className="text-xs font-bold text-yellow-500 tracking-wide">{userCredits} CREDITS</span>
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Logged in as: <span className="text-blue-400 font-bold">{user.email || user.displayName}</span>
        </span>
        <button 
          onClick={() => signOut(auth)}
          className="px-3 py-1 bg-red-900/30 hover:bg-red-600/50 text-red-400 text-xs font-bold rounded transition-colors border border-red-800/50"
        >
          Logout
        </button>
      </div>

      <Header />

      <div className="w-full max-w-[96%] xl:max-w-[98%] mx-auto p-4 md:p-6 lg:p-8">
        
        <AIParseSection 
          aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} 
          isParsing={isParsing} setIsParsing={setIsParsing} 
          aiMessage={aiMessage} setAiMessage={setAiMessage}
          needsInfoQuestion={needsInfoQuestion} setNeedsInfoQuestion={setNeedsInfoQuestion}
          aiExplanation={aiExplanation} setAiExplanation={setAiExplanation}
          isConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed} 
          onParsedDataSuccess={handleParsedDataSuccess} 
        />

        {aiExplanation && (
          <div className="animate-fade-in w-full">
            <h2 className="text-lg font-bold text-white mb-4 mt-8">Strategy Configuration</h2>
            
            <StrategyConfig 
              sellTicker={sellTicker} setSellTicker={setSellTicker}
              sellTimeframe={sellTimeframe} setSellTimeframe={setSellTimeframe}
              sellUnderlyingFrom={sellUnderlyingFrom} setSellUnderlyingFrom={setSellUnderlyingFrom}
              sellEntryTime={sellEntryTime} setSellEntryTime={setSellEntryTime}
              sellExitTime={sellExitTime} setSellExitTime={setSellExitTime}
              
              buyTicker={buyTicker} setBuyTicker={setBuyTicker}
              buyTimeframe={buyTimeframe} setBuyTimeframe={setBuyTimeframe}
              buyUnderlyingFrom={buyUnderlyingFrom} setBuyUnderlyingFrom={setBuyUnderlyingFrom}
              buyEntryTime={buyEntryTime} setBuyEntryTime={setBuyEntryTime}
              buyExitTime={buyExitTime} setBuyExitTime={setBuyExitTime}

              ticker={ticker} setTicker={setTicker}
              timeframe={timeframe} setTimeframe={setTimeframe}
              underlyingFrom={underlyingFrom} setUnderlyingFrom={setUnderlyingFrom}
              qty={qty} setQty={setQty}
              transactionType={transactionType} setTransactionType={setTransactionType}
              
              buyConfiguration={buyConfiguration} setBuyConfiguration={setBuyConfiguration}
              sellConfiguration={sellConfiguration} setSellConfiguration={setSellConfiguration}
              
              fromDate={fromDate} setFromDate={setFromDate}
              toDate={toDate} setToDate={setToDate}
              
              entryTime={entryTime} setEntryTime={setEntryTime}
              exitTime={exitTime} setExitTime={setExitTime}
              
              trailMoveX={trailMoveX} setTrailMoveX={setTrailMoveX}
              trailPointY={trailPointY} setTrailPointY={setTrailPointY}
              indicators={indicators} addIndicator={addIndicator} updateIndicator={updateIndicator} removeIndicator={removeIndicator}
              legs={legs} addLeg={addLeg} updateLeg={updateLeg} removeLeg={removeLeg}
              setIsConfirmed={setIsConfirmed}
            />

            <button
              onClick={runBacktest}
              disabled={loading || !isConfirmed}
              className={`w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all mb-8 flex justify-center items-center gap-3 ${
                loading || !isConfirmed 
                ? 'bg-[#1e1e1e] text-gray-600 border border-[#2d2d2d] cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
              }`}
            >
              {loading ? (
                <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running Backtest...</>
              ) : !isConfirmed ? 'Lock Parameters to Execute' : 'Run Backtest (Cost: 1 Credit)'}
            </button>

            {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 mb-8 text-sm font-semibold">{error}</div>}

            <ResultsDashboard 
              result={result} 
              withTax={withTax} 
              setWithTax={setWithTax} 
            />
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;