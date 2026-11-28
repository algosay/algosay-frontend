import React from 'react';

// SVG icons
const Icons = {
  Strategy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Delete: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Load: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Metadata pill (light tints)
const MetadataPill = ({ text, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-sky-50 text-sky-700 border border-sky-200',
    purple: 'bg-violet-50 text-violet-700 border border-violet-200',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    orange: 'bg-amber-50 text-amber-700 border border-amber-200',
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${colors[color] || colors.cyan}`}>
      {text}
    </span>
  );
};

// Universal Strategy Mapping function
const createDefaultObj = (id, name, concept, promptText, segmentTag) => ({
  id,
  name,
  concept,
  description: concept,
  prompt: promptText,
  text: promptText,
  content: promptText,
  strategy: promptText,
  segmentTag,
  isDefault: true,
  createdAt: { seconds: Math.floor(Date.now() / 1000) }
});

// 17 Complete Strategies mapped exactly to user requirements
const DEFAULT_STRATEGIES = [
  createDefaultObj(
    's_1', 
    'Short Straddle Recurring (15M)', 
    'Time-Based Neutral - Continuous 15M short straddle.', 
    "Asset & Timeframe: Sensex | 15 Mins Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Entry starts at 09:30 AM and repeats every 15 minutes till 15:15 PM (ATM Strike).\nRisk Management: 35% Stop Loss & 85% Target for each leg.\nExit Rule: Universal square-off for all open positions at 15:15 PM.\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'time_ndir'
  ),
  createDefaultObj(
    's_2', 
    'Multi-Timeframe Candle Color Trend Short (15M)', 
    'Trend & Momentum - Shorting based on previous candle color.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:30 AM onwards.\nLeg 1 (PE): Check previous 15-min candle color. If Green, short ATM PE at current candle open price.\nLeg 2 (CE): Check previous 15-min candle color. If Red, short ATM CE at current candle open price.\nRecurring checks run every candle close until 14:00 (2:00 PM) cutoff.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'trend'
  ),
  createDefaultObj(
    's_3', 
    'Multi-Timeframe Candle Colour Reverse Short (15M)', 
    'Trend & Momentum - Reverse shorting based on previous candle.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:45 AM onwards.\nLeg 1 (PE): Check previous 15-min candle color. If RED, short ATM PE at the open price of the current candle.\nLeg 2 (CE): Check previous 15-min candle color. If GREEN, short ATM CE at the open price of the current candle.\nRecurring checks run on every candle close until the 14:00 (2:00 PM) cutoff.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'trend'
  ),
  createDefaultObj(
    's_4', 
    '3-Candle Momentum Short Strategy (15M)', 
    'Trend & Momentum - Shorting after 3 consecutive candles.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (ATM Options Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:30 AM onwards Until 3.00 PM.\nCE Short: If 3 consecutive 15-minute candles close Green, short ATM CE at the open price of the next candle.\nPE Short: If 3 consecutive 15-minute candles close Red, short ATM PE at the open price of the next candle.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'trend'
  ),
  createDefaultObj(
    's_5', 
    'Candle Reverse Short Strategy (15M)', 
    'Trend & Momentum - Reverse shorting after 3 consecutive candles.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (ATM Options Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:30 AM onwards Until 3.00 PM.\nCE Short: If 3 consecutive 15-minute candles close red, short ATM CE at the open price of the next candle.\nPE Short: If 3 consecutive 15-minute candles close green, short ATM PE at the open price of the next candle.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'trend'
  ),
 createDefaultObj(
  's_6',
  'Combined Premium Short Straddle (SENSEX - 15M)',
  'Core Non-Dir - Combined premium target and SL.',
  "Sell SENSEX ATM CE and PE, 1 lot each, 15 minutes timeframe.\nPlace a fresh entry at every 15-minute slot from 09:30 AM to 15:00 PM (09:30, 09:45, 10:00 ... 15:00).\nEach slot is an independent trade. Do NOT wait for the previous trade to exit or hit stoploss before placing the next entry. Overlapping positions are allowed.\nEach trade has its own Combined Premium SL 20% and Combined Premium Target 20%.\nSquare off all open trades at 15:15 PM.\nPeriod: 06-08-2026 to 06-08-2026.",
  'core_ndir'
),
  createDefaultObj(
    's_7', 
    'Inside Bar Premium Crush (15M)', 
    'Price Action - Shorting on inside bar formation.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Dynamic Loop starting at 09:45 AM until 14:30 PM. Check the previous two 15-min candles. If the previous candle is an \"Inside Bar\" (its High is lower than the preceding candle's High, and its Low is higher than the preceding candle's Low), short the ATM Straddle (ATM CE & ATM PE) at the current candle's open.\nRisk Management: 30% Stop Loss & 75% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM.\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'pa'
  ),
  createDefaultObj(
    's_8', 
    'Doji Breakout Close Confirmation (15M)', 
    'Price Action - Trading Doji breakouts.', 
    "Asset & Timeframe: Sensex | 15 Mins | 1 Lot\nEntry Rule: Dynamic Loop (09:30 AM to 14:00 PM)\nStep 1: Check T-2 candle for Doji pattern (High & Low noted).\nStep 2: Check T-1 candle color & close price: If T-1 candle closes above Doji High - Bullish Confirmation. If T-1 candle closes below Doji Low - Bearish Confirmation.\nStep 3 (Entry): On Bullish Confirmation, Short ATM PE at current candle (T) Open Price. On Bearish Confirmation, Short ATM CE at current candle (T) Open Price.\nRisk Management: 20% Stop Loss & 50% Target per leg.\nExit Rule: Universal square-off at 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    's_9', 
    'Doji Color Directional Short Strategy (15M)', 
    'Price Action - Directional short based on Doji color.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (ATM Options Short)\nEntry Rule: Dynamic Loop starting from 09:30 AM to 14:00 PM (checks every 15-min candle close).\nStep 1: Check if the previous 15-minute candle (T-1) is classified as a Doji.\nStep 2 (Execution): If Doji candle color is RED - Short ATM CE at current candle (T) Open Price. If Doji candle color is GREEN - Short ATM PE at current candle (T) Open Price.\nRisk Management: 20% Stop Loss & 50% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'pa'
  ),
  createDefaultObj(
    's_10', 
    'First-Hour ORB Mean Reversion (15M)', 
    'Time-Based Dir - Mean reversion on 1st hour breakout.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (ATM Options Short)\nEntry Rule: Dynamic Loop (Starts monitoring from 10:15 AM onwards till 14:00 PM)\nStep 1: Define First-Hour High and Low using the first four 15-min candles (09:15 AM to 10:15 AM).\nStep 2 (Close Confirmation - T-1): CE Short Signal: If T-1 candle breaches First-Hour High but closes as a RED candle. PE Short Signal: If T-1 candle breaches First-Hour Low but closes as a GREEN candle.\nStep 3 (Entry Execution - T Open): On CE Short Signal - Short ATM CE at current candle (T) Open Price. On PE Short Signal - Short ATM PE at current candle (T) Open Price.\nRisk Management: 25% Stop Loss & 70% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 13.8.2026 to Aug 13.08.2026", 
    'time_dir'
  ),
  createDefaultObj(
    's_11', 
    'Sensex 5-Min Super trend Intraday Strategy', 
    'Indicators - Supertrend (10,3) strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: Supertrend (ATR Period: 10, Multiplier: 3.0)\nEntry Rule: ATM Options\nPE Entry (PE Option SELL): When the 5-minute candle closes and Supertrend gives a Green signal, immediately SELL 10 Lots of PE at the next candle's open price. (Maximum 3 PE trades per day).\nCE Entry (CE Option SELL): When the 5-minute candle closes and Supertrend gives a Red signal, immediately SELL 10 Lots of CE at the next candle's open price. (Maximum 3 CE trades per day).\nRisk Management: Stoploss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: 200 Points profit from entry price triggers complete exit. Stoploss Exit: 100 Points loss triggers complete exit.\nPeriod: sep 11.09.2026 to sep 11.09.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_12', 
    'Sensex 5-Min MACD Crossover Intraday Strategy', 
    'Indicators - MACD (12,26,9) crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: MACD (Fast EMA: 12, Slow EMA: 26, Signal Line: 9)\nEntry Rule: ATM Options\nPE Entry (PE Option SELL - Bullish Signal): When the 5-minute candle closes and the MACD Line crosses above the Signal Line from below, immediately SELL 10 Lots of PE at the next candle's open price. (Max 1 PE trade per day).\nCE Entry (CE Option SELL - Bearish Signal): When the 5-minute candle closes and the MACD Line crosses below the Signal Line from above, immediately SELL 10 Lots of CE at the next candle's open price. (Max 1 CE trade per day).\nRisk Management: Stoploss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade.\nExit Rule: Target Exit: 200 Points profit triggers complete exit. Stoploss Exit: 100 Points loss triggers complete exit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_13', 
    'Sensex 5-Min EMA Crossover Intraday Strategy', 
    'Indicators - 9/21 EMA crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicators: Fast EMA: 9, Slow EMA: 21\nEntry Rule (ATM Options): Dynamic Loop (Starts monitoring from 9:20 AM onwards till 15:00 PM)\nPE Entry (PE Option SELL - Bullish Signal): When the 5-minute candle closes and Fast EMA (9) crosses above Slow EMA (21) from below, immediately SELL 10 Lots of PE at the next candle's open price.\nCE Entry (CE Option SELL - Bearish Signal): When the 5-minute candle closes and Fast EMA (9) crosses below Slow EMA (21) from above, immediately SELL 10 Lots of CE at the next candle's open price.\nExit Rule: Target Exit: 200 Points profit triggers complete exit. Stoploss Exit: 100 Points loss triggers complete exit.\nPeriod: Aug 20, 2026 to Aug 21, 2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_14', 
    'Sensex 5-Min RSI Crossover Intraday Strategy', 
    'Indicators - RSI 14 overbought/oversold reversal.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: RSI (Period: 14, OB Level: 70, OS Level: 30)\nEntry Rule: ATM Options\nCE Entry (CE Option SELL - Bullish Signal): When the 5-minute candle closes and the RSI value crosses above 30 from below, immediately SELL 10 Lots of PE at the next candle's open price. (Max 2 CE trades per day).\nPE Entry (PE Option SELL - Bearish Signal): When the 5-minute candle closes and the RSI value crosses below 70 from above, immediately SELL 10 Lots of PE at the next candle's open price. (Max 2 PE trades per day).\nRisk Management: Stoploss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: 200 Points profit triggers complete exit. Stoploss Exit: 100 Points loss triggers complete exit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_15', 
    'OTM & ITM Multi-Leg Combination Strategy (15M)', 
    'Time-Based Neutral - Dual OTM & ITM option sell combo.', 
    "Asset & Timeframe: Sensex | 15 Mins Timeframe | 1 Lot\nEntry Rule: Entry starts at 09:30 AM and repeats every 15 minutes till 15:15 PM (Dynamic Loop).\nLeg 1: Short 1 Lot CE & PE OTM with 100% Stop Loss & 80% Target.\nLeg 2: Short 1 Lot CE & PE ITM (ITM 1) with 20% Stop Loss & 80% Target.\nExit Rule: Universal square-off for all open positions at 15:15 PM.\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'time_ndir'
  ),
  createDefaultObj(
    's_16', 
    '7-Candle Sequence Momentum Short Strategy (15M)', 
    'Trend & Momentum - 7-candle sequence breakout shorting.', 
    "Asset & Timeframe: Sensex | 15 Mins Timeframe | 1 Lot\nEntry Rule: The strategy executes based on a 7-candle sequence on a 15-minute timeframe.\nLeg 1 (CE Short): Enters an ATM CE sell when a 7-candle sequence ending in a Green candle is followed by the 8th candle open.\nLeg 2 (PE Short): Enters an ATM PE sell when a 7-candle sequence ending in a Red candle is followed by the 8th candle open.\nRisk Management: 25% Stop Loss & 80% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions at 15:15 PM.\nPeriod: Aug 17.08.2026 to Aug 17.08.2026", 
    'trend'
  ),
  createDefaultObj(
    's_17', 
    '5-Candle Sequence Momentum Short Strategy (15M)', 
    'Trend & Momentum - 5-candle sequence breakout shorting.', 
    "Asset & Timeframe: Sensex | 15 Mins Timeframe | 1 Lot\nEntry Rule: The strategy executes based on a 5-candle sequence on a 15-minute timeframe.\nLeg 1 (CE Short): Enters an ATM CE sell when a 5-candle sequence ending in a Green candle is followed by the 6th candle RED ...TRADE ENTER ON 7TH CANDLE OPEN\nLeg 2 (PE Short): Enters an ATM PE sell when a 5-candle sequence ending in a Red candle is followed by the 6th candle GREEN..TRADE ENTER ON 7TH CANDLE OPEN\nRisk Management: 25% Stop Loss & 80% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions at 15:15 PM.\nPeriod: SEP 02.09.2026 to SEP 02.09.2026", 
    'trend'
  )
];

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies = [], onLoad, onEdit, onDelete }) => {
  
  if (!isOpen) return null;

  // Combine User Saved Strategies and Default Templates into one unified list
  const allDisplayStrategies = [...(strategies || []), ...DEFAULT_STRATEGIES];

  const handleLoadStrategy = (e, strat) => {
    e.stopPropagation();
    if (onLoad) onLoad(strat);
    if (onClose) onClose();
  };

  const handleEditStrategy = (e, strat) => {
    e.stopPropagation();
    if (onEdit) onEdit(strat);
  };

  const handleDeleteStrategy = (e, strat) => {
    e.stopPropagation();
    if (onDelete) onDelete(strat);
  };

  const getPillColor = (tag) => {
    const colors = {
      core_dir: 'cyan',
      core_spreads: 'purple',
      core_ndir: 'green',
      core_adv: 'orange',
      time_dir: 'cyan',
      time_ndir: 'purple',
      ind_dir: 'green',
      trend: 'orange',
      pa: 'cyan',
      scalp: 'purple'
    };
    return colors[tag] || 'cyan';
  };

  return (
    <div className="fixed inset-0 bg-[#F4F5F7] z-[999] overflow-y-auto overflow-x-hidden animate-fade-in">

      <div className="relative min-h-screen px-4 md:px-8 pb-10 flex flex-col max-w-[1600px] mx-auto">
        
        {/* Sticky header */}
        <div className="flex justify-between items-center mb-6 py-4 sticky top-0 bg-[#F4F5F7]/90 backdrop-blur-md z-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0F1B2D] rounded-lg text-indigo-200">
              <Icons.Strategy />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#0F1B2D]">
                Strategy library
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Backtest-ready intraday templates and your saved strategies.
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Close"
            className="p-2 rounded-lg text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 hover:text-[#0F1B2D] transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Loading / empty / grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <div className="animate-spin h-10 w-10 border-4 border-[#0F1B2D] border-t-transparent rounded-full mb-4"></div>
            <p className="text-slate-500 font-medium text-sm">Loading your strategies...</p>
          </div>
        ) : allDisplayStrategies.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 bg-white rounded-xl border border-slate-200">
            <p className="text-[#0F1B2D] font-semibold text-lg">No strategies yet</p>
            <p className="text-slate-500 mt-1 text-sm">Describe a strategy in the AI box and save it to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
            {allDisplayStrategies.map(strat => (
              
              <div 
                key={strat.id} 
                className="bg-white rounded-xl flex flex-col h-[420px] border border-slate-200 hover:border-indigo-300 hover:shadow-[0_6px_20px_rgba(15,27,45,0.08)] transition-all duration-200 group overflow-hidden"
              >
                {/* Card top: pill + id */}
                <div className="flex items-center justify-between px-4 pt-4 shrink-0">
                  <MetadataPill 
                    text={strat.isDefault ? (strat.segmentTag || 'TEMPLATE') : 'Custom build'} 
                    color={getPillColor(strat.segmentTag)} 
                  />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {strat.id.substring(0, 6)}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-4 pt-3 pb-3 flex flex-col flex-1 gap-3 overflow-hidden">
                  <h3 className="font-semibold text-base text-[#0F1B2D] group-hover:text-indigo-700 transition-colors line-clamp-2 leading-snug shrink-0">
                    {strat.name}
                  </h3>
                  
                  {/* Strategy text (scrollable) */}
                  <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-y-auto custom-scrollbar">
                    <pre className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                      {strat.prompt || strat.concept || strat.text}
                    </pre>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium shrink-0">
                    <Icons.Calendar />
                    Logged: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Active'}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
                  
                  {/* Edit/Delete only for user's custom strategies */}
                  {!strat.isDefault && (
                    <div className="flex gap-1.5">
                      <button 
                        type="button"
                        onClick={(e) => handleEditStrategy(e, strat)}
                        className="p-2.5 rounded-lg text-slate-600 bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer"
                        title="Edit Strategy"
                      >
                        <Icons.Edit />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteStrategy(e, strat)}
                        className="p-2.5 rounded-lg text-slate-600 bg-white border border-slate-300 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete Strategy"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  )}

                  {/* Load button */}
                  <button 
                    type="button"
                    onClick={(e) => handleLoadStrategy(e, strat)} 
                    className="flex items-center justify-center flex-1 gap-2 py-2.5 px-4 bg-[#0F1B2D] hover:bg-[#1c2d47] text-white text-xs font-semibold rounded-lg transition-colors active:scale-[0.98] cursor-pointer"
                  >
                    <Icons.Load />
                    {strat.isDefault ? 'Use template' : 'Load strategy'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyStrategiesModal;
