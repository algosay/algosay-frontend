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

// 10 Segments x 5 Strategies = 50 Highly Detailed Intraday Pure Strategies
const DEFAULT_STRATEGIES = [
  // --- TAB 1: CORE DIRECTIONAL (5) ---
  createDefaultObj(
    'cd_1', 
    'Long Call Breakout', 
    'Directional Bullish - Catching high momentum upwards.', 
    "I have mapped your NIFTY 50 Long Call strategy. Instrument: NIFTY 50 Options. Timeframe: 5-min candle. Execution: 09:30 AM on breaking previous day high. Action: Buy 10 LOT ATM CE Current Expiry. Target: 40% premium gain (approx 50 pts). Stoploss: 15% premium loss (Tight SL). Exit: Trail SL by 10% after 20% gain, or mandatory exit at 15:10 PM.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_2', 
    'Long Put Breakdown', 
    'Directional Bearish - Catching sharp downward moves.', 
    "I have mapped your BANKNIFTY Long Put strategy. Instrument: BANKNIFTY Options. Timeframe: 15-min chart. Execution: 10:15 AM on breaking first hour low. Action: Buy 10 LOT ATM PE Current Expiry. Target: 60% premium gain (approx 120 pts). Stoploss: 25% premium loss (approx 50 pts). Exit: 15:05 PM strict intraday square-off.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_3', 
    'Covered Call (Intraday)', 
    'Non-Directional/Bullish - Capitalizing on mild bullish drift.', 
    "I have mapped your Intraday Covered Call strategy. Instrument: NIFTY 50. Timeframe: 15-min. Execution: Buy Future 10 LOT & Sell 10 LOT OTM CE (+150 pts) at 09:45 AM. Target: 30% of CE decay + 40 pts in Futures. Stoploss: 25 points combined loss. Exit: 15:15 PM.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_4', 
    'Long Straddle Event Play', 
    'Directional Breakout - Expecting massive explosive move (RBI/Fed).', 
    "I have mapped your Long Straddle strategy. Timeframe: 5-min. Execution: At 09:55 AM (pre-event), Buy 10 LOT ATM CE & Buy 10 LOT ATM PE. Target: 70% combined premium spike. Stoploss: 20% combined premium decay limit (to avoid IV crush). Exit: 14:30 PM.", 
    'core_dir'
  ),
  createDefaultObj(
    'cd_5', 
    'Long Strangle Gamma Blast', 
    'Directional Breakout - Cheaper entry for trending days.', 
    "I have mapped your Long Strangle strategy. Timeframe: 5-min chart. Execution: At 13:00 PM (European market open), Buy 10 LOT OTM (+100 pts) CE & Buy 10 LOT OTM (-100 pts) PE. Target: 50% combined target. Stoploss: 15% combined SL. Exit: 15:15 PM.", 
    'core_dir'
  ),

  // --- TAB 2: CORE SPREADS (5) ---
  createDefaultObj(
    'cs_1', 
    'Bull Call Spread 1:2 RR', 
    'Directional Bullish - Capped Risk with high probability.', 
    "I have mapped your Bull Call Spread. Instrument: NIFTY 50. Execution: At 10:00 AM, 1. Buy 10 LOT ATM CE, 2. Sell 10 LOT OTM CE (+100 pts). Target: 60% of max spread profit (approx 35 points net). Stoploss: 30% of max spread loss (approx 15 points net). Exit: 15:00 PM.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_2', 
    'Bear Put Spread Heavy', 
    'Directional Bearish - High RR debit spread for crash.', 
    "I have mapped your Bear Put Spread. Instrument: BANKNIFTY. Execution: At 09:45 AM, 1. Buy 10 LOT ATM PE, 2. Sell 10 LOT OTM PE (-200 pts). Target: 70% of max spread profit (approx 80 points net). Stoploss: 25% max spread loss. Exit: 15:10 PM.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_3', 
    'Bull Put Spread (Credit)', 
    'Directional/Neutral - Income Generation on sideways/up days.', 
    "I have mapped your Bull Put Spread. Timeframe: 15-min. Execution: At 10:15 AM, 1. Sell 10 LOT OTM PE (-100 pts), 2. Buy 10 LOT Far OTM PE (-200 pts) for protection. Target: 80% premium decay collected. Stoploss: Premium spikes by 50% of credit received. Exit: 15:15 PM.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_4', 
    'Bear Call Spread (Credit)', 
    'Directional/Neutral - Defending a strong resistance.', 
    "I have mapped your Bear Call Spread. Timeframe: 15-min. Execution: At 10:30 AM (if rejecting R1), 1. Sell 10 LOT OTM CE (+100 pts), 2. Buy 10 LOT Far OTM CE (+200 pts). Target: 75% decay of net credit. Stoploss: 40% hit on net credit collected. Exit: 15:15 PM.", 
    'core_spreads'
  ),
  createDefaultObj(
    'cs_5', 
    'ITM Debit Call Spread', 
    'Deep Directional Bullish - Synthetic future play.', 
    "I have mapped your ITM Debit Call Spread. Execution: At 09:30 AM, 1. Buy 10 LOT ITM CE (-100 pts), 2. Sell 10 LOT ATM CE. Target: 50 points net strategy gain. Stoploss: 20 points net SL. Exit: Trail by 10 points or exit at 15:15 PM.", 
    'core_spreads'
  ),

  // --- TAB 3: CORE NON-DIRECTIONAL (5) ---
  createDefaultObj(
    'cnd_1', 
    'Safe Short Straddle', 
    'Non-Directional - Pure Intraday Theta Decay with strict legs.', 
    "I have mapped your Short Straddle. Execution: At 09:20 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE. Target: 40% combined premium decay. Stoploss: 25% individual leg stoploss (SL hit on one side leaves the other running). Exit: 15:10 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_2', 
    'Wide Range Short Strangle', 
    'Non-Directional - High win-rate selling out-of-money.', 
    "I have mapped your Short Strangle. Execution: At 09:30 AM, Sell 10 LOT OTM CE (Delta 20) & Sell 10 LOT OTM PE (Delta 20). Target: 60% decay of total premium. Stoploss: 30% SL on individual legs. Exit: 15:15 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_3', 
    'Iron Condor (Risk Defined)', 
    'Non-Directional - Range-bound play with hedged wings.', 
    "I have mapped your Iron Condor. Execution: At 10:00 AM, Sell OTM CE (+150), Buy CE (+250), Sell OTM PE (-150), Buy PE (-250). Target: 50% of max credit received. Stoploss: 30% loss of total premium collected. Exit: 15:00 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_4', 
    'Iron Butterfly (Pin Risk)', 
    'Non-Directional - Aggressive decay play.', 
    "I have mapped your Iron Butterfly. Execution: At 09:45 AM, Sell ATM CE & PE, Buy OTM CE (+200) & OTM PE (-200). Target: 40% decay on short legs. Stoploss: 20% fixed loss on total strategy premium. Exit: 15:10 PM.", 
    'core_ndir'
  ),
  createDefaultObj(
    'cnd_5', 
    'Jade Lizard (Upward Bias)', 
    'Non-Directional/Bullish - Collecting premium with no upside risk.', 
    "I have mapped your Jade Lizard strategy. Execution: At 10:30 AM, Sell OTM PE (-100 pts), Sell OTM CE (+100 pts), Buy OTM CE (+150 pts). Target: 60% of total credit received. Stoploss: 25% total SL if market crashes down. Exit: 15:15 PM.", 
    'core_ndir'
  ),

  // --- TAB 4: CORE ADVANCED (RATIO/FLY) (5) ---
  createDefaultObj(
    'ca_1', 
    'Call Ratio Backspread', 
    'Directional Explosive - Free trade if market falls, massive profit if flies.', 
    "I have mapped your Call Ratio Backspread. Execution: At 10:00 AM, Sell 10 LOT ITM CE, Buy 20 LOT OTM CE. Target: 120 points explosive upside gain. Stoploss: 30 points if it hovers in the loss valley. Exit: 15:10 PM.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_2', 
    'Put Ratio Backspread', 
    'Directional Explosive - Zero upside risk, massive downside reward.', 
    "I have mapped your Put Ratio Backspread. Execution: At 11:00 AM, Sell 10 LOT ITM PE, Buy 20 LOT OTM PE. Target: 150 points downside profit. Stoploss: 40 points in the trap zone. Exit: 15:15 PM.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_3', 
    'Front Ratio Spread', 
    'Directional Mild - Best for slow creeping trends.', 
    "I have mapped your Front Ratio Spread. Execution: At 10:30 AM, Buy 10 LOT ATM CE, Sell 20 LOT OTM CE (+100 pts). Target: Max profit at short strike (approx 45 pts). Stoploss: 15 pts overall spread loss. Exit: 15:00 PM.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_4', 
    'Long Call Butterfly', 
    'Directional Targeted - Extremely High 1:4 RR Setup.', 
    "I have mapped your Long Call Butterfly. Execution: At 12:00 PM, Buy ITM CE (-100), Sell 2x ATM CE, Buy OTM CE (+100). Target: 80% of max reward near ATM strike. Stoploss: 20% max loss limit. Exit: 15:15 PM.", 
    'core_adv'
  ),
  createDefaultObj(
    'ca_5', 
    'Long Put Butterfly', 
    'Directional Targeted - Pinning support zones.', 
    "I have mapped your Long Put Butterfly. Execution: At 12:00 PM, Buy ITM PE (+100), Sell 2x ATM PE, Buy OTM PE (-100). Target: 75% max reward. Stoploss: 25% max loss. Exit: 15:15 PM.", 
    'core_adv'
  ),

  // --- TAB 5: TIME-BASED DIRECTIONAL (5) ---
  createDefaultObj(
    'tb_1', 
    '9:16 AM Opening Drive Long', 
    'Time-Based Directional - Catching extreme pre-market sentiment.', 
    "I have mapped your 9:16 Opening Drive. Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM CE. Target: Fast 30 points scalp. Stoploss: 15 points (tight SL). Exit: Mandatory time exit at 09:25 AM if target not met.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_2', 
    '9:16 AM Opening Dump Short', 
    'Time-Based Directional - Catching gap-up profit booking.', 
    "I have mapped your 9:16 Dump Short. Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM PE. Target: 40 points quick momentum fall. Stoploss: 20 points. Exit: Maximum hold time 15 minutes (09:31 AM).", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_3', 
    '9:30 AM ORB Bullish', 
    'Time-Based Directional - Institutional buying zone.', 
    "I have mapped your 9:30 AM ORB Long. Timeframe: 15-min. Execution: If 09:30 candle closes above opening 15-m high, Buy 10 LOT ATM CE. Target: 60 points. Stoploss: Low of the 09:15-09:30 candle (approx 30 pts). Exit: 15:00 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_4', 
    '9:30 AM ORB Bearish', 
    'Time-Based Directional - Institutional selling zone.', 
    "I have mapped your 9:30 AM ORB Short. Timeframe: 15-min. Execution: If 09:30 candle closes below opening 15-m low, Buy 10 LOT ATM PE. Target: 75 points. Stoploss: High of the first 15-min candle. Exit: 15:00 PM.", 
    'time_dir'
  ),
  createDefaultObj(
    'tb_5', 
    '1:30 PM European Breakout', 
    'Time-Based Directional - Second half explosive trend.', 
    "I have mapped your 1:30 PM Breakout. Execution: At 13:30 PM, Buy CE if trading near day high, Buy PE if near day low. Target: 50 points momentum burst. Stoploss: 25 points. Trail: 10 points step. Exit: 15:15 PM.", 
    'time_dir'
  ),

  // --- TAB 6: TIME-BASED NON-DIRECTIONAL (5) ---
  createDefaultObj(
    'tbn_1', 
    '9:20 AM Golden Straddle', 
    'Time-Based Neutral - The classic morning theta crush.', 
    "I have mapped your 9:20 AM Straddle. Execution: Exactly at 09:20 AM, Sell ATM CE & ATM PE. Target: 60% of total premium. Stoploss: 25% individual leg SL (Move SL to cost for remaining leg if one hits). Exit: 15:10 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_2', 
    '9:30 AM Premium Strangle', 
    'Time-Based Neutral - Letting IV settle before selling.', 
    "I have mapped your 9:30 AM Strangle. Execution: At 09:30 AM, Sell OTM CE (+1% of spot) & Sell OTM PE (-1% of spot). Target: 70% premium decay. Stoploss: 30% individual leg SL. Exit: 15:15 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_3', 
    '10:30 AM Iron Condor (Low IV)', 
    'Time-Based Neutral - Mid-day sideways grind.', 
    "I have mapped your 10:30 AM Iron Condor. Execution: At 10:30 AM, Sell 15-delta CE/PE, Buy 5-delta CE/PE. Target: 50% max credit collected. Stoploss: 20% of credit received. Exit: 15:15 PM.", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_4', 
    '11:30 AM Lunch Theta Eater', 
    'Time-Based Neutral - Capitalizing on low volume hours.', 
    "I have mapped your 11:30 AM Theta Eater. Execution: At 11:30 AM, Sell ATM Straddle. Target: 30% decay (quick capture). Stoploss: 15% combined SL. Strict Time Exit: 13:30 PM (Before Euro markets open).", 
    'time_ndir'
  ),
  createDefaultObj(
    'tbn_5', 
    '2:30 PM Expiry Zero Hero Sell', 
    'Time-Based Neutral - Late day expiry crush.', 
    "I have mapped your 2:30 PM Expiry Pin. Execution: At 14:30 PM on Expiry, Sell ATM CE & PE (Straddle). Target: 90% decay (holding to zero). Stoploss: 40% combined spike. Mandatory Exit: 15:15 PM.", 
    'time_ndir'
  ),

  // --- TAB 7: DIRECTIONAL INDICATORS (5) ---
  createDefaultObj(
    'di_1', 
    'VWAP Bounce Call (1:2 RR)', 
    'Indicator - Institutional average support.', 
    "I have mapped your VWAP Bounce Long. Timeframe: 5-min. Execution: Buy ATM CE when price tests VWAP from above and closes green. Target: 40 points. Stoploss: 20 points (below VWAP line). Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_2', 
    'VWAP Rejection Put (1:2.5 RR)', 
    'Indicator - Selling into VWAP resistance.', 
    "I have mapped your VWAP Rejection Short. Timeframe: 5-min. Execution: Buy ATM PE when price bounces to VWAP from below and forms red candle. Target: 50 points. Stoploss: 20 points. Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_3', 
    'RSI Extreme Reversal (Below 25)', 
    'Indicator - Catching the exhausted bottom.', 
    "I have mapped your RSI Reversal. Timeframe: 5-min. Execution: Buy ATM CE when RSI drops below 25 and crosses back above 30. Target: 45 points gain. Stoploss: 15 points tight SL. Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_4', 
    'RSI Overbought Short (Above 80)', 
    'Indicator - Fading the euphoric top.', 
    "I have mapped your RSI Overbought Reversal. Timeframe: 5-min. Execution: Buy ATM PE when RSI crosses below 75 from 80+. Target: 60 points target. Stoploss: 25 points stoploss. Exit: 15:15 PM.", 
    'ind_dir'
  ),
  createDefaultObj(
    'di_5', 
    'MACD Zero Line Burst', 
    'Indicator - Strong momentum shift validation.', 
    "I have mapped your MACD Bullish Crossover. Timeframe: 5-min. Execution: Buy ATM CE when MACD histogram crosses above zero powerfully. Target: 50 points gain. Stoploss: 25 points. Trail SL: 15 pts. Exit: 15:15 PM.", 
    'ind_dir'
  ),

  // --- TAB 8: TREND & MOMENTUM (5) ---
  createDefaultObj(
    'tm_1', 
    'EMA 9/15 Bullish Ride', 
    'Trend - Fast momentum upward trailing.', 
    "I have mapped your EMA 9/15 Long. Timeframe: 5-min. Execution: Buy ATM CE when 9 EMA crosses above 15 EMA. Target: Open Target (Trail 9 EMA). Stoploss: 20 points or candle close below 15 EMA. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_2', 
    'EMA 9/15 Bearish Ride', 
    'Trend - Fast momentum downward trailing.', 
    "I have mapped your EMA 9/15 Short. Timeframe: 5-min. Execution: Buy ATM PE when 9 EMA crosses below 15 EMA. Target: Open Target (Trail 15 EMA). Stoploss: 25 points. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_3', 
    'Supertrend (10,3) Rider', 
    'Trend - Algorithmic Long trailing.', 
    "I have mapped your Supertrend Long. Timeframe: 10-min. Execution: Buy ATM CE when Supertrend turns green. Target: 80 points. Stoploss: Supertrend line value (dynamic SL). Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_4', 
    'Supertrend (10,3) Crusher', 
    'Trend - Algorithmic Short trailing.', 
    "I have mapped your Supertrend Short. Timeframe: 10-min. Execution: Buy ATM PE when Supertrend turns red. Target: 100 points. Stoploss: Supertrend line value. Exit: 15:15 PM.", 
    'trend'
  ),
  createDefaultObj(
    'tm_5', 
    'Bollinger Band Squeeze Breakout', 
    'Trend - Volatility expansion blast.', 
    "I have mapped your BB Squeeze Breakout. Timeframe: 5-min. Execution: Buy ATM CE/PE on candle close outside narrowed Bollinger Bands. Target: 60 points momentum gain. Stoploss: 20 points (Middle BB line). Exit: 15:15 PM.", 
    'trend'
  ),

  // --- TAB 9: PRICE ACTION (5) ---
  createDefaultObj(
    'pa_1', 
    'Inside Bar Master Breakout', 
    'Price Action - Volatility contraction leading to expansion.', 
    "I have mapped your Inside Bar Breakout. Timeframe: 15-min chart. Execution: Buy ATM CE/PE on breaking the mother bar high/low. Target: 1:3 RR (Approx 60 pts). Stoploss: Below/Above the inside bar (Approx 20 pts). Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_2', 
    'Pin Bar Sniper Reversal', 
    'Price Action - Smart money rejection at support.', 
    "I have mapped your Pin Bar Reversal. Timeframe: 5-min. Execution: Buy ATM CE on bullish Pin Bar (long lower wick) close at S1/S2 support. Target: 50 points (Next resistance). Stoploss: 15 points (Just below wick). Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_3', 
    'Double Bottom (W) Breakout', 
    'Price Action - Structural shift to uptrend.', 
    "I have mapped your Double Bottom Long. Timeframe: 5-min. Execution: Buy ATM CE on W-pattern neckline breakout close. Target: 70 points. Stoploss: 25 points (below right leg). Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_4', 
    'Bull Flag Continuation', 
    'Price Action - Resting phase before next rally.', 
    "I have mapped your Bull Flag Long. Timeframe: 5-min. Execution: Buy ATM CE on flag resistance trendline breakout close. Target: Measured move of the pole (approx 80 points). Stoploss: 25 points (below flag base). Exit: 15:15 PM.", 
    'pa'
  ),
  createDefaultObj(
    'pa_5', 
    'CPR (Central Pivot) Golden Bounce', 
    'Price Action - Institutional Floor Support.', 
    "I have mapped your CPR Bounce. Timeframe: 5-min. Execution: Buy ATM CE on bullish engulfing candle at CPR floor. Target: 60 points (R1). Stoploss: 20 points (below bottom CPR). Exit: 15:15 PM.", 
    'pa'
  ),

  // --- TAB 10: INTRADAY SCALPING (5) ---
  createDefaultObj(
    'sc_1', 
    '1-Min Marubozu Quick CE Scalp', 
    'Scalping - High Frequency Bullish.', 
    "I have mapped your 1-Min Marubozu Scalp CE. Timeframe: 1-min. Execution: Buy ATM CE immediately on strong 1-min solid green candle close. Target: 15 points premium spike. Stoploss: 7 points strict SL. Exit: Max holding time 5 minutes.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_2', 
    '1-Min Marubozu Quick PE Scalp', 
    'Scalping - High Frequency Bearish.', 
    "I have mapped your 1-Min Marubozu Scalp PE. Timeframe: 1-min. Execution: Buy ATM PE immediately on strong 1-min solid red candle close. Target: 18 points premium drop. Stoploss: 8 points strict SL. Exit: Max holding time 5 minutes.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_3', 
    '3-Min Engulfing Long Scalp', 
    'Scalping - Reversal Trap Scalp.', 
    "I have mapped your Engulfing Long Scalp. Timeframe: 3-min. Execution: Buy ATM CE immediately after 3-min Bullish Engulfing close. Target: 25 points. Stoploss: 10 points. Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_4', 
    '3-Min Engulfing Short Scalp', 
    'Scalping - Reversal Trap Scalp.', 
    "I have mapped your Engulfing Short Scalp. Timeframe: 3-min. Execution: Buy ATM PE immediately after 3-min Bearish Engulfing close. Target: 30 points. Stoploss: 12 points. Exit: 15:15 PM.", 
    'scalp'
  ),
  createDefaultObj(
    'sc_5', 
    '3-Min ORB Lightning Scalp', 
    'Scalping - Opening Momentum Rush.', 
    "I have mapped your 3-Min ORB Quick Scalp. Timeframe: 3-min. Execution: Buy ATM CE/PE immediately on crossing first 3-min candle's high/low. Target: 20 points. Stoploss: 10 points. Exit: Close trade by 09:30 AM max.", 
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
                Explore 50 Intraday Pure backtestable setups categorized across 10 distinct market segments.
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
                    
                    <p className="flex-1 text-xs text-gray-300 font-medium leading-relaxed bg-[#04040a] p-3.5 rounded-2xl border border-orange-500/20 mb-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
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