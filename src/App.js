import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AIParseSection from './components/AIParseSection';
import StrategyConfig from './components/StrategyConfig';
import ResultsDashboard from './components/ResultsDashboard';
// 🚨 NEW: Import the extracted Modal Component 🚨
import MyStrategiesModal from './MyStrategiesModal';

// 🚨 Added saveUserStrategy, getUserStrategies, and deleteUserStrategy imports 🚨
import { auth, getUserCredits, deductUserCredit, saveUserStrategy, getUserStrategies, deleteUserStrategy } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';

function App() {
  // --- Auth & Credits State ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userCredits, setUserCredits] = useState(0); 

  // 🚨 Save & Load Strategy States 🚨
  const [showStrategiesModal, setShowStrategiesModal] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [modalTab, setModalTab] = useState('my_strategies'); // 🚨 NEW STATE FOR TAB

  // --- AI Input & Workflow State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExplanation, setAiExplanation] = useState(''); 
  const [isConfirmed, setIsConfirmed] = useState(false);   
  const [needsInfoQuestion, setNeedsInfoQuestion] = useState(''); 

  // --- Global Strategy State (No Forced Ticker Defaults) ---
  const [ticker, setTicker] = useState(''); // 🚨 Changed default from 'BANKNIFTY' to '' to prevent hardcoded overrides
  const [timeframe, setTimeframe] = useState('15m'); 
  const [underlyingFrom, setUnderlyingFrom] = useState('Options');
  const [qty, setQty] = useState(150); 
  const [transactionType, setTransactionType] = useState('BUY');
  const [strategyType, setStrategyType] = useState('Intraday');
  const [entryTime, setEntryTime] = useState('09:15');
  const [exitTime, setExitTime] = useState('15:15');
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [trailMoveX, setTrailMoveX] = useState(0);
  const [trailPointY, setTrailPointY] = useState(0);

  const [indicators, setIndicators] = useState([]);
  const [legs, setLegs] = useState([]); // 🚨 ALL LEG DATA LIVES HERE NOW

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [withTax, setWithTax] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const credits = await getUserCredits(currentUser.uid);
        setUserCredits(credits);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleParsedDataSuccess = (data) => {
    // Extract Global Settings for fallbacks
    const inst = data.instrument_settings || {};
    const entry = data.entry_settings || {};
    const risk = data.risk_management || {};
    const dates = data.date_settings || {}; 

    // 🚨 UPDATED: Directly assign what AI returns, avoiding forced 'BANKNIFTY' fallback
    setTicker(inst.ticker || '');
    setTimeframe(inst.timeframe || '15m'); 
    setUnderlyingFrom(inst.underlyingFrom || inst.segment || 'Options');
    setQty(inst.qty || 150); 
    setTransactionType(inst.transactionType || 'BUY');
    setStrategyType(entry.strategyType || 'Intraday');
    setEntryTime(entry.entryTime || '09:15');
    setExitTime(entry.exitTime || '15:15');
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
    
    // 🚨 UPDATED: Map legs with exact Ticker/Asset requested by user via AI prompt (No forced 'BANKNIFTY' override)
    if (data.legs && Array.isArray(data.legs)) {
      const mappedLegs = data.legs.map((leg, idx) => ({
        id: leg.id || Date.now() + idx,
        ticker: leg.ticker || leg.asset || inst.ticker || '', // 👈 Passes exact user request
        timeframe: leg.timeframe || inst.timeframe || '5m',
        entryTime: leg.entryTime || leg.entry_time || entry.entryTime || '', 
        exitTime: leg.exitTime || leg.exit_time || entry.exitTime || '',
        segment: leg.segment || 'Options',
        position: leg.position || 'Buy',
        lots: leg.lots || 1,
        optionType: leg.optionType || leg.option_type || 'CE', 
        expiry: leg.expiry || 'Weekly',
        strikeType: leg.strikeType || leg.strike_type || 'ATM',
        strikeDistance: leg.strikeDistance || leg.strike_distance || 0,
        stopLoss: leg.stop_loss || leg.stopLoss || '', 
        target: leg.target || '',
        slUnit: leg.sl_unit || leg.slUnit || '%',
        targetUnit: leg.target_unit || leg.targetUnit || '%',
        trailX: leg.trail_sl?.x || leg.trailX || 0,
        trailY: leg.trail_sl?.y || leg.trailY || 0,
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

  // 🚨 UPDATED: Add Leg uses current ticker state (or empty string)
  const addLeg = () => { 
    setLegs([...legs, { 
      id: Date.now(), 
      ticker: ticker, timeframe: timeframe, entryTime: '', exitTime: '', 
      segment: 'Options', position: 'Buy', lots: 1, optionType: 'CE', expiry: 'Weekly', strikeType: 'ATM', 
      strikeDistance: 0, stopLoss: '', target: '', slUnit: '%', targetUnit: '%', trailX: 0, trailY: 0, 
      slReentry: 0, targetReexecute: 0, waitAndTrade: false, costToCost: false, moveToStoploss: false 
    }]); 
    setIsConfirmed(false); 
  };
  const updateLeg = (id, field, value) => { setLegs(legs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); setIsConfirmed(false); };
  const removeLeg = (id) => { setLegs(legs.filter(leg => leg.id !== id)); setIsConfirmed(false); };

  const addIndicator = () => { setIndicators([...indicators, { id: Date.now(), name: 'RSI', settings: 'Period: 14' }]); setIsConfirmed(false); };
  const updateIndicator = (id, field, value) => { setIndicators(indicators.map(ind => ind.id === id ? { ...ind, [field]: value } : ind)); setIsConfirmed(false); };
  const removeIndicator = (id) => { setIndicators(indicators.filter(ind => ind.id !== id)); setIsConfirmed(false); };

  // 🟢 Save Strategy Logic 🟢
  const handleSaveStrategy = async () => {
    if (!user) return alert("Please login to save strategies.");
    const name = window.prompt("Enter a name for this strategy (e.g., Nifty Iron Condor):");
    if (!name) return;

    const strategyData = {
      aiPrompt, aiExplanation,
      ticker, timeframe, underlyingFrom, qty, transactionType,
      strategyType, entryTime, exitTime, fromDate, toDate,
      trailMoveX, trailPointY, indicators, legs
    };

    const res = await saveUserStrategy(user.uid, name, strategyData);
    if (res.success) {
      alert("✅ Strategy saved successfully!");
    } else {
      alert("❌ Error saving strategy.");
    }
  };

  // 🟢 UPDATED: Open Modal & Fetch Strategies Logic (Tab Support) 🟢
  const openStrategiesModal = async (tabName = 'my_strategies') => {
    if (!user) return;
    setModalTab(tabName); // Set which tab to open
    setIsLoadingStrategies(true);
    setShowStrategiesModal(true);
    const strats = await getUserStrategies(user.uid);
    setSavedStrategies(strats);
    setIsLoadingStrategies(false);
  };

  // 🟢 UPDATED: Load Strategy Logic 🟢
  const loadStrategy = (strat) => {
    if (strat.isDefault) {
      setAiPrompt(strat.prompt);
      setAiExplanation(''); 
      setIsConfirmed(false);
      setShowStrategiesModal(false);
      alert(`🚀 Template "${strat.name}" loaded!\n\nClick the "Generate with AI" button to build the strategy legs.`);
      return;
    }

    const data = strat.data;
    setAiPrompt(data.aiPrompt || '');
    setAiExplanation(data.aiExplanation || 'Loaded from saved strategies.');
    setTicker(data.ticker || '');
    setTimeframe(data.timeframe || '15m');
    setUnderlyingFrom(data.underlyingFrom || 'Options');
    setQty(data.qty || 150);
    setTransactionType(data.transactionType || 'BUY');
    
    setStrategyType(data.strategyType || 'Intraday');
    setEntryTime(data.entryTime || '09:15');
    setExitTime(data.exitTime || '15:15');
    setFromDate(data.fromDate || '');
    setToDate(data.toDate || '');
    
    setTrailMoveX(data.trailMoveX || 0);
    setTrailPointY(data.trailPointY || 0);
    setIndicators(data.indicators || []);
    setLegs(data.legs || []); // Loads the unified legs configuration

    setIsConfirmed(true); 
    setShowStrategiesModal(false); 
    alert(`🚀 Strategy "${strat.name}" loaded successfully!`);
  };

  // 🟢 Delete Strategy Logic 🟢
  const handleDeleteStrategy = async (strat) => {
    if (!user) return;
    const isConfirm = window.confirm(`Are you sure you want to delete "${strat.name}"?`);
    if (!isConfirm) return;

    try {
      const res = await deleteUserStrategy(strat.id);
      if (res && res.success) {
        setSavedStrategies(prevStrats => prevStrats.filter(s => s.id !== strat.id));
        alert("✅ Strategy deleted successfully!");
      } else {
        alert("❌ Error: Could not delete strategy from database.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("❌ Error deleting strategy. Please try again.");
    }
  };

  // 🚨 API Request Payload
  const runBacktest = async () => {
    if (!isConfirmed) return; 

    if (userCredits <= 0) {
      alert("⚠️ Insufficient Credits! Please recharge your credits to run more backtests.");
      setError('Insufficient Credits. Please recharge your account.');
      return;
    }

    setLoading(true); setError(''); setResult(null);

    const deductionSuccess = await deductUserCredit(user?.uid);
    if (deductionSuccess) {
      setUserCredits(prev => prev - 1); 
    } else {
      setError('Failed to process credits. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user?.uid || "guest_123", 
      strategy_text: aiPrompt, 
      instrument_settings: { ticker, timeframe, underlyingFrom, qty, transactionType },
      date_settings: { fromDate, toDate },
      entry_settings: { strategyType, entryTime, exitTime },
      risk_management: { trailMoveX, trailPointY }, 
      indicators: indicators.map(i => ({ name: i.name, settings: i.settings })), 
      
      legs: legs.map(leg => ({
        id: leg.id, 
        ticker: leg.ticker, timeframe: leg.timeframe, entry_time: leg.entryTime, exit_time: leg.exitTime,
        segment: leg.segment, position: leg.position, lots: leg.lots, option_type: leg.optionType, expiry: leg.expiry, 
        strike_type: leg.strikeType, strike_distance: parseInt(leg.strikeDistance) || 0,
        target: leg.target || 0, target_unit: leg.targetUnit || '%', stop_loss: leg.stopLoss || 0, sl_unit: leg.slUnit || '%',
        trail_sl: { x: leg.trailX || 0, y: leg.trailY || 0 }, sl_reentry: leg.slReentry || 0, target_reexecute: leg.targetReexecute || 0, 
        wait_and_trade: leg.waitAndTrade || false, cost_to_cost: leg.costToCost || false, move_to_stoploss: leg.moveToStoploss || false
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
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30 relative">
      
      <MyStrategiesModal 
        isOpen={showStrategiesModal} 
        onClose={() => setShowStrategiesModal(false)}
        isLoading={isLoadingStrategies}
        strategies={savedStrategies}
        onLoad={loadStrategy}
        onDelete={handleDeleteStrategy}
        initialTab={modalTab} 
      />

      <div className="flex justify-between md:justify-end items-center p-3 bg-[#181818] border-b border-[#2d2d2d] gap-4">
        <div className="flex items-center gap-3 w-full justify-end">
          
          <button 
            onClick={() => openStrategiesModal('my_strategies')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#252525] hover:bg-[#2d2d2d] text-gray-300 text-xs font-bold rounded transition-colors border border-[#3d3d3d]"
          >
            📂 My Strategies
          </button>

          <button 
            onClick={() => openStrategiesModal('default_strategies')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#252525] hover:bg-[#2d2d2d] text-gray-300 text-xs font-bold rounded transition-colors border border-[#3d3d3d]"
          >
            📜 Default Templates
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full shadow-inner">
            <span className="text-yellow-500 text-sm">⚡</span>
            <span className="text-xs font-bold text-yellow-500 tracking-wide">{userCredits} CREDITS</span>
          </div>

          <span className="hidden md:block text-xs text-gray-400 font-medium">
            <span className="text-blue-400 font-bold">{user.email || user.displayName}</span>
          </span>
          
          <button 
            onClick={() => signOut(auth)}
            className="px-3 py-1 bg-red-900/30 hover:bg-red-600/50 text-red-400 text-xs font-bold rounded transition-colors border border-red-800/50"
          >
            Logout
          </button>
        </div>
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
              ticker={ticker} setTicker={setTicker}
              timeframe={timeframe} setTimeframe={setTimeframe}
              underlyingFrom={underlyingFrom} setUnderlyingFrom={setUnderlyingFrom}
              qty={qty} setQty={setQty}
              transactionType={transactionType} setTransactionType={setTransactionType}
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

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <button
                onClick={handleSaveStrategy}
                disabled={!isConfirmed}
                className={`w-full md:w-1/3 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
                  !isConfirmed 
                  ? 'bg-[#1a1a1a] text-gray-700 border border-[#2d2d2d] cursor-not-allowed' 
                  : 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 hover:text-white border border-[#3d3d3d] shadow-lg'
                }`}
              >
                💾 Save Strategy
              </button>

              <button
                onClick={runBacktest}
                disabled={loading || !isConfirmed}
                className={`w-full md:w-2/3 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
                  loading || !isConfirmed 
                  ? 'bg-[#1e1e1e] text-gray-600 border border-[#2d2d2d] cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
                }`}
              >
                {loading ? (
                  <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running Backtest...</>
                ) : !isConfirmed ? 'Lock Parameters to Execute' : 'Run Backtest (Cost: 1 Credit)'}
              </button>
            </div>

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