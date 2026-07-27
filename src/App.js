import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AIParseSection from './components/AIParseSection';
import StrategyConfig from './components/StrategyConfig';
import ResultsDashboard from './components/ResultsDashboard';
// 🚨 NEW: Import the extracted Modal Component 🚨
import MyStrategiesModal from './MyStrategiesModal';
import PricingModal from './components/PricingModal'; 
// 🚨 NEW: Imported UserProfile 🚨
import UserProfile from './components/UserProfile'; 

// 🚨 Saved Strategy, Auth & Firestore Imports 🚨
import { auth, db, getUserCredits, deductUserCredit, saveUserStrategy, getUserStrategies, deleteUserStrategy } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 

// 🚨 LATEST UPDATE: Imported AuthView instead of separate Login and Signup 🚨
import AuthView from './AuthView'; 

function App() {
  // --- Auth & Credits State ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userCredits, setUserCredits] = useState(0); 
  
  // 🚨 NEW: Subscription States 🚨
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');

  // 🚨 Save & Load Strategy States 🚨
  const [showStrategiesModal, setShowStrategiesModal] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [modalTab, setModalTab] = useState('my_strategies'); 

  // 🚨 Pricing Modal State 🚨
  const [showPricingModal, setShowPricingModal] = useState(false);

  // 🚨 NEW: User Profile Modal State 🚨
  const [showProfileModal, setShowProfileModal] = useState(false);

  // --- AI Input & Workflow State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExplanation, setAiExplanation] = useState(''); 
  const [isConfirmed, setIsConfirmed] = useState(false);   
  const [needsInfoQuestion, setNeedsInfoQuestion] = useState(''); 

  // --- Global Strategy State (No Forced Ticker Defaults) ---
  const [ticker, setTicker] = useState(''); 
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
  const [legs, setLegs] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [withTax, setWithTax] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 🚨 UPDATED: Fetching both credits and subscription status directly from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserCredits(userData.credits || 0);
          
          // Check if subscription is valid and not expired
          if (userData.subscription && userData.subscription.is_active) {
            const endDate = new Date(userData.subscription.end_date);
            if (endDate > new Date()) {
              setIsSubscribed(true);
              setSubscriptionPlan(userData.subscription.plan_type || 'Unlimited');
            } else {
              setIsSubscribed(false); 
            }
          }
        } else {
          // Fallback just in case
          const credits = await getUserCredits(currentUser.uid);
          setUserCredits(credits);
        }
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleParsedDataSuccess = (data) => {
    // 🚨 Extract actual Ticker/Index mentioned directly from user's AI Prompt
    let extractedTicker = '';
    const promptText = (aiPrompt || '').toUpperCase();
    
    if (promptText.includes('MIDCPNIFTY') || promptText.includes('MIDCAP')) {
      extractedTicker = 'MIDCPNIFTY';
    } else if (promptText.includes('FINNIFTY') || promptText.includes('FIN NIFTY')) {
      extractedTicker = 'FINNIFTY';
    } else if (promptText.includes('BANKNIFTY') || promptText.includes('BANK NIFTY')) {
      extractedTicker = 'BANKNIFTY';
    } else if (promptText.includes('BANKEX')) {
      extractedTicker = 'BANKEX';
    } else if (promptText.includes('SENSEX')) {
      extractedTicker = 'SENSEX';
    } else if (promptText.includes('NIFTY')) {
      extractedTicker = 'NIFTY';
    }

    // Extract Global Settings for fallbacks
    const inst = data.instrument_settings || {};
    const entry = data.entry_settings || {};
    const risk = data.risk_management || {};
    const dates = data.date_settings || {}; 

    // Priority: Extracted Ticker from Prompt > AI Response Ticker > Empty
    const finalTicker = extractedTicker || inst.ticker || '';

    // 🎯 ROBUST GLOBAL TRAIL EXTRACTION 🎯
    // Extracts X & Y even if AI drops them outside 'risk_management' at the root level of JSON
    const globalTrailX = risk.trailMoveX ?? risk.trail_x ?? risk.trailX ?? data.trailMoveX ?? data.trailX ?? data.trail_x ?? 0;
    const globalTrailY = risk.trailPointY ?? risk.trailMoveY ?? risk.trail_y ?? risk.trailY ?? data.trailMoveY ?? data.trailPointY ?? data.trailY ?? data.trail_y ?? 0;

    // Directly assign the calculated finalTicker & variables
    setTicker(finalTicker);
    setTimeframe(inst.timeframe || '15m'); 
    setUnderlyingFrom(inst.underlyingFrom || inst.segment || 'Options');
    setQty(inst.qty || 150); 
    setTransactionType(inst.transactionType || 'BUY');
    setStrategyType(entry.strategyType || 'Intraday');
    setEntryTime(entry.entryTime || '09:15');
    setExitTime(entry.exitTime || '15:15');
    setFromDate(dates.fromDate || '');
    setToDate(dates.toDate || '');
    
    // Set robust global trail values
    setTrailMoveX(globalTrailX);
    setTrailPointY(globalTrailY);

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
    
    // 🚨 UPDATED: Map legs with priority finalTicker and handle all strike fields seamlessly
    if (data.legs && Array.isArray(data.legs)) {
      const mappedLegs = data.legs.map((leg, idx) => {
        
        // 🧠 SMART UNIT DETECTOR: Extracts % or Pts even if AI sends "40 points" or "100%" as string
        let rawSlVal = leg.stopLoss ?? leg.stop_loss ?? '';
        let extractedSlUnit = leg.slUnit || leg.sl_unit || leg.stopLossUnit || leg.stop_loss_unit || '%';
        
        if (typeof rawSlVal === 'string') {
            if (rawSlVal.toLowerCase().includes('pt') || rawSlVal.toLowerCase().includes('point')) extractedSlUnit = 'Pts';
            else if (rawSlVal.includes('%')) extractedSlUnit = '%';
            rawSlVal = parseFloat(rawSlVal) || '';
        }

        let rawTargetVal = leg.target ?? '';
        let extractedTargetUnit = leg.targetUnit || leg.target_unit || '%';
        
        if (typeof rawTargetVal === 'string') {
            if (rawTargetVal.toLowerCase().includes('pt') || rawTargetVal.toLowerCase().includes('point')) extractedTargetUnit = 'Pts';
            else if (rawTargetVal.includes('%')) extractedTargetUnit = '%';
            rawTargetVal = parseFloat(rawTargetVal) || '';
        }
        
        // 🚀 SUPERCHARGED TRAIL SL SMART DETECTOR 🚀
        // Safely fallback if trail_sl is null in AI JSON (e.g., trail_sl: null)
        const trailSlObj = leg.trail_sl || {};
        
        // Catch every possible AI key variation for X (Trail Move) including global fallbacks
        let rawTrailX = leg.trailX ?? leg.trailMoveX ?? trailSlObj.x ?? trailSlObj.trailMoveX ?? leg.trail_x ?? leg.trailMove ?? leg.trail_move ?? leg.move ?? leg.trail_points ?? globalTrailX ?? '';
        
        let extractedTrailUnitX = leg.trailUnitX ?? leg.trail_unit_x ?? leg.trailUnit ?? 'Pts';
        if (typeof rawTrailX === 'string') {
            if (rawTrailX.includes('%')) extractedTrailUnitX = '%';
            else if (rawTrailX.toLowerCase().includes('pt') || rawTrailX.toLowerCase().includes('point')) extractedTrailUnitX = 'Pts';
            rawTrailX = parseFloat(rawTrailX) || 0;
        }

        // Catch every possible AI key variation for Y (SL Move) including global fallbacks
        let rawTrailY = leg.trailY ?? leg.trailMoveY ?? leg.trailPointY ?? trailSlObj.y ?? trailSlObj.trailMoveY ?? trailSlObj.trailPointY ?? leg.trail_y ?? leg.stopLossMove ?? leg.stop_loss_move ?? leg.slMove ?? leg.sl_move ?? globalTrailY ?? '';
        
        let extractedTrailUnitY = leg.trailUnitY ?? leg.trail_unit_y ?? leg.trailUnit ?? 'Pts';
        if (typeof rawTrailY === 'string') {
            if (rawTrailY.includes('%')) extractedTrailUnitY = '%';
            else if (rawTrailY.toLowerCase().includes('pt') || rawTrailY.toLowerCase().includes('point')) extractedTrailUnitY = 'Pts';
            rawTrailY = parseFloat(rawTrailY) || 0;
        }
        // ------------------------------------------------------------------------

        console.log("🤖 AI JSON LEG DATA:", leg); // 👀 Useful for debugging if AI invents new keys

        return {
          id: leg.id || Date.now() + idx,
          ticker: finalTicker || leg.ticker || leg.asset || '', 
          timeframe: leg.timeframe || inst.timeframe || '5m',
          entryTime: leg.entryTime || leg.entry_time || entry.entryTime || '', 
          exitTime: leg.exitTime || leg.exit_time || entry.exitTime || '',
          segment: leg.segment || 'Options',
          position: leg.position || 'Buy',
          lots: leg.lots || 1,
          optionType: leg.optionType || leg.option_type || 'CE', 
          expiry: leg.expiry || 'Weekly',

          strikeCriteria: leg.strikeCriteria || leg.strike_criteria || 'Strike Type',
          targetPremium: leg.targetPremium || leg.target_premium || leg.premium || '',
          lowerPremium: leg.lowerPremium || leg.lower_premium || '',
          upperPremium: leg.upperPremium || leg.upper_premium || '',

          strikeType: leg.strikeType || leg.strike_type || 'ATM',
          strikeDistance: leg.strikeDistance || leg.strike_distance || 0,
          
          // 🎯 UPDATED STOP LOSS & TARGET WITH SMART DETECTOR
          stopLoss: rawSlVal, 
          target: rawTargetVal,
          slUnit: extractedSlUnit,
          targetUnit: extractedTargetUnit,
          
          // 🚀 UPDATED TRAIL X & Y VALUES
          trailX: rawTrailX,
          trailY: rawTrailY,
          trailUnitX: extractedTrailUnitX,
          trailUnitY: extractedTrailUnitY,
          
          slReentry: leg.sl_reentry || leg.slReentry || 0,
          targetReexecute: leg.target_reexecute || leg.targetReexecute || 0,
          waitAndTrade: leg.wait_and_trade || leg.waitAndTrade || false,
          costToCost: leg.cost_to_cost || leg.costToCost || false,
          moveToStoploss: leg.move_to_stoploss || leg.moveToStoploss || false
        };
      });
      setLegs(mappedLegs);
    } else {
      setLegs([]);
    }
        setIsConfirmed(true); 
  };

  const addLeg = () => { 
    setLegs([...legs, { 
      id: Date.now(), 
      ticker: ticker, timeframe: timeframe, entryTime: '', exitTime: '', 
      segment: 'Options', position: 'Buy', lots: 1, optionType: 'CE', expiry: 'Weekly', strikeType: 'ATM', 
      strikeDistance: 0, stopLoss: '', target: '', slUnit: '%', targetUnit: '%', 
      trailX: 0, trailY: 0, trailUnitX: 'Pts', trailUnitY: 'Pts', // 🚀 Added missing trailUnits for manual additions
      slReentry: 0, targetReexecute: 0, waitAndTrade: false, costToCost: false, moveToStoploss: false 
    }]); 
    setIsConfirmed(false); 
  };
  const updateLeg = (id, field, value) => { setLegs(legs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); setIsConfirmed(false); };
  const removeLeg = (id) => { setLegs(legs.filter(leg => leg.id !== id)); setIsConfirmed(false); };

  const addIndicator = () => { setIndicators([...indicators, { id: Date.now(), name: 'RSI', settings: 'Period: 14' }]); setIsConfirmed(false); };
  const updateIndicator = (id, field, value) => { setIndicators(indicators.map(ind => ind.id === id ? { ...ind, [field]: value } : ind)); setIsConfirmed(false); };
  const removeIndicator = (id) => { setIndicators(indicators.filter(ind => ind.id !== id)); setIsConfirmed(false); };

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

  const openStrategiesModal = async (tabName = 'my_strategies') => {
    if (!user) return;
    setModalTab(tabName); 
    setIsLoadingStrategies(true);
    setShowStrategiesModal(true);
    const strats = await getUserStrategies(user.uid);
    setSavedStrategies(strats);
    setIsLoadingStrategies(false);
  };

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
    setLegs(data.legs || []); 

    setIsConfirmed(true); 
    setShowStrategiesModal(false); 
    alert(`🚀 Strategy "${strat.name}" loaded successfully!`);
  };

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

  const runBacktest = async () => {
    if (!isConfirmed) return; 

    if (!isSubscribed && userCredits <= 0) {
      alert("⚠️ Insufficient Credits & No Active Subscription! Please recharge your account.");
      setError('Insufficient Credits. Please upgrade your account.');
      setShowPricingModal(true);
      return;
    }

    setLoading(true); setError(''); setResult(null);

    if (!isSubscribed) {
      const deductionSuccess = await deductUserCredit(user?.uid);
      if (deductionSuccess) {
        setUserCredits(prev => prev - 1); 
      } else {
        setError('Failed to process credits. Please check your connection and try again.');
        setLoading(false);
        return;
      }
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
        ticker: leg.ticker || ticker, timeframe: leg.timeframe, entry_time: leg.entryTime, exit_time: leg.exitTime,
        segment: leg.segment, position: leg.position, lots: leg.lots, option_type: leg.optionType, expiry: leg.expiry, 
        strike_type: leg.strikeType, strike_distance: parseInt(leg.strikeDistance) || 0,
        target: leg.target || 0, target_unit: leg.targetUnit || '%', stop_loss: leg.stopLoss || 0, sl_unit: leg.slUnit || '%',
        trail_sl: { x: leg.trailX || 0, y: leg.trailY || 0, unit_x: leg.trailUnitX || 'Pts', unit_y: leg.trailUnitY || 'Pts' }, 
        sl_reentry: leg.slReentry || 0, target_reexecute: leg.targetReexecute || 0, 
        wait_and_trade: leg.wait_and_trade || false, cost_to_cost: leg.costToCost || false, move_to_stoploss: leg.moveToStoploss || false
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

  // 🚨 LATEST UPDATE: Render AuthView when user is not logged in 🚨
  if (!user) {
    return <AuthView onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30 relative">
      
      {/* 🚨 Modals 🚨 */}
      <MyStrategiesModal 
        isOpen={showStrategiesModal} 
        onClose={() => setShowStrategiesModal(false)}
        isLoading={isLoadingStrategies}
        strategies={savedStrategies}
        onLoad={loadStrategy}
        onDelete={handleDeleteStrategy}
        initialTab={modalTab} 
      />

      <PricingModal 
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      {/* 🚨 NEW: User Profile Modal Rendered Here 🚨 */}
      {showProfileModal && (
        <UserProfile onClose={() => setShowProfileModal(false)} />
      )}

      {/* 🌟 REDESIGNED TOP NAVIGATION BAR (Based on Screenshot) 🌟 */}
      <div className="flex justify-between items-center px-4 py-3 md:px-6 bg-[#020205] border-b border-[#16162a] shadow-[0_4px_30px_rgba(0,0,0,0.4)] sticky top-0 z-50">
        
        {/* LEFT: App Logo & Name */}
        <div className="flex items-center gap-3">
          <img src="/image/logo.png" alt="AlgoSay Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-wide">
              <span className="text-white">Algo</span><span className="text-blue-500">Say</span>
            </span>
            <span className="text-[9px] md:text-[10px] text-cyan-400 font-bold tracking-[0.2em]">PRO QUANT EDGE</span>
          </div>
        </div>

        {/* RIGHT: Action Buttons (Original text maintained from codebase) */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Pill-shaped container for secondary actions (Desktop) */}
          <div className="hidden lg:flex items-center bg-[#070710] border border-[#1e1e30] rounded-full px-2 py-1 shadow-inner">
            <button 
              onClick={() => openStrategiesModal('my_strategies')}
              className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 border-r border-[#1e1e30]"
            >
              <span className="text-yellow-500">📂</span> My Strategies
            </button>
            
            <button 
              onClick={() => openStrategiesModal('default_strategies')}
              className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 border-r border-[#1e1e30]"
            >
              <span className="text-orange-400">📜</span> Default Templates
            </button>

            <button 
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-purple-500">👤</span> {user.email || user.displayName}
            </button>
          </div>

          {/* Credits / Pro Badge Button */}
          <button 
            onClick={() => setShowPricingModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141000] hover:bg-[#201a00] border border-yellow-600/40 rounded-full shadow-inner transition-all cursor-pointer"
          >
            <span className="text-yellow-500 text-sm">✨</span>
            <span className="text-xs font-bold text-yellow-500 tracking-wide">
              {isSubscribed ? `PRO: ${subscriptionPlan.toUpperCase()}` : `${userCredits} CREDITS`}
            </span>
          </button>

          {/* Logout Button (Neon Red Theme) */}
          <button 
            onClick={() => signOut(auth)}
            className="px-4 py-1.5 bg-transparent border border-[#e11d48] text-[#f43f5e] hover:bg-[#e11d48]/10 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] text-xs md:text-sm font-bold rounded-lg transition-all"
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
                ) : !isConfirmed ? 'Lock Parameters to Execute' : (isSubscribed ? `Run Backtest (Free - ${subscriptionPlan})` : 'Run Backtest (Cost: 1 Credit)')}
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