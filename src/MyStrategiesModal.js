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
    yellow: 'bg-yellow-600/10 text-yellow-400 border border-yellow-600/20'
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${colors[color]} tracking-wide`}>
      {text}
    </span>
  );
};

// Default Strategies Data
const DEFAULT_STRATEGIES = [
  {
    id: 'default_1',
    name: 'Long Call',
    concept: 'Bullish - Expecting a strong upside move.',
    prompt: "I have mapped your 0DTE NIFTY 50 Long Call strategy. The strategy involves one 'Buy' leg (ATM CE) executed at 09:45 using a 5-minute timeframe. Leg 1 (Buy ATM CE) has a 40% Stop Loss and 100% Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_2',
    name: 'Long Put',
    concept: 'Bearish - Expecting a strong downside move.',
    prompt: "I have mapped your 0DTE NIFTY 50 Long Put strategy. The strategy involves one 'Buy' leg (ATM PE) executed at 09:45 using a 5-minute timeframe. Leg 1 (Buy ATM PE) has a 40% Stop Loss and 100% Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_3',
    name: 'Covered Call',
    concept: 'Neutral to Bullish - Holding asset, selling calls for income.',
    prompt: "I have mapped your NIFTY 50 Covered Call strategy. The strategy involves one 'Buy' leg (Current Month NIFTY Futures) and one 'Sell' leg (OTM CE, +100 points away) executed at 09:45 using a 5-minute timeframe. The Future leg runs without SL/Target. Leg 2 (Sell OTM CE) has a 25% Stop Loss and 90% Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_4',
    name: 'Bull Call Spread',
    concept: 'Bullish - Debit Spread with capped risk and reward.',
    prompt: "I have mapped your 0DTE NIFTY 50 Bull Call Spread strategy. The strategy involves two legs executed at 09:45 using a 5-minute timeframe: Leg 1 is 'Buy' (ATM CE) and Leg 2 is 'Sell' (OTM CE, +100 points). Overall strategy Stop Loss is set at 20% of the net premium paid, and Target is 50% of the net premium. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_5',
    name: 'Bear Put Spread',
    concept: 'Bearish - Debit Spread with capped risk and reward.',
    prompt: "I have mapped your 0DTE NIFTY 50 Bear Put Spread strategy. The strategy involves two legs executed at 09:45 using a 5-minute timeframe: Leg 1 is 'Buy' (ATM PE) and Leg 2 is 'Sell' (OTM PE, -100 points). Overall strategy Stop Loss is set at 20% of the net premium paid, and Target is 50% of the net premium. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_6a',
    name: 'Bull Put Spread (Credit Spread)',
    concept: 'Bullish/Neutral - Directional income strategy.',
    prompt: "I have mapped your 0DTE NIFTY 50 Bull Put Spread strategy. The strategy involves two legs executed at 09:45 using a 5-minute timeframe: Leg 1 'Sell' (OTM PE, -50 points) and Leg 2 'Buy' (Far OTM PE, -150 points for hedging). Leg 1 has a 25% Stop Loss and 80% Target. Leg 2 is left open for margin benefit. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_6b',
    name: 'Bear Call Spread (Credit Spread)',
    concept: 'Bearish/Neutral - Directional income strategy.',
    prompt: "I have mapped your 0DTE NIFTY 50 Bear Call Spread strategy. The strategy involves two legs executed at 09:45 using a 5-minute timeframe: Leg 1 'Sell' (OTM CE, +50 points) and Leg 2 'Buy' (Far OTM CE, +150 points for hedging). Leg 1 has a 25% Stop Loss and 80% Target. Leg 2 is left open for margin benefit. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_7',
    name: 'Long Straddle',
    concept: 'High Volatility - Expecting a massive move in either direction.',
    prompt: "I have mapped your 0DTE NIFTY 50 Long Straddle strategy. The strategy involves two 'Buy' legs (ATM CE and ATM PE) executed at 09:45 using a 5-minute timeframe. Leg 1 (Buy CE) has a 30% Stop Loss and 150% Target. Leg 2 (Buy PE) has a 30% Stop Loss and 150% Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_8',
    name: 'Long Strangle',
    concept: 'High Volatility - Cheaper setup, expecting an even bigger move.',
    prompt: "I have mapped your 0DTE NIFTY 50 Long Strangle strategy. The strategy involves two 'Buy' legs (OTM CE +100 points, and OTM PE -100 points) executed at 09:45 using a 5-minute timeframe. Leg 1 (Buy OTM CE) has a 40% Stop Loss and 200% Target. Leg 2 (Buy OTM PE) has a 40% Stop Loss and 200% Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_9',
    name: 'Iron Condor',
    concept: 'Range-bound - Market to stay in a wide range (Low Volatility).',
    prompt: "I have mapped your 0DTE NIFTY 50 Iron Condor strategy. The strategy involves four legs executed at 09:45 using a 5-minute timeframe: Sell OTM CE (+100 pts), Buy Far OTM CE (+200 pts), Sell OTM PE (-100 pts), and Buy Far OTM PE (-200 pts). The 'Sell' legs each have a 25% Stop Loss and an 80% Target. The 'Buy' legs act as hedges with no individual SL/Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  },
  {
    id: 'default_10',
    name: 'Iron Butterfly',
    concept: 'Range-bound - Market to stay exactly where it is (Pin Risk).',
    prompt: "I have mapped your 0DTE NIFTY 50 Iron Butterfly strategy. The strategy involves four legs executed at 09:45 using a 5-minute timeframe: Sell ATM CE, Sell ATM PE, Buy OTM CE (+100 pts), and Buy OTM PE (-100 pts). Leg 1 (Sell ATM CE) has a 25% Stop Loss and 90% Target. Leg 2 (Sell ATM PE) has an 18% Stop Loss and 80% Target. The 'Buy' legs act as hedges with no individual SL/Target. Exit is set for 15:15, lot 10, Nov 2025 to Dec 2025 on a candle close basis.",
    isDefault: true
  }
];

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies, onLoad, onEdit, onDelete }) => {
  // New State for Tabs
  const [activeTab, setActiveTab] = useState('my_strategies');

  if (!isOpen) return null;

  return (
    // Backdrop - with blur and gradient
    <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      
      {/* Modal Container - Increased max-width slightly to accommodate both tabs comfortably */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl w-full max-w-3xl p-7 relative shadow-[0_0_60px_-15px_rgba(30,41,59,0.5)] animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
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
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#334155] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Custom Premium Tabs */}
        <div className="flex p-1 bg-[#0F172A] rounded-xl border border-[#334155] mb-6 flex-shrink-0">
          <button 
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
        
        {/* Main Content Area - Scrollable */}
        <div className="overflow-y-auto pr-3 scrollbar-premium flex-1">
          
          {/* TAB 1: MY STRATEGIES (Original logic unchanged) */}
          {activeTab === 'my_strategies' && (
            <>
              {isLoading ? (
                <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Syncing with your database...</p>
                </div>
              ) : strategies.length === 0 ? (
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
                      {/* Left Side - Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                            {strat.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Icons.Calendar />
                            Saved on: {strat.createdAt ? new Date(strat.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex items-center gap-2 pr-1">
                        {/* Edit - Secondary Action */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(strat);
                          }}
                          className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-yellow-600/10 hover:border-yellow-600/30 border border-transparent transition-all"
                        >
                          <Icons.Edit />
                        </button>
                        {/* Delete - Secondary Action */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(strat);
                          }}
                          className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 border border-transparent transition-all"
                        >
                          <Icons.Delete />
                        </button>
                        {/* Load - Primary Action */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoad(strat);
                          }} 
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-extrabold rounded-full transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)] active:scale-95 group-active:scale-95 border-none"
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

          {/* TAB 2: DEFAULT STRATEGIES */}
          {activeTab === 'default_strategies' && (
            <div className="space-y-4">
              {DEFAULT_STRATEGIES.map(strat => (
                <div 
                  key={strat.id} 
                  className="bg-[#0F172A] p-5 rounded-2xl flex justify-between items-center border border-[#334155] hover:border-green-500 hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)] transition-all duration-300 group"
                >
                  {/* Left Side - Info */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">
                        {strat.name}
                      </h3>
                      <MetadataPill text="TEMPLATE" color="green" />
                    </div>
                    <p className="text-sm text-gray-400 mt-2 font-medium">
                      {strat.concept}
                    </p>
                  </div>

                  {/* Right Side - Action */}
                  <div className="flex items-center gap-2 pr-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoad(strat); // Triggers onLoad with the default strategy object containing the prompt
                      }} 
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] border border-[#334155] text-white text-xs font-extrabold rounded-full transition-all hover:bg-green-600 hover:border-green-500 hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)] active:scale-95 group-active:scale-95"
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