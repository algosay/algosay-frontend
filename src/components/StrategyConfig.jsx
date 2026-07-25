import React from 'react';

// 🛠️ SMART NORMALIZER HELPERS (Fixes AI Backend String / Case Mismatch)
const normalizeCriteria = (criteria) => {
  if (!criteria) return 'Strike Type';
  const c = criteria.toString().toLowerCase().trim();
  if (c.includes('closest') || c.includes('premium')) return 'Closest Premium';
  if (c.includes('range')) return 'Premium Range';
  return 'Strike Type';
};

const normalizeUnit = (unit) => {
  if (!unit) return '%';
  const u = unit.toString().toLowerCase().trim();
  if (u.includes('pt') || u.includes('point') || u === 'pts') return 'Pts';
  return '%';
};

const StrategyConfig = ({
  // ✨ SELLING CONFIGURATIONS
  sellTicker, setSellTicker, sellTimeframe, setSellTimeframe, sellUnderlyingFrom, setSellUnderlyingFrom,
  sellEntryTime, setSellEntryTime, sellExitTime, setSellExitTime,
  sellStopLoss, setSellStopLoss, sellSlUnit, setSellSlUnit, 
  sellTarget, setSellTarget, sellTargetUnit, setSellTargetUnit, 
  
  // ✨ BUYING CONFIGURATIONS
  buyTicker, setBuyTicker, buyTimeframe, setBuyTimeframe, buyUnderlyingFrom, setBuyUnderlyingFrom,
  buyEntryTime, setBuyEntryTime, buyExitTime, setBuyExitTime,
  buyStopLoss, setBuyStopLoss, buySlUnit, setBuySlUnit, 
  buyTarget, setBuyTarget, buyTargetUnit, setBuyTargetUnit, 

  // GLOBAL / SHARED CONFIGURATIONS
  fromDate, setFromDate, toDate, setToDate,
  trailMoveX, setTrailMoveX, trailPointY, setTrailPointY,
  indicators, addIndicator, updateIndicator, removeIndicator,
  legs, addLeg, updateLeg, removeLeg, setIsConfirmed,
  
  // Legacy Props for Compatibility
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
    let ce_buy = 0;
    let pe_buy = 0;
    let buy_margin = 0;

    currentLegs.forEach(leg => {
        const position = (leg.action || leg.position || "BUY").toUpperCase();
        const optType = (leg.optionType || leg.type || "CE").toUpperCase();
        
        let rawQty = parseInt(leg.lots || leg.qty || 1);
        let lots = rawQty >= 65 ? Math.floor(rawQty / 65) : rawQty;

        if (position === "SELL" || position === "SHORT") {
            if (optType.includes("CE")) { ce_sell += lots; }
            else if (optType.includes("PE")) { pe_sell += lots; }
            else { ce_sell += lots; }
        } else {
            if (optType.includes("CE")) { ce_buy += lots; }
            else if (optType.includes("PE")) { pe_buy += lots; }
            else { ce_buy += lots; }
            
            buy_margin += (lots * 5000);
        }
    });

    const ceQty = (ce_sell + ce_buy) * 65;
    const peQty = (pe_sell + pe_buy) * 65;

    const hedged_pairs = Math.min(ce_sell, pe_sell);
    const naked_ce = ce_sell - hedged_pairs;
    const naked_pe = pe_sell - hedged_pairs;

    const totalMargin = (hedged_pairs * 207238) + (naked_ce * 176042) + (naked_pe * 176042) + buy_margin;
    
    return { totalMargin, ceQty, peQty };
  };

  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs);

  return (
    <div className="w-full animate-fade-in">
      
      {/* 📅 TOP-HEADER SECTION */}
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

      {/* 📊 INDICATORS PANEL */}
      <div className="bg-[#1e1e1e] p-5 rounded-xl border border-[#2d2d2d] mb-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-[#2d2d2d] pb-2">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-1.5">
              <span>📊</span> Indicators Matrix
            </h3>
            <button onClick={addIndicator} className="text-[10px] bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-2 py-1 rounded transition-colors">+ Add</button>
          </div>
          {indicators.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-500">No indicators added.</div>
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

      {/* 📋 LEGS PANEL */}
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
            {legs.map((leg, index) => {
              // Normalized Values (Auto-handles snake_case, camelCase, and String variation mismatches)
              const currentCriteria = normalizeCriteria(leg.strikeCriteria || leg.strike_criteria);
              const currentSlUnit = normalizeUnit(leg.slUnit || leg.sl_unit);
              const currentTargetUnit = normalizeUnit(leg.targetUnit || leg.target_unit);
              const targetPremiumVal = leg.targetPremium ?? leg.target_premium ?? leg.premium ?? '';

              return (
                <div key={leg.id || index} className="bg-[#121212] p-4 rounded-xl border border-[#333] relative hover:border-gray-800 transition-all flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-[#222]">
                      <span className="text-[11px] font-bold text-blue-400 tracking-wider">LEG ACCELERATION #{index + 1}</span>
                      <button onClick={() => removeLeg(leg.id)} className="text-gray-500 hover:text-red-400 text-xs transition-colors p-0.5">✕</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      
                      {/* INTEGRATED LEG FIELDS */}
                      <div className="col-span-2 grid grid-cols-2 gap-2 mb-2 pb-2 border-b border-[#222]">
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Asset</label>
                          <select value={leg.ticker || leg.asset || 'NIFTY'} onChange={(e) => updateLeg(leg.id, 'ticker', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="NIFTY">NIFTY 50</option>
                            <option value="BANKNIFTY">BANKNIFTY</option>
                            <option value="FINNIFTY">FINNIFTY</option>
                            <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                            <option value="SENSEX">SENSEX</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Timeframe</label>
                          <select value={leg.timeframe || '5m'} onChange={(e) => updateLeg(leg.id, 'timeframe', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="1m">1 Min</option>
                            <option value="5m">5 Min</option>
                            <option value="15m">15 Min</option>
                            <option value="30m">30 Min</option>
                            <option value="45m">45 Min</option>
                            <option value="1h">1 Hour</option>
                            <option value="3h">3 Hours</option>
                            <option value="6h">6 Hours</option>
                            <option value="12h">12 Hours</option>
                            <option value="1D">1 Day</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Entry Time</label>
                          <input type="time" value={leg.entryTime || leg.entry_time || ''} onChange={(e) => updateLeg(leg.id, 'entryTime', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Exit Time</label>
                          <input type="text" value={leg.exitTime || leg.exit_time || ''} onChange={(e) => updateLeg(leg.id, 'exitTime', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500" placeholder="e.g. 15:15" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Segment</label>
                        <select value={leg.segment || 'Options'} onChange={(e) => updateLeg(leg.id, 'segment', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                          <option value="Cash">Cash</option>
                          <option value="Futures">Futures</option>
                          <option value="Options">Options</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Position</label>
                        <select value={leg.position || leg.action || 'Sell'} onChange={(e) => updateLeg(leg.id, 'position', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                          <option value="Buy">Buy</option>
                          <option value="Sell">Sell</option>
                        </select>
                      </div>

                      {(leg.segment === 'Options' || !leg.segment) && (
                        <>
                          <div className="col-span-2 mt-1">
                            <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Expiry Type</label>
                            <select value={leg.expiryType || leg.expiry_type || 'Current Week'} onChange={(e) => updateLeg(leg.id, 'expiryType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                              <option value="Current Week">Current Week</option>
                              <option value="Next Week">Next Week</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Option Type</label>
                            <select value={leg.optionType || leg.type || 'CE'} onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                              <option value="CE">CE (Call)</option>
                              <option value="PE">PE (Put)</option>
                            </select>
                          </div>
                          
                          {/* 🎯 SMART STRIKE CRITERIA SECTION */}
                          <div className="col-span-2 mt-1 p-2 bg-[#181818] border border-[#222] rounded shadow-sm">
                           <label className="flex text-[9px] text-gray-500 uppercase tracking-wide mb-2 items-center gap-1">
                              Select Strike Criteria <span className="text-gray-400 cursor-help" title="Select how to choose the strike price">ⓘ</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                              
                              {/* Primary Selection Dropdown */}
                              <div className="w-full sm:w-1/2">
                                <select
                                  value={currentCriteria}
                                  onChange={(e) => {
                                    const newCriteria = e.target.value;
                                    updateLeg(leg.id, 'strikeCriteria', newCriteria);
                                    if (newCriteria !== 'Strike Type') {
                                      updateLeg(leg.id, 'strikeType', '');
                                      updateLeg(leg.id, 'strikeDistance', 0);
                                    } else {
                                      updateLeg(leg.id, 'strikeType', 'ATM');
                                      updateLeg(leg.id, 'strikeDistance', 1);
                                    }
                                  }}
                                  className="w-full bg-[#1e1e1e] border border-blue-600 rounded p-1.5 text-xs text-blue-100 font-medium outline-none focus:border-blue-400"
                                >
                                  <option value="Strike Type">Strike Type (ATM/ITM/OTM)</option>
                                  <option value="Closest Premium">Closest Premium</option>
                                  <option value="Premium Range">Premium Range</option>
                                </select>
                              </div>

                              {/* Option 1: Legacy Strike Type & Distance */}
                              {currentCriteria === 'Strike Type' && (
                                <div className="w-full sm:w-1/2 flex gap-1">
                                  <select 
                                    value={leg.strikeType || leg.strike_type || 'ATM'} 
                                    onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} 
                                    className={`${(leg.strikeType === 'OTM' || leg.strikeType === 'ITM') ? 'w-1/2' : 'w-full'} bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500`}
                                  >
                                    <option value="ATM">ATM</option>
                                    <option value="ITM">ITM</option>
                                    <option value="OTM">OTM</option>
                                  </select>
                                  
                                  {(leg.strikeType === 'OTM' || leg.strikeType === 'ITM') && (
                                    <select 
                                      value={leg.strikeDistance || leg.strike_distance || 1} 
                                      onChange={(e) => updateLeg(leg.id, 'strikeDistance', Number(e.target.value))} 
                                      className="w-1/2 bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                    >
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              )}

                              {/* Option 2: Closest Premium Target */}
                              {currentCriteria === 'Closest Premium' && (
                                <div className="w-full sm:w-1/2 flex items-center gap-2">
                                  <label className="text-[10px] text-gray-400 font-medium">Premium</label>
                                  <input
                                    type="number"
                                    value={targetPremiumVal}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      updateLeg(leg.id, 'targetPremium', val);
                                      updateLeg(leg.id, 'target_premium', val);
                                    }}
                                    className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                    placeholder="e.g. 50"
                                  />
                                </div>
                              )}

                              {/* Option 3: Premium Range Match */}
                              {currentCriteria === 'Premium Range' && (
                                <div className="w-full sm:w-1/2 flex items-center gap-2">
                                  <div className="flex items-center gap-1 w-1/2">
                                    <label className="text-[10px] text-gray-400 font-medium">Lower</label>
                                    <input
                                      type="number"
                                      value={leg.lowerPremium || leg.lower_premium || ''}
                                      onChange={(e) => updateLeg(leg.id, 'lowerPremium', Number(e.target.value))}
                                      className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                      placeholder="50"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 w-1/2">
                                    <label className="text-[10px] text-gray-400 font-medium">Upper</label>
                                    <input
                                      type="number"
                                      value={leg.upperPremium || leg.upper_premium || ''}
                                      onChange={(e) => updateLeg(leg.id, 'upperPremium', Number(e.target.value))}
                                      className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                      placeholder="200"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-span-2 flex items-center justify-between gap-2 mt-1 bg-[#181818] px-2.5 py-1.5 rounded border border-[#222]">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lots Allocation:</span>
                        <input type="number" value={leg.lots || 1} onChange={(e) => updateLeg(leg.id, 'lots', Number(e.target.value))} className="w-20 bg-[#121212] border border-[#333] rounded p-1 text-center text-xs text-gray-200 font-bold outline-none focus:border-blue-500" />
                      </div>

                      {/* 🎚️ STOP LOSS & TARGET WITH SMART UNIT DETECTOR */}
                      <div className="col-span-2 grid grid-cols-2 gap-2 mt-2 border-t border-[#222] pt-2">
                        <div>
                          <label className="block text-[9px] text-red-400 uppercase tracking-wide mb-1">Stop Loss</label>
                          <div className="flex gap-1">
                            <input type="number" value={leg.stopLoss ?? leg.stop_loss ?? ''} onChange={(e) => updateLeg(leg.id, 'stopLoss', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-red-900/30 focus:border-red-500 rounded p-1.5 text-xs text-gray-300 outline-none" placeholder="0" />
                            <select 
                              value={currentSlUnit} 
                              onChange={(e) => {
                                const val = e.target.value;
                                updateLeg(leg.id, 'slUnit', val);
                                updateLeg(leg.id, 'sl_unit', val);
                              }} 
                              className="w-1/3 bg-[#1e1e1e] border border-red-900/30 focus:border-red-500 rounded p-1 text-[10px] text-gray-300 outline-none"
                            >
                              <option value="%">%</option>
                              <option value="Pts">Pts</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[9px] text-green-400 uppercase tracking-wide mb-1">Target</label>
                          <div className="flex gap-1">
                            <input type="number" value={leg.target ?? ''} onChange={(e) => updateLeg(leg.id, 'target', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-green-900/30 focus:border-green-500 rounded p-1.5 text-xs text-gray-300 outline-none" placeholder="0" />
                            <select 
                              value={currentTargetUnit} 
                              onChange={(e) => {
                                const val = e.target.value;
                                updateLeg(leg.id, 'targetUnit', val);
                                updateLeg(leg.id, 'target_unit', val);
                              }} 
                              className="w-1/3 bg-[#1e1e1e] border border-green-900/30 focus:border-green-500 rounded p-1 text-[10px] text-gray-300 outline-none"
                            >
                              <option value="%">%</option>
                              <option value="Pts">Pts</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Trailing SL Inputs */}
                      <div className="col-span-2 grid grid-cols-2 gap-2 mt-1.5">
                        <div>
                          <label className="block text-[9px] text-yellow-500 uppercase tracking-wide mb-1">Trail SL (Move X)</label>
                          <div className="flex gap-1">
                            <input type="number" value={leg.trailX ?? ''} onChange={(e) => updateLeg(leg.id, 'trailX', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
                            <select 
                              value={leg.trailUnitX || 'Pts'} 
                              onChange={(e) => updateLeg(leg.id, 'trailUnitX', e.target.value)} 
                              className="w-1/3 bg-[#1e1e1e] border border-[#222] focus:border-yellow-600 rounded p-1 text-[10px] text-gray-300 outline-none"
                            >
                              <option value="Pts">Pts</option>
                              <option value="%">%</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-yellow-500 uppercase tracking-wide mb-1">Trail SL (Move Y)</label>
                          <div className="flex gap-1">
                            <input type="number" value={leg.trailY ?? ''} onChange={(e) => updateLeg(leg.id, 'trailY', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
                            <select 
                              value={leg.trailUnitY || 'Pts'} 
                              onChange={(e) => updateLeg(leg.id, 'trailUnitY', e.target.value)} 
                              className="w-1/3 bg-[#1e1e1e] border border-[#222] focus:border-yellow-600 rounded p-1 text-[10px] text-gray-300 outline-none"
                            >
                              <option value="Pts">Pts</option>
                              <option value="%">%</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Re-entry & Re-execute */}
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

                      {/* Leg Toggles */}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Live Estimated Margin Card */}
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