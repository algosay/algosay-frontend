import { useState, useEffect } from 'react';
import { auth, db, getUserCredits, deductUserCredit, saveUserStrategy, getUserStrategies, deleteUserStrategy } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 

// 🎯 INDEX STEP SIZE LOOKUP FOR DYNAMIC DISTANCE CALCULATION
const INDEX_STEP_SIZES = {
  "NIFTY 50": 50,
  "NIFTY": 50,
  "BANKNIFTY": 100,
  "FINNIFTY": 50,
  "MIDCPNIFTY": 25,
  "SENSEX": 100,
  "BANKEX": 100
};

export const useAppLogic = () => {
  // --- Auth & Credits State ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userCredits, setUserCredits] = useState(0); 

  // 🚨 User Profile Data State (To store Name, Mobile, etc. from DB) 🚨
  const [userProfileData, setUserProfileData] = useState(null);

  // 🚨 Subscription States 🚨
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');

  // 🚨 Save & Load Strategy States 🚨
  const [showStrategiesModal, setShowStrategiesModal] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [modalTab, setModalTab] = useState('my_strategies'); 

  // 🚨 Pricing Modal State 🚨
  const [showPricingModal, setShowPricingModal] = useState(false);

  // 🚨 User Profile Modal State 🚨
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ⚡ Fyers & Data Source States ⚡
  const [dataSource, setDataSource] = useState('s3'); // default to S3
  const [isFyersConnected, setIsFyersConnected] = useState(false);
  const [fyersToken, setFyersToken] = useState(null);

  // --- AI Input & Workflow State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExplanation, setAiExplanation] = useState(''); 
  const [isConfirmed, setIsConfirmed] = useState(false);   
  const [needsInfoQuestion, setNeedsInfoQuestion] = useState(''); 

  // --- Global Strategy State (Initial defaults kept simple for manual entry, but overridden by AI) ---
  const [ticker, setTicker] = useState(''); 
  const [timeframe, setTimeframe] = useState(''); 
  const [underlyingFrom, setUnderlyingFrom] = useState('');
  const [qty, setQty] = useState(''); 
  const [transactionType, setTransactionType] = useState('');
  const [strategyType, setStrategyType] = useState('');
  const [isDynamic, setIsDynamic] = useState(false); 
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [trailMoveX, setTrailMoveX] = useState('');
  const [trailPointY, setTrailPointY] = useState('');

  const [indicators, setIndicators] = useState([]);
  const [legs, setLegs] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [withTax, setWithTax] = useState(false);

  // ⚡ Fyers Login & Token Extraction Effect ⚡
  useEffect(() => {
    const storedToken = localStorage.getItem('fyers_access_token');
    if (storedToken) {
      setIsFyersConnected(true);
      setFyersToken(storedToken);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('fyers_token');
    
    if (tokenFromUrl) {
      localStorage.setItem('fyers_access_token', tokenFromUrl);
      setIsFyersConnected(true);
      setFyersToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ⚡ Trigger Fyers Auth Flow ⚡
  const handleFyersLogin = () => {
    window.location.href = "https://algosay-backend.onrender.com/fyers-login";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserCredits(userData.credits || 0);
          setUserProfileData(userData); 
          
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
          const credits = await getUserCredits(currentUser.uid);
          setUserCredits(credits);
          setUserProfileData(null);
        }
      } else {
        setUserProfileData(null); 
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 🚨 100% PURE DYNAMIC PARSING FUNCTION (NO HARDCODED DEFAULTS) 🚨
  const handleParsedDataSuccess = (data) => {
    let extractedTicker = '';
    const promptText = (aiPrompt || '').toUpperCase();
    
    if (promptText.includes('MIDCPNIFTY') || promptText.includes('MIDCAP')) extractedTicker = 'MIDCPNIFTY';
    else if (promptText.includes('FINNIFTY') || promptText.includes('FIN NIFTY')) extractedTicker = 'FINNIFTY';
    else if (promptText.includes('BANKNIFTY') || promptText.includes('BANK NIFTY')) extractedTicker = 'BANKNIFTY';
    else if (promptText.includes('BANKEX')) extractedTicker = 'BANKEX';
    else if (promptText.includes('SENSEX')) extractedTicker = 'SENSEX';
    else if (promptText.includes('NIFTY')) extractedTicker = 'NIFTY';

    const inst = data.instrument_settings || {};
    const entry = data.entry_settings || {};
    const risk = data.risk_management || {};
    const dates = data.date_settings || {}; 

    const isDynamicFlag = data.is_dynamic || entry.is_dynamic || (entry.strategyType && String(entry.strategyType).toLowerCase() === 'dynamic') || (entry.entryTime && String(entry.entryTime).toLowerCase() === 'dynamic') || !!data.strategy_function || false;
    setIsDynamic(isDynamicFlag);

    const finalTicker = extractedTicker || inst.ticker || '';

    const globalTrailX = risk.trailMoveX ?? risk.trail_x ?? risk.trailX ?? data.trailMoveX ?? data.trailX ?? data.trail_x ?? '';
    const globalTrailY = risk.trailPointY ?? risk.trailMoveY ?? risk.trail_y ?? risk.trailY ?? data.trailMoveY ?? data.trailPointY ?? data.trailY ?? data.trail_y ?? '';

    // 🎯 NO DEFAULTS HERE - STRICTLY TAKING WHAT AI PROVIDES 🎯
    setTicker(finalTicker);
    setTimeframe(inst.timeframe || ''); 
    setUnderlyingFrom(inst.underlyingFrom || inst.segment || '');
    setQty(inst.qty !== undefined ? inst.qty : ''); 
    setTransactionType(inst.transactionType || '');
    setStrategyType(entry.strategyType || '');
    setEntryTime(entry.entryTime || '');
    setExitTime(entry.exitTime || '');

    setFromDate(dates.fromDate || '');
    setToDate(dates.toDate || '');
    
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
        return { id: Date.now() + idx, name: ind.name || ind.indicator || 'Unknown', settings: parsedSettings || '' };
      });
      setIndicators(mappedIndicators);
    } else {
      setIndicators([]);
    }
    
    if (data.legs && Array.isArray(data.legs)) {
      const mappedLegs = data.legs.map((leg, idx) => {
        
        let rawSlVal = leg.stopLoss ?? leg.stop_loss ?? '';
        let extractedSlUnit = leg.slUnit || leg.sl_unit || leg.stopLossUnit || leg.stop_loss_unit || '';
        
        if (typeof rawSlVal === 'string') {
            if (rawSlVal.toLowerCase().includes('pt') || rawSlVal.toLowerCase().includes('point')) extractedSlUnit = 'Pts';
            else if (rawSlVal.includes('%')) extractedSlUnit = '%';
            rawSlVal = parseFloat(rawSlVal) || '';
        }

        let rawTargetVal = leg.target ?? '';
        let extractedTargetUnit = leg.targetUnit || leg.target_unit || '';
        
        if (typeof rawTargetVal === 'string') {
            if (rawTargetVal.toLowerCase().includes('pt') || rawTargetVal.toLowerCase().includes('point')) extractedTargetUnit = 'Pts';
            else if (rawTargetVal.includes('%')) extractedTargetUnit = '%';
            rawTargetVal = parseFloat(rawTargetVal) || '';
        }
        
        const trailSlObj = leg.trail_sl || {};
        
        let rawTrailX = leg.trailX ?? leg.trailMoveX ?? trailSlObj.x ?? trailSlObj.trailMoveX ?? leg.trail_x ?? leg.trailMove ?? leg.trail_move ?? leg.move ?? leg.trail_points ?? globalTrailX ?? '';
        let extractedTrailUnitX = leg.trailUnitX ?? leg.trail_unit_x ?? leg.trailUnit ?? '';
        if (typeof rawTrailX === 'string') {
            if (rawTrailX.includes('%')) extractedTrailUnitX = '%';
            else if (rawTrailX.toLowerCase().includes('pt') || rawTrailX.toLowerCase().includes('point')) extractedTrailUnitX = 'Pts';
            rawTrailX = parseFloat(rawTrailX) || '';
        }

        let rawTrailY = leg.trailY ?? leg.trailMoveY ?? leg.trailPointY ?? trailSlObj.y ?? trailSlObj.trailMoveY ?? trailSlObj.trailPointY ?? leg.trail_y ?? leg.stopLossMove ?? leg.stop_loss_move ?? leg.slMove ?? leg.sl_move ?? globalTrailY ?? '';
        let extractedTrailUnitY = leg.trailUnitY ?? leg.trail_unit_y ?? leg.trailUnit ?? '';
        if (typeof rawTrailY === 'string') {
            if (rawTrailY.includes('%')) extractedTrailUnitY = '%';
            else if (rawTrailY.toLowerCase().includes('pt') || rawTrailY.toLowerCase().includes('point')) extractedTrailUnitY = 'Pts';
            rawTrailY = parseFloat(rawTrailY) || '';
        }

        let strictPosition = (leg.position || leg.action || '').toString().toUpperCase();

        let resolvedExpiryType = leg.expiryType || leg.expiry_type || leg.expiry || '';
        if (resolvedExpiryType) {
            const expStr = resolvedExpiryType.toString().toUpperCase();
            if (expStr.includes('NEXT') || expStr.includes('MONTH') || expStr.includes('FAR')) {
              resolvedExpiryType = 'NEXT_WEEK';
            } else if (expStr.includes('CURRENT')) {
              resolvedExpiryType = 'CURRENT_WEEK';
            }
        }

        const resolvedSegment = leg.segment || inst.underlyingFrom || inst.segment || '';
        const isOptions = resolvedSegment.toUpperCase() === 'OPTIONS';

        const currentAsset = finalTicker || leg.ticker || leg.asset || 'NIFTY';
        const stepSize = INDEX_STEP_SIZES[currentAsset] || 50;

        let resolvedDistance = leg.distance !== undefined ? leg.distance : (leg.strikeDistance !== undefined ? leg.strikeDistance : (leg.strike_distance !== undefined ? leg.strike_distance : '')); 
        
        if ((leg.strike_offset || leg.strikeOffset) && (resolvedDistance === '' || resolvedDistance === null)) {
          resolvedDistance = Math.max(1, Math.round(Math.abs(leg.strike_offset || leg.strikeOffset) / stepSize));
        } else if (resolvedDistance !== '' && resolvedDistance > 30) {
          resolvedDistance = Math.max(1, Math.round(resolvedDistance / stepSize));
        }

        return {
          id: leg.id || Date.now() + idx,
          ticker: finalTicker || leg.ticker || leg.asset || '', 
          timeframe: leg.timeframe || inst.timeframe || '',
          entryTime: leg.entryTime || leg.entry_time || entry.entryTime || '', 
          exitTime: leg.exitTime || leg.exit_time || entry.exitTime || '',
          
          segment: resolvedSegment,
          position: strictPosition,
          lots: leg.lots !== undefined ? parseInt(leg.lots, 10) : '',
          
          optionType: isOptions ? (leg.optionType || leg.option_type || '') : '', 
          expiry: isOptions ? resolvedExpiryType : '', 
          expiryType: isOptions ? resolvedExpiryType : '',
          strikeCriteria: isOptions ? (leg.strikeCriteria || leg.strike_criteria || '') : '',
          targetPremium: isOptions ? (leg.targetPremium || leg.target_premium || leg.premium || '') : '',
          lowerPremium: isOptions ? (leg.lowerPremium || leg.lower_premium || '') : '',
          upperPremium: isOptions ? (leg.upperPremium || leg.upper_premium || '') : '',
          
          strikeType: isOptions ? (leg.strikeType || leg.strike_type || '') : '',
          strikeDistance: isOptions ? resolvedDistance : '',
          strike_offset: 0, 

          stopLoss: rawSlVal, 
          target: rawTargetVal,
          slUnit: extractedSlUnit,
          targetUnit: extractedTargetUnit,
          trailX: rawTrailX,
          trailY: rawTrailY,
          trailUnitX: extractedTrailUnitX,
          trailUnitY: extractedTrailUnitY,
          slReentry: leg.sl_reentry || leg.slReentry || '',
          targetReexecute: leg.target_reexecute || leg.targetReexecute || '',
          waitForCandleClose: leg.wait_for_candle_close || leg.waitForCandleClose || false, 
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
      segment: 'Options', position: 'BUY', 
      lots: 1, optionType: 'CE', expiry: 'CURRENT_WEEK', expiryType: 'CURRENT_WEEK', strikeType: 'ATM', 
      strikeDistance: 0, strike_offset: 0, 
      stopLoss: '', target: '', slUnit: '%', targetUnit: '%', 
      trailX: 0, trailY: 0, trailUnitX: 'Pts', trailUnitY: 'Pts', 
      slReentry: 0, targetReexecute: 0, waitForCandleClose: false, waitAndTrade: false, costToCost: false, moveToStoploss: false 
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
    setTimeframe(data.timeframe || '');
    setUnderlyingFrom(data.underlyingFrom || '');
    setQty(data.qty || '');
    setTransactionType(data.transactionType || '');
    setStrategyType(data.strategyType || '');
    setIsDynamic(data.isDynamic || false); 
    setEntryTime(data.entryTime || '');
    setExitTime(data.exitTime || '');
    setFromDate(data.fromDate || '');
    setToDate(data.toDate || '');
    setTrailMoveX(data.trailMoveX || '');
    setTrailPointY(data.trailPointY || '');
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

    if (dataSource === 'fyers' && !isFyersConnected) {
      alert("⚠️ Fyers is not connected! Please click the 'Fyers Login' button at the top to connect your account before running live data backtests.");
      return;
    }

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

    const conditionBasedLoop = isDynamic || String(entryTime).toLowerCase() === 'dynamic' || String(strategyType).toLowerCase() === 'dynamic';

    const formattedLegs = legs.map(leg => ({
        id: leg.id, 
        ticker: leg.ticker || ticker, 
        timeframe: leg.timeframe || timeframe, 
        entry_time: String(leg.entryTime).toLowerCase() === 'dynamic' ? 'dynamic' : leg.entryTime,
        exit_time: leg.exitTime,
        segment: leg.segment, 
        position: leg.position ? leg.position.toString().toUpperCase() : '', 
        option_type: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (leg.option_type || leg.optionType || "").toString().toUpperCase() : '', 
        strike_type: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (leg.strike_type || leg.strikeType || "").toString().toUpperCase() : '', 
        expiry: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (leg.expiry || leg.expiryType || '') : '', 
        expiry_type: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (leg.expiryType || leg.expiry || '') : '', 
        
        lots: parseInt(leg.lots, 10) || 1, 
        strike_distance: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (parseInt(leg.strikeDistance || leg.strike_offset) || 0) : 0,
        strike_offset: leg.segment && leg.segment.toUpperCase() === 'OPTIONS' ? (parseInt(leg.strike_offset || leg.strikeDistance || leg.strikeOffset) || 0) : 0,
        
        target: leg.target || 0, 
        target_unit: leg.target_unit || leg.targetUnit || '%', 
        stop_loss: leg.stopLoss || 0, 
        sl_unit: leg.sl_unit || leg.slUnit || '%',
        trail_sl: { x: leg.trailX || 0, y: leg.trailY || 0, unit_x: leg.trailUnitX || 'Pts', unit_y: leg.trailUnitY || 'Pts' }, 
        sl_reentry: leg.slReentry || 0, 
        target_reexecute: leg.targetReexecute || 0, 
        wait_for_candle_close: leg.waitForCandleClose || false, 
        wait_and_trade: leg.waitAndTrade || false, 
        cost_to_cost: leg.costToCost || false, 
        move_to_stoploss: leg.moveToStoploss || false
    }));

    const payload = {
      user_id: user?.uid || "guest_123", 
      data_source: dataSource,            
      fyers_access_token: fyersToken,     
      strategy_text: aiPrompt, 
      is_dynamic: conditionBasedLoop, 
      timeframe: timeframe, 
      instrument_settings: { ticker, timeframe, underlyingFrom, qty, transactionType },
      date_settings: { fromDate, toDate },
      entry_settings: { strategyType, timeframe, entryTime, exitTime },
      risk_management: { trailMoveX, trailPointY }, 
      indicators: indicators.map(i => ({ name: i.name, settings: i.settings })), 
      legs: formattedLegs 
    };

    try {
      const response = await fetch("https://algosay-backend.onrender.com/run_strategy", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("❌ Non-JSON Response from Backend:", responseText);
        throw new Error(`Server returned invalid response (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Backtest execution encountered an error.');
      }

      setResult(data.results || data); 
    } catch (err) {
      console.error("🚨 Backtest Catch Error:", err);
      setError(`Execution Error: ${err.message || 'Failed to retrieve backtest results from the engine.'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    user, setUser, loadingAuth, userCredits, isSubscribed, subscriptionPlan,
    userProfileData, setUserProfileData,
    showStrategiesModal, setShowStrategiesModal, savedStrategies, isLoadingStrategies, modalTab, setModalTab,
    showPricingModal, setShowPricingModal, showProfileModal, setShowProfileModal,
    
    dataSource, setDataSource, isFyersConnected, setIsFyersConnected, handleFyersLogin,

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