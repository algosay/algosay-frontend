import React, { useState } from 'react';
import { normalizeCriteria, normalizeUnit, normalizeSegment, INDEX_STEP_SIZES } from './utils';
import { INPUT, SELECT, NUM, Field, UnitField, Check, SubHead } from './ui';

const on = (v) => Number(v) > 0;

// Bordered group box used inside every leg tab
const Group = ({ title, caption, className = '', children }) => (
  <div className={`rounded-md border border-[#C9D1DD] bg-[#FAFBFC] p-2.5 ${className}`}>
    {title && <SubHead title={title} caption={caption} />}
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// One leg = one bordered card. Entry is always visible; Risk,
// Trail & lock, Exit rules live in tabs (count badge shows
// how many rules are set, so nothing is hidden by accident).
// ─────────────────────────────────────────────────────────────
const LegCard = ({ leg, index, updateLeg, removeLeg }) => {
  const [tab, setTab] = useState('entry');

  const currentCriteria = normalizeCriteria(leg.strikeCriteria || leg.strike_criteria);
  const currentSlUnit = normalizeUnit(leg.slUnit || leg.sl_unit);
  const currentTargetUnit = normalizeUnit(leg.targetUnit || leg.target_unit);
  const targetPremiumVal = leg.targetPremium ?? leg.target_premium ?? leg.premium ?? '';

  const currentSegment = normalizeSegment(leg.segment, leg.optionType || leg.option_type || leg.type);

  const currentTrailX = leg.trailX ?? leg.trailMoveX ?? leg.trail_x ?? '';
  const currentTrailY = leg.trailY ?? leg.trailPointY ?? leg.trailMoveY ?? leg.trail_y ?? '';

  const rawEntryTime = leg.entryTime || leg.entry_time || '';
  const isDynamicLeg = String(rawEntryTime).toLowerCase() === 'dynamic';

  const currentPosition = (leg.position || leg.action || 'BUY').toString().toUpperCase() === 'SELL' ? 'SELL' : 'BUY';
  const isSell = currentPosition === 'SELL';

  const currentAsset = leg.ticker || leg.asset || 'NIFTY';
  const stepSize = INDEX_STEP_SIZES[currentAsset] || 50;
  const currentDistance = leg.strikeDistance || leg.strike_distance || 1;
  const currentStrikeType = leg.strikeType || leg.strike_type || 'OTM';

  const currentOptionType = leg.optionType || leg.option_type || leg.type || 'CE';

  const slReentryVal = leg.sl_reentry_count ?? leg.sl_reentry ?? leg.slReentry ?? 0;
  const targetReexVal = leg.target_reexecute ?? leg.targetReexecute ?? leg.target_reentry ?? 0;

  // ── Plain-language one-line summary ──
  let strikeText = '';
  if (currentSegment === 'Options') {
    if (currentCriteria === 'Strike Type') {
      strikeText = currentStrikeType === 'ATM' ? 'ATM' : `${currentDistance} ${currentStrikeType}`;
    } else if (currentCriteria === '% of Spot') {
      strikeText = `${leg.spotPercent ?? 0}% ${currentStrikeType === 'ITM' ? 'ITM' : 'OTM'}`;
    } else if (currentCriteria === 'Straddle Width') {
      strikeText = `${leg.straddleMultiplier ?? 1}x straddle ${currentStrikeType === 'ITM' ? 'ITM' : 'OTM'}`;
    } else if (currentCriteria === 'Closest Premium') {
      strikeText = `premium ≈ ${targetPremiumVal || 0}`;
    } else if (currentCriteria === 'Premium Range') {
      strikeText = `premium ${leg.lowerPremium || leg.lower_premium || 0}–${leg.upperPremium || leg.upper_premium || 0}`;
    }
  }
  const summaryParts = [
    `${leg.lots || 1} lot${(leg.lots || 1) > 1 ? 's' : ''}`,
    currentAsset,
    currentSegment === 'Options' ? `${strikeText} ${currentOptionType}` : currentSegment,
    currentSegment === 'Options' ? (leg.expiryType || leg.expiry_type || 'Current Week') : null,
    `${isDynamicLeg ? 'dynamic entry' : (rawEntryTime || '--:--')} to ${leg.exitTime || leg.exit_time || '--:--'}`,
  ].filter(Boolean);

  // ── Count of rules set per tab ──
  const riskCount = [
    leg.stopLoss ?? leg.stop_loss,
    leg.target,
    leg.spotSL ?? leg.spot_sl,
    leg.spotTarget ?? leg.spot_target,
    slReentryVal,
    targetReexVal,
  ].filter(on).length;
  const trailCount =
    [currentTrailX, currentTrailY, leg.slToCostTrigger ?? leg.sl_to_cost_trigger, leg.lockTrigger ?? leg.lock_trigger].filter(on).length +
    ((leg.costToCost ?? leg.cost_to_cost) ? 1 : 0);
  const exitCount =
    (leg.slOnClose ? 1 : 0) + (leg.moveOtherToCost ? 1 : 0) + (leg.noProfitExitTime ? 1 : 0);

  const tabs = [
    { id: 'entry', label: 'Entry', n: 0 },
    { id: 'risk', label: 'Risk', n: riskCount },
    { id: 'trail', label: 'Trail & lock', n: trailCount },
    { id: 'exit', label: 'Exit rules', n: exitCount },
  ];

  return (
    <div className="flex overflow-hidden rounded-lg border border-[#B8C1D0] bg-white transition-colors hover:border-[#8E9AB0]">
      {/* side colour = BUY / SELL */}
      <div className={`w-1.5 shrink-0 ${isSell ? 'bg-[#D64545]' : 'bg-[#1F9D6B]'}`} />

      <div className="min-w-0 flex-1">
        {/* ───── LEG HEADER ───── */}
        <div className="flex items-center gap-2 border-b border-[#D5DBE5] bg-[#F7F8FA] px-3 py-2">
          <span className="font-num text-[11px] font-semibold text-[#7C879A]">L{index + 1}</span>
          <span className={`rounded px-1.5 py-px text-[10.5px] font-bold ${isSell ? 'bg-[#FDECEC] text-[#B42F2F]' : 'bg-[#E4F6EE] text-[#157550]'}`}>
            {currentPosition}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#121A2B]">{summaryParts.join(' · ')}</span>
          <button onClick={() => removeLeg(leg.id)} className="rounded border border-transparent px-1.5 text-[13px] leading-6 text-[#9AA4B5] transition-colors hover:border-[#F3C5C5] hover:bg-[#FDECEC] hover:text-[#B42F2F]" title="Remove leg">✕</button>
        </div>

        {/* ───── TABS ───── */}
        <div className="flex gap-1 border-b border-[#D5DBE5] px-3 pt-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-2.5 pb-1.5 pt-0.5 text-[11.5px] font-medium transition-colors ${
                tab === t.id ? 'border-[#121A2B] text-[#121A2B]' : 'border-transparent text-[#7C879A] hover:text-[#121A2B]'
              }`}
            >
              {t.label}
              {t.n > 0 && <span className="ml-1.5 rounded-full bg-[#121A2B] px-1.5 font-num text-[10px] leading-4 text-white">{t.n}</span>}
            </button>
          ))}
        </div>

        <div className="p-3">
          {/* ═════════ ENTRY ═════════ */}
          {tab === 'entry' && (
            <div className="space-y-2.5">
              <Group title="Trade basics" caption="What to trade, which side and when.">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  <Field label="Asset">
                    <select value={currentAsset} onChange={(e) => updateLeg(leg.id, 'ticker', e.target.value)} className={SELECT}>
                      <option value="NIFTY">NIFTY 50</option>
                      <option value="BANKNIFTY">BANKNIFTY</option>
                      <option value="FINNIFTY">FINNIFTY</option>
                      <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                      <option value="SENSEX">SENSEX</option>
                    </select>
                  </Field>
                  <Field label="Timeframe">
                    <select value={leg.timeframe || '15m'} onChange={(e) => updateLeg(leg.id, 'timeframe', e.target.value)} className={SELECT}>
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
                  </Field>
                  <Field label="Segment">
                    <select value={currentSegment} onChange={(e) => updateLeg(leg.id, 'segment', e.target.value)} className={`${SELECT} font-medium`}>
                      <option value="Spot">Spot (Cash)</option>
                      <option value="Futures">Futures</option>
                      <option value="Options">Options</option>
                    </select>
                  </Field>
                  <Field label="Position">
                    <select value={currentPosition} onChange={(e) => updateLeg(leg.id, 'position', e.target.value)} className={SELECT}>
                      <option value="BUY">Buy</option>
                      <option value="SELL">Sell</option>
                    </select>
                  </Field>
                  <Field label="Lots">
                    <input type="number" value={leg.lots || 1} onChange={(e) => updateLeg(leg.id, 'lots', Number(e.target.value))} className={`${NUM} text-center font-semibold`} />
                  </Field>
                  <Field label="Entry time">
                    {isDynamicLeg ? (
                      <input
                        type="text"
                        value="Dynamic (Condition Loop)"
                        disabled
                        className="h-7 w-full cursor-not-allowed rounded-md border border-[#E2B04A] bg-[#FFF8E6] px-2 text-center text-[11px] font-semibold text-[#8A5A00]"
                        title="Controlled dynamically by candle condition loop"
                      />
                    ) : (
                      <input type="time" value={rawEntryTime} onChange={(e) => updateLeg(leg.id, 'entryTime', e.target.value)} className={`${INPUT} font-num`} />
                    )}
                  </Field>
                  <Field label="Exit time">
                    <input type="text" value={leg.exitTime || leg.exit_time || ''} onChange={(e) => updateLeg(leg.id, 'exitTime', e.target.value)} className={`${INPUT} font-num`} placeholder="15:15" />
                  </Field>
                </div>
              </Group>

              {/* Options contract: only when segment is Options */}
              {currentSegment === 'Options' && (
                <Group title="Option contract" caption="Expiry, call / put and how the strike is picked.">
                  <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-2 lg:grid-cols-12">
                    <Field label="Expiry" className="lg:col-span-2">
                      <select value={leg.expiryType || leg.expiry_type || 'Current Week'} onChange={(e) => updateLeg(leg.id, 'expiryType', e.target.value)} className={SELECT}>
                        <option value="Current Week">Current Week</option>
                        <option value="Next Week">Next Week</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </Field>
                    <Field label="Option type" className="lg:col-span-2">
                      <select value={currentOptionType} onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)} className={SELECT}>
                        <option value="CE">CE (Call)</option>
                        <option value="PE">PE (Put)</option>
                      </select>
                    </Field>

                    <Field label="How to pick the strike" className="sm:col-span-2 lg:col-span-8">
                      <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
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
                            className="h-7 w-full cursor-pointer rounded-md border border-[#2F5BEA]/50 bg-[#F4F7FF] px-1.5 text-[12px] font-medium text-[#121A2B] outline-none transition-colors focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15"
                          >
                            <option value="Strike Type">Strike Type (ATM/ITM/OTM)</option>
                            <option value="% of Spot">% of Spot</option>
                            <option value="Closest Premium">Closest Premium</option>
                            <option value="Premium Range">Premium Range</option>
                            <option value="Straddle Width">Straddle Width</option>
                          </select>
                        </div>

                        {currentCriteria === 'Strike Type' && (
                          <div className="w-full flex-1">
                            <select value={currentStrikeType} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className={SELECT}>
                              <option value="ATM">ATM</option>
                              <option value="ITM">ITM</option>
                              <option value="OTM">OTM</option>
                            </select>
                          </div>
                        )}

                        {currentCriteria === 'Strike Type' && (currentStrikeType === 'OTM' || currentStrikeType === 'ITM') && (
                          <div className="w-full flex-1">
                            <select value={currentDistance} onChange={(e) => updateLeg(leg.id, 'strikeDistance', Number(e.target.value))} className={SELECT}>
                              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                  {num} ({num * stepSize} Pts {currentStrikeType})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {currentCriteria === '% of Spot' && (
                          <>
                            <div className="w-full flex-1">
                              <select value={currentStrikeType === 'ITM' ? 'ITM' : 'OTM'} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className={SELECT}>
                                <option value="OTM">OTM</option>
                                <option value="ITM">ITM</option>
                              </select>
                            </div>
                            <div className="flex w-full flex-1 items-center gap-1.5">
                              <input
                                type="number" step="0.1" min="0"
                                value={leg.spotPercent ?? ''}
                                onChange={(e) => updateLeg(leg.id, 'spotPercent', e.target.value === '' ? '' : Number(e.target.value))}
                                className={NUM}
                              />
                              <span className="whitespace-nowrap text-[11px] text-[#7C879A]">% of spot</span>
                            </div>
                          </>
                        )}

                        {currentCriteria === 'Straddle Width' && (
                          <>
                            <div className="w-full flex-1">
                              <select value={currentStrikeType === 'ITM' ? 'ITM' : 'OTM'} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className={SELECT}>
                                <option value="OTM">OTM</option>
                                <option value="ITM">ITM</option>
                              </select>
                            </div>
                            <div className="flex w-full flex-1 items-center gap-1.5">
                              <select value={leg.straddleMultiplier ?? 1} onChange={(e) => updateLeg(leg.id, 'straddleMultiplier', Number(e.target.value))} className={SELECT}>
                                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3].map((m) => (
                                  <option key={m} value={m}>{m}x Straddle</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}

                        {currentCriteria === 'Closest Premium' && (
                          <div className="flex w-full flex-1 items-center gap-1.5">
                            <span className="whitespace-nowrap text-[11px] text-[#7C879A]">Premium ≈</span>
                            <input
                              type="number"
                              value={targetPremiumVal}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                updateLeg(leg.id, 'targetPremium', val);
                                updateLeg(leg.id, 'target_premium', val);
                              }}
                              className={NUM}
                              placeholder="e.g. 50"
                            />
                          </div>
                        )}

                        {currentCriteria === 'Premium Range' && (
                          <div className="flex w-full flex-1 items-center gap-1.5">
                            <span className="text-[11px] text-[#7C879A]">From</span>
                            <input
                              type="number"
                              value={leg.lowerPremium || leg.lower_premium || ''}
                              onChange={(e) => updateLeg(leg.id, 'lowerPremium', Number(e.target.value))}
                              className={NUM}
                              placeholder="50"
                            />
                            <span className="text-[11px] text-[#7C879A]">to</span>
                            <input
                              type="number"
                              value={leg.upperPremium || leg.upper_premium || ''}
                              onChange={(e) => updateLeg(leg.id, 'upperPremium', Number(e.target.value))}
                              className={NUM}
                              placeholder="200"
                            />
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                </Group>
              )}
            </div>
          )}

          {/* ═════════ RISK ═════════ */}
          {tab === 'risk' && (
            <div className="grid gap-2.5 md:grid-cols-2">
              <Group title="Premium stop loss & target" caption="Measured on the option / futures price of this leg.">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Stop loss">
                    <UnitField
                      units={['%', 'Pts', 'Rs']}
                      value={leg.stopLoss ?? leg.stop_loss ?? ''}
                      onValue={(e) => updateLeg(leg.id, 'stopLoss', Number(e.target.value))}
                      unit={currentSlUnit}
                      onUnit={(e) => {
                        const val = e.target.value;
                        updateLeg(leg.id, 'slUnit', val);
                        updateLeg(leg.id, 'sl_unit', val);
                      }}
                    />
                  </Field>
                  <Field label="Stop loss re-entry (times)">
                    <input
                      type="number"
                      min="0"
                      value={slReentryVal}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateLeg(leg.id, 'sl_reentry_count', val);
                        updateLeg(leg.id, 'slReentry', val);
                      }}
                      className={NUM}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Target">
                    <UnitField
                      units={['%', 'Pts', 'Rs']}
                      value={leg.target ?? ''}
                      onValue={(e) => updateLeg(leg.id, 'target', Number(e.target.value))}
                      unit={currentTargetUnit}
                      onUnit={(e) => {
                        const val = e.target.value;
                        updateLeg(leg.id, 'targetUnit', val);
                        updateLeg(leg.id, 'target_unit', val);
                      }}
                    />
                  </Field>
                  <Field label="Target re-execute (times)">
                    <input
                      type="number"
                      min="0"
                      value={targetReexVal}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateLeg(leg.id, 'target_reexecute', val);
                        updateLeg(leg.id, 'targetReexecute', val);
                      }}
                      className={NUM}
                      placeholder="0"
                    />
                  </Field>
                </div>
              </Group>

              <Group title="Underlying stop loss & target" caption="Measured on the index / spot price instead of the premium.">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Spot SL">
                    <UnitField
                      value={leg.spotSL ?? leg.spot_sl ?? ''}
                      onValue={(e) => updateLeg(leg.id, 'spotSL', Number(e.target.value))}
                      unit={leg.spotSLUnit || leg.spot_sl_unit || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'spotSLUnit', e.target.value)}
                    />
                  </Field>
                  <Field label="Spot target">
                    <UnitField
                      value={leg.spotTarget ?? leg.spot_target ?? ''}
                      onValue={(e) => updateLeg(leg.id, 'spotTarget', Number(e.target.value))}
                      unit={leg.spotTargetUnit || leg.spot_target_unit || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'spotTargetUnit', e.target.value)}
                    />
                  </Field>
                </div>
              </Group>
            </div>
          )}

          {/* ═════════ TRAIL & LOCK ═════════ */}
          {tab === 'trail' && (
            <div className="grid gap-2.5 md:grid-cols-2">
              <Group title="Trailing stop loss" caption="For every X the price moves in profit, the SL moves up by Y.">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Every move X">
                    <UnitField
                      value={currentTrailX}
                      onValue={(e) => updateLeg(leg.id, 'trailX', Number(e.target.value))}
                      unit={leg.trailUnitX || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'trailUnitX', e.target.value)}
                    />
                  </Field>
                  <Field label="SL moves Y">
                    <UnitField
                      value={currentTrailY}
                      onValue={(e) => updateLeg(leg.id, 'trailY', Number(e.target.value))}
                      unit={leg.trailUnitY || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'trailUnitY', e.target.value)}
                    />
                  </Field>
                </div>
              </Group>

              <Group title="SL to cost" caption="Once profit reaches the trigger, SL jumps to your entry price.">
                <div className="grid grid-cols-2 items-end gap-2">
                  <Field label="Profit trigger">
                    <UnitField
                      value={leg.slToCostTrigger ?? leg.sl_to_cost_trigger ?? ''}
                      onValue={(e) => updateLeg(leg.id, 'slToCostTrigger', Number(e.target.value))}
                      unit={leg.slToCostUnit || leg.sl_to_cost_unit || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'slToCostUnit', e.target.value)}
                    />
                  </Field>
                  <div className="pb-1.5">
                    <Check label="Cost-to-cost (SL to entry)" checked={!!(leg.costToCost ?? leg.cost_to_cost)} onChange={(e) => updateLeg(leg.id, 'costToCost', e.target.checked)} />
                  </div>
                </div>
              </Group>

              <Group className="md:col-span-2" title="Lock and trail" caption="When profit reaches the trigger, lock a minimum profit; after that, for every X more profit the lock moves up by Y.">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <Field label="Trigger">
                    <input type="number" value={leg.lockTrigger ?? leg.lock_trigger ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrigger', Number(e.target.value))} className={NUM} placeholder="0" />
                  </Field>
                  <Field label="Lock profit">
                    <input type="number" value={leg.lockProfit ?? leg.lock_profit ?? ''} onChange={(e) => updateLeg(leg.id, 'lockProfit', Number(e.target.value))} className={NUM} placeholder="0" />
                  </Field>
                  <Field label="Trail X">
                    <input type="number" value={leg.lockTrailX ?? leg.lock_trail_x ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrailX', Number(e.target.value))} className={NUM} placeholder="0" />
                  </Field>
                  <Field label="Trail Y">
                    <input type="number" value={leg.lockTrailY ?? leg.lock_trail_y ?? ''} onChange={(e) => updateLeg(leg.id, 'lockTrailY', Number(e.target.value))} className={NUM} placeholder="0" />
                  </Field>
                  <Field label="Unit">
                    <select value={leg.lockUnit || leg.lock_unit || 'Pts'} onChange={(e) => updateLeg(leg.id, 'lockUnit', e.target.value)} className={SELECT}>
                      <option value="Pts">Pts</option>
                      <option value="%">%</option>
                    </select>
                  </Field>
                </div>
              </Group>
            </div>
          )}

          {/* ═════════ EXIT RULES ═════════ */}
          {tab === 'exit' && (
            <div className="grid gap-2.5 md:grid-cols-2">
              <Group title="Exit rules" caption="Extra ways this leg can close.">
                <div className="flex flex-col gap-2">
                  <Check label="SL on candle close" checked={!!leg.slOnClose} onChange={(e) => updateLeg(leg.id, 'slOnClose', e.target.checked)} />
                  <Check label="Other leg SL hit, move my SL to cost" checked={!!leg.moveOtherToCost} onChange={(e) => updateLeg(leg.id, 'moveOtherToCost', e.target.checked)} />
                </div>
              </Group>

              <Group title="No-profit exit" caption="Exit at this time if profit is below the minimum.">
                <div className="grid grid-cols-5 gap-2">
                  <input type="time" value={leg.noProfitExitTime || ''} onChange={(e) => updateLeg(leg.id, 'noProfitExitTime', e.target.value)} className={`${INPUT} col-span-3 font-num`} />
                  <div className="col-span-2">
                    <UnitField
                      value={leg.noProfitMin ?? 0}
                      onValue={(e) => updateLeg(leg.id, 'noProfitMin', Number(e.target.value))}
                      unit={leg.noProfitUnit || 'Pts'}
                      onUnit={(e) => updateLeg(leg.id, 'noProfitUnit', e.target.value)}
                    />
                  </div>
                </div>
              </Group>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LegsPanel = ({
  legs, addLeg, updateLeg, removeLeg,
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit,
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit,
}) => {
  return (
    <div className="space-y-2.5">

      {/* ───── Legs box ───── */}
      <section className="overflow-hidden rounded-xl border border-[#C9D1DD] bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-[#D5DBE5] bg-[#F7F8FA] px-3 py-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <h3 className="text-[12px] font-semibold text-[#121A2B]">Legs</h3>
            <span className="truncate text-[11px] text-[#7C879A]">{legs.length} configured</span>
          </div>
          <button onClick={addLeg} className="h-7 rounded-md bg-[#121A2B] px-3 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#25314D]">
            + Add leg
          </button>
        </header>

        <div className="p-3">
          {legs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#AEB8C7] bg-[#FAFBFC] py-6 text-center text-[12px] text-[#7C879A]">
              No legs yet. Ask the AI assistant, or use “Add leg” to start.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {legs.map((leg, index) => (
                <LegCard key={leg.id || index} leg={leg} index={index} updateLeg={updateLeg} removeLeg={removeLeg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───── Combined premium risk (all legs together) ───── */}
      <section className="overflow-hidden rounded-xl border border-[#C9D1DD] bg-white">
        <header className="border-b border-[#D5DBE5] bg-[#F7F8FA] px-3 py-2">
          <h3 className="text-[12px] font-semibold text-[#121A2B]">Combined premium</h3>
          <p className="text-[10.5px] leading-snug text-[#7C879A]">Target and stop loss on the total premium of all legs.</p>
        </header>
        <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2">
          <Group>
            <Field label="Target">
              <UnitField
                units={['Pts', '%', 'Rs']}
                value={combinedPremiumTarget || ''}
                onValue={(e) => setCombinedPremiumTarget && setCombinedPremiumTarget(e.target.value)}
                unit={normalizeUnit(combinedPremiumTargetUnit)}
                onUnit={(e) => setCombinedPremiumTargetUnit && setCombinedPremiumTargetUnit(e.target.value)}
                placeholder="e.g. 150"
              />
            </Field>
          </Group>
          <Group>
            <Field label="Stop loss">
              <UnitField
                units={['Pts', '%', 'Rs']}
                value={combinedPremiumSL || ''}
                onValue={(e) => setCombinedPremiumSL && setCombinedPremiumSL(e.target.value)}
                unit={normalizeUnit(combinedPremiumSLUnit)}
                onUnit={(e) => setCombinedPremiumSLUnit && setCombinedPremiumSLUnit(e.target.value)}
                placeholder="e.g. 50"
              />
            </Field>
          </Group>
        </div>
      </section>

    </div>
  );
};

export default LegsPanel;