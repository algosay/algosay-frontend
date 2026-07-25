import React, { useState } from 'react';

// Bespoke SVG Icons - Pure Premium
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

// Metadata Pill Component
const MetadataPill = ({ text, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600/10 text-blue-400 border border-blue-600/20',
    green: 'bg-green-600/10 text-green-400 border border-green-600/20',
    yellow: 'bg-yellow-600/10 text-yellow-400 border border-yellow-600/20',
    purple: 'bg-purple-600/10 text-purple-400 border border-purple-600/20',
    orange: 'bg-orange-600/10 text-orange-400 border border-orange-600/20'
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${colors[color]} tracking-wide`}>
      {text}
    </span>
  );
};

// Universal Strategy Mapping function for compatibility
const createDefaultObj = (id, name, concept, promptText) => ({
  id,
  name,
  concept,
  description: concept,
  prompt: promptText,
  text: promptText,
  content: promptText,
  strategy: promptText,
  isDefault: true,
  createdAt: { seconds: Math.floor(Date.now() / 1000) }
});

// Default Strategies Data (Exactly 105 Intraday Strategies: Time-Based, Directional & Non-Directional)
const DEFAULT_STRATEGIES = [
  // --- CORE BASICS (1-17) ---
  createDefaultObj('default_1', 'Long Call', 'Directional Bullish - Expecting strong upside.', "I have mapped your NIFTY 50 Long Call strategy. Buy ATM CE at 09:45 (5-min). 40% SL, 100% Target. Exit at 15:15, lot 10, Current Expiry."),
  createDefaultObj('default_2', 'Long Put', 'Directional Bearish - Expecting strong downside.', "I have mapped your NIFTY 50 Long Put strategy. Buy ATM PE at 09:45 (5-min). 40% SL, 100% Target. Exit at 15:15, lot 10, Current Expiry."),
  createDefaultObj('default_3', 'Covered Call (Intraday)', 'Non-Directional/Bullish - Selling calls against futures.', "I have mapped your Covered Call strategy. Buy Future & Sell OTM CE (+100 pts) at 09:45. 25% SL on CE. Exit at 15:15, lot 10, Current Expiry."),
  createDefaultObj('default_4', 'Bull Call Spread', 'Directional Bullish - Debit Spread (Capped Risk).', "I have mapped your Bull Call Spread. Buy ATM CE & Sell OTM CE (+100 pts). Overall SL 20%, Target 50%. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_5', 'Bear Put Spread', 'Directional Bearish - Debit Spread (Capped Risk).', "I have mapped your Bear Put Spread. Buy ATM PE & Sell OTM PE (-100 pts). Overall SL 20%, Target 50%. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_6a', 'Bull Put Spread', 'Directional/Neutral - Income Strategy.', "I have mapped your Bull Put Spread. Sell OTM PE (-50 pts) & Buy Far OTM PE (-150 pts). 25% SL on Sell leg. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_6b', 'Bear Call Spread', 'Directional/Neutral - Income Strategy.', "I have mapped your Bear Call Spread. Sell OTM CE (+50 pts) & Buy Far OTM CE (+150 pts). 25% SL on Sell leg. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_7', 'Long Straddle', 'Directional Volatility - Huge move expected.', "I have mapped your Long Straddle. Buy ATM CE & ATM PE. 30% SL, 150% Target each. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_8', 'Long Strangle', 'Directional Volatility - Cheaper breakout setup.', "I have mapped your Long Strangle. Buy OTM CE & OTM PE. 40% SL, 200% Target each. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_9', 'Iron Condor', 'Non-Directional - Range-bound play.', "I have mapped your Iron Condor. Sell OTM CE/PE, Buy Far OTM CE/PE. 25% SL on sold legs. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_10', 'Iron Butterfly', 'Non-Directional - Pin Risk play.', "I have mapped your Iron Butterfly. Sell ATM CE/PE, Buy OTM CE/PE. 25% SL. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_11', 'Short Straddle', 'Non-Directional - Theta Decay.', "I have mapped your Short Straddle. Sell ATM CE & ATM PE. 30% SL, 80% Target. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_12', 'Short Strangle', 'Non-Directional - Wide Range Decay.', "I have mapped your Short Strangle. Sell OTM CE & OTM PE. 30% SL, 80% Target. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_13', 'Jade Lizard', 'Non-Directional/Bullish - Naked Put + Bear Call.', "I have mapped your Jade Lizard. Sell OTM PE, Sell OTM CE, Buy Far OTM CE. 30% SL on sell legs. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_14', 'Call Ratio Backspread', 'Directional Explosive - Sell 1 ITM, Buy 2 OTM CE.', "I have mapped your Call Ratio Backspread. Sell 1 ITM CE, Buy 2 OTM CE. 30% overall SL. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_15', 'Put Ratio Backspread', 'Directional Explosive - Sell 1 ITM, Buy 2 OTM PE.', "I have mapped your Put Ratio Backspread. Sell 1 ITM PE, Buy 2 OTM PE. 30% overall SL. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_16', 'Front Ratio Spread', 'Directional Mild - Buy 1 ATM, Sell 2 OTM.', "I have mapped your Front Ratio Spread. Buy 1 ATM CE, Sell 2 OTM CE. Target 50% max profit. Exit at 15:15, Current Expiry."),
  createDefaultObj('default_17', 'Long Call Butterfly', 'Directional Targeted - High RR Setup.', "I have mapped your Long Call Butterfly. Buy 1 ITM CE, Sell 2 ATM CE, Buy 1 OTM CE. 20% SL. Exit at 15:15, Current Expiry."),

  // --- TIME-BASED STRATEGIES (18-40) ---
  createDefaultObj('default_18', '9:16 AM Opening Drive - Long', 'Time-Based Directional - First minute momentum.', "I have mapped your 9:16 Opening Drive Long. Buy ATM CE at exactly 09:16. SL is day low. Target 1:2. Exit at 15:15."),
  createDefaultObj('default_19', '9:16 AM Opening Drive - Short', 'Time-Based Directional - First minute crash.', "I have mapped your 9:16 Opening Drive Short. Buy ATM PE at exactly 09:16. SL is day high. Target 1:2. Exit at 15:15."),
  createDefaultObj('default_20', '9:20 AM Short Straddle', 'Time-Based Non-Directional - Morning Theta.', "I have mapped your 9:20 AM Straddle. Executed at 09:20. Sell ATM CE & PE. 25% Combined SL. Exit at 15:15."),
  createDefaultObj('default_21', '9:20 AM Short Strangle', 'Time-Based Non-Directional - Morning Theta.', "I have mapped your 9:20 AM Strangle. Executed at 09:20. Sell OTM CE & PE. 25% Combined SL. Exit at 15:15."),
  createDefaultObj('default_22', '9:30 AM ORB - Bullish', 'Time-Based Directional - 15 Min Breakout.', "I have mapped your 9:30 ORB Bullish. Buy ATM CE when price crosses 15-min high. SL 15-min low. Exit at 15:15."),
  createDefaultObj('default_23', '9:30 AM ORB - Bearish', 'Time-Based Directional - 15 Min Breakdown.', "I have mapped your 9:30 ORB Bearish. Buy ATM PE when price crosses 15-min low. SL 15-min high. Exit at 15:15."),
  createDefaultObj('default_24', '10:00 AM Reversal - Long', 'Time-Based Directional - Fake breakdown recovery.', "I have mapped your 10:00 Reversal Long. Buy ATM CE if price recovers morning low after 10:00. SL 15 pts. Exit at 15:15."),
  createDefaultObj('default_25', '10:00 AM Reversal - Short', 'Time-Based Directional - Fake breakout crash.', "I have mapped your 10:00 Reversal Short. Buy ATM PE if price rejects morning high after 10:00. SL 15 pts. Exit at 15:15."),
  createDefaultObj('default_26', '10:30 AM Iron Condor', 'Time-Based Non-Directional - Mid-day settling.', "I have mapped your 10:30 Iron Condor. Executed when market settles. Sell OTMs, Buy Far OTMs. SL 20%. Exit 15:15."),
  createDefaultObj('default_27', '11:00 AM Theta Eater', 'Time-Based Non-Directional - Lunchtime decay.', "I have mapped your 11:00 Theta Eater. Sell ATM CE & PE. Tight SL of 15% on each leg. Strict exit at 13:30."),
  createDefaultObj('default_28', '12:30 PM European Open - Long', 'Time-Based Directional - Global market push.', "I have mapped your 12:30 Euro Open Long. Buy ATM CE at 12:30 anticipating global push. SL 20%. Exit 15:15."),
  createDefaultObj('default_29', '12:30 PM European Open - Short', 'Time-Based Directional - Global market drag.', "I have mapped your 12:30 Euro Open Short. Buy ATM PE at 12:30 anticipating global drop. SL 20%. Exit 15:15."),
  createDefaultObj('default_30', '1:30 PM Breakout - Call', 'Time-Based Directional - Afternoon trend.', "I have mapped your 1:30 PM Breakout Call. Buy ATM CE if day high breaks after 13:30. SL 20 pts spot. Exit 15:15."),
  createDefaultObj('default_31', '1:30 PM Breakout - Put', 'Time-Based Directional - Afternoon crash.', "I have mapped your 1:30 PM Breakout Put. Buy ATM PE if day low breaks after 13:30. SL 20 pts spot. Exit 15:15."),
  createDefaultObj('default_32', '2:00 PM Gamma Blast - Long', 'Time-Based Directional - Expiry day special.', "I have mapped your 2:00 PM Gamma Blast. Buy ATM CE on 0DTE Expiry at 14:00. SL 50%, Target 200%. Exit 15:15."),
  createDefaultObj('default_33', '2:00 PM Gamma Blast - Short', 'Time-Based Directional - Expiry day special.', "I have mapped your 2:00 PM Gamma Blast. Buy ATM PE on 0DTE Expiry at 14:00. SL 50%, Target 200%. Exit 15:15."),
  createDefaultObj('default_34', '2:30 PM Zero Hero - Call', 'Time-Based Directional - Pure lotto.', "I have mapped your 2:30 PM Zero Hero Call. Buy ₹10-₹15 Premium CE. 100% SL (Zero). Target 300%. Exit 15:15."),
  createDefaultObj('default_35', '2:30 PM Zero Hero - Put', 'Time-Based Directional - Pure lotto.', "I have mapped your 2:30 PM Zero Hero Put. Buy ₹10-₹15 Premium PE. 100% SL (Zero). Target 300%. Exit 15:15."),
  createDefaultObj('default_36', '3:00 PM Momentum Spike - Long', 'Time-Based Directional - Final hour rush.', "I have mapped your 3:00 PM Momentum Long. Buy ATM CE at 15:00 exact. SL 10%, Target 30%. Exit 15:15."),
  createDefaultObj('default_37', '3:00 PM Momentum Spike - Short', 'Time-Based Directional - Final hour rush.', "I have mapped your 3:00 PM Momentum Short. Buy ATM PE at 15:00 exact. SL 10%, Target 30%. Exit 15:15."),
  createDefaultObj('default_38', 'Friday 10:00 AM Premium Short', 'Time-Based Non-Directional - High IV crush.', "I have mapped your Friday Premium Short. Sell Far OTM CE/PE after 10 AM. SL 30%. Exit 15:15."),
  createDefaultObj('default_39', 'Wednesday 1:00 PM Straddle', 'Time-Based Non-Directional - Pre-expiry theta.', "I have mapped your Wed 1 PM Straddle. Sell ATM CE & PE. 20% Combined SL. Captures heavy decay. Exit 15:15."),
  createDefaultObj('default_40', 'Thursday 9:15 AM Strangle', 'Time-Based Non-Directional - Expiry Morning.', "I have mapped your Expiry Day Strangle. Sell OTM CE/PE at 09:15. SL 40% per leg. Exit 15:15."),

  // --- DIRECTIONAL INDICATORS & TRENDS (41-70) ---
  createDefaultObj('default_41', 'VWAP Bounce - Call', 'Directional Trend - Mean reversion long.', "I have mapped your VWAP Bounce Call. Buy ATM CE on 5-min bullish candle at VWAP. SL below VWAP. Exit 15:15."),
  createDefaultObj('default_42', 'VWAP Rejection - Put', 'Directional Trend - Mean reversion short.', "I have mapped your VWAP Rejection Put. Buy ATM PE on 5-min bearish candle at VWAP. SL above VWAP. Exit 15:15."),
  createDefaultObj('default_43', 'EMA 9/15 Bullish Cross', 'Directional Trend - Fast momentum.', "I have mapped your EMA 9/15 Long. Buy ATM CE on 9 EMA crossing above 15 EMA. Trailing SL. Exit 15:15."),
  createDefaultObj('default_44', 'EMA 9/15 Bearish Cross', 'Directional Trend - Fast momentum.', "I have mapped your EMA 9/15 Short. Buy ATM PE on 9 EMA crossing below 15 EMA. Trailing SL. Exit 15:15."),
  createDefaultObj('default_45', 'Supertrend Buy (10,3)', 'Directional Trend - Algorithmic Long.', "I have mapped your Supertrend Long. Buy ATM CE when Supertrend turns green. SL is Supertrend line. Exit 15:15."),
  createDefaultObj('default_46', 'Supertrend Sell (10,3)', 'Directional Trend - Algorithmic Short.', "I have mapped your Supertrend Short. Buy ATM PE when Supertrend turns red. SL is Supertrend line. Exit 15:15."),
  createDefaultObj('default_47', 'RSI Oversold (Below 30) Reversal', 'Directional Mean Reversion - Catching bottom.', "I have mapped your RSI Oversold Reversal. Buy ATM CE when RSI crosses above 30. SL 20% premium. Exit 15:15."),
  createDefaultObj('default_48', 'RSI Overbought (Above 70) Reversal', 'Directional Mean Reversion - Catching top.', "I have mapped your RSI Overbought Reversal. Buy ATM PE when RSI crosses below 70. SL 20% premium. Exit 15:15."),
  createDefaultObj('default_49', 'MACD Zero Line Bullish', 'Directional Trend - Momentum shift up.', "I have mapped your MACD Bullish. Buy ATM CE when MACD crosses above Zero line. SL 25%. Exit 15:15."),
  createDefaultObj('default_50', 'MACD Zero Line Bearish', 'Directional Trend - Momentum shift down.', "I have mapped your MACD Bearish. Buy ATM PE when MACD crosses below Zero line. SL 25%. Exit 15:15."),
  createDefaultObj('default_51', 'Bollinger Band Squeeze - UP', 'Directional Volatility - Breakout Long.', "I have mapped your BB Squeeze Up. Buy ATM CE when price breaks upper band after squeeze. SL Mid-band. Exit 15:15."),
  createDefaultObj('default_52', 'Bollinger Band Squeeze - DOWN', 'Directional Volatility - Breakout Short.', "I have mapped your BB Squeeze Down. Buy ATM PE when price breaks lower band after squeeze. SL Mid-band. Exit 15:15."),
  createDefaultObj('default_53', 'EMA 50/200 Golden Cross Intraday', 'Directional Trend - Major shift Long.', "I have mapped your Intraday Golden Cross. Buy ATM CE on 5-min 50 EMA crossing 200 EMA. SL 30%. Exit 15:15."),
  createDefaultObj('default_54', 'EMA 50/200 Death Cross Intraday', 'Directional Trend - Major shift Short.', "I have mapped your Intraday Death Cross. Buy ATM PE on 5-min 50 EMA crossing below 200 EMA. SL 30%. Exit 15:15."),
  createDefaultObj('default_55', 'Ichimoku Cloud Breakout - Long', 'Directional Trend - Kumo Break.', "I have mapped your Ichimoku Long. Buy ATM CE when price closes above Kumo Cloud. SL bottom of cloud. Exit 15:15."),
  createDefaultObj('default_56', 'Ichimoku Cloud Breakdown - Short', 'Directional Trend - Kumo Break.', "I have mapped your Ichimoku Short. Buy ATM PE when price closes below Kumo Cloud. SL top of cloud. Exit 15:15."),
  createDefaultObj('default_57', 'ADX Trend Strength > 25 Long', 'Directional Trend - Strong Uptrend.', "I have mapped your ADX Long. Buy ATM CE when ADX > 25 and +DI > -DI. Trailing SL. Exit 15:15."),
  createDefaultObj('default_58', 'ADX Trend Strength > 25 Short', 'Directional Trend - Strong Downtrend.', "I have mapped your ADX Short. Buy ATM PE when ADX > 25 and -DI > +DI. Trailing SL. Exit 15:15."),
  createDefaultObj('default_59', 'Parabolic SAR Scalp - Long', 'Directional Scalping - Fast flips.', "I have mapped your PSAR Long. Buy ATM CE when dots flip below price. Tight SL on dots. Exit 15:15."),
  createDefaultObj('default_60', 'Parabolic SAR Scalp - Short', 'Directional Scalping - Fast flips.', "I have mapped your PSAR Short. Buy ATM PE when dots flip above price. Tight SL on dots. Exit 15:15."),
  createDefaultObj('default_61', 'Stochastic RSI Overbought Short', 'Directional - Exhaustion play.', "I have mapped your Stoch RSI Short. Buy ATM PE when Stoch RSI crosses down from 80. SL 20%. Exit 15:15."),
  createDefaultObj('default_62', 'Stochastic RSI Oversold Long', 'Directional - Exhaustion play.', "I have mapped your Stoch RSI Long. Buy ATM CE when Stoch RSI crosses up from 20. SL 20%. Exit 15:15."),
  createDefaultObj('default_63', 'Keltner Channel Breakout Long', 'Directional - High Vol Breakout.', "I have mapped your Keltner Long. Buy ATM CE when price closes above upper Keltner channel. SL middle line. Exit 15:15."),
  createDefaultObj('default_64', 'Keltner Channel Breakout Short', 'Directional - High Vol Breakout.', "I have mapped your Keltner Short. Buy ATM PE when price closes below lower Keltner channel. SL middle line. Exit 15:15."),
  createDefaultObj('default_65', 'Donchian Channel Break Long', 'Directional - 20-period High Break.', "I have mapped your Donchian Long. Buy ATM CE on breaking upper Donchian line (20). Trailing SL. Exit 15:15."),
  createDefaultObj('default_66', 'Donchian Channel Break Short', 'Directional - 20-period Low Break.', "I have mapped your Donchian Short. Buy ATM PE on breaking lower Donchian line (20). Trailing SL. Exit 15:15."),
  createDefaultObj('default_67', 'Volume Weighted MACD Long', 'Directional - Volume backed trend.', "I have mapped your VW-MACD Long. Buy ATM CE on positive cross with high volume. SL 25%. Exit 15:15."),
  createDefaultObj('default_68', 'Volume Weighted MACD Short', 'Directional - Volume backed trend.', "I have mapped your VW-MACD Short. Buy ATM PE on negative cross with high volume. SL 25%. Exit 15:15."),
  createDefaultObj('default_69', 'ATR Trailing Stop Long', 'Directional - Trend riding.', "I have mapped your ATR Long. Buy ATM CE on breakout, trail SL by 2x ATR. Target open. Exit 15:15."),
  createDefaultObj('default_70', 'ATR Trailing Stop Short', 'Directional - Trend riding.', "I have mapped your ATR Short. Buy ATM PE on breakdown, trail SL by 2x ATR. Target open. Exit 15:15."),

  // --- PRICE ACTION & PATTERNS (71-90) ---
  createDefaultObj('default_71', 'Inside Bar Breakout - Long', 'Directional Price Action - Range Expansion.', "I have mapped your Inside Bar Long. Buy ATM CE on breaking Mother Bar high. SL Mother Bar low. Exit 15:15."),
  createDefaultObj('default_72', 'Inside Bar Breakout - Short', 'Directional Price Action - Range Expansion.', "I have mapped your Inside Bar Short. Buy ATM PE on breaking Mother Bar low. SL Mother Bar high. Exit 15:15."),
  createDefaultObj('default_73', 'Gap Fill Bullish', 'Directional Price Action - Morning Gap Down.', "I have mapped your Gap Fill Bullish. Buy ATM CE after gap down & first 5-min green candle. Target PDC. Exit 15:15."),
  createDefaultObj('default_74', 'Gap Fill Bearish', 'Directional Price Action - Morning Gap Up.', "I have mapped your Gap Fill Bearish. Buy ATM PE after gap up & first 5-min red candle. Target PDC. Exit 15:15."),
  createDefaultObj('default_75', 'Double Bottom (W) Breakout', 'Directional Price Action - Reversal.', "I have mapped your Double Bottom Long. Buy ATM CE on W-pattern neckline breakout. SL previous swing low. Exit 15:15."),
  createDefaultObj('default_76', 'Double Top (M) Rejection', 'Directional Price Action - Reversal.', "I have mapped your Double Top Short. Buy ATM PE on M-pattern neckline breakdown. SL previous swing high. Exit 15:15."),
  createDefaultObj('default_77', 'Bull Flag Continuation', 'Directional Price Action - Trend pause.', "I have mapped your Bull Flag Long. Buy ATM CE on flag resistance breakout. SL below flag support. Exit 15:15."),
  createDefaultObj('default_78', 'Bear Flag Continuation', 'Directional Price Action - Trend pause.', "I have mapped your Bear Flag Short. Buy ATM PE on flag support breakdown. SL above flag resistance. Exit 15:15."),
  createDefaultObj('default_79', 'Ascending Triangle Long', 'Directional Price Action - Bullish Build-up.', "I have mapped your Ascending Triangle Long. Buy ATM CE on horizontal resistance break. SL below trendline. Exit 15:15."),
  createDefaultObj('default_80', 'Descending Triangle Short', 'Directional Price Action - Bearish Build-up.', "I have mapped your Descending Triangle Short. Buy ATM PE on horizontal support break. SL above trendline. Exit 15:15."),
  createDefaultObj('default_81', 'Pin Bar at Support - Long', 'Directional Price Action - Rejection.', "I have mapped your Pin Bar Long. Buy ATM CE on Bullish Pin Bar closing at S1/S2. SL below wick. Exit 15:15."),
  createDefaultObj('default_82', 'Pin Bar at Resistance - Short', 'Directional Price Action - Rejection.', "I have mapped your Pin Bar Short. Buy ATM PE on Bearish Pin Bar closing at R1/R2. SL above wick. Exit 15:15."),
  createDefaultObj('default_83', 'Bullish Engulfing Scalp', 'Directional Price Action - Momentum.', "I have mapped your Engulfing Long. Buy ATM CE immediately after 5-min Bullish Engulfing. SL below pattern. Exit 15:15."),
  createDefaultObj('default_84', 'Bearish Engulfing Scalp', 'Directional Price Action - Momentum.', "I have mapped your Engulfing Short. Buy ATM PE immediately after 5-min Bearish Engulfing. SL above pattern. Exit 15:15."),
  createDefaultObj('default_85', 'Fibonacci 0.5/0.618 Golden Bounce', 'Directional Price Action - Pullback.', "I have mapped your Fib Golden Bounce. Buy ATM CE on rejection from 0.618 Fib retracement level. SL 0.786. Exit 15:15."),
  createDefaultObj('default_86', 'Fibonacci 0.5/0.618 Golden Drop', 'Directional Price Action - Pullback.', "I have mapped your Fib Golden Drop. Buy ATM PE on rejection from 0.618 Fib retracement level. SL 0.786. Exit 15:15."),
  createDefaultObj('default_87', 'Previous Day High (PDH) Breakout', 'Directional Price Action - Momentum.', "I have mapped your PDH Breakout. Buy ATM CE when price sustains above PDH for 15 mins. SL PDH. Exit 15:15."),
  createDefaultObj('default_88', 'Previous Day Low (PDL) Breakdown', 'Directional Price Action - Momentum.', "I have mapped your PDL Breakdown. Buy ATM PE when price sustains below PDL for 15 mins. SL PDL. Exit 15:15."),
  createDefaultObj('default_89', 'Central Pivot Range (CPR) Bounce', 'Directional Price Action - Support.', "I have mapped your CPR Bounce Long. Buy ATM CE on bullish candle at Top CPR. SL below Bottom CPR. Exit 15:15."),
  createDefaultObj('default_90', 'Central Pivot Range (CPR) Rejection', 'Directional Price Action - Resistance.', "I have mapped your CPR Rejection Short. Buy ATM PE on bearish candle at Bottom CPR. SL above Top CPR. Exit 15:15."),

  // --- NON-DIRECTIONAL, SCALPING & DATA BASED (91-105) ---
  createDefaultObj('default_91', '1-Min Marubozu Scalp CE', 'Directional - High Frequency Intraday.', "I have mapped your 1-Min Scalp CE. Buy ATM CE on strong 1-min green Marubozu. Strict 10% SL, 15% Target. Exit 15:15."),
  createDefaultObj('default_92', '1-Min Marubozu Scalp PE', 'Directional - High Frequency Intraday.', "I have mapped your 1-Min Scalp PE. Buy ATM PE on strong 1-min red Marubozu. Strict 10% SL, 15% Target. Exit 15:15."),
  createDefaultObj('default_93', 'Call OI Short Covering Spike', 'Directional Data - Sudden CE Spike.', "I have mapped your OI Short Covering. Buy OTM CE when massive Call OI unwinding occurs. SL 30%. Target 100%. Exit 15:15."),
  createDefaultObj('default_94', 'Put OI Long Unwinding Dump', 'Directional Data - Sudden PE Spike.', "I have mapped your OI Long Unwinding. Buy OTM PE when massive Put OI unwinding occurs. SL 30%. Target 100%. Exit 15:15."),
  createDefaultObj('default_95', '0DTE Iron Butterfly Special', 'Non-Directional - Expiry Theta Play.', "I have mapped your 0DTE Iron Butterfly. Sell ATM straddle, Buy OTM wings at 10:30 on Expiry. Hold till 15:15 for maximum decay."),
  createDefaultObj('default_96', 'OTM Credit Spread Scalp - Bullish', 'Non-Directional/Bullish - High Probability.', "I have mapped your Credit Spread Scalp Long. Sell OTM PE / Buy Far OTM PE on support dip. Hold 2 hrs. SL 25%. Exit 15:15."),
  createDefaultObj('default_97', 'OTM Credit Spread Scalp - Bearish', 'Non-Directional/Bearish - High Probability.', "I have mapped your Credit Spread Scalp Short. Sell OTM CE / Buy Far OTM CE on resistance rally. Hold 2 hrs. SL 25%. Exit 15:15."),
  createDefaultObj('default_98', 'Gamma Scalp - Long Straddle Adjustment', 'Non-Directional - Hedged Volatility.', "I have mapped your Gamma Scalp. Buy ATM Straddle. Book profits on 30% moves and re-balance ATM. Pure Intraday. Exit 15:15."),
  createDefaultObj('default_99', 'VIX Drop Premium Eater', 'Non-Directional - Implied Volatility Crash.', "I have mapped your VIX Drop strategy. Sell OTM Strangle when VIX drops > 3% Intraday. SL 30% combined. Exit 15:15."),
  createDefaultObj('default_100', 'VIX Spike Gamma Buyer', 'Directional - Implied Volatility Surge.', "I have mapped your VIX Spike strategy. Buy ATM Straddle when VIX shoots up > 4% Intraday. Captures wide moves. Exit 15:15."),
  createDefaultObj('default_101', 'Volume Profile POC Bounce', 'Directional - Point of Control.', "I have mapped your POC Bounce Long. Buy ATM CE when price bounces from daily Point of Control. SL 15 pts. Exit 15:15."),
  createDefaultObj('default_102', 'Volume Profile POC Rejection', 'Directional - Point of Control.', "I have mapped your POC Rejection Short. Buy ATM PE when price rejects daily Point of Control. SL 15 pts. Exit 15:15."),
  createDefaultObj('default_103', 'Delta Neutral Calendar (Intraday)', 'Non-Directional - Theta diff catch.', "I have mapped your Intraday Calendar. Sell current week ATM, Buy next week ATM. Exit strictly at 15:15 today. Pure theta play."),
  createDefaultObj('default_104', '3-Min ORB Straddle', 'Non-Directional - Very fast decay.', "I have mapped your 3-Min ORB Straddle. Sell ATM CE & PE at exactly 09:18. SL 15% per leg. Extreme morning decay. Exit 15:15."),
  createDefaultObj('default_105', 'End of Day (EOD) Squeeze Break', 'Directional - 2:45 PM move.', "I have mapped your EOD Squeeze. Buy ATM CE or PE breaking out of a 3-hour tight consolidation at 14:45. Target 1:3. Exit 15:15.")
];

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies = [], onLoad, onEdit, onDelete, initialTab = 'my_strategies' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLoadStrategy = (e, strat) => {
    e.stopPropagation();
    if (onLoad) {
      onLoad(strat);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleEditStrategy = (e, strat) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(strat);
    }
  };

  const handleDeleteStrategy = (e, strat) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(strat);
    }
  };

  // Helper for pill colors based on concept
  const getPillColor = (concept) => {
    const lower = concept.toLowerCase();
    if (lower.includes('non-directional') || lower.includes('neutral')) return 'purple';
    if (lower.includes('time-based') || lower.includes('timebased')) return 'orange';
    return 'green'; // Default for Directional
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl w-full max-w-3xl p-7 relative shadow-[0_0_60px_-15px_rgba(30,41,59,0.5)] animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6 pr-12 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155] text-white">
              <Icons.Strategy />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Trading Strategies
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Access your saved plans or use our pre-configured templates.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#334155] transition-all"
          >
            ✕
          </button>
        </div>

        <div className="flex p-1 bg-[#0F172A] rounded-xl border border-[#334155] mb-6 flex-shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('my_strategies')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'my_strategies' 
                ? 'bg-[#1E293B] text-white shadow-md border border-[#334155]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icons.Strategy />
            My Saved Strategies
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('default_strategies')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'default_strategies' 
                ? 'bg-[#1E293B] text-white shadow-md border border-[#334155]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icons.Template />
            Default Templates
          </button>
        </div>
        
        <div className="overflow-y-auto pr-3 scrollbar-premium flex-1">
          
          {activeTab === 'my_strategies' && (
            <>
              {isLoading ? (
                <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Syncing with your database...</p>
                </div>
              ) : !strategies || strategies.length === 0 ? (
                <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
                  <div className="p-4 bg-[#1E293B] rounded-full border border-[#334155] text-gray-600 inline-block mb-4">
                    <Icons.Strategy />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">No Strategies Found</p>
                  <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
                    You haven't saved any configurations yet. Your private collection will appear here once you do.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {strategies.map(strat => (
                    <div 
                      key={strat.id} 
                      className="bg-[#0F172A] p-5 rounded-2xl flex justify-between items-start border border-[#334155] hover:border-blue-600 hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)] transition-all duration-300 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                            {strat.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Icons.Calendar />
                            Saved on: {strat.createdAt ? new Date((strat.createdAt.seconds || strat.createdAt) * 1000).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pr-1">
                        <button 
                          type="button"
                          onClick={(e) => handleEditStrategy(e, strat)}
                          className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-yellow-600/10 hover:border-yellow-600/30 border border-transparent transition-all cursor-pointer"
                          title="Edit Strategy"
                        >
                          <Icons.Edit />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleDeleteStrategy(e, strat)}
                          className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 border border-transparent transition-all cursor-pointer"
                          title="Delete Strategy"
                        >
                          <Icons.Delete />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleLoadStrategy(e, strat)} 
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-extrabold rounded-full transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)] active:scale-95 group-active:scale-95 border-none cursor-pointer"
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
              {DEFAULT_STRATEGIES.map(strat => (
                <div 
                  key={strat.id} 
                  className="bg-[#0F172A] p-5 rounded-2xl flex justify-between items-center border border-[#334155] hover:border-green-500 hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)] transition-all duration-300 group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">
                        {strat.name}
                      </h3>
                      <MetadataPill text="TEMPLATE" color={getPillColor(strat.concept)} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2 font-medium">
                      {strat.concept}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pr-1">
                    <button 
                      type="button"
                      onClick={(e) => handleLoadStrategy(e, strat)} 
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] border border-[#334155] text-white text-xs font-extrabold rounded-full transition-all hover:bg-green-600 hover:border-green-500 hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)] active:scale-95 group-active:scale-95 cursor-pointer"
                    >
                      <Icons.Load />
                      USE TEMPLATE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyStrategiesModal;