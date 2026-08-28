import React, { useState } from 'react';

// Bespoke SVG Icons - Pure Cyber Neon & Modern Glassmorphism Styling
const Icons = {
  Strategy: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-4.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

// Metadata Pill Component with Neon Badges
const MetadataPill = ({ text, type = 'cyan' }) => {
  const styles = {
    cyan: 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/40 shadow-[0_0_12px_rgba(0,255,255,0.25)]',
    purple: 'bg-[#D500F9]/10 text-[#D500F9] border border-[#D500F9]/40 shadow-[0_0_12px_rgba(213,0,249,0.25)]',
    green: 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/40 shadow-[0_0_12px_rgba(0,230,118,0.25)]',
    orange: 'bg-[#FF9100]/10 text-[#FF9100] border border-[#FF9100]/40 shadow-[0_0_12px_rgba(255,145,0,0.25)]',
    pink: 'bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/40 shadow-[0_0_12px_rgba(255,0,127,0.25)]',
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-extrabold rounded-lg tracking-wider uppercase backdrop-blur-md ${styles[type] || styles.cyan}`}>
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

// All 14 Strategies Translated into 100% Pure Professional English
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
    "Asset & Timeframe: Sensex | 15 Minutes Timeframe | 1 Lot (ATM Options Short)\nEntry Rule: Dynamic Loop (Starts monitoring from 10:15 AM onwards till 14:00 PM)\nStep 1: Define First-Hour High and Low using the first four 15-min candles (09:15 AM to 10:15 AM).\nStep 2 (Close Confirmation - T-1): CE Short Signal: If T-1 candle breaches First-Hour High but closes as a RED candle. PE Short Signal: If T-1 candle breaches First-Hour Low but closes as a GREEN candle.\nStep 3 (Entry Execution - T Open): On CE Short Signal - Short ATM CE at current candle (T) Open Price. On PE Short Signal - Short ATM PE at current candle (T) Open Price.\nRisk Management: 25% Stop Loss & 70% Target calculated per individual leg.\nExit Rule: Universal square-off for all open positions automatically at 15:15 PM (3:15 PM).\nPeriod: Aug 13.08.2026 to Aug 13.08.2026", 
    'time_dir'
  ),
  createDefaultObj(
    's_11', 
    'Sensex 5-Min Supertrend Intraday Strategy', 
    'Indicators - Supertrend (10,3) strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: Supertrend (ATR Period: 10, Multiplier: 3.0)\nEntry Rule: ATM Options\nPE Entry (PE Option SELL): On 5-minute candle close when Supertrend gives a Green signal, immediately sell 10 Lots PE at the open price of the next candle. (Maximum 3 PE trades per day).\nCE Entry (CE Option SELL): On 5-minute candle close when Supertrend gives a Red signal, immediately sell 10 Lots CE at the open price of the next candle. (Maximum 3 CE trades per day).\nRisk Management: Stop Loss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: Complete exit when target of 200 Points profit from entry price is hit. Stop Loss Exit: Complete exit when 100 Points loss from entry price is hit.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_12', 
    'Sensex 5-Min MACD Crossover Intraday Strategy', 
    'Indicators - MACD (12,26,9) crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: MACD (Fast EMA: 12, Slow EMA: 26, Signal Line: 9)\nEntry Rule: ATM Options\nPE Entry (PE Option SELL - Bullish Signal): On 5-minute candle close when the MACD Line crosses above the Signal Line from below, immediately sell 10 Lots PE at the open price of the next candle. (Maximum 1 PE trade per day).\nCE Entry (CE Option SELL - Bearish Signal): On 5-minute candle close when the MACD Line crosses below the Signal Line from above, immediately sell 10 Lots CE at the open price of the next candle. (Maximum 1 CE trade per day).\nRisk Management: Stop Loss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade.\nExit Rule: Target Exit: Complete exit upon achieving 200 Points profit from entry price. Stop Loss Exit: Complete exit upon hitting 100 Points loss from entry price.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_13', 
    'Sensex 5-Min EMA Crossover Intraday Strategy', 
    'Indicators - 9/21 EMA crossover strategy.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicators: Fast EMA: 9, Slow EMA: 21\nEntry Rule (ATM Options): Dynamic Loop (Starts monitoring from 09:20 AM onwards till 15:00 PM)\nPE Entry (PE Option SELL - Bullish Signal): On 5-minute candle close when Fast EMA (9) crosses above Slow EMA (21) from below, immediately sell 10 Lots PE at the open price of the next candle.\nCE Entry (CE Option SELL - Bearish Signal): On 5-minute candle close when Fast EMA (9) crosses below Slow EMA (21) from above, immediately sell 10 Lots CE at the open price of the next candle.\nExit Rule: Target Exit: Complete exit upon hitting 200 Points profit from entry price. Stop Loss Exit: Complete exit upon hitting 100 Points loss from entry price.\nPeriod: Aug 20.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  ),
  createDefaultObj(
    's_14', 
    'Sensex 5-Min RSI Crossover Intraday Strategy', 
    'Indicators - RSI 14 overbought/oversold reversal.', 
    "Asset & Timeframe: BSE Sensex | 5-Minute Chart | 10 Lots\nIndicator: RSI (Period: 14, OB Level: 70, OS Level: 30)\nEntry Rule: ATM Options\nCE Entry (CE Option SELL - Bullish Signal): On 5-minute candle close when RSI crosses above 30 from below, immediately sell 10 Lots PE at the open price of the next candle. (Maximum 2 CE trades per day).\nPE Entry (PE Option SELL - Bearish Signal): On 5-minute candle close when RSI crosses below 70 from above, immediately sell 10 Lots PE at the open price of the next candle. (Maximum 2 PE trades per day).\nRisk Management: Stop Loss (SL): 100 Points from entry price. Capital Protection: Maximum daily limit is strictly 1 CE Trade and 1 PE Trade to avoid over-trading in sideways markets.\nExit Rule: Target Exit: Complete exit upon achieving 200 Points profit from entry price. Stop Loss Exit: Complete exit upon hitting 100 Points loss from entry price.\nPeriod: Aug 17.08.2026 to Aug 21.08.2026", 
    'ind_dir'
  )
];

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies = [], onLoad, onEdit, onDelete }) => {
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

  const getPillType = (tag) => {
    const types = {
      core_dir: 'orange',
      core_spreads: 'cyan',
      core_ndir: 'purple',
      core_adv: 'pink',
      time_dir: 'green',
      time_ndir: 'purple',
      ind_dir: 'cyan',
      trend: 'green',
      pa: 'orange',
      scalp: 'pink'
    };
    return types[tag] || 'cyan';
  };

  const getSegmentLabel = (tag) => {
    const labels = {
      core_dir: 'CORE DIRECTIONAL',
      core_spreads: 'CORE SPREADS',
      core_ndir: 'CORE NON-DIR',
      core_adv: 'CORE ADVANCED',
      time_dir: 'TIME-BASED DIR',
      time_ndir: 'TIME-BASED NEUTRAL',
      ind_dir: 'INDICATOR STRATEGY',
      trend: 'TREND & MOMENTUM',
      pa: 'PRICE ACTION',
      scalp: 'SCALPING'
    };
    return labels[tag] || 'QUANT SETUP';
  };

  return (
    <div className="fixed inset-0 bg-[#090A0F] z-[9999] p-4 md:p-8 overflow-hidden flex flex-col font-sans select-none">
      
      {/* Subtle Background Grid & Ambient Neon Glowing Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D500F9]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00FFFF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Full-Screen Cyber Neon Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#00FFFF]/20 flex-shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#00FFFF]/20 to-[#D500F9]/20 rounded-2xl border border-[#00FFFF]/50 text-[#00FFFF] shadow-[0_0_25px_rgba(0,255,255,0.4)]">
            <Icons.Strategy />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide">
                QUANT STRATEGY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#D500F9] to-[#FF007F]">HUB</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D500F9]/20 border border-[#D500F9]/50 text-[#D500F9] text-xs font-bold shadow-[0_0_15px_rgba(213,0,249,0.4)]">
                <Icons.Sparkles /> AI-POWERED
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#A0AEC0] mt-1 font-medium">
              Real-time automated execution presets with strict risk parameters & high-probability intraday setups.
            </p>
          </div>
        </div>

        {/* Action Controls & Fullscreen Exit Button */}
        <div className="flex items-center gap-4 self-end md:self-center">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-[#FF007F] bg-[#FF007F]/10 border border-[#FF007F]/40 hover:bg-[#FF007F] hover:text-white hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] transition-all duration-300 cursor-pointer"
          >
            Close Terminal ✕
          </button>
        </div>
      </div>

      {/* Full-Screen Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto mt-6 pr-2 scrollbar-thin scrollbar-thumb-[#00FFFF]/40 scrollbar-track-[#090A0F] relative z-10">
        
        {/* User Saved Custom Strategies Section */}
        {strategies && strategies.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-3 w-3 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]"></span>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
                My Saved Strategies ({strategies.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map(strat => (
                <div 
                  key={strat.id} 
                  className="bg-[#0D0E17]/90 backdrop-blur-xl p-6 rounded-2xl flex flex-col justify-between border border-[#00E676]/40 hover:border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.15)] hover:shadow-[0_0_35px_rgba(0,230,118,0.35)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Top Glowing Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E676] to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-extrabold text-lg text-white group-hover:text-[#00E676] transition-colors line-clamp-1">
                        {strat.name}
                      </h3>
                      <MetadataPill text="USER SAVED" type="green" />
                    </div>

                    <p className="text-xs text-[#A0AEC0] font-mono leading-relaxed bg-[#05060A] p-4 rounded-xl border border-[#00E676]/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] mb-4">
                      <span className="line-clamp-5 text-[#00E676]/90">{strat.prompt || strat.concept || strat.description || strat.text}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#A0AEC0] mb-6 font-semibold">
                      <Icons.Calendar />
                      Created: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#00E676]/20">
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={(e) => handleEditStrategy(e, strat)}
                        className="p-3 rounded-xl text-[#FF9100] bg-[#FF9100]/10 hover:bg-[#FF9100] hover:text-black border border-[#FF9100]/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,145,0,0.2)]"
                        title="Edit Strategy"
                      >
                        <Icons.Edit />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteStrategy(e, strat)}
                        className="p-3 rounded-xl text-[#FF007F] bg-[#FF007F]/10 hover:bg-[#FF007F] hover:text-white border border-[#FF007F]/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.2)]"
                        title="Delete Strategy"
                      >
                        <Icons.Delete />
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={(e) => handleLoadStrategy(e, strat)} 
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#00E676] to-[#00FFFF] text-black text-xs font-black rounded-xl transition-all hover:shadow-[0_0_25px_rgba(0,230,118,0.6)] active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      <Icons.Load />
                      EXECUTE PLAN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center p-16 bg-[#0D0E17]/80 backdrop-blur-md rounded-2xl border border-[#00FFFF]/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] mb-10">
            <div className="animate-spin h-10 w-10 border-4 border-[#00FFFF] border-t-transparent rounded-full mx-auto mb-4 shadow-[0_0_20px_#00FFFF]"></div>
            <p className="text-[#00FFFF] font-extrabold text-sm tracking-widest uppercase">Syncing Cloud Database Strategy Vault...</p>
          </div>
        )}

        {/* Default Master Templates Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-[#00FFFF] animate-pulse shadow-[0_0_10px_#00FFFF]"></span>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
            Standard Algorithmic Strategies ({DEFAULT_STRATEGIES.length})
          </h2>
        </div>

        {/* Master Preset Grid of Animated Neon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {DEFAULT_STRATEGIES.map((strat) => (
            <div 
              key={strat.id} 
              className="bg-[#0D0E17]/90 backdrop-blur-xl p-6 rounded-2xl flex flex-col justify-between border border-[#00FFFF]/30 hover:border-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_35px_rgba(0,255,255,0.35)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Card Terminal Header Accent Dots */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9100]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]"></span>
                </div>
                <MetadataPill text={getSegmentLabel(strat.segmentTag)} type={getPillType(strat.segmentTag)} />
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-lg text-white group-hover:text-[#00FFFF] transition-colors mb-3 line-clamp-1">
                {strat.name}
              </h3>

              {/* Strategy Parameters Display */}
              <p className="flex-1 text-xs text-[#A0AEC0] font-mono leading-relaxed bg-[#05060A] p-4 rounded-xl border border-[#00FFFF]/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] mb-6 whitespace-pre-wrap">
                {strat.prompt}
              </p>

              {/* Load Action Button */}
              <button 
                type="button"
                onClick={(e) => handleLoadStrategy(e, strat)} 
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#D500F9] via-[#FF007F] to-[#D500F9] text-white text-xs font-black rounded-xl transition-all hover:shadow-[0_0_25px_rgba(213,0,249,0.7)] active:scale-95 cursor-pointer uppercase tracking-wider border border-white/20"
              >
                <Icons.Load />
                LOAD TEMPLATE
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default MyStrategiesModal;