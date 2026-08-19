import React from 'react';
import { normalizeCriteria, normalizeUnit, normalizeSegment, INDEX_STEP_SIZES } from './utils';

const LegsPanel = ({ 
  legs, addLeg, updateLeg, removeLeg,
  // 🟢 NEW UPDATE: Combined Premium Props added to LegsPanel (WITH UNITS)
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit, // 🚀 NEW
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit // 🚀 NEW
}) => {
  return (
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

            // 🚨 SMART SEGMENT NORMALIZER DETECTOR
            const currentSegment = normalizeSegment(leg.segment, leg.optionType || leg.option_type || leg.type);

            // 🚀 Smart fallback for Trail X & Y inside legs card UI
            const currentTrailX = leg.trailX ?? leg.trailMoveX ?? leg.trail_x ?? '';
            const currentTrailY = leg.trailY ?? leg.trailPointY ?? leg.trailMoveY ?? leg.trail_y ?? '';

            // 🚨 DETECT IF IT IS DYNAMIC / CONDITION-BASED LOOP STRATEGY 🚨
            const rawEntryTime = leg.entryTime || leg.entry_time || '';
            const isDynamicLeg = String(rawEntryTime).toLowerCase() === 'dynamic';

            // 🚨 STANDARDIZED POSITION VALUE FOR DROPDOWN (UPPERCASE) 🚨
            const currentPosition = (leg.position || leg.action || 'BUY').toString().toUpperCase() === 'SELL' ? 'SELL' : 'BUY';

            // 🎯 NEW: CALCULATE DYNAMIC POINTS FOR STRIKE DISTANCE
            const currentAsset = leg.ticker || leg.asset || 'NIFTY';
            const stepSize = INDEX_STEP_SIZES[currentAsset] || 50;
            const currentDistance = leg.strikeDistance || leg.strike_distance || 1;
            const currentStrikeType = leg.strikeType || leg.strike_type || 'OTM';

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
                        <select value={currentAsset} onChange={(e) => updateLeg(leg.id, 'ticker', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                          <option value="NIFTY">NIFTY 50</option>
                          <option value="BANKNIFTY">BANKNIFTY</option>
                          <option value="FINNIFTY">FINNIFTY</option>
                          <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                          <option value="SENSEX">SENSEX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Timeframe</label>
                        <select value={leg.timeframe || '15m'} onChange={(e) => updateLeg(leg.id, 'timeframe', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
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
                        {/* 🚨 CONDITION-BASED DYNAMIC FIELD RENDERER 🚨 */}
                        {isDynamicLeg ? (
                          <input 
                            type="text" 
                            value="Dynamic (Condition Loop)" 
                            disabled 
                            className="w-full bg-[#181818] border border-amber-600/50 rounded p-1.5 text-xs text-amber-400 font-semibold cursor-not-allowed opacity-90 text-center" 
                            title="Controlled dynamically by candle condition loop"
                          />
                        ) : (
                          <input 
                            type="time" 
                            value={rawEntryTime} 
                            onChange={(e) => updateLeg(leg.id, 'entryTime', e.target.value)} 
                            className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500" 
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Exit Time</label>
                        <input type="text" value={leg.exitTime || leg.exit_time || ''} onChange={(e) => updateLeg(leg.id, 'exitTime', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500" placeholder="e.g. 15:15" />
                      </div>
                    </div>

                    {/* 🚨 UPDATED: Segment Data Perfectly Matched to AI Backend */}
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Segment</label>
                      <select 
                        value={currentSegment} 
                        onChange={(e) => updateLeg(leg.id, 'segment', e.target.value)} 
                        className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="Spot">Spot (Cash)</option>
                        <option value="Futures">Futures</option>
                        <option value="Options">Options</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase tracking-wide mb-1">Position</label>
                      <select value={currentPosition} onChange={(e) => updateLeg(leg.id, 'position', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                        <option value="BUY">Buy</option>
                        <option value="SELL">Sell</option>
                      </select>
                    </div>

                    {/* 🚨 UPDATED: Display Options configuration when currentSegment is Options */}
                    {currentSegment === 'Options' && (
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
                          <select value={leg.optionType || leg.option_type || leg.type || 'CE'} onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="CE">CE (Call)</option>
                            <option value="PE">PE (Put)</option>
                          </select>
                        </div>
                        
                        {/* 🎯 SMART STRIKE CRITERIA SECTION */}
                        <div className="col-span-2 mt-1 p-2 bg-[#181818] border border-[#222] rounded shadow-sm">
                         <label className="flex text-[9px] text-gray-500 uppercase tracking-wide mb-2 items-center gap-1">
                            Select Strike Criteria <span className="text-gray-400 cursor-help" title="Select how to choose the strike price">ⓘ</span>
                          </label>
                          
                          {/* 🚨 UPDATED: PERFECTLY ALIGNED 3-BOX LAYOUT */}
                          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                            
                            {/* Primary Selection Dropdown (Box 1) */}
                            <div className="w-full flex-1">
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

                            {/* Option 1: ATM/ITM/OTM Dropdown (Box 2) */}
                            {currentCriteria === 'Strike Type' && (
                              <div className="w-full flex-1">
                                <select 
                                  value={currentStrikeType} 
                                  onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} 
                                  className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                >
                                  <option value="ATM">ATM</option>
                                  <option value="ITM">ITM</option>
                                  <option value="OTM">OTM</option>
                                </select>
                              </div>
                            )}

                            {/* Option 1: Distance Dropdown (Box 3 - Only visible for ITM/OTM) */}
                            {currentCriteria === 'Strike Type' && (currentStrikeType === 'OTM' || currentStrikeType === 'ITM') && (
                              <div className="w-full flex-1">
                                <select 
                                  value={currentDistance} 
                                  onChange={(e) => updateLeg(leg.id, 'strikeDistance', Number(e.target.value))} 
                                  className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                >
                                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                      {num} ({num * stepSize} Pts {currentStrikeType})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Option 2: Closest Premium Target */}
                            {currentCriteria === 'Closest Premium' && (
                              <div className="w-full flex-1 flex items-center gap-2">
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
                              <div className="w-full flex-1 flex items-center gap-2">
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
                          <input type="number" value={currentTrailX} onChange={(e) => updateLeg(leg.id, 'trailX', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
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
                          <input type="number" value={currentTrailY} onChange={(e) => updateLeg(leg.id, 'trailY', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-yellow-600" placeholder="0" />
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
                    <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-[#222]">
                      <label className="flex flex-col items-center justify-center p-1 bg-[#161616] border border-[#252525] rounded cursor-pointer select-none hover:bg-[#1a1a1a] transition-colors">
                        <span className="text-[8px] text-gray-400 font-medium mb-1">Wait Candle Close</span>
                        <input type="checkbox" checked={leg.waitForCandleClose || false} onChange={(e) => updateLeg(leg.id, 'waitForCandleClose', e.target.checked)} className="rounded text-blue-500 w-3 h-3 bg-[#111] border-[#333]" />
                      </label>
                      
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

      {/* 🛡️ COMBINED PREMIUM RISK SECTION (CLEANED UP & DEDUPLICATED) */}
      <div className="mt-5 pt-4 border-t border-[#2d2d2d] bg-[#1a1a1a] p-4 rounded-lg">
        <h4 className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          🔗 Combined Premium Target & Stoploss
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Combined Premium Target */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Combined Premium Target</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={combinedPremiumTarget || ''}
                onChange={(e) => setCombinedPremiumTarget && setCombinedPremiumTarget(e.target.value)}
                className="w-full bg-[#121212] text-white p-2 rounded border border-[#333] focus:border-blue-500 focus:outline-none text-xs transition-colors"
                placeholder="e.g. 150"
              />
              <select
                value={normalizeUnit(combinedPremiumTargetUnit)}
                onChange={(e) => setCombinedPremiumTargetUnit && setCombinedPremiumTargetUnit(e.target.value)}
                className="bg-[#121212] text-white p-2 rounded border border-[#333] focus:border-blue-500 focus:outline-none text-xs transition-colors cursor-pointer"
              >
                <option value="Pts">Pts</option>
                <option value="%">%</option>
                <option value="Rs">Rs</option>
              </select>
            </div>
          </div>
          
          {/* Combined Premium Stop Loss */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Combined Premium Stop Loss</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={combinedPremiumSL || ''}
                onChange={(e) => setCombinedPremiumSL && setCombinedPremiumSL(e.target.value)}
                className="w-full bg-[#121212] text-white p-2 rounded border border-[#333] focus:border-orange-500 focus:outline-none text-xs transition-colors"
                placeholder="e.g. 50"
              />
              <select
                value={normalizeUnit(combinedPremiumSLUnit)}
                onChange={(e) => setCombinedPremiumSLUnit && setCombinedPremiumSLUnit(e.target.value)}
                className="bg-[#121212] text-white p-2 rounded border border-[#333] focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
              >
                <option value="Pts">Pts</option>
                <option value="%">%</option>
                <option value="Rs">Rs</option>
              </select>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LegsPanel;