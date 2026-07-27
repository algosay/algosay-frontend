import React, { useState } from 'react';

// Bespoke SVG Icons - Pure Premium Neon Styling
const Icons = {
  Strategy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Template: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Metadata Pill Component - Neon Glow Badges
const MetadataPill = ({ text, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-950/60 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    green: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    yellow: 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    purple: 'bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    orange: 'bg-orange-950/60 text-orange-400 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
    red: 'bg-rose-950/60 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
  };
  return (
    <span className={`px-3 py-1 text-[11px] font-black rounded-full ${colors[color] || colors.blue} tracking-wider uppercase`}>
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

// 10 Segments x 5 Strategies = 50 Highly Detailed Intraday Pure Strategies
const DEFAULT_STRATEGIES = [
  // --- TAB 1: CORE DIRECTIONAL (5) ---
  createDefaultObj(
    'cd_1', 
    'Long Call', 
    'Directional Bullish - Expecting strong upside.', 
    "I have mapped your NIFTY 50 Long Call strategy. Instrument: NIFTY 50 Futures/Options. Timeframe: 5-min candle close. Execution: 09:45 AM candle close exactly. Action: Buy 10 LOT ATM CE Current Expiry. Target: 1000 points (or 100% option premium). Stoploss: 500 points (or 40% option premium). Exit: 15:15 PM mandatory auto-squareoff.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_2', 
    'Long Put', 
    'Directional Bearish - Expecting strong downside.', 
    "I have mapped your NIFTY 50 Long Put strategy. Instrument: NIFTY 50. Timeframe: 5-min chart. Execution: 09:45 AM candle close. Action: Buy 10 LOT ATM PE Current Expiry. Target: 1000 points premium gain. Stoploss: 500 points premium loss. Exit: 15:15 PM strict intraday exit.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_3', 
    'Covered Call (Intraday)', 
    'Non-Directional/Bullish - Selling calls against futures.', 
    "I have mapped your Covered Call strategy. Instrument: NIFTY 50. Timeframe: 5-min. Execution: Buy Future 10 LOT at 10:00 AM & Sell 10 LOT OTM CE (+100 pts) at 10:00 AM. Target: 1000 points overall strategy gain. Stoploss: 500 points overall loss. Exit: 15:15 PM, Current Expiry.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_4', 
    'Long Straddle', 
    'Directional Breakout - Huge move expected.', 
    "I have mapped your NIFTY Long Straddle strategy. Timeframe: 5-min. Execution: At 09:45 AM candle close exactly, Buy 10 LOT ATM CE & Buy 10 LOT ATM PE Current Expiry. Target: 1000 points combined target. Stoploss: 500 points combined stoploss. Exit: 15:15 PM intraday exit.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_5', 
    'Long Strangle', 
    'Directional Breakout - Cheaper breakout setup.', 
    "I have mapped your Long Strangle strategy. Timeframe: 5-min chart. Execution: At 09:45 AM, Buy 10 LOT OTM (+100 pts) CE & Buy 10 LOT OTM (-100 pts) PE Current Expiry. Target: 1000 points combined target. Stoploss: 500 points combined SL. Exit: 15:15 PM.", 
    'core_dir'
  ),

  // --- TAB 2: CORE SPREADS (5) ---
  createDefaultObj(
    'cs_1', 
    'Bull Call Spread', 
    'Directional Bullish - Debit Spread (Capped Risk).', 
    "I have mapped your Bull Call Spread. Instrument: NIFTY 50 (5-min timeframe). Execution: At 09:45 AM candle close, 1. Buy 10 LOT ATM CE, 2. Sell 10 LOT OTM CE (+100 pts). Target: 1000 points gain on spread. Stoploss: 500 points loss on spread. Exit: 15:15 PM, Current Expiry.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_2', 
    'Bear Put Spread', 
    'Directional Bearish - Debit Spread (Capped Risk).', 
    "I have mapped your Bear Put Spread. Instrument: NIFTY 50 (5-min). Execution: At 09:45 AM candle close, 1. Buy 10 LOT ATM PE, 2. Sell 10 LOT OTM PE (-100 pts). Target: 1000 points spread target. Stoploss: 500 points spread SL. Exit: 15:15 PM, Current Expiry.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_3', 
    'Bull Put Spread', 
    'Directional/Neutral - Income Strategy.', 
    "I have mapped your Bull Put Spread. Timeframe: 5-min. Execution: At 10:00 AM, 1. Sell 10 LOT OTM PE (-50 pts), 2. Buy 10 LOT Far OTM PE (-150 pts). Target: 1000 points total credit decay. Stoploss: 500 points max loss limit. Exit: 15:15 PM, Current Expiry.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_4', 
    'Bear Call Spread', 
    'Directional/Neutral - Income Strategy.', 
    "I have mapped your Bear Call Spread. Timeframe: 5-min. Execution: At 10:00 AM, 1. Sell 10 LOT OTM CE (+50 pts), 2. Buy 10 LOT Far OTM CE (+150 pts). Target: 1000 points premium decay. Stoploss: 500 points stoploss limit. Exit: 15:15 PM, Current Expiry.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_5', 
    'ITM Debit Call Spread', 
    'Deep Directional Bullish.', 
    "I have mapped your ITM Debit Call Spread. Timeframe: 5-min. Execution: At 09:45 AM, 1. Buy 10 LOT ITM CE (-100 pts), 2. Sell 10 LOT ATM CE. Target: 1000 points strategy gain. Stoploss: 500 points combined SL. Exit: 15:15 PM, Current Expiry.", 
    'core_spreads'
  ),

  // --- TAB 3: CORE NON-DIRECTIONAL (5) ---
  createDefaultObj(
    'cnd_1', 
    'Short Straddle', 
    'Non-Directional - Intraday Theta Decay.', 
    "I have mapped your Short Straddle. Timeframe: 5-min. Execution: At 09:20 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE Current Expiry. Target: 1000 points combined decay. Stoploss: 500 points combined loss. Mandatory Exit: 15:15 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_2', 
    'Short Strangle', 
    'Non-Directional - Wide Range Decay.', 
    "I have mapped your Short Strangle. Timeframe: 5-min. Execution: At 09:20 AM, Sell 10 LOT OTM CE (+100 pts) & Sell 10 LOT OTM PE (-100 pts). Target: 1000 points strategy decay. Stoploss: 500 points combined SL. Exit: 15:15 PM, Current Expiry.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_3', 
    'Iron Condor', 
    'Non-Directional - Range-bound play.', 
    "I have mapped your Iron Condor strategy. Timeframe: 5-min. Execution: At 10:00 AM, 1. Sell 10 LOT OTM CE (+100 pts), 2. Buy 10 LOT OTM CE (+200 pts), 3. Sell 10 LOT OTM PE (-100 pts), 4. Buy 10 LOT OTM PE (-200 pts). Target: 1000 pts. Stoploss: 500 pts. Exit: 15:15 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_4', 
    'Iron Butterfly', 
    'Non-Directional - Pin Risk play.', 
    "I have mapped your Iron Butterfly strategy. Timeframe: 5-min. Execution: At 09:45 AM, 1. Sell 10 LOT ATM CE, 2. Sell 10 LOT ATM PE, 3. Buy 10 LOT OTM CE (+150 pts), 4. Buy 10 LOT OTM PE (-150 pts). Target: 1000 pts. Stoploss: 500 pts. Exit: 15:15 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_5', 
    'Jade Lizard', 
    'Non-Directional/Bullish - Intraday Variation.', 
    "I have mapped your Jade Lizard strategy. Timeframe: 5-min. Execution: At 10:00 AM, 1. Sell 10 LOT OTM PE (-100 pts), 2. Sell 10 LOT OTM CE (+100 pts), 3. Buy 10 LOT OTM CE (+150 pts). Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM, Current Expiry.", 
    'core_ndir'
  ),

  // --- TAB 4: CORE ADVANCED (RATIO/FLY) (5) ---
  createDefaultObj(
    'ca_1', 
    'Call Ratio Backspread', 
    'Directional Explosive - Zero downside risk.', 
    "I have mapped your Call Ratio Backspread. Timeframe: NIFTY 5-min. Execution: At 09:45 AM candle close exactly, 1. Sell 10 LOT ITM CE (-50 pts), 2. Buy 20 LOT OTM CE (+50 pts), 3. Buy 10 LOT OTM CE (+100 pts). Target: 1000 points upside gain. Stoploss: 500 points combined SL. Exit: 15:15 PM, Current Expiry.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_2', 
    'Put Ratio Backspread', 
    'Directional Explosive - Zero upside risk.', 
    "I have mapped your Put Ratio Backspread. Timeframe: NIFTY 5-min. Execution: At 09:45 AM candle close, 1. Sell 10 LOT ITM PE (+50 pts), 2. Buy 20 LOT OTM PE (-50 pts). Target: 1000 points downside profit. Stoploss: 500 points combined SL. Exit: 15:15 PM, Current Expiry.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_3', 
    'Front Ratio Spread', 
    'Directional Mild - Income focused.', 
    "I have mapped your Front Ratio Spread. Timeframe: 5-min. Execution: At 10:00 AM, 1. Buy 10 LOT ATM CE, 2. Sell 20 LOT OTM CE (+100 pts). Target: 1000 points decay profit. Stoploss: 500 points spread SL. Exit: 15:15 PM, Current Expiry.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_4', 
    'Long Call Butterfly', 
    'Directional Targeted - High RR Setup.', 
    "I have mapped your Long Call Butterfly. Timeframe: 5-min. Execution: At 09:45 AM, 1. Buy 10 LOT ITM CE (-100 pts), 2. Sell 20 LOT ATM CE, 3. Buy 10 LOT OTM CE (+100 pts). Target: 1000 points max reward. Stoploss: 500 points max loss. Exit: 15:15 PM, Current Expiry.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_5', 
    'Long Put Butterfly', 
    'Directional Targeted - Downside play.', 
    "I have mapped your Long Put Butterfly. Timeframe: 5-min. Execution: At 09:45 AM, 1. Buy 10 LOT ITM PE (+100 pts), 2. Sell 20 LOT ATM PE, 3. Buy 10 LOT OTM PE (-100 pts). Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM, Current Expiry.", 
    'core_adv'
  ),

  // --- TAB 5: TIME-BASED DIRECTIONAL (5) ---
  createDefaultObj(
    'tb_1', 
    '9:16 AM Opening Drive - Long', 
    'Time-Based Directional - First minute momentum.', 
    "I have mapped your 9:16 Opening Drive Long strategy. Timeframe: 1-min chart. Execution: Exactly at 09:16 AM, Buy NIFTY Future 10 LOT (or Buy 10 LOT ATM CE). Target: 1000 points gain. Stoploss: 500 points (or 1-min candle low). Mandatory Exit: 15:15 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_2', 
    '9:16 AM Opening Drive - Short', 
    'Time-Based Directional - First minute crash.', 
    "I have mapped your 9:16 Opening Drive Short strategy. Timeframe: 1-min chart. Execution: Exactly at 09:16 AM, Sell NIFTY Future 10 LOT (or Buy 10 LOT ATM PE). Target: 1000 points gain. Stoploss: 500 points (or 1-min candle high). Mandatory Exit: 15:15 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_3', 
    '9:30 AM ORB - Bullish', 
    'Time-Based Directional - 15 Min Breakout.', 
    "I have mapped your 9:30 AM ORB Bullish strategy. Timeframe: 15-min chart. Execution: At 09:30 AM candle close high breakout, Buy Future 10 LOT at 09:30 AM. Target: 1000 points. Stoploss: 500 points. Mandatory Exit: 15:15 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_4', 
    '9:30 AM ORB - Bearish', 
    'Time-Based Directional - 15 Min Breakdown.', 
    "I have mapped your 9:30 AM ORB Bearish strategy. Timeframe: 15-min chart. Execution: At 09:30 AM candle close low breakdown, Sell Future 10 LOT at 09:30 AM. Target: 1000 points target. Stoploss: 500 points SL. Exit: 15:15 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_5', 
    '1:30 PM Breakout Continuation', 
    'Time-Based Directional - Second half trend.', 
    "I have mapped your 1:30 PM Breakout strategy. Timeframe: 5-min chart. Execution: At 13:30 PM candle close, Buy Future 10 LOT (or 10 LOT ATM CE/PE on day high/low break). Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'time_dir'
  ),

  // --- TAB 6: TIME-BASED NON-DIRECTIONAL (5) ---
  createDefaultObj(
    'tbn_1', 
    '9:20 AM Short Straddle', 
    'Time-Based Neutral - Morning Theta.', 
    "I have mapped your 9:20 AM Short Straddle. Timeframe: 1-min/5-min. Execution: Exactly at 09:20 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE Current Expiry. Target: 1000 points theta profit. Stoploss: 500 points overall strategy SL. Exit: 15:15 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_2', 
    '9:20 AM Short Strangle', 
    'Time-Based Neutral - Morning Theta.', 
    "I have mapped your 9:20 AM Short Strangle. Timeframe: 1-min/5-min. Execution: Exactly at 09:20 AM, Sell 10 LOT OTM CE (+100 pts) & Sell 10 LOT OTM PE (-100 pts). Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM, Current Expiry.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_3', 
    '10:30 AM Iron Condor', 
    'Time-Based Neutral - Mid-day settling.', 
    "I have mapped your 10:30 AM Iron Condor. Timeframe: 5-min. Execution: Executed at 10:30 AM. Sell 10 LOT OTM CE/PE (+100/-100), Buy 10 LOT Far OTM CE/PE (+200/-200). Target: 1000 points decay. Stoploss: 500 points SL. Exit: 15:15 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_4', 
    '11:30 AM Theta Eater', 
    'Time-Based Neutral - Lunchtime decay.', 
    "I have mapped your 11:30 AM Theta Eater. Timeframe: 5-min. Execution: Executed at 11:30 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE. Target: 1000 points decay gain. Stoploss: 500 points total SL. Strict Exit: 13:30 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_5', 
    '2:30 PM Expiry Pin (0DTE)', 
    'Time-Based Neutral - Late day decay.', 
    "I have mapped your 2:30 PM Expiry Pin strategy. Timeframe: 5-min. Execution: Executed at 14:30 PM on Expiry day, Sell 10 LOT ATM Iron Butterfly. Target: 1000 points theta decay. Stoploss: 500 points total loss. Mandatory Exit: 15:15 PM.", 
    'time_ndir'
  ),

  // --- TAB 7: DIRECTIONAL INDICATORS (5) ---
  createDefaultObj(
    'di_1', 
    'VWAP Bounce - Call', 
    'Indicator - Mean reversion long.', 
    "I have mapped your VWAP Bounce Call strategy. Timeframe: NIFTY 5-min. Execution: Buy Future 10 LOT (or Buy 10 LOT ATM CE) on bullish candle close at VWAP. Target: 1000 points. Stoploss: 500 points. Mandatory Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_2', 
    'VWAP Rejection - Put', 
    'Indicator - Mean reversion short.', 
    "I have mapped your VWAP Rejection Put strategy. Timeframe: NIFTY 5-min. Execution: Sell Future 10 LOT (or Buy 10 LOT ATM PE) on bearish candle close at VWAP. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_3', 
    'RSI Oversold (Below 30) Reversal', 
    'Indicator - Catching bottom.', 
    "I have mapped your RSI Oversold Reversal. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 10:00 AM when RSI crosses above 30. Target: 1000 points gain. Stoploss: 500 points SL. Exit: 15:15 PM, Current Expiry.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_4', 
    'RSI Overbought (Above 70) Reversal', 
    'Indicator - Catching top.', 
    "I have mapped your RSI Overbought Reversal. Timeframe: 5-min chart. Execution: Sell Future 10 LOT at 11:00 AM when RSI crosses below 70. Target: 1000 points target. Stoploss: 500 points stoploss. Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_5', 
    'MACD Zero Line Crossover Long', 
    'Indicator - Momentum shift up.', 
    "I have mapped your MACD Bullish Crossover. Timeframe: 5-min. Execution: Buy 10 LOT ATM CE when MACD line crosses above Zero line. Target: 1000 points gain. Stoploss: 500 points loss limit. Exit: 15:15 PM.", 
    'ind_dir'
  ),

  // --- TAB 8: TREND & MOMENTUM (5) ---
  createDefaultObj(
    'tm_1', 
    'EMA 9/15 Bullish Cross', 
    'Trend - Fast momentum up.', 
    "I have mapped your EMA 9/15 Long strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 09:45 AM when 9 EMA crosses above 15 EMA. Target: 1000 points profit. Stoploss: 500 points loss. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_2', 
    'EMA 9/15 Bearish Cross', 
    'Trend - Fast momentum down.', 
    "I have mapped your EMA 9/15 Short strategy. Timeframe: 5-min chart. Execution: Sell Future 10 LOT at 11:00 AM when 9 EMA crosses below 15 EMA. Target: 1000 points profit. Stoploss: 500 points loss. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_3', 
    'Supertrend Buy (10,3)', 
    'Trend - Algorithmic Long.', 
    "I have mapped your Supertrend Long strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT (or Buy 10 LOT ATM CE) when Supertrend turns green. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_4', 
    'Supertrend Sell (10,3)', 
    'Trend - Algorithmic Short.', 
    "I have mapped your Supertrend Short strategy. Timeframe: 5-min chart. Execution: Sell Future 10 LOT (or Buy 10 LOT ATM PE) when Supertrend turns red. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_5', 
    'Bollinger Band Squeeze Breakout', 
    'Trend - Volatility expansion.', 
    "I have mapped your BB Squeeze Breakout strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT on breaking upper/lower band after squeeze close. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'trend'
  ),

  // --- TAB 9: PRICE ACTION (5) ---
  createDefaultObj(
    'pa_1', 
    'Inside Bar Breakout', 
    'Price Action - Range Expansion.', 
    "I have mapped your Inside Bar Breakout strategy. Timeframe: 15-min chart. Execution: Buy Future 10 LOT on breaking mother bar high/low. Target: 1000 points. Stoploss: 500 points. Mandatory Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_2', 
    'Pin Bar Reversal at Support', 
    'Price Action - Rejection.', 
    "I have mapped your Pin Bar Reversal strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 09:45 AM on bullish Pin Bar close at key support. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_3', 
    'Double Bottom (W) Breakout', 
    'Price Action - Structure Shift.', 
    "I have mapped your Double Bottom Long strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 10:30 AM on W-pattern neckline breakout close. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_4', 
    'Bull Flag Continuation', 
    'Price Action - Trend pause.', 
    "I have mapped your Bull Flag Long strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 11:00 AM on flag resistance breakout close. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_5', 
    'CPR (Central Pivot) Bounce', 
    'Price Action - Floor Support.', 
    "I have mapped your CPR Bounce strategy. Timeframe: 5-min chart. Execution: Buy Future 10 LOT at 09:45 AM on bullish reversal candle at CPR floor. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'pa'
  ),

  // --- TAB 10: INTRADAY SCALPING (5) ---
  createDefaultObj(
    'sc_1', 
    '1-Min Marubozu Scalp CE', 
    'Scalping - High Frequency Bullish.', 
    "I have mapped your 1-Min Marubozu Scalp CE. Timeframe: 1-min chart. Execution: Buy 10 LOT ATM CE on strong 1-min green Marubozu candle close. Target: 1000 points (or fast 15% scalp). Stoploss: 500 points (or 10% SL). Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_2', 
    '1-Min Marubozu Scalp PE', 
    'Scalping - High Frequency Bearish.', 
    "I have mapped your 1-Min Marubozu Scalp PE. Timeframe: 1-min chart. Execution: Buy 10 LOT ATM PE on strong 1-min red Marubozu candle close. Target: 1000 points. Stoploss: 500 points. Mandatory Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_3', 
    'Engulfing Candlestick Scalp Long', 
    'Scalping - Reversal Scalp.', 
    "I have mapped your Engulfing Long Scalp. Timeframe: 3-min chart. Execution: Buy 10 LOT ATM CE immediately after 3-min Bullish Engulfing close. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_4', 
    'Engulfing Candlestick Scalp Short', 
    'Scalping - Reversal Scalp.', 
    "I have mapped your Engulfing Short Scalp. Timeframe: 3-min chart. Execution: Buy 10 LOT ATM PE immediately after 3-min Bearish Engulfing close. Target: 1000 points. Stoploss: 500 points. Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_5', 
    '3-Min ORB Quick Scalp', 
    'Scalping - Opening Momentum.', 
    "I have mapped your 3-Min ORB Quick Scalp. Timeframe: 3-min chart. Execution: Buy 10 LOT ATM CE/PE on crossing first 3-min high/low at 09:18 AM. Target: 1000 points. Stoploss: 500 points. Fast Exit: 15:15 PM.", 
    'scalp'
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
      core_dir: 'green',
      core_spreads: 'blue',
      core_ndir: 'purple',
      core_adv: 'orange',
      time_dir: 'green',
      time_ndir: 'purple',
      ind_dir: 'blue',
      trend: 'green',
      pa: 'yellow',
      scalp: 'red'
    };
    return colors[tag] || 'blue';
  };

  // Filter default strategies based on 10 segments
  const filteredTemplates = DEFAULT_STRATEGIES.filter(strat => {
    if (segmentFilter === 'all') return true;
    return strat.segmentTag === segmentFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999] p-4 transition-all duration-300">
      
      {/* Sleek Dark Neon Box Container */}
      <div className="bg-[#05050a] border border-blue-500/20 rounded-3xl w-full max-w-5xl p-7 relative shadow-[0_0_50px_rgba(0,100,255,0.15)] animate-fade-in-up flex flex-col max-h-[90vh] mt-10">
        
        {/* Header - Neon Title */}
        <div className="flex justify-between items-center mb-5 pr-12 flex-shrink-0 border-b border-[#1e1e30] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0a0a14] rounded-2xl border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Icons.Strategy />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">
                  Trading Strategies & Segments
                </span>
              </h2>
              <p className="text-xs text-cyan-400/70 mt-1 font-semibold">
                Explore 50 Intraday Pure backtestable setups categorized across 10 distinct market segments.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a1a28] hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Tabs - Glowing Neon Buttons */}
        <div className="flex p-1.5 bg-[#0a0a14] rounded-xl border border-[#1e1e30] mb-5 flex-shrink-0 gap-2">
          <button 
            type="button"
            onClick={() => setActiveTab('my_strategies')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'my_strategies' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400' 
                : 'text-gray-400 hover:text-white hover:bg-[#121222]'
            }`}
          >
            <Icons.Strategy />
            My Saved Strategies
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('default_strategies')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'default_strategies' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400' 
                : 'text-gray-400 hover:text-white hover:bg-[#121222]'
            }`}
          >
            <Icons.Template />
            Default Templates (10 Segments)
          </button>
        </div>

        {/* 10 Sub-Segments (Only visible under Default Templates) */}
        {activeTab === 'default_strategies' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin scrollbar-thumb-blue-600 flex-shrink-0">
            {[
              { id: 'all', label: 'All (50)' },
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
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  segmentFilter === seg.id
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.8)] font-bold'
                    : 'bg-[#0c0c16] text-gray-400 border border-[#1e1e30] hover:border-cyan-500/50 hover:text-white'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Content Area */}
        <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-600/40 flex-1">
          
          {activeTab === 'my_strategies' && (
            <>
              {isLoading ? (
                <div className="text-center p-12 bg-[#0c0c16] rounded-2xl border border-[#1e1e30]">
                  <div className="animate-spin h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
                  <p className="text-cyan-400/80 font-bold">Syncing with your database...</p>
                </div>
              ) : !strategies || strategies.length === 0 ? (
                <div className="text-center p-12 bg-[#0c0c16] rounded-2xl border border-[#1e1e30]">
                  <div className="p-4 bg-[#121222] rounded-full border border-blue-500/30 text-cyan-400 inline-block mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Icons.Strategy />
                  </div>
                  <p className="text-gray-300 font-bold text-lg">No Strategies Found</p>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                    You haven't saved any configurations yet. Your private collection will appear here once you do.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {strategies.map(strat => (
                    <div 
                      key={strat.id} 
                      className="bg-[#0c0c16] p-5 rounded-2xl flex justify-between items-start border border-[#1e1e30] hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 group"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-300 transition-colors">
                            {strat.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed bg-[#05050a] p-3 rounded-xl border border-[#1a1a2e]">
                          {strat.prompt || strat.concept || strat.description || strat.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-cyan-500/70 mt-3 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Icons.Calendar />
                            Saved on: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={(e) => handleEditStrategy(e, strat)}
                          className="p-2.5 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                          title="Edit Strategy"
                        >
                          <Icons.Edit />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleDeleteStrategy(e, strat)}
                          className="p-2.5 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                          title="Delete Strategy"
                        >
                          <Icons.Delete />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleLoadStrategy(e, strat)} 
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black rounded-full transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 cursor-pointer uppercase tracking-wider"
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
            <div className="space-y-4">
              {filteredTemplates.length === 0 ? (
                <div className="text-center p-12 bg-[#0c0c16] rounded-2xl border border-[#1e1e30]">
                  <p className="text-gray-400 font-bold">No strategies found in this segment.</p>
                </div>
              ) : (
                filteredTemplates.map(strat => (
                  <div 
                    key={strat.id} 
                    className="bg-[#0c0c16] p-5 rounded-2xl flex justify-between items-start border border-[#1e1e30] hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-lg text-white group-hover:text-emerald-400 transition-colors">
                          {strat.name}
                        </h3>
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
                      
                      {/* Rich Detailed Strategy Prompt Text */}
                      <p className="text-xs text-gray-300 mt-3 font-medium leading-relaxed bg-[#05050a] p-3 rounded-xl border border-[#1e1e30]">
                        {strat.prompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={(e) => handleLoadStrategy(e, strat)} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a14] border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-black rounded-full transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] active:scale-95 cursor-pointer uppercase tracking-wider"
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