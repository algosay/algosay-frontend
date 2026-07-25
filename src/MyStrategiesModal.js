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
    orange: 'bg-orange-600/10 text-orange-400 border border-orange-600/20',
    red: 'bg-red-600/10 text-red-400 border border-red-600/20'
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${colors[color] || colors.blue} tracking-wide`}>
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

// 10 Segments x 5 Strategies = 50 Intraday Pure Strategies (No VIX/Volume/Gamma/Next Week)
const DEFAULT_STRATEGIES = [
  // --- TAB 1: CORE DIRECTIONAL (5) ---
  createDefaultObj('cd_1', 'Long Call', 'Directional Bullish - Expecting strong upside.', "I have mapped your NIFTY 50 Long Call strategy. Buy ATM CE at 09:45 (5-min). 40% SL, 100% Target. Exit at 15:15, Current Expiry.", 'core_dir'),
  createDefaultObj('cd_2', 'Long Put', 'Directional Bearish - Expecting strong downside.', "I have mapped your NIFTY 50 Long Put strategy. Buy ATM PE at 09:45 (5-min). 40% SL, 100% Target. Exit at 15:15, Current Expiry.", 'core_dir'),
  createDefaultObj('cd_3', 'Covered Call (Intraday)', 'Non-Directional/Bullish - Selling calls against futures.', "I have mapped your Covered Call strategy. Buy Future & Sell OTM CE (+100 pts) at 09:45. 25% SL on CE. Exit at 15:15, Current Expiry.", 'core_dir'),
  createDefaultObj('cd_4', 'Long Straddle', 'Directional Breakout - Huge move expected.', "I have mapped your Long Straddle. Buy ATM CE & ATM PE. 30% SL, 150% Target each. Exit at 15:15, Current Expiry.", 'core_dir'),
  createDefaultObj('cd_5', 'Long Strangle', 'Directional Breakout - Cheaper breakout setup.', "I have mapped your Long Strangle. Buy OTM CE & OTM PE. 40% SL, 200% Target each. Exit at 15:15, Current Expiry.", 'core_dir'),

  // --- TAB 2: CORE SPREADS (5) ---
  createDefaultObj('cs_1', 'Bull Call Spread', 'Directional Bullish - Debit Spread (Capped Risk).', "I have mapped your Bull Call Spread. Buy ATM CE & Sell OTM CE (+100 pts). Overall SL 20%, Target 50%. Exit at 15:15, Current Expiry.", 'core_spreads'),
  createDefaultObj('cs_2', 'Bear Put Spread', 'Directional Bearish - Debit Spread (Capped Risk).', "I have mapped your Bear Put Spread. Buy ATM PE & Sell OTM PE (-100 pts). Overall SL 20%, Target 50%. Exit at 15:15, Current Expiry.", 'core_spreads'),
  createDefaultObj('cs_3', 'Bull Put Spread', 'Directional/Neutral - Income Strategy.', "I have mapped your Bull Put Spread. Sell OTM PE (-50 pts) & Buy Far OTM PE (-150 pts). 25% SL on Sell leg. Exit at 15:15, Current Expiry.", 'core_spreads'),
  createDefaultObj('cs_4', 'Bear Call Spread', 'Directional/Neutral - Income Strategy.', "I have mapped your Bear Call Spread. Sell OTM CE (+50 pts) & Buy Far OTM CE (+150 pts). 25% SL on Sell leg. Exit at 15:15, Current Expiry.", 'core_spreads'),
  createDefaultObj('cs_5', 'ITM Debit Call Spread', 'Deep Directional Bullish.', "I have mapped your ITM Debit Call Spread. Buy ITM CE & Sell ATM CE. 20% combined SL. High probability setup. Exit at 15:15, Current Expiry.", 'core_spreads'),

  // --- TAB 3: CORE NON-DIRECTIONAL (5) ---
  createDefaultObj('cnd_1', 'Short Straddle', 'Non-Directional - Intraday Theta Decay.', "I have mapped your Short Straddle. Sell ATM CE & ATM PE. 30% SL, 80% Target. Exit at 15:15, Current Expiry.", 'core_ndir'),
  createDefaultObj('cnd_2', 'Short Strangle', 'Non-Directional - Wide Range Decay.', "I have mapped your Short Strangle. Sell OTM CE & OTM PE. 30% SL, 80% Target. Exit at 15:15, Current Expiry.", 'core_ndir'),
  createDefaultObj('cnd_3', 'Iron Condor', 'Non-Directional - Range-bound play.', "I have mapped your Iron Condor. Sell OTM CE/PE, Buy Far OTM CE/PE. 25% SL on sold legs. Exit at 15:15, Current Expiry.", 'core_ndir'),
  createDefaultObj('cnd_4', 'Iron Butterfly', 'Non-Directional - Pin Risk play.', "I have mapped your Iron Butterfly. Sell ATM CE/PE, Buy OTM CE/PE. 25% SL. Exit at 15:15, Current Expiry.", 'core_ndir'),
  createDefaultObj('cnd_5', 'Jade Lizard', 'Non-Directional/Bullish - Intraday Variation.', "I have mapped your Jade Lizard. Sell OTM PE, Sell OTM CE, Buy Far OTM CE. 30% SL on sell legs. Exit at 15:15, Current Expiry.", 'core_ndir'),

  // --- TAB 4: CORE ADVANCED (RATIO/FLY) (5) ---
  createDefaultObj('ca_1', 'Call Ratio Backspread', 'Directional Explosive - Zero downside risk.', "I have mapped your Call Ratio Backspread. Sell 1 ITM CE, Buy 2 OTM CE. 30% overall SL. Exit at 15:15, Current Expiry.", 'core_adv'),
  createDefaultObj('ca_2', 'Put Ratio Backspread', 'Directional Explosive - Zero upside risk.', "I have mapped your Put Ratio Backspread. Sell 1 ITM PE, Buy 2 OTM PE. 30% overall SL. Exit at 15:15, Current Expiry.", 'core_adv'),
  createDefaultObj('ca_3', 'Front Ratio Spread', 'Directional Mild - Income focused.', "I have mapped your Front Ratio Spread. Buy 1 ATM CE, Sell 2 OTM CE. Target 50% max profit. Exit at 15:15, Current Expiry.", 'core_adv'),
  createDefaultObj('ca_4', 'Long Call Butterfly', 'Directional Targeted - High RR Setup.', "I have mapped your Long Call Butterfly. Buy 1 ITM CE, Sell 2 ATM CE, Buy 1 OTM CE. 20% SL. Exit at 15:15, Current Expiry.", 'core_adv'),
  createDefaultObj('ca_5', 'Long Put Butterfly', 'Directional Targeted - Downside play.', "I have mapped your Long Put Butterfly. Buy 1 ITM PE, Sell 2 ATM PE, Buy 1 OTM PE. 20% SL. Exit at 15:15, Current Expiry.", 'core_adv'),

  // --- TAB 5: TIME-BASED DIRECTIONAL (5) ---
  createDefaultObj('tb_1', '9:16 AM Opening Drive - Long', 'Time-Based Directional - First minute momentum.', "I have mapped your 9:16 Opening Drive Long. Buy ATM CE at exactly 09:16. SL is day low. Target 1:2. Exit at 15:15.", 'time_dir'),
  createDefaultObj('tb_2', '9:16 AM Opening Drive - Short', 'Time-Based Directional - First minute crash.', "I have mapped your 9:16 Opening Drive Short. Buy ATM PE at exactly 09:16. SL is day high. Target 1:2. Exit at 15:15.", 'time_dir'),
  createDefaultObj('tb_3', '9:30 AM ORB - Bullish', 'Time-Based Directional - 15 Min Breakout.', "I have mapped your 9:30 ORB Bullish. Buy ATM CE when price crosses 15-min high. SL 15-min low. Exit at 15:15.", 'time_dir'),
  createDefaultObj('tb_4', '9:30 AM ORB - Bearish', 'Time-Based Directional - 15 Min Breakdown.', "I have mapped your 9:30 ORB Bearish. Buy ATM PE when price crosses 15-min low. SL 15-min high. Exit at 15:15.", 'time_dir'),
  createDefaultObj('tb_5', '1:30 PM Breakout Continuation', 'Time-Based Directional - Second half trend.', "I have mapped your 1:30 PM Breakout. Buy ATM CE/PE if day high/low breaks after 13:30. SL 20 pts. Exit at 15:15.", 'time_dir'),

  // --- TAB 6: TIME-BASED NON-DIRECTIONAL (5) ---
  createDefaultObj('tbn_1', '9:20 AM Short Straddle', 'Time-Based Neutral - Morning Theta.', "I have mapped your 9:20 AM Straddle. Executed at 09:20. Sell ATM CE & PE. 25% Combined SL. Exit at 15:15.", 'time_ndir'),
  createDefaultObj('tbn_2', '9:20 AM Short Strangle', 'Time-Based Neutral - Morning Theta.', "I have mapped your 9:20 AM Strangle. Executed at 09:20. Sell OTM CE & PE. 25% Combined SL. Exit at 15:15.", 'time_ndir'),
  createDefaultObj('tbn_3', '10:30 AM Iron Condor', 'Time-Based Neutral - Mid-day settling.', "I have mapped your 10:30 Iron Condor. Executed when market settles. Sell OTMs, Buy Far OTMs. SL 20%. Exit 15:15.", 'time_ndir'),
  createDefaultObj('tbn_4', '11:30 AM Theta Eater', 'Time-Based Neutral - Lunchtime decay.', "I have mapped your 11:30 Theta Eater. Sell ATM CE & PE. Tight SL of 15% on each leg. Strict exit at 13:30.", 'time_ndir'),
  createDefaultObj('tbn_5', '2:30 PM Expiry Pin (0DTE)', 'Time-Based Neutral - Late day decay.', "I have mapped your 2:30 PM Expiry Pin. Sell ATM Iron Butterfly on Expiry day at 14:30. Strict exit at 15:15.", 'time_ndir'),

  // --- TAB 7: DIRECTIONAL INDICATORS (5) ---
  createDefaultObj('di_1', 'VWAP Bounce - Call', 'Indicator - Mean reversion long.', "I have mapped your VWAP Bounce Call. Buy ATM CE on 5-min bullish candle at VWAP. SL below VWAP. Exit 15:15.", 'ind_dir'),
  createDefaultObj('di_2', 'VWAP Rejection - Put', 'Indicator - Mean reversion short.', "I have mapped your VWAP Rejection Put. Buy ATM PE on 5-min bearish candle at VWAP. SL above VWAP. Exit 15:15.", 'ind_dir'),
  createDefaultObj('di_3', 'RSI Oversold (Below 30) Reversal', 'Indicator - Catching bottom.', "I have mapped your RSI Oversold Reversal. Buy ATM CE when RSI crosses above 30. SL 20% premium. Exit 15:15.", 'ind_dir'),
  createDefaultObj('di_4', 'RSI Overbought (Above 70) Reversal', 'Indicator - Catching top.', "I have mapped your RSI Overbought Reversal. Buy ATM PE when RSI crosses below 70. SL 20% premium. Exit 15:15.", 'ind_dir'),
  createDefaultObj('di_5', 'MACD Zero Line Crossover Long', 'Indicator - Momentum shift up.', "I have mapped your MACD Bullish. Buy ATM CE when MACD crosses above Zero line. SL 25%. Exit 15:15.", 'ind_dir'),

  // --- TAB 8: TREND & MOMENTUM (5) ---
  createDefaultObj('tm_1', 'EMA 9/15 Bullish Cross', 'Trend - Fast momentum up.', "I have mapped your EMA 9/15 Long. Buy ATM CE on 9 EMA crossing above 15 EMA. Trailing SL. Exit 15:15.", 'trend'),
  createDefaultObj('tm_2', 'EMA 9/15 Bearish Cross', 'Trend - Fast momentum down.', "I have mapped your EMA 9/15 Short. Buy ATM PE on 9 EMA crossing below 15 EMA. Trailing SL. Exit 15:15.", 'trend'),
  createDefaultObj('tm_3', 'Supertrend Buy (10,3)', 'Trend - Algorithmic Long.', "I have mapped your Supertrend Long. Buy ATM CE when Supertrend turns green. SL is Supertrend line. Exit 15:15.", 'trend'),
  createDefaultObj('tm_4', 'Supertrend Sell (10,3)', 'Trend - Algorithmic Short.', "I have mapped your Supertrend Short. Buy ATM PE when Supertrend turns red. SL is Supertrend line. Exit 15:15.", 'trend'),
  createDefaultObj('tm_5', 'Bollinger Band Squeeze Breakout', 'Trend - Volatility expansion.', "I have mapped your BB Squeeze. Buy ATM CE/PE when price breaks upper/lower band after squeeze. SL Mid-band. Exit 15:15.", 'trend'),

  // --- TAB 9: PRICE ACTION (5) ---
  createDefaultObj('pa_1', 'Inside Bar Breakout', 'Price Action - Range Expansion.', "I have mapped your Inside Bar strategy. Buy ATM CE/PE on breaking 15-min Mother Bar high/low. SL opposite end. Exit 15:15.", 'pa'),
  createDefaultObj('pa_2', 'Pin Bar Reversal at Support', 'Price Action - Rejection.', "I have mapped your Pin Bar Long. Buy ATM CE on Bullish Pin Bar closing at Support. SL below wick. Exit 15:15.", 'pa'),
  createDefaultObj('pa_3', 'Double Bottom (W) Breakout', 'Price Action - Structure Shift.', "I have mapped your Double Bottom Long. Buy ATM CE on W-pattern neckline breakout. SL previous swing low. Exit 15:15.", 'pa'),
  createDefaultObj('pa_4', 'Bull Flag Continuation', 'Price Action - Trend pause.', "I have mapped your Bull Flag Long. Buy ATM CE on flag resistance breakout. SL below flag support. Exit 15:15.", 'pa'),
  createDefaultObj('pa_5', 'CPR (Central Pivot) Bounce', 'Price Action - Floor Support.', "I have mapped your CPR Bounce. Buy ATM CE on bullish candle at Top/Bottom CPR. SL below Pivot. Exit 15:15.", 'pa'),

  // --- TAB 10: INTRADAY SCALPING (5) ---
  createDefaultObj('sc_1', '1-Min Marubozu Scalp CE', 'Scalping - High Frequency Bullish.', "I have mapped your 1-Min Scalp CE. Buy ATM CE on strong 1-min green Marubozu. Strict 10% SL, 15% Target. Exit 15:15.", 'scalp'),
  createDefaultObj('sc_2', '1-Min Marubozu Scalp PE', 'Scalping - High Frequency Bearish.', "I have mapped your 1-Min Scalp PE. Buy ATM PE on strong 1-min red Marubozu. Strict 10% SL, 15% Target. Exit 15:15.", 'scalp'),
  createDefaultObj('sc_3', 'Engulfing Candlestick Scalp Long', 'Scalping - Reversal Scalp.', "I have mapped your Engulfing Long. Buy ATM CE immediately after 3-min Bullish Engulfing. SL below pattern.", 'scalp'),
  createDefaultObj('sc_4', 'Engulfing Candlestick Scalp Short', 'Scalping - Reversal Scalp.', "I have mapped your Engulfing Short. Buy ATM PE immediately after 3-min Bearish Engulfing. SL above pattern.", 'scalp'),
  createDefaultObj('sc_5', '3-Min ORB Quick Scalp', 'Scalping - Opening Momentum.', "I have mapped your 3-Min ORB Scalp. Buy ATM CE/PE on crossing 3-min high/low. Fast in and out. 10% SL.", 'scalp')
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
    <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl w-full max-w-5xl p-7 relative shadow-[0_0_60px_-15px_rgba(30,41,59,0.5)] animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pr-12 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155] text-white">
              <Icons.Strategy />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Trading Strategies & Segments
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Explore 50 Intraday Pure backtestable setups categorized across 10 distinct market segments.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#334155] transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex p-1 bg-[#0F172A] rounded-xl border border-[#334155] mb-5 flex-shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('my_strategies')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'default_strategies' 
                ? 'bg-[#1E293B] text-white shadow-md border border-[#334155]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icons.Template />
            Default Templates (10 Segments)
          </button>
        </div>

        {/* 10 Sub-Segments (Only visible under Default Templates) */}
        {activeTab === 'default_strategies' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-premium flex-shrink-0">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  segmentFilter === seg.id
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)] border border-blue-500'
                    : 'bg-[#0F172A] text-gray-400 border border-[#334155] hover:border-gray-500 hover:text-white'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Content Area */}
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
              {filteredTemplates.length === 0 ? (
                <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
                  <p className="text-gray-400 font-medium">No strategies found in this segment.</p>
                </div>
              ) : (
                filteredTemplates.map(strat => (
                  <div 
                    key={strat.id} 
                    className="bg-[#0F172A] p-5 rounded-2xl flex justify-between items-center border border-[#334155] hover:border-green-500 hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)] transition-all duration-300 group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">
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