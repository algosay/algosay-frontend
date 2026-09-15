import React from 'react';

// Bespoke SVG Icons - Pure Premium Cyber-Neon Styling
const Icons = {
  Strategy: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Metadata Pill Component - Cyberpunk Tag Styling
const MetadataPill = ({ text, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]',
    purple: 'bg-[#D500F9]/10 text-[#D500F9] border border-[#D500F9]/50 shadow-[0_0_10px_rgba(213,0,249,0.3)]',
    green: 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/50 shadow-[0_0_10px_rgba(0,230,118,0.3)]',
    orange: 'bg-[#FF9100]/10 text-[#FF9100] border border-[#FF9100]/50 shadow-[0_0_10px_rgba(255,145,0,0.3)]',
  };
  return (
    <span className={`px-3 py-1.5 text-[10px] font-black rounded-lg ${colors[color] || colors.cyan} tracking-widest uppercase backdrop-blur-md`}>
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
    "Asset & Timeframe: Sensex | 15 Mins Timeframe | 1 Lot\nEntry Rule: The strategy executes based on a 7-candle sequence on a 15-minute timeframe.\nLeg 1 (CE Short): Enters an ATM CE sell when a 7-candle sequence ending in a Green candle is followed by the 8th candle open.\nLeg 2 (PE Short): Enters an ATM PE sell when a 7-candle sequence ending in a Red candle is followed by the 8th candle open.\nRisk Management: 25% Stop Loss & 80% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions at 15:15 PM.\nPeriod: Aug 14.08.2026 to Aug 14.08.2026", 
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
    <div className="fixed inset-0 bg-[#090A0F] z-[999] overflow-y-auto overflow-x-hidden animate-fade-in transition-all duration-500">
      
      {/* Deep Dark Navy Background with Light Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D500F9]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative min-h-screen p-4 md:p-10 flex flex-col z-10 max-w-[1600px] mx-auto">
        
        {/* Header - Full Width Royal Neon Title */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#00FFFF]/20 sticky top-0 bg-[#090A0F]/80 backdrop-blur-xl z-50 rounded-b-3xl px-4 md:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-5 pt-4">
            <div className="p-4 bg-gradient-to-br from-[#00FFFF]/20 to-[#D500F9]/20 rounded-2xl border border-[#00FFFF]/50 text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.4)]">
              <Icons.Strategy />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-wide text-[#FFFFFF]">
                AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#D500F9] drop-shadow-[0_0_15px_rgba(213,0,249,0.5)]">Strategies</span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 mt-2 font-medium tracking-wider">
                Explore Intraday pure backtestable setups & your private saved collections.
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className="p-3 md:p-4 rounded-full text-white bg-[#D500F9]/10 border border-[#D500F9]/30 hover:bg-[#D500F9]/30 hover:border-[#D500F9] hover:shadow-[0_0_25px_rgba(213,0,249,0.6)] transition-all duration-300 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Strategies Grid Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <div className="animate-spin h-16 w-16 border-4 border-[#00FFFF] border-t-transparent rounded-full shadow-[0_0_30px_rgba(0,255,255,0.8)] mb-6"></div>
            <p className="text-[#00FFFF] font-black text-xl tracking-widest uppercase">Initializing Database...</p>
          </div>
        ) : allDisplayStrategies.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32 bg-[#00FFFF]/5 rounded-3xl border border-[#00FFFF]/20 backdrop-blur-sm">
            <p className="text-white font-black text-2xl">No Strategies Found</p>
            <p className="text-gray-400 mt-3 text-lg">Your master library is currently empty.</p>
          </div>
        ) : (
          /* Full Screen Responsive Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {allDisplayStrategies.map(strat => (
              
              /* Terminal Style Animated Box for each strategy */
              <div 
                key={strat.id} 
                className="bg-[#0D0F18]/90 backdrop-blur-xl rounded-2xl flex flex-col h-[500px] border border-[#00FFFF]/20 hover:border-[#00FFFF]/80 hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Terminal Header (Red, Yellow, Green dots) */}
                <div className="flex items-center gap-2 px-5 py-3.5 bg-[#05060A] border-b border-[#00FFFF]/10 group-hover:bg-[#00FFFF]/5 transition-colors duration-500">
                  <div className="w-3 h-3 rounded-full bg-[#FF007F] shadow-[0_0_8px_rgba(255,0,127,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FF9100] shadow-[0_0_8px_rgba(255,145,0,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.5)]"></div>
                  <span className="ml-auto text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                    ID: {strat.id.substring(0, 6)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 gap-4 overflow-hidden">
                  
                  {/* Strategy Name & Tags */}
                  <div className="flex flex-col gap-3 shrink-0">
                    <h3 className="font-black text-xl text-white group-hover:text-[#00FFFF] transition-colors line-clamp-2 leading-tight">
                      {strat.name}
                    </h3>
                    <div className="self-start">
                      <MetadataPill 
                        text={strat.isDefault ? (strat.segmentTag || 'TEMPLATE') : 'CUSTOM BUILD'} 
                        color={getPillColor(strat.segmentTag)} 
                      />
                    </div>
                  </div>
                  
                  {/* Neon Green Terminal Code Block (Scrollable) */}
                  <div className="flex-1 bg-[#020205] p-4 rounded-xl border border-[#00E676]/20 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00E676]/40 scrollbar-track-transparent">
                    <pre className="text-xs text-[#00E676] font-mono whitespace-pre-wrap leading-relaxed">
                      {strat.prompt || strat.concept || strat.text}
                    </pre>
                  </div>

                  {/* Metadata (Date) */}
                  <div className="flex items-center gap-2 text-[11px] text-[#00FFFF]/70 font-bold tracking-widest uppercase shrink-0">
                    <Icons.Calendar />
                    Logged: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Active'}
                  </div>
                </div>

                {/* Footer Buttons Action Area */}
                <div className="p-4 bg-[#05060A] border-t border-[#00FFFF]/10 flex items-center gap-3 shrink-0">
                  
                  {/* Only show Edit/Delete if it is a user's custom strategy */}
                  {!strat.isDefault && (
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={(e) => handleEditStrategy(e, strat)}
                        className="p-3 rounded-xl text-[#00FFFF] bg-[#00FFFF]/5 border border-[#00FFFF]/30 hover:bg-[#00FFFF]/20 hover:border-[#00FFFF] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:scale-105"
                        title="Edit Strategy"
                      >
                        <Icons.Edit />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteStrategy(e, strat)}
                        className="p-3 rounded-xl text-[#FF007F] bg-[#FF007F]/5 border border-[#FF007F]/30 hover:bg-[#FF007F]/20 hover:border-[#FF007F] transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,127,0.1)] hover:scale-105"
                        title="Delete Strategy"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  )}

                  {/* Universal Execute / Load Button */}
                  <button 
                    type="button"
                    onClick={(e) => handleLoadStrategy(e, strat)} 
                    className="flex items-center justify-center flex-1 gap-2 py-3.5 px-4 bg-gradient-to-r from-[#D500F9] to-[#FF007F] text-white text-[13px] font-black rounded-xl transition-all hover:shadow-[0_0_30px_rgba(213,0,249,0.6)] hover:scale-[1.02] active:scale-95 cursor-pointer uppercase tracking-widest border border-white/20"
                  >
                    <Icons.Load />
                    {strat.isDefault ? 'Deploy Template' : 'Execute Plan'}
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