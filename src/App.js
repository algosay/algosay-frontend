import React, { useState } from 'react';
import Header from './components/Header';
import AIParseSection from './components/AIParseSection';
import StrategyConfig from './components/StrategyConfig';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
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
  
  // 🚨 NEW: Transaction Type State (Buy/Sell) 🚨
  const [transactionType, setTransactionType] = useState('BUY');

  // 🚨 NEW: Dual Directional Configuration States (Added for Options/Multi-Leg Sync) 🚨
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
  
  // 🚨 NEW: Date Range State 🚨
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Trailing States (Maintained as requested, if needed globally)
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

  // API Call: AI Parse
  const handleAIParse = async () => {
    if (!aiPrompt) return;
    setIsParsing(true);
    setAiMessage(''); setAiExplanation(''); setNeedsInfoQuestion(''); 
    setIsConfirmed(false); setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/parse_strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) throw new Error('Failed to connect to the parsing engine.');
      
      const data = await response.json();
      
      if (data.status === 'needs_info') {
        setNeedsInfoQuestion(data.message);
        setAiMessage('⚠️ Clarification Required');
        return; 
      }

      // 🟢 SUCCESS STATUS CHECK ADDED 🟢
      if (data.status === 'success') {
        // 🚨 NEW: Extracting specific directional configurations 🚨
        if (data.buy_configuration) setBuyConfiguration(data.buy_configuration);
        if (data.sell_configuration) setSellConfiguration(data.sell_configuration);

        const inst = data.instrument_settings || {};
        const entry = data.entry_settings || {};
        const risk = data.risk_management || {};
        const dates = data.date_settings || {}; 

        // 🟢 NULL CRASH FIX: Added || {} at the end to prevent undefined errors
        const primaryConfig = data.buy_configuration || data.sell_configuration || inst || {};
        const primaryEntry = data.buy_configuration || data.sell_configuration || entry || {};

        // Extract Specific Buy/Sell Config details returned from backend
        const rawBuy = data.buy_configuration || {};
        const rawSell = data.sell_configuration || {};

        // 🛠️ Dynamic mapping to independent Split States to fix UI defaults bug
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

        // Global parameters alignment (Retaining legacy states safely)
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

        // Indicators Mapping
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
          // 🚨 FIX: Explicitly mapping entryTime, exitTime, and strikeDistance for EVERY individual leg!
          const mappedLegs = data.legs.map((leg, idx) => ({
            id: leg.id || Date.now() + idx,
            segment: leg.segment || 'Options',
            position: leg.position || 'Buy',
            lots: leg.lots || 1,
            optionType: leg.optionType || 'CE', 
            expiry: leg.expiry || 'Weekly',
            strikeType: leg.strikeType || 'ATM',
            strikeDistance: leg.strikeDistance || leg.strike_distance || 0, // <-- ADDED OTM/ITM Distance Support
            entryTime: leg.entryTime || leg.entry_time || '', // <-- ADDED Leg-level Entry Time
            exitTime: leg.exitTime || leg.exit_time || '',    // <-- ADDED Leg-level Exit Time
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

        setAiExplanation(data.explanation || 'Strategy parameters have been successfully extracted.');
        setAiMessage('✅ Strategy successfully processed.');
        setIsConfirmed(true);
      } // End of success check
    } catch (err) {
      setError('System Error: Unable to process the strategy.');
    } finally {
      setIsParsing(false);
    }
  };

  // List Handlers
  const addLeg = () => { 
    setLegs([...legs, { 
      id: Date.now(), segment: 'Options', position: 'Buy', lots: 1, optionType: 'CE', expiry: 'Weekly', strikeType: 'ATM', 
      strikeDistance: 0, entryTime: '', exitTime: '', // <-- Added defaults for manual leg addition
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

  // API Call: Backtest
  const runBacktest = async () => {
    if (!isConfirmed) return; 
    setLoading(true); setError(''); setResult(null);

    const payload = {
      user_id: "user_123",
      strategy_text: aiPrompt, 
      instrument_settings: { ticker, timeframe, underlyingFrom, qty, transactionType }, 
      
      // Dynamic packaging of split UI parameters for engine backtest execution
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
      
      // 🚨 FIX: Payload is now passing entry_time, exit_time and strike_distance INSIDE each leg!
      legs: legs.map(leg => ({
        id: leg.id,
        segment: leg.segment,
        position: leg.position, // BUY/SELL flag per leg
        lots: leg.lots,
        option_type: leg.optionType,
        expiry: leg.expiry,
        strike_type: leg.strikeType,
        strike_distance: parseInt(leg.strikeDistance) || 0, // Passed to OTM/ITM function
        entry_time: leg.entryTime, // Unique time per leg
        exit_time: leg.exitTime,   // Unique time per leg
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/run_strategy`, {
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

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30">
      
      <Header />

      <div className="w-full max-w-[96%] xl:max-w-[98%] mx-auto p-4 md:p-6 lg:p-8">
        
        {/* 🟢 PROPS FIX: Added handleAIParse and Setters to actually trigger and update state! */}
        <AIParseSection 
          aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} 
          isParsing={isParsing} setIsParsing={setIsParsing} 
          aiMessage={aiMessage} setAiMessage={setAiMessage}
          needsInfoQuestion={needsInfoQuestion} setNeedsInfoQuestion={setNeedsInfoQuestion}
          aiExplanation={aiExplanation} setAiExplanation={setAiExplanation}
          isConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed} 
          handleAIParse={handleAIParse} 
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
              ) : !isConfirmed ? 'Lock Parameters to Execute' : 'Run Backtest'}
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