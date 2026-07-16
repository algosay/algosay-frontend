import React from 'react';

const StrategyConfig = ({
  // ✨ SELLING CONFIGURATIONS (New Split State Props)
  sellTicker, setSellTicker, sellTimeframe, setSellTimeframe, sellUnderlyingFrom, setSellUnderlyingFrom,
  sellEntryTime, setSellEntryTime, sellExitTime, setSellExitTime,
  sellStopLoss, setSellStopLoss, sellSlUnit, setSellSlUnit, // Retained for compatibility
  sellTarget, setSellTarget, sellTargetUnit, setSellTargetUnit, // Retained for compatibility
  
  // ✨ BUYING CONFIGURATIONS (New Split State Props)
  buyTicker, setBuyTicker, buyTimeframe, setBuyTimeframe, buyUnderlyingFrom, setBuyUnderlyingFrom,
  buyEntryTime, setBuyEntryTime, buyExitTime, setBuyExitTime,
  buyStopLoss, setBuyStopLoss, buySlUnit, setBuySlUnit, // Retained for compatibility
  buyTarget, setBuyTarget, buyTargetUnit, setBuyTargetUnit, // Retained for compatibility

  // GLOBAL / SHARED CONFIGURATIONS
  fromDate, setFromDate, toDate, setToDate,
  trailMoveX, setTrailMoveX, trailPointY, setTrailPointY,
  indicators, addIndicator, updateIndicator, removeIndicator,
  legs, addLeg, updateLeg, removeLeg, setIsConfirmed,
  
  // Legacy Props for Compatibility (Retained so that nothing breaks)
  ticker, setTicker, timeframe, setTimeframe, underlyingFrom, setUnderlyingFrom, qty, setQty,
  transactionType, setTransactionType, entryTime, setEntryTime, exitTime, setExitTime,
  overallSL, setOverallSL, slUnit, setSlUnit, 
  overallTarget, setOverallTarget, targetUnit, setTargetUnit
}) => {
  
  const handleConfigChange = (setter, value) => {
    if (setter) {
      setter(value);
    }
    setIsConfirmed(false);
  };

  const calculateLiveMargin = (currentLegs) => {
    if (!currentLegs || currentLegs.length === 0) return { totalMargin: 0, ceQty: 0, peQty: 0 };

    let ce_sell = 0;
    let pe_sell = 0;
    let buy_margin = 0;

    currentLegs.forEach(leg => {
        const position = (leg.action || leg.position || "BUY").toUpperCase();
        const optType = (leg.optionType || leg.type || "CE").toUpperCase();
        
        // Handle Qty vs Lots dynamically (65 qty = 1 lot)
        let rawQty = parseInt(leg.lots || leg.qty || 1);
        let lots = rawQty >= 65 ? Math.floor(rawQty / 65) : rawQty;

        if (position === "SELL" || position === "SHORT") {
            if (optType.includes("CE")) { ce_sell += lots; }
            else if (optType.includes("PE")) { pe_sell += lots; }
            else { ce_sell += lots; } // Fallback
        } else {
            buy_margin += (lots * 5000); // Approx 5k for Option Buying
        }
    });

    const ceQty = ce_sell * 65;
    const peQty = pe_sell * 65;

    // Pair hedged legs for margin benefit
    const hedged_pairs = Math.min(ce_sell, pe_sell);
    const naked_ce = ce_sell - hedged_pairs;
    const naked_pe = pe_sell - hedged_pairs;

    // Exact Broker Maths (Zerodha/Upstox values)
    const totalMargin = (hedged_pairs * 207238) + (naked_ce * 176042) + (naked_pe * 176042) + buy_margin;
    
    return { totalMargin, ceQty, peQty };
  };

  // Get values for UI
  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs);

  return (
    <div className="w-full animate-fade-in">
      
      {/* 📅 TOP-HEADER SECTION: STRATEGY MANAGEMENT & DATES TIMELINE */}
      <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#2d2d2d] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            ⚙️ Strategy Configurations Panel
          </h2>
          <p className="text-xs text-gray-400">Manage global intervals, trade rules, and leg parameters dynamically.</p>
        </div>
        <div className="flex gap-3 bg-[#121212] p-2.5 rounded-lg border border-[#333]">
          <div>
            <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-wide mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => handleConfigChange(setFromDate, e.target.value)} className="bg-[#1e1e1e] border border-[#333] text-xs rounded p-1.5 text-gray-200 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-wide mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => handleConfigChange(setToDate, e.target.value)} className="bg-[#1e1e1e] border border-[#333] text-xs rounded p-1.5 text-gray-200 outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
        {/* 🟥 SELLING CONFIGURATION PANEL */}
        <div className="bg-[#1e1e1e] p-5 rounded-xl border border-red-900/20 shadow-lg shadow-red-950/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-400 mb-4 border-b border-[#2d2d2d] pb-2 flex items-center gap-2">
              <span>📉</span> Selling Configuration (9:20 AM)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Asset</label>
                  <select value={sellTicker} onChange={(e) => handleConfigChange(setSellTicker, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-red-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="NIFTY">NIFTY 50</option>
                    <option value="BANKNIFTY">BANKNIFTY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Timeframe</label>
                  <select value={sellTimeframe} onChange={(e) => handleConfigChange(setSellTimeframe, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-red-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="1m">1 Min</option>
                    <option value="5m">5 Min</option>
                    <option value="15m">15 Min</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Segment</label>
                  <select value={sellUnderlyingFrom} onChange={(e) => handleConfigChange(setSellUnderlyingFrom, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-red-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="Cash">Cash</option>
                    <option value="Futures">Futures</option>
                    <option value="Options">Options</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Entry Time</label>
                  <input type="time" value={sellEntryTime} onChange={(e) => handleConfigChange(setSellEntryTime, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-red-500 rounded p-2 text-sm text-gray-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Exit Time</label>
                  <input type="text" value={sellExitTime} onChange={(e) => handleConfigChange(setSellExitTime, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-red-500 rounded p-2 text-sm text-gray-200 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🟩 BUYING CONFIGURATION PANEL */}
        <div className="bg-[#1e1e1e] p-5 rounded-xl border border-green-900/20 shadow-lg shadow-green-950/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-green-400 mb-4 border-b border-[#2d2d2d] pb-2 flex items-center gap-2">
              <span>📈</span> Buying Configuration (9:45 AM)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Asset</label>
                  <select value={buyTicker} onChange={(e) => handleConfigChange(setBuyTicker, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-green-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="NIFTY">NIFTY 50</option>
                    <option value="BANKNIFTY">BANKNIFTY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Timeframe</label>
                  <select value={buyTimeframe} onChange={(e) => handleConfigChange(setBuyTimeframe, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-green-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="1m">1 Min</option>
                    <option value="5m">5 Min</option>
                    <option value="15m">15 Min</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Segment</label>
                  <select value={buyUnderlyingFrom} onChange={(e) => handleConfigChange(setBuyUnderlyingFrom, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-green-500 rounded p-2 text-sm text-gray-200 outline-none">
                    <option value="Cash">Cash</option>
                    <option value="Futures">Futures</option>
                    <option value="Options">Options</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Entry Time</label>
                  <input type="time" value={buyEntryTime} onChange={(e) => handleConfigChange(setBuyEntryTime, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-green-500 rounded p-2 text-sm text-gray-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">Exit Time</label>
                  <input type="text" value={buyExitTime} onChange={(e) => handleConfigChange(setBuyExitTime, e.target.value)} className="w-full bg-[#121212] border border-[#333] focus:border-green-500 rounded p-2 text-sm text-gray-200 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 INDICATORS PANEL (ISOLATED - Handles Indicator Selections only) */}
        <div className="bg-[#1e1e1e] p-5 rounded-xl border border-[#2d2d2d] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-[#2d2d2d] pb-2">
              <h3 className="text-sm font-bold text-gray-200 flex items-center gap-1.5">
                <span>📊</span> Indicators Matrix
              </h3>
              <button onClick={addIndicator} className="text-[10px] bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-2 py-1 rounded transition-colors">+ Add</button>
            </div>
            {indicators.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-500">No indicators added.</div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar pr-1 mb-3">
                {indicators.map((ind) => (
                  <div key={ind.id} className="bg-[#121212] p-2 rounded border border-[#333] relative group">
                    <button onClick={() => removeIndicator(ind.id)} className="absolute top-1.5 right-1.5 text-gray-500 hover:text-red-400 text-xs">✕</button>
                    <input type="text" value={ind.name} onChange={(e) => updateIndicator(ind.id, 'name', e.target.value)} className="w-[80%] bg-transparent border-b border-[#333] text-xs text-blue-400 font-semibold focus:outline-none focus:border-blue-500 mb-1" placeholder="Name" />
                    <input type="text" value={ind.settings} onChange={(e) => updateIndicator(ind.id, 'settings', e.target.value)} className="w-full bg-transparent border-b border-[#333] text-[11px] text-gray-400 focus:outline-none focus:border-gray-500" placeholder="Settings" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 📋 LEGS PANEL: Restructured to wide horizontal grid block above margin indicator */}
      <div className="bg-[#1e1e1e] p-5 rounded-xl border border-[#2d2d2d] mb-6 w-full flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-[#2d2d2d] pb-2">
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <span>📋</span> Active Strategy Legs Array Configuration
          </h3>
          <button onClick={addLeg} className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition-colors shadow-md shadow-blue-950/20">+ Add New Leg</button>
        </div>
        {legs.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500 bg-[#121212] rounded-xl border border-dashed border-[#333]">
            No trading legs configured. Prompt the AI assistant or click "+ Add New Leg" to populate setup parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {legs.map((leg, index) => (
              <div key={leg.id || index} className="bg-[#121212] p-4 rounded-xl border border-[#333] relative hover:border-gray-800 transition-all flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-[#222]">
                    <span className="text-[11px] font-bold text-blue-400 tracking-wider">LEG ACCELERATION #{index + 1}</span>
                    <button onClick={() => removeLeg(leg.id)} className="text-gray-500 hover:text-red-400 text-xs transition-colors p-0.5">✕</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Segment</label>
                      <select value={leg.segment} onChange={(e) => updateLeg(leg.id, 'segment', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                        <option value="Options">Options</option>
                        <option value="Futures">Futures</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Position</label>
                      <select value={leg.position} onChange={(e) => updateLeg(leg.id, 'position', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                      </select>
                    </div>

                    {leg.segment === 'Options' && (
                      <>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Option Type</label>
                          <select value={leg.optionType || 'CE'} onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="CE">CE (Call)</option>
                            <option value="PE">PE (Put)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Strike Type</label>
                          <select value={leg.strikeType || 'ATM'} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="ATM">ATM</option>
                            <option value="ITM">ITM</option>
                            <option value="OTM">OTM</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="col-span-2 flex items-center justify-between gap-2 mt-1 bg-[#181818] px-2.5 py-1.5 rounded border border-[#222]">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lots Allocation:</span>
                      <input type="number" value={leg.lots || 1} onChange={(e) => updateLeg(leg.id, 'lots', Number(e.target.value))} className="w-20 bg-[#121212] border border-[#333] rounded p-1 text-center text-xs text-gray-200 font-bold outline-none focus:border-blue-500" />
                    </div>

                    {/* 🎚️ INDIVIDUAL RISKS PER POSITION CARD LEG */}
                    <div className="col-span-2 grid grid-cols-2 gap-2 mt-2 border-t border-[#222] pt-2">
                      <div>
                        <label className="block text-[9px] text-red-400 uppercase tracking-wide mb-1">Stop Loss</label>
                        <div className="flex gap-1">
                          <input type="number" value={leg.stopLoss || ''} onChange={(e) => updateLeg(leg.id, 'stopLoss', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-red-900/30 focus:border-red-500 rounded p-1.5 text-xs text-gray-300 outline-none" placeholder="0" />
                          <select value={leg.slUnit || "%"} onChange={(e) => updateLeg(leg.id, 'slUnit', e.target.value)} className="w-1/3 bg-[#1e1e1e] border border-red-900/30 focus:border-red-500 rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="%">%</option>
                            <option value="Pts">Pts</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[9px] text-green-400 uppercase tracking-wide mb-1">Target</label>
                        <div className="flex gap-1">
                          <input type="number" value={leg.target || ''} onChange={(e) => updateLeg(leg.id, 'target', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-green-900/30 focus:border-green-500 rounded p-1.5 text-xs text-gray-300 outline-none" placeholder="0" />
                          <select value={leg.targetUnit || "%"} onChange={(e) => updateLeg(leg.id, 'targetUnit', e.target.value)} className="w-1/3 bg-[#1e1e1e] border border-green-900/30 focus:border-green-500 rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="%">%</option>
                            <option value="Pts">Pts</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Leg-Level Trailing Matrix Inputs */}
                    <div className="col-span-2 grid grid-cols-2 gap-2 mt-1.5">
                      <div>
                        <label className="block text-[9px] text-yellow-500 uppercase tracking-wide mb-1">Trail SL (X Pts)</label>
                        <input type="number" value={leg.trailX || leg.trailMoveX || ''} onChange={(e) => updateLeg(leg.id, 'trailX', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-yellow-500 uppercase tracking-wide mb-1">Trail SL (Y Pts)</label>
                        <input type="number" value={leg.trailY || leg.trailPointY || ''} onChange={(e) => updateLeg(leg.id, 'trailY', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
                      </div>
                    </div>

                    {/* Leg-Level Executions Strategy */}
                    <div className="col-span-2 grid grid-cols-2 gap-2 mt-1.5">
                      <div>
                        <label className="block text-[9px] text-amber-500 uppercase tracking-wide mb-1">SL Re-entry Count</label>
                        <input type="number" value={leg.slReentry || 0} onChange={(e) => updateLeg(leg.id, 'slReentry', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-amber-500" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-emerald-500 uppercase tracking-wide mb-1">Target Re-execute</label>
                        <input type="number" value={leg.targetReexecute || 0} onChange={(e) => updateLeg(leg.id, 'targetReexecute', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-emerald-500" placeholder="0" />
                      </div>
                    </div>

                    {/* Leg-Level Toggles Config Matrix */}
                    <div className="col-span-2 grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-[#222]">
                      <label className="flex flex-col items-center justify-center p-1 bg-[#161616] border border-[#252525] rounded cursor-pointer select-none hover:bg-[#1a1a1a] transition-colors">
                        <span className="text-[8px] text-gray-400 font-medium mb-1">Wait & Trade</span>
                        <input type="checkbox" checked={leg.waitAndTrade || false} onChange={(e) => updateLeg(leg.id, 'waitAndTrade', e.target.checked)} className="rounded text-blue-500 w-3 h-3 bg-[#111] border-[#333]" />
                      </label>
                      
                      <label className="flex flex-col items-center justify-center p-1 bg-[#161616] border border-[#252525] rounded cursor-pointer select-none hover:bg-[#1a1a1a] transition-colors">
                        <span className="text-[8px] text-gray-400 font-medium mb-1">Move to SL</span>
                        <input type="checkbox" checked={leg.moveToStoploss || false} onChange={(e) => updateLeg(leg.id, 'moveToStoploss', e.target.checked)} className="rounded text-blue-500 w-3 h-3 bg-[#111] border-[#333]" />
                      </label>

                      <label className="flex flex-col items-center justify-center p-1 bg-[#161616] border border-[#252525] rounded cursor-pointer select-none hover:bg-[#1a1a1a] transition-colors">
                        <span className="text-[8px] text-gray-400 font-medium mb-1">Cost-to-Cost</span>
                        <input type="checkbox" checked={leg.costToCost || false} onChange={(e) => updateLeg(leg.id, 'costToCost', e.target.checked)} className="rounded text-blue-500 w-3 h-3 bg-[#111] border-[#333]" />
                      </label>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Estimated Margin Card Retained */}
      <div className="mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1e1e1e] border border-blue-900/40 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <span className="text-2xl">💰</span>
            <div>
                <p className="text-[11px] text-blue-400/90 font-bold uppercase tracking-wider">Estimated Margin Required</p>
                <p className="text-sm text-gray-400">Live margin based on your currently configured legs.</p>
                <p className="text-sm text-gray-400 mt-1">
                   CE Qty: <span className="text-white font-bold">{ceQty}</span> | PE Qty: <span className="text-white font-bold">{peQty}</span>
                </p>
            </div>
        </div>
        <p className="text-2xl font-bold text-blue-400">
            ₹{totalMargin.toLocaleString('en-IN')}
        </p>
      </div>

    </div>
  );
};

export default StrategyConfig;