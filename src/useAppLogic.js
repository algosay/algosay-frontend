import { useState, useEffect } from 'react';
import { auth, db, getUserCredits, deductUserCredit, saveUserStrategy, getUserStrategies, deleteUserStrategy } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 

export const useAppLogic = () => {
  // --- Auth & Credits State ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userCredits, setUserCredits] = useState(0); 

  // 🚨 NEW: User Profile Data State (To store Name, Mobile, etc. from DB) 🚨
  const [userProfileData, setUserProfileData] = useState(null);

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
  const [isDynamic, setIsDynamic] = useState(false); // 🚨 NEW STATE: To track if it's a Condition-based Loop 🚨
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
        // 🚨 UPDATED: Fetching credits, name, mobile, and subscription status directly from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserCredits(userData.credits || 0);
          setUserProfileData(userData); // <-- Capturing Full DB Profile (Name, Mobile)
          
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
          setUserProfileData(null);
        }
      } else {
        setUserProfileData(null); // Clear data on logout
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

    // 🚨 THE FIX: Identify Condition-based / Dynamic Logic
    const isDynamicFlag = data.is_dynamic || entry.is_dynamic || (entry.strategyType && String(entry.strategyType).toLowerCase() === 'dynamic') || (entry.entryTime && String(entry.entryTime).toLowerCase() === 'dynamic') || !!data.strategy_function || false;
    setIsDynamic(isDynamicFlag);

    // Priority: Extracted Ticker from Prompt > AI Response Ticker > Empty
    const finalTicker = extractedTicker || inst.ticker || '';

    // 🎯 ROBUST GLOBAL TRAIL EXTRACTION 🎯
    const globalTrailX = risk.trailMoveX ?? risk.trail_x ?? risk.trailX ?? data.trailMoveX ?? data.trailX ?? data.trail_x ?? 0;
    const globalTrailY = risk.trailPointY ?? risk.trailMoveY ?? risk.trail_y ?? risk.trailY ?? data.trailMoveY ?? data.trailPointY ?? data.trailY ?? data.trail_y ?? 0;

    // Directly assign the calculated finalTicker & variables
    setTicker(finalTicker);
    setTimeframe(inst.timeframe || '15m'); 
    setUnderlyingFrom(inst.underlyingFrom || inst.segment || 'Options');
    setQty(inst.qty || 150); 
    setTransactionType(inst.transactionType || 'BUY');
    setStrategyType(entry.strategyType || (isDynamicFlag ? 'Dynamic' : 'Intraday'));
    
    // 🚨 THE FIX: Avoid defaulting to 09:15 if it's a dynamic condition!
    const resolvedEntryTime = entry.entryTime || (isDynamicFlag ? 'Dynamic' : '09:15');
    setEntryTime(resolvedEntryTime);
    setExitTime(entry.exitTime || (isDynamicFlag ? 'Positional' : '15:15'));

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
        
        const trailSlObj = leg.trail_sl || {};
        
        let rawTrailX = leg.trailX ?? leg.trailMoveX ?? trailSlObj.x ?? trailSlObj.trailMoveX ?? leg.trail_x ?? leg.trailMove ?? leg.trail_move ?? leg.move ?? leg.trail_points ?? globalTrailX ?? '';
        let extractedTrailUnitX = leg.trailUnitX ?? leg.trail_unit_x ?? leg.trailUnit ?? 'Pts';
        if (typeof rawTrailX === 'string') {
            if (rawTrailX.includes('%')) extractedTrailUnitX = '%';
            else if (rawTrailX.toLowerCase().includes('pt') || rawTrailX.toLowerCase().includes('point')) extractedTrailUnitX = 'Pts';
            rawTrailX = parseFloat(rawTrailX) || 0;
        }

        let rawTrailY = leg.trailY ?? leg.trailMoveY ?? leg.trailPointY ?? trailSlObj.y ?? trailSlObj.trailMoveY ?? trailSlObj.trailPointY ?? leg.trail_y ?? leg.stopLossMove ?? leg.stop_loss_move ?? leg.slMove ?? leg.sl_move ?? globalTrailY ?? '';
        let extractedTrailUnitY = leg.trailUnitY ?? leg.trail_unit_y ?? leg.trailUnit ?? 'Pts';
        if (typeof rawTrailY === 'string') {
            if (rawTrailY.includes('%')) extractedTrailUnitY = '%';
            else if (rawTrailY.toLowerCase().includes('pt') || rawTrailY.toLowerCase().includes('point')) extractedTrailUnitY = 'Pts';
            rawTrailY = parseFloat(rawTrailY) || 0;
        }

        console.log("🤖 AI JSON LEG DATA:", leg); 

        return {
          id: leg.id || Date.now() + idx,
          ticker: finalTicker || leg.ticker || leg.asset || '', 
          timeframe: leg.timeframe || inst.timeframe || '5m',
          entryTime: leg.entryTime || leg.entry_time || resolvedEntryTime || '', // 🚨 Passed resolved time directly
          exitTime: leg.exitTime || leg.exit_time || entry.exitTime || (isDynamicFlag ? 'Positional' : '15:15'),
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
          stopLoss: rawSlVal, 
          target: rawTargetVal,
          slUnit: extractedSlUnit,
          targetUnit: extractedTargetUnit,
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
      id: Date.now(), ticker: ticker, timeframe: timeframe, entryTime: '', exitTime: '', 
      segment: 'Options', position: 'Buy', lots: 1, optionType: 'CE', expiry: 'Weekly', strikeType: 'ATM', 
      strikeDistance: 0, stopLoss: '', target: '', slUnit: '%', targetUnit: '%', 
      trailX: 0, trailY: 0, trailUnitX: 'Pts', trailUnitY: 'Pts', 
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
      strategyType, isDynamic, entryTime, exitTime, fromDate, toDate,
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
    setIsDynamic(data.isDynamic || false); // 🚨 NEW
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

    // 🚨 Evaluate exact flag to send to backend for loop logic
    const conditionBasedLoop = isDynamic || String(entryTime).toLowerCase() === 'dynamic' || String(strategyType).toLowerCase() === 'dynamic';

    // 🚨 NEW PAYLOAD BRIDGE: Map Frontend states strictly to Backend Pydantic Keys
    const formattedLegs = legs.map(leg => ({
        id: leg.id, 
        ticker: leg.ticker || ticker, 
        timeframe: leg.timeframe, 
        entry_time: String(leg.entryTime).toLowerCase() === 'dynamic' ? 'dynamic' : leg.entryTime,
        exit_time: leg.exitTime,
        segment: leg.segment, 
        
        // --- 🎯 KEY FIXES FOR PYDANTIC HERE ---
        position: leg.position || leg.action || "Buy",
        option_type: leg.option_type || leg.optionType || "CE", 
        strike_type: leg.strike_type || leg.strikeType || "ATM", 
        // --------------------------------------
        
        lots: leg.lots, 
        expiry: leg.expiry, 
        strike_distance: parseInt(leg.strikeDistance) || 0,
        target: leg.target || 0, 
        target_unit: leg.target_unit || leg.targetUnit || '%', 
        stop_loss: leg.stopLoss || 0, 
        sl_unit: leg.sl_unit || leg.slUnit || '%',
        trail_sl: { x: leg.trailX || 0, y: leg.trailY || 0, unit_x: leg.trailUnitX || 'Pts', unit_y: leg.trailUnitY || 'Pts' }, 
        sl_reentry: leg.slReentry || 0, 
        target_reexecute: leg.targetReexecute || 0, 
        wait_and_trade: leg.waitAndTrade || false, 
        cost_to_cost: leg.costToCost || false, 
        move_to_stoploss: leg.moveToStoploss || false
    }));

    const payload = {
      user_id: user?.uid || "guest_123", 
      strategy_text: aiPrompt, 
      is_dynamic: conditionBasedLoop, 
      instrument_settings: { ticker, timeframe, underlyingFrom, qty, transactionType },
      date_settings: { fromDate, toDate },
      entry_settings: { strategyType, entryTime, exitTime },
      risk_management: { trailMoveX, trailPointY }, 
      indicators: indicators.map(i => ({ name: i.name, settings: i.settings })), 
      
      legs: formattedLegs // 👈 Passing the bridged formatted leg data
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

  return {
    user, setUser, loadingAuth, userCredits, isSubscribed, subscriptionPlan,
    userProfileData, setUserProfileData,
    showStrategiesModal, setShowStrategiesModal, savedStrategies, isLoadingStrategies, modalTab, setModalTab,
    showPricingModal, setShowPricingModal, showProfileModal, setShowProfileModal,
    aiPrompt, setAiPrompt, isParsing, setIsParsing, aiMessage, setAiMessage,
    aiExplanation, setAiExplanation, isConfirmed, setIsConfirmed, needsInfoQuestion, setNeedsInfoQuestion,
    ticker, setTicker, timeframe, setTimeframe, underlyingFrom, setUnderlyingFrom,
    qty, setQty, transactionType, setTransactionType, strategyType, setStrategyType,
    isDynamic, setIsDynamic, 
    entryTime, setEntryTime, exitTime, setExitTime, fromDate, setFromDate, toDate, setToDate,
    trailMoveX, setTrailMoveX, trailPointY, setTrailPointY, indicators, legs,
    loading, result, error, withTax, setWithTax,
    handleParsedDataSuccess, addLeg, updateLeg, removeLeg, addIndicator, updateIndicator, removeIndicator,
    handleSaveStrategy, openStrategiesModal, loadStrategy, handleDeleteStrategy, runBacktest
  };
};