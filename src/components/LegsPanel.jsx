import React from 'react';
import { normalizeCriteria, normalizeUnit, normalizeSegment, INDEX_STEP_SIZES } from './utils';

// 🎨 Shared compact UI helpers (layout only - no logic changes)
const Group = ({ title, titleColor = 'text-gray-400', className = '', children }) => (
  <div className={`bg-[#181818] border border-[#222] rounded-lg p-2 ${className}`}>
    <div className={`text-[9px] font-bold uppercase tracking-wider mb-1.5 ${titleColor}`}>{title}</div>
    {children}
  </div>
);

const Lbl = ({ color = 'text-gray-500', children }) => (
  <label className={`block text-[9px] uppercase tracking-wide mb-0.5 ${color}`}>{children}</label>
);

const LegsPanel = ({ 
  legs, addLeg, updateLeg, removeLeg,
  // 🟢 NEW UPDATE: Combined Premium Props added to LegsPanel (WITH UNITS)
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit, 
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit 
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
        // 🚀 HORIZONTAL LAYOUT: each leg is now a full-width card (one leg per row)
        <div className="flex flex-col gap-3">
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

            // Option type (used for the header badge + dropdown)
            const currentOptionType = leg.optionType || leg.option_type || leg.type || 'CE';

            return (
              <div key={leg.id || index} className="bg-[#121212] rounded-xl border border-[#333] relative hover:border-gray-700 transition-all shadow-inner">

                {/* ───── LEG HEADER STRIP ───── */}
                <div className="flex justify-between items-center px-3 py-1.5 border-b border-[#222]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-blue-400 tracking-wider">LEG ACCELERATION #{index + 1}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${currentPosition === 'SELL' ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                      {currentPosition}
                    </span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#222] text-gray-300">
                      {currentAsset} · {currentSegment}{currentSegment === 'Options' ? ` · ${currentOptionType}` : ''}
                    </span>
                  </div>
                  <button onClick={() => removeLeg(leg.id)} className="text-gray-500 hover:text-red-400 text-xs transition-colors p-0.5">✕</button>
                </div>

                {/* ───── LEG BODY: groups laid out side-by-side ───── */}
                <div className="p-2 grid grid-cols-1 lg:grid-cols-12 gap-2">

                  {/* ① BASIC SETUP (Integrated leg fields + Segment + Position + Lots) */}
                  <Group title="① Basic Setup" titleColor="text-blue-400" className="lg:col-span-12">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      <div>
                        <Lbl>Asset</Lbl>
                        <select value={currentAsset} onChange={(e) => updateLeg(leg.id, 'ticker', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                          <option value="NIFTY">NIFTY 50</option>
                          <option value="BANKNIFTY">BANKNIFTY</option>
                          <option value="FINNIFTY">FINNIFTY</option>
                          <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                          <option value="SENSEX">SENSEX</option>
                        </select>
                      </div>
                      <div>
                        <Lbl>Timeframe</Lbl>
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
                        <Lbl>Entry Time</Lbl>
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
                        <Lbl>Exit Time</Lbl>
                        <input type="text" value={leg.exitTime || leg.exit_time || ''} onChange={(e) => updateLeg(leg.id, 'exitTime', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500" placeholder="e.g. 15:15" />
                      </div>

                      {/* 🚨 UPDATED: Segment Data Perfectly Matched to AI Backend */}
                      <div>
                        <Lbl>Segment</Lbl>
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
                        <Lbl>Position</Lbl>
                        <select value={currentPosition} onChange={(e) => updateLeg(leg.id, 'position', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                          <option value="BUY">Buy</option>
                          <option value="SELL">Sell</option>
                        </select>
                      </div>

                      <div>
                        <Lbl>Lots Allocation</Lbl>
                        <input type="number" value={leg.lots || 1} onChange={(e) => updateLeg(leg.id, 'lots', Number(e.target.value))} className="w-full bg-[#121212] border border-[#333] rounded p-1.5 text-center text-xs text-gray-200 font-bold outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </Group>

                  {/* ② OPTIONS CONTRACT - 🚨 UPDATED: Display Options configuration when currentSegment is Options */}
                  {currentSegment === 'Options' && (
                    <Group title="② Options Contract (Expiry · Type · Strike)" titleColor="text-cyan-400" className="lg:col-span-12">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-end">
                        <div className="lg:col-span-2">
                          <Lbl>Expiry Type</Lbl>
                          <select value={leg.expiryType || leg.expiry_type || 'Current Week'} onChange={(e) => updateLeg(leg.id, 'expiryType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="Current Week">Current Week</option>
                            <option value="Next Week">Next Week</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>

                        <div className="lg:col-span-2">
                          <Lbl>Option Type</Lbl>
                          <select value={currentOptionType} onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500">
                            <option value="CE">CE (Call)</option>
                            <option value="PE">PE (Put)</option>
                          </select>
                        </div>

                        {/* 🎯 SMART STRIKE CRITERIA SECTION */}
                        <div className="sm:col-span-2 lg:col-span-8">
                          <label className="flex text-[9px] text-gray-500 uppercase tracking-wide mb-0.5 items-center gap-1">
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
                                  if (newCriteria === 'Strike Type') {
                                    updateLeg(leg.id, 'strikeType', 'ATM');
                                    updateLeg(leg.id, 'strikeDistance', 1);
                                  } else if (newCriteria === '% of Spot' || newCriteria === 'Straddle Width') {
                                    updateLeg(leg.id, 'strikeType', 'OTM');
                                    updateLeg(leg.id, 'strikeDistance', 0);
                                    if (newCriteria === '% of Spot') updateLeg(leg.id, 'spotPercent', 1);
                                    else updateLeg(leg.id, 'straddleMultiplier', 1);
                                  } else {
                                    updateLeg(leg.id, 'strikeType', '');
                                    updateLeg(leg.id, 'strikeDistance', 0);
                                  }
                                }}
                                className="w-full bg-[#1e1e1e] border border-blue-600 rounded p-1.5 text-xs text-blue-100 font-medium outline-none focus:border-blue-400"
                              >
                                <option value="Strike Type">Strike Type (ATM/ITM/OTM)</option>
                                <option value="% of Spot">% of Spot</option>
                                <option value="Closest Premium">Closest Premium</option>
                                <option value="Premium Range">Premium Range</option>
                                <option value="Straddle Width">Straddle Width</option>
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

                            {/* % of Spot */}
                            {currentCriteria === '% of Spot' && (
                              <>
                                <div className="w-full flex-1">
                                  <select
                                    value={currentStrikeType === 'ITM' ? 'ITM' : 'OTM'}
                                    onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)}
                                    className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                  >
                                    <option value="OTM">OTM</option>
                                    <option value="ITM">ITM</option>
                                  </select>
                                </div>
                                <div className="w-full flex-1 flex items-center gap-2">
                                  <input
                                    type="number" step="0.1" min="0"
                                    value={leg.spotPercent ?? ''}
                                    onChange={(e) => updateLeg(leg.id, 'spotPercent', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                  />
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap">% of Spot</span>
                                </div>
                              </>
                            )}

                            {/* Straddle Width */}
                            {currentCriteria === 'Straddle Width' && (
                              <>
                                <div className="w-full flex-1">
                                  <select
                                    value={currentStrikeType === 'ITM' ? 'ITM' : 'OTM'}
                                    onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)}
                                    className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                  >
                                    <option value="OTM">OTM</option>
                                    <option value="ITM">ITM</option>
                                  </select>
                                </div>
                                <div className="w-full flex-1 flex items-center gap-2">
                                  <select
                                    value={leg.straddleMultiplier ?? 1}
                                    onChange={(e) => updateLeg(leg.id, 'straddleMultiplier', Number(e.target.value))}
                                    className="w-full bg-[#1e1e1e] border border-[#333] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
                                  >
                                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3].map((m) => (
                                      <option key={m} value={m}>{m}x Straddle</option>
                                    ))}
                                  </select>
                                </div>
                              </>
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
                      </div>
                    </Group>
                  )}

                  {/* ③ 🎚️ STOP LOSS & TARGET WITH SMART UNIT DETECTOR */}
                  <Group title="③ Leg Stop Loss & Target (premium based)" titleColor="text-red-400" className="lg:col-span-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Lbl color="text-red-400">Stop Loss</Lbl>
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
                            <option value="Rs">Rs</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Lbl color="text-green-400">Target</Lbl>
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
                            <option value="Rs">Rs</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Group>

                  {/* ④ 🎯 SPOT / UNDERLYING SL & TARGET */}
                  <Group title="④ Spot / Underlying SL & Target (index based)" titleColor="text-orange-400" className="lg:col-span-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Lbl color="text-orange-400">Spot / Underlying SL</Lbl>
                        <div className="flex gap-1">
                          <input type="number" value={leg.spotSL ?? leg.spot_sl ?? ''} onChange={(e) => updateLeg(leg.id, 'spotSL', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-orange-500" placeholder="0" />
                          <select value={leg.spotSLUnit || leg.spot_sl_unit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'spotSLUnit', e.target.value)} className="w-1/3 bg-[#1e1e1e] border border-[#222] focus:border-orange-500 rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="Pts">Pts</option>
                            <option value="%">%</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Lbl color="text-lime-400">Spot / Underlying Target</Lbl>
                        <div className="flex gap-1">
                          <input type="number" value={leg.spotTarget ?? leg.spot_target ?? ''} onChange={(e) => updateLeg(leg.id, 'spotTarget', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-lime-500" placeholder="0" />
                          <select value={leg.spotTargetUnit || leg.spot_target_unit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'spotTargetUnit', e.target.value)} className="w-1/3 bg-[#1e1e1e] border border-[#222] focus:border-lime-500 rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="Pts">Pts</option>
                            <option value="%">%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Group>

                  {/* ⑤ Trailing SL Inputs */}
                  <Group title="⑤ Trailing SL (every X move → SL moves Y)" titleColor="text-yellow-500" className="lg:col-span-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Lbl color="text-yellow-500">Trail SL (Move X)</Lbl>
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
                        <Lbl color="text-yellow-500">Trail SL (Move Y)</Lbl>
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
                  </Group>

                  {/* ⑥ 🎯 SL TO COST (trigger) + COST-TO-COST */}
                  <Group title="⑥ SL to Cost" titleColor="text-sky-400" className="lg:col-span-6">
                    <div className="grid grid-cols-2 gap-2 items-end">
                      <div>
                        <Lbl color="text-sky-400">SL to Cost (profit trigger)</Lbl>
                        <div className="flex gap-1">
                          <input type="number" value={leg.slToCostTrigger ?? leg.sl_to_cost_trigger ?? ''} onChange={(e) => updateLeg(leg.id, 'slToCostTrigger', Number(e.target.value))} className="w-2/3 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-sky-500" placeholder="0" />
                          <select value={leg.slToCostUnit || leg.sl_to_cost_unit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'slToCostUnit', e.target.value)} className="w-1/3 bg-[#1e1e1e] border border-[#222] focus:border-sky-500 rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="Pts">Pts</option>
                            <option value="%">%</option>
                          </select>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-[10px] text-gray-300 cursor-pointer pb-1.5">
                        <input type="checkbox" className="accent-sky-500" checked={!!(leg.costToCost ?? leg.cost_to_cost)} onChange={(e) => updateLeg(leg.id, 'costToCost', e.target.checked)} />
                        Cost-to-Cost (SL → entry)
                      </label>
                    </div>
                  </Group>

                  {/* ⑦ 🔒 LOCK AND TRAIL (leg level): profit >= Trigger -> Lock Profit, apparam X move-ku Y trail */}
                  <Group title="⑦ 🔒 Lock and Trail (Trigger → Lock, then X → Y)" titleColor="text-violet-400" className="lg:col-span-12">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div>
                        <Lbl>Trigger</Lbl>
                        <input type="number" value={leg.lockTrigger ?? leg.lock_trigger ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrigger', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-violet-500" placeholder="0" />
                      </div>
                      <div>
                        <Lbl>Lock</Lbl>
                        <input type="number" value={leg.lockProfit ?? leg.lock_profit ?? ''} onChange={(e) => updateLeg(leg.id, 'lockProfit', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-violet-500" placeholder="0" />
                      </div>
                      <div>
                        <Lbl>Trail X</Lbl>
                        <input type="number" value={leg.lockTrailX ?? leg.lock_trail_x ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrailX', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-violet-500" placeholder="0" />
                      </div>
                      <div>
                        <Lbl>Trail Y</Lbl>
                        <input type="number" value={leg.lockTrailY ?? leg.lock_trail_y ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrailY', Number(e.target.value))} className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-violet-500" placeholder="0" />
                      </div>
                      <div>
                        <Lbl>Unit</Lbl>
                        <select value={leg.lockUnit || leg.lock_unit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'lockUnit', e.target.value)} className="w-full bg-[#1e1e1e] border border-[#222] focus:border-violet-500 rounded p-1.5 text-[10px] text-gray-300 outline-none">
                          <option value="Pts">Pts</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                  </Group>

                  {/* ⑧ 🧩 SL ON CLOSE / NO-PROFIT EXIT / MOVE OTHER LEG TO COST */}
                  <Group title="⑧ Exit Conditions" titleColor="text-rose-400" className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-[10px] text-gray-300 cursor-pointer">
                          <input type="checkbox" className="accent-orange-500" checked={!!leg.slOnClose} onChange={(e) => updateLeg(leg.id, 'slOnClose', e.target.checked)} />
                          SL on candle close
                        </label>
                        <label className="flex items-center gap-2 text-[10px] text-gray-300 cursor-pointer">
                          <input type="checkbox" className="accent-cyan-500" checked={!!leg.moveOtherToCost} onChange={(e) => updateLeg(leg.id, 'moveOtherToCost', e.target.checked)} />
                          Other leg SL hit → my SL to cost
                        </label>
                      </div>
                      <div>
                        <Lbl color="text-rose-400">No-profit exit (time, min profit)</Lbl>
                        <div className="flex gap-1">
                          <input type="time" value={leg.noProfitExitTime || ''} onChange={(e) => updateLeg(leg.id, 'noProfitExitTime', e.target.value)} className="w-1/2 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-rose-500" />
                          <input type="number" value={leg.noProfitMin ?? 0} onChange={(e) => updateLeg(leg.id, 'noProfitMin', Number(e.target.value))} className="w-1/4 bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-rose-500" placeholder="0" />
                          <select value={leg.noProfitUnit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'noProfitUnit', e.target.value)} className="w-1/4 bg-[#1e1e1e] border border-[#222] rounded p-1 text-[10px] text-gray-300 outline-none">
                            <option value="Pts">Pts</option>
                            <option value="%">%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Group>

                  {/* ⑨ 🚨 CORRECTED: SL Re-entry & Target Re-execute (Perfectly synced with AI JSON keys) */}
                  <Group title="⑨ Re-entry" titleColor="text-amber-500" className="lg:col-span-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Lbl color="text-amber-500">SL Re-entry Count</Lbl>
                        <input 
                          type="number" 
                          value={leg.sl_reentry_count ?? leg.sl_reentry ?? leg.slReentry ?? 0} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateLeg(leg.id, 'sl_reentry_count', val); // Strictly updating JSON Key
                            updateLeg(leg.id, 'slReentry', val); // State Fallback
                          }} 
                          className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-amber-500" 
                          placeholder="0" 
                        />
                      </div>
                      <div>
                        <Lbl color="text-emerald-500">Target Re-execute</Lbl>
                        <input 
                          type="number" 
                          value={leg.target_reexecute ?? leg.targetReexecute ?? leg.target_reentry ?? 0} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateLeg(leg.id, 'target_reexecute', val); // Strictly updating JSON Key
                            updateLeg(leg.id, 'targetReexecute', val); // State Fallback
                          }} 
                          className="w-full bg-[#1e1e1e] border border-[#222] rounded p-1.5 text-xs text-gray-300 outline-none focus:border-emerald-500" 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                  </Group>

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