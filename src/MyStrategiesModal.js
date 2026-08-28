import React, { useState } from 'react';

// Bespoke SVG Icons - Pure Premium Cyber-Neon Styling
const Icons = {
  Strategy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Load: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Template: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Metadata Pill Component - Neon Glow Badges with Glassmorphism
const MetadataPill = ({ text, color = 'orange' }) => {
  const colors = {
    blue: 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    green: 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    yellow: 'bg-amber-950/80 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    purple: 'bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.35)]',
    orange: 'bg-orange-950/80 text-orange-300 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    red: 'bg-rose-950/80 text-rose-300 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
  };
  return (
    <span className={`px-3.5 py-1.5 text-[11px] font-black rounded-xl ${colors[color] || colors.orange} tracking-wider uppercase backdrop-blur-md`}>
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

// 14 Updated Strategies mapped exactly to user requirements
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
    'Multi-Timeframe Candle Color Trend Short Strategy (15M)', 
    'Trend & Momentum - Shorting based on previous candle color.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:30 AM onwards.\nLeg 1 (PE): Check previous 15-min candle color. If Green, short ATM PE at current candle open price.\nLeg 2 (CE): Check previous 15-min candle color. If Red, short ATM CE at current candle open price.\nRecurring checks run every candle close until 14:00 (2:00 PM) cutoff.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
    'trend'
  ),
  createDefaultObj(
    's_3', 
    'Multi-Timeframe Candle Colour Reverse Short Strategy (15M)', 
    'Trend & Momentum - Reverse shorting based on previous candle.', 
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Dynamic Loop. Starts checking from 09:30 AM onwards.\nLeg 1 (PE): Check previous 15-min candle color. If RED, short ATM PE at the open price of the current candle.\nLeg 2 (CE): Check previous 15-min candle color. If GREEN, short ATM CE at the open price of the current candle.\nRecurring checks run on every candle close until the 14:00 (2:00 PM) cutoff.\nRisk Management: 22% Stop Loss & 65% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
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
    "Asset & Timeframe: SENSEX | 15 Minutes Timeframe | 1 Lot (CE & PE Short)\nEntry Rule: Entry starts at 09:30 AM and repeats every 15 minutes till 15:15 PM (ATM Strike). Dynamic Loop\nRisk Management: Combined Premium SL: 20% points | Target: 20% (Overall strategy exit based on total premium movement)\nExit Rule: Universal square-off at 15:15 PM (3:15 PM) or when combined premium targets/stop-losses are triggered.\nPeriod: Aug 06.08.2026 to Aug 06.08.2026", 
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
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: Supertrend (ATR Period: 10, Multiplier: 3.0)\nEntry Rule: ATM\nPE Entry (PE Option SELL): 5-minute candle close aagum podhu Supertrend Green signal podhu, immediate-ah next candle open price la 10 Lots PE SELL pannanum. (Oru nalaiku max 3 PE trade mattum dhaan).\nCE Entry (CALL Option Buy / SELL): 5-minute candle close aagum podhu Supertrend Red signal podhu, immediate-ah next candle open price la 10 Lots CE SELL pannanum. (Oru nalaiku max 3 CE trade mattum dhaan).\nRisk Management: Stoploss (SL): Entry price la irundhu 100 Points. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: Entry price la irundhu 200 Points profit hit aana complete exit. Stoploss Exit: Entry price la irundhu 100 Points loss hit aana complete exit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_12', 
    'Sensex 5-Min MACD Crossover Intraday Strategy', 
    'Indicators - MACD (12,26,9) crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: MACD (Fast EMA: 12, Slow EMA: 26, Signal Line: 9)\nEntry Rule: ATM\nPE Entry (PE Option SELL - Bullish Signal): 5-minute candle close aagum podhu MACD Line, Signal Line-ஐ கீழே இருந்து மேலே Cross பண்ணி Crossover தரும் போது, immediate-ah next candle open price la 10 Lots PE SELL pannanum. (Oru nalaiku max 1 PE trade).\nCE Entry (CE Option SELL - Bearish Signal): 5-minute candle close aagum podhu MACD Line, Signal Line-ஐ மேலே இருந்து கீழே Cross பண்ணி Crossover தரும் போது, immediate-ah next candle open price la 10 Lots CE SELL pannanum. (Oru nalaiku max 1 CE trade).\nRisk Management: Stoploss (SL): Entry price la irundhu 100 Points. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade.\nExit Rule: Target Exit: Entry price la irundhu 200 Points profit hit aana complete exit. Stoploss Exit: Entry price la irundhu 100 Points loss hit aana complete exit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_13', 
    'Sensex 5-Min EMA Crossover Intraday Strategy', 
    'Indicators - 9/21 EMA crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicators: Fast EMA: 9, Slow EMA: 21\nEntry Rule (ATM Options): Dynamic Loop (Starts monitoring from 9:20 AM onwards till 15:00 PM)\nPE Entry (PE Option SELL - Bullish Signal): 5-minute candle close aagum podhu Fast EMA (9), Slow EMA (21)-ai கீழே இருந்து மேலே Cross பண்ணி Crossover தரும் போது, immediate-ah next candle open price-la 10 Lots PE SELL pannanum.\nCE Entry (CE Option SELL - Bearish Signal): 5-minute candle close aagum podhu Fast EMA (9), Slow EMA (21)-ai மேலே இருந்து கீழே Cross பண்ணி Crossover தரும் போது, immediate-ah next candle open price-la 10 Lots CE SELL pannanum.\nExit Rule: Target Exit: Entry price-la irundhu 200 Points profit hit aana complete exit. Stoploss Exit: Entry price-la irundhu 100 Points loss hit aana complete exit.\nPeriod: Aug 20, 2026 to Aug 21, 2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_14', 
    'Sensex 5-Min RSI Crossover Intraday Strategy', 
    'Indicators - RSI 14 overbought/oversold reversal.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: RSI (Period: 14, OB Level: 70, OS Level: 30)\nEntry Rule: ATM Options\nCE Entry (CE Option SELL - Bullish Signal): 5-minute candle close aagum podhu RSI value 30-ku keele irundhu mela cross panni varum podhu, immediate-ah next candle open price la 10 Lots PE SELL pannanum. (Oru nalaiku max 2 CE trade mattum dhaan).\nPE Entry (PE Option SELL - Bearish Signal): 5-minute candle close aagum podhu RSI value 70-ku mela irundhu keele cross panni varum podhu, immediate-ah next candle open price la 10 Lots PE SELL pannanum. (Oru nalaiku max 2 PE trade mattum dhaan).\nRisk Management: Stoploss (SL): Entry price la irundhu 100 Points. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: Entry price la irundhu 200 Points profit hit aana complete exit. Stoploss Exit: Entry price la irundhu 100 Points loss hit aana complete exit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  )
];

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies = [], onLoad, onEdit, onDelete, initialTab = 'my_strategies' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [segmentFilter, setSegmentFilter] = useState('all');

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSegmentFilter('all');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

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
      core_dir: 'orange',
      core_spreads: 'blue',
      core_ndir: 'purple',
      core_adv: 'yellow',
      time_dir: 'green',
      time_ndir: 'purple',
      ind_dir: 'blue',
      trend: 'green',
      pa: 'yellow',
      scalp: 'red'
    };
    return colors[tag] || 'orange';
  };

  // Filter default strategies based on 10 segments
  const filteredTemplates = DEFAULT_STRATEGIES.filter(strat => {
    if (segmentFilter === 'all') return true;
    return strat.segmentTag === segmentFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[999] p-4 md:p-6 transition-all duration-300">
      
      {/* Ultra-Modern Royal Cyber Neon Modal Container */}
      <div className="bg-gradient-to-b from-[#090914] via-[#05050a] to-[#030307] border-2 border-orange-500/40 rounded-3xl w-full max-w-7xl p-6 md:p-8 relative shadow-[0_0_80px_rgba(249,115,22,0.25)] animate-fade-in-up flex flex-col max-h-[92vh]">
        
        {/* Glowing Background Ambient Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header - Neon Title with Vibrant Gradient */}
        <div className="flex justify-between items-center mb-6 pr-12 flex-shrink-0 border-b border-orange-500/20 pb-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-2xl border border-orange-500/50 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)]">
              <Icons.Strategy />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  Trading Strategies & Segments
                </span>
              </h2>
              <p className="text-xs md:text-sm text-amber-300/80 mt-1 font-semibold tracking-wide">
                Explore Intraday Pure backtestable setups categorized across distinct market segments.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-1 right-2 p-2.5 rounded-2xl text-gray-400 hover:text-white bg-[#0f0f1d] border border-orange-500/30 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.6)] transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Tabs - Glowing Neon Orange Buttons */}
        <div className="flex p-2 bg-[#080812] rounded-2xl border border-orange-500/30 mb-6 flex-shrink-0 gap-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative z-10">
          <button 
            type="button"
            onClick={() => setActiveTab('my_strategies')}
            className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'my_strategies' 
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.6)] border border-amber-300 scale-[1.01]' 
                : 'text-gray-400 hover:text-white hover:bg-[#121226]'
            }`}
          >
            <Icons.Strategy />
            My Saved Strategies
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('default_strategies')}
            className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'default_strategies' 
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.6)] border border-amber-300 scale-[1.01]' 
                : 'text-gray-400 hover:text-white hover:bg-[#121226]'
            }`}
          >
            <Icons.Template />
            Default Templates (10 Segments)
          </button>
        </div>

        {/* 10 Sub-Segments (Only visible under Default Templates) */}
        {activeTab === 'default_strategies' && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-5 scrollbar-thin scrollbar-thumb-orange-500 flex-shrink-0 relative z-10">
            {[
              { id: 'all', label: 'All Strategies' },
              { id: 'core_dir', label: 'Core Directional' },
              { id: 'core_spreads', label: 'Core Spreads' },
              { id: 'core_ndir', label: 'Core Non-Dir' },
              { id: 'core_adv', label: 'Core Advanced' },
              { id: 'time_dir', label: 'Time-Based Dir' },
              { id: 'time_ndir', label: 'Time-Based Neutral' },
              { id: 'ind_dir', label: 'Indicators' },
              { id: 'trend', label: 'Trend & Momentum' },
              { id: 'pa', label: 'Price Action' },
              { id: 'scalp', label: 'Scalping' }
            ].map(seg => (
              <button
                key={seg.id}
                type="button"
                onClick={() => setSegmentFilter(seg.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  segmentFilter === seg.id
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.8)] font-black scale-105 border border-white/40'
                    : 'bg-[#0b0b17] text-gray-300 border border-orange-500/20 hover:border-orange-500/60 hover:text-white hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Content Area - Responsive Grid Layout with Custom Scrollbar */}
        <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/50 scrollbar-track-[#080812] flex-1 relative z-10">
          
          {activeTab === 'my_strategies' && (
            <>
              {isLoading ? (
                <div className="text-center p-16 bg-[#080814]/80 backdrop-blur-md rounded-3xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4 shadow-[0_0_20px_rgba(249,115,22,0.8)]"></div>
                  <p className="text-orange-400 font-extrabold text-base tracking-wider">Syncing with your database...</p>
                </div>
              ) : !strategies || strategies.length === 0 ? (
                <div className="text-center p-16 bg-[#080814]/80 backdrop-blur-md rounded-3xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-500/40 text-orange-400 inline-block mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <Icons.Strategy />
                  </div>
                  <p className="text-white font-black text-xl">No Strategies Found</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    You haven't saved any configurations yet. Your private collection will appear here once you do.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strategies.map(strat => (
                    <div 
                      key={strat.id} 
                      className="bg-gradient-to-b from-[#0e0e1c] to-[#070710] p-6 rounded-3xl flex flex-col h-full border border-orange-500/30 hover:border-orange-500 hover:shadow-[0_0_35px_rgba(249,115,22,0.35)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Top Neon Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {strat.name}
                        </h3>
                      </div>
                      
                      <p className="text-xs text-gray-300 font-medium leading-relaxed bg-[#04040a] p-3.5 rounded-2xl border border-orange-500/20 flex-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                        <span className="line-clamp-4">{strat.prompt || strat.concept || strat.description || strat.text}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-amber-400/80 mt-4 mb-4 font-bold tracking-wide">
                        <Icons.Calendar />
                        Saved on: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Just now'}
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-orange-500/20">
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={(e) => handleEditStrategy(e, strat)}
                            className="p-3 rounded-xl text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/25 border border-yellow-500/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(234,179,8,0.25)] hover:scale-105"
                            title="Edit Strategy"
                          >
                            <Icons.Edit />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleDeleteStrategy(e, strat)}
                            className="p-3 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:scale-105"
                            title="Delete Strategy"
                          >
                            <Icons.Delete />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => handleLoadStrategy(e, strat)} 
                          className="flex items-center justify-center flex-1 gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-pink-500 to-blue-400 text-white text-xs font-black rounded-xl transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] active:scale-95 cursor-pointer uppercase tracking-wider border border-amber-300/40"
                        >
                          <Icons.Load />
                          LOAD PLAN
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'default_strategies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center p-16 bg-[#080814]/80 backdrop-blur-md rounded-3xl border border-orange-500/30 col-span-full shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <p className="text-gray-300 font-black text-lg">No strategies found in this segment.</p>
                </div>
              ) : (
                filteredTemplates.map(strat => (
                  <div 
                    key={strat.id} 
                    className="bg-gradient-to-b from-[#0e0e1c] to-[#070710] p-6 rounded-3xl flex flex-col h-full border border-orange-500/30 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Top Neon Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col gap-3.5 mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1 pr-2">
                          {strat.name}
                        </h3>
                      </div>
                      <div className="self-start">
                        <MetadataPill 
                          text={
                            strat.segmentTag === 'core_dir' ? 'CORE DIRECTIONAL' :
                            strat.segmentTag === 'core_spreads' ? 'CORE SPREADS' :
                            strat.segmentTag === 'core_ndir' ? 'CORE NON-DIR' :
                            strat.segmentTag === 'core_adv' ? 'CORE ADVANCED' :
                            strat.segmentTag === 'time_dir' ? 'TIME-BASED DIR' :
                            strat.segmentTag === 'time_ndir' ? 'TIME-BASED NEUTRAL' :
                            strat.segmentTag === 'ind_dir' ? 'INDICATORS' :
                            strat.segmentTag === 'trend' ? 'TREND & MOMENTUM' :
                            strat.segmentTag === 'pa' ? 'PRICE ACTION' : 'SCALPING'
                          } 
                          color={getPillColor(strat.segmentTag)} 
                        />
                      </div>
                    </div>
                    
                    <p className="flex-1 text-xs text-gray-300 font-medium whitespace-pre-wrap leading-relaxed bg-[#04040a] p-3.5 rounded-2xl border border-orange-500/20 mb-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                      {strat.prompt}
                    </p>

                    <div className="mt-auto pt-3 border-t border-orange-500/20">
                      <button 
                        type="button"
                        onClick={(e) => handleLoadStrategy(e, strat)} 
                        className="flex items-center justify-center w-full gap-2 py-3.5 bg-[#080814] border border-amber-400/60 text-amber-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-black text-xs font-black rounded-xl transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        <Icons.Load />
                        USE TEMPLATE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyStrategiesModal;