import React from 'react';
import { Play } from 'lucide-react'; 

const StrategyTemplates = () => {
  // 💎 50+ Default Strategies Database
  const defaultStrategies = [
    { title: "Long Call Breakout", category: "CORE DIRECTIONAL", desc: "Instrument: NIFTY 50 Options. Timeframe: 5-min candle. Execution: 09:30 AM on breaking previous day high. Action: Buy 10 LOT ATM CE Current Expiry. Target: 40% premium gain. Stoploss: 15% premium loss." },
    { title: "Long Put Breakdown", category: "CORE DIRECTIONAL", desc: "Instrument: BANKNIFTY Options. Timeframe: 15-min chart. Execution: 10:15 AM on breaking first hour low. Action: Buy 10 LOT ATM PE. Target: 60% premium gain. Stoploss: 25% premium loss." },
    { title: "Covered Call (Intraday)", category: "CORE DIRECTIONAL", desc: "Instrument: NIFTY 50. Timeframe: 15-min. Execution: Buy Future 10 LOT & Sell 10 LOT OTM CE (+150 pts) at 09:45 AM. Target: 30% of CE decay + 40 pts in Futures." },
    { title: "Long Straddle Event Play", category: "CORE DIRECTIONAL", desc: "Timeframe: 5-min. Execution: At 09:55 AM (pre-event), Buy 10 LOT ATM CE & Buy 10 LOT ATM PE. Target: 70% combined premium spike. Stoploss: 20% combined premium decay limit." },
    { title: "Long Strangle Gamma Blast", category: "CORE DIRECTIONAL", desc: "Execution: At 13:00 PM (European market open), Buy 10 LOT OTM (+100 pts) CE & Buy 10 LOT OTM (-100 pts) PE. Target: 50% combined target. Stoploss: 15% combined SL." },
    { title: "Bull Call Spread 1:2 RR", category: "CORE SPREADS", desc: "Execution: At 10:00 AM, Buy 10 LOT ATM CE, Sell 10 LOT OTM CE (+100 pts). Target: 60% of max spread profit. Stoploss: 30% of max spread loss. Exit: 15:00 PM." },
    { title: "Bear Put Spread Heavy", category: "CORE SPREADS", desc: "Execution: At 09:45 AM, Buy 10 LOT ATM PE, Sell 10 LOT OTM PE (-200 pts). Target: 70% of max spread profit (approx 80 points net)." },
    { title: "Bull Put Spread (Credit)", category: "CORE SPREADS", desc: "Execution: At 10:15 AM, Sell 10 LOT OTM PE (-100 pts), Buy 10 LOT Far OTM PE (-200 pts) for protection. Target: 80% premium decay collected." },
    { title: "Bear Call Spread (Credit)", category: "CORE SPREADS", desc: "Execution: At 10:30 AM (if rejecting R1), Sell 10 LOT OTM CE (+100 pts), Buy 10 LOT Far OTM CE (+200 pts). Target: 75% decay of net credit." },
    { title: "ITM Debit Call Spread", category: "CORE SPREADS", desc: "Execution: At 09:30 AM, Buy 10 LOT ITM CE (-100 pts), Sell 10 LOT ATM CE. Target: 50 points net strategy gain. Stoploss: 20 points net SL." },
    { title: "Safe Short Straddle", category: "CORE NON-DIR", desc: "Execution: At 09:20 AM, Sell 10 LOT ATM CE & Sell 10 LOT ATM PE. Target: 40% combined premium decay. Stoploss: 25% individual leg stoploss." },
    { title: "Wide Range Short Strangle", category: "CORE NON-DIR", desc: "Execution: At 09:30 AM, Sell 10 LOT OTM CE (Delta 20) & Sell 10 LOT OTM PE (Delta 20). Target: 60% decay of total premium. Stoploss: 30% SL." },
    { title: "Iron Condor (Risk Defined)", category: "CORE NON-DIR", desc: "Execution: At 10:00 AM, Sell OTM CE (+150), Buy CE (+250), Sell OTM PE (-150), Buy PE (-250). Target: 50% of max credit received." },
    { title: "Iron Butterfly (Pin Risk)", category: "CORE NON-DIR", desc: "Execution: At 09:45 AM, Sell ATM CE & PE, Buy OTM CE (+200) & OTM PE (-200). Target: 40% decay on short legs. Stoploss: 20% fixed loss." },
    { title: "Jade Lizard (Upward Bias)", category: "CORE NON-DIR", desc: "Execution: At 10:30 AM, Sell OTM PE (-100 pts), Sell OTM CE (+100 pts), Buy OTM CE (+150 pts). Target: 60% of total credit received." },
    { title: "Call Ratio Backspread", category: "CORE ADVANCED", desc: "Execution: At 10:00 AM, Sell 10 LOT ITM CE, Buy 20 LOT OTM CE. Target: 120 points explosive upside gain. Stoploss: 30 points if it hovers in the loss valley." },
    { title: "Put Ratio Backspread", category: "CORE ADVANCED", desc: "Execution: At 11:00 AM, Sell 10 LOT ITM PE, Buy 20 LOT OTM PE. Target: 150 points downside profit. Stoploss: 40 points in the trap zone." },
    { title: "Front Ratio Spread", category: "CORE ADVANCED", desc: "Execution: At 10:30 AM, Buy 10 LOT ATM CE, Sell 20 LOT OTM CE (+100 pts). Target: Max profit at short strike (approx 45 pts)." },
    { title: "Long Call Butterfly", category: "CORE ADVANCED", desc: "Execution: At 12:00 PM, Buy ITM CE (-100), Sell 2x ATM CE, Buy OTM CE (+100). Target: 80% of max reward near ATM strike." },
    { title: "Long Put Butterfly", category: "CORE ADVANCED", desc: "Execution: At 12:00 PM, Buy ITM PE (+100), Sell 2x ATM PE, Buy OTM PE (-100). Target: 75% max reward. Stoploss: 25% max loss." },
    { title: "9:16 AM Opening Drive Long", category: "TIME-BASED DIR", desc: "Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM CE. Target: Fast 30 points scalp. Stoploss: 15 points (tight SL)." },
    { title: "9:16 AM Opening Dump Short", category: "TIME-BASED DIR", desc: "Timeframe: 1-min chart. Execution: Exactly at 09:16:00 AM, Buy 10 LOT ATM PE. Target: 40 points quick momentum fall. Stoploss: 20 points." },
    { title: "9:30 AM ORB Bullish", category: "TIME-BASED DIR", desc: "Execution: If 09:30 candle closes above opening 15-m high, Buy 10 LOT ATM CE. Target: 60 points. Stoploss: Low of the 09:15-09:30 candle." },
    { title: "9:30 AM ORB Bearish", category: "TIME-BASED DIR", desc: "Execution: If 09:30 candle closes below opening 15-m low, Buy 10 LOT ATM PE. Target: 75 points. Stoploss: High of the first 15-min candle." },
    { title: "1:30 PM European Breakout", category: "TIME-BASED DIR", desc: "Execution: At 13:30 PM, Buy CE if trading near day high, Buy PE if near day low. Target: 50 points momentum burst. Stoploss: 25 points." },
    { title: "9:20 AM Golden Straddle", category: "TIME-BASED NEUTRAL", desc: "Execution: Exactly at 09:20 AM, Sell ATM CE & ATM PE. Target: 60% of total premium. Stoploss: 25% individual leg SL." },
    { title: "9:30 AM Premium Strangle", category: "TIME-BASED NEUTRAL", desc: "Execution: At 09:30 AM, Sell OTM CE (+1% of spot) & Sell OTM PE (-1% of spot). Target: 70% premium decay. Stoploss: 30% individual leg SL." },
    { title: "10:30 AM Iron Condor (Low IV)", category: "TIME-BASED NEUTRAL", desc: "Execution: At 10:30 AM, Sell 15-delta CE/PE, Buy 5-delta CE/PE. Target: 50% max credit collected. Stoploss: 20% of credit received." },
    { title: "11:30 AM Lunch Theta Eater", category: "TIME-BASED NEUTRAL", desc: "Execution: At 11:30 AM, Sell ATM Straddle. Target: 30% decay (quick capture). Strict Time Exit: 13:30 PM." },
    { title: "2:30 PM Expiry Zero Hero Sell", category: "TIME-BASED NEUTRAL", desc: "Execution: At 14:30 PM on Expiry, Sell ATM CE & PE (Straddle). Target: 90% decay (holding to zero). Mandatory Exit: 15:15 PM." },
    { title: "VWAP Bounce Call (1:2 RR)", category: "INDICATORS", desc: "Execution: Buy ATM CE when price tests VWAP from above and closes green. Target: 40 points. Stoploss: 20 points (below VWAP line)." },
    { title: "VWAP Rejection Put (1:2.5 RR)", category: "INDICATORS", desc: "Execution: Buy ATM PE when price bounces to VWAP from below and forms red candle. Target: 50 points. Stoploss: 20 points." },
    { title: "RSI Extreme Reversal (<25)", category: "INDICATORS", desc: "Execution: Buy ATM CE when RSI drops below 25 and crosses back above 30. Target: 45 points gain. Stoploss: 15 points tight SL." },
    { title: "RSI Overbought Short (>80)", category: "INDICATORS", desc: "Execution: Buy ATM PE when RSI crosses below 75 from 80+. Target: 60 points target. Stoploss: 25 points stoploss." },
    { title: "MACD Zero Line Burst", category: "INDICATORS", desc: "Execution: Buy ATM CE when MACD histogram crosses above zero powerfully. Target: 50 points gain. Stoploss: 25 points." },
    { title: "EMA 9/15 Bullish Ride", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE when 9 EMA crosses above 15 EMA. Target: Open Target (Trail 9 EMA). Stoploss: 20 points." },
    { title: "EMA 9/15 Bearish Ride", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM PE when 9 EMA crosses below 15 EMA. Target: Open Target (Trail 15 EMA). Stoploss: 25 points." },
    { title: "Supertrend (10,3) Rider", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE when Supertrend turns green. Target: 80 points. Stoploss: Supertrend line value (dynamic SL)." },
    { title: "Supertrend (10,3) Crusher", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM PE when Supertrend turns red. Target: 100 points. Stoploss: Supertrend line value." },
    { title: "BB Squeeze Breakout", category: "TREND & MOMENTUM", desc: "Execution: Buy ATM CE/PE on candle close outside narrowed Bollinger Bands. Target: 60 points momentum gain. Stoploss: 20 points." },
    { title: "Inside Bar Master Breakout", category: "PRICE ACTION", desc: "Execution: Buy ATM CE/PE on breaking the mother bar high/low. Target: 1:3 RR (Approx 60 pts). Stoploss: Below/Above the inside bar." },
    { title: "Pin Bar Sniper Reversal", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on bullish Pin Bar (long lower wick) close at S1/S2 support. Target: 50 points. Stoploss: 15 points." },
    { title: "Double Bottom (W) Breakout", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on W-pattern neckline breakout close. Target: 70 points. Stoploss: 25 points (below right leg)." },
    { title: "Bull Flag Continuation", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on flag resistance trendline breakout close. Target: Measured move of the pole. Stoploss: 25 points." },
    { title: "CPR Golden Bounce", category: "PRICE ACTION", desc: "Execution: Buy ATM CE on bullish engulfing candle at CPR floor. Target: 60 points (R1). Stoploss: 20 points (below bottom CPR)." },
    { title: "1-Min Marubozu CE Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE immediately on strong 1-min solid green candle close. Target: 15 points premium spike. Stoploss: 7 points strict SL." },
    { title: "1-Min Marubozu PE Scalp", category: "SCALPING", desc: "Execution: Buy ATM PE immediately on strong 1-min solid red candle close. Target: 18 points premium drop. Stoploss: 8 points strict SL." },
    { title: "3-Min Engulfing Long Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE immediately after 3-min Bullish Engulfing close. Target: 25 points. Stoploss: 10 points." },
    { title: "3-Min Engulfing Short Scalp", category: "SCALPING", desc: "Execution: Buy ATM PE immediately after 3-min Bearish Engulfing close. Target: 30 points. Stoploss: 12 points." },
    { title: "3-Min ORB Lightning Scalp", category: "SCALPING", desc: "Execution: Buy ATM CE/PE immediately on crossing first 3-min candle's high/low. Target: 20 points. Stoploss: 10 points." }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-24 mb-12 relative z-20 border-t border-white/5 pt-20">
      <div className="text-center mb-16 relative z-10">
        <h3 className="text-[#9D4EDD] text-[13px] font-black uppercase tracking-[0.2em] mb-4">No Coding. No Blocks. Just Type.</h3>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          50+ Ready-to-Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0088FF]">Strategy Templates</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          Instantly deploy from our vast library of pre-built options and equity strategies, or use them as a base to create your own unique logic.
        </p>
      </div>

      {/* Scrollable Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar p-2">
        {defaultStrategies.map((strategy, idx) => (
          <div key={idx} className="bg-[#0A0C14]/80 border border-white/10 hover:border-[#00E5FF]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] group flex flex-col justify-between h-full">
             <div>
               <div className="flex justify-between items-start mb-3">
                 <h4 className="text-white font-bold text-lg leading-tight group-hover:text-[#00E5FF] transition-colors">{strategy.title}</h4>
                 <span className="text-[9px] font-black tracking-wider text-[#9D4EDD] bg-[#9D4EDD]/10 px-2 py-1 rounded border border-[#9D4EDD]/20 whitespace-nowrap ml-3">
                   {strategy.category}
                 </span>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                 {strategy.desc}
               </p>
             </div>
             <button className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-widest group-hover:bg-[#00E5FF]/10 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/30 transition-all flex justify-center items-center gap-2 mt-auto">
               <Play size={14} /> USE TEMPLATE
             </button>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04060F] to-transparent pointer-events-none z-10"></div>

      {/* Custom CSS for Scrollbar inside this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.5);
        }
      `}} />
    </div>
  );
};

export default StrategyTemplates;