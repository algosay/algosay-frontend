import React, { useState } from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { calculateLiveMargin } from './utils';
import { SELECT, NUM, Field, UnitField, Check } from './ui';

const normalizeUnit = (unit) => {
  if (!unit) return "Pts";
  const u = String(unit).toLowerCase().trim();
  if (u.includes("%") || u.includes("percent") || u === "per" || u === "pct") return "%";
  if (u === "rs" || u.includes("rupee") || u.includes("₹") || u.includes("inr")) return "Rs";
  return "Pts";
};

// Section heading sits OUTSIDE the card (like the reference)
const Section = ({ title, hint, children }) => (
  <section>
    <div className="mb-1.5 flex items-baseline gap-2 px-0.5">
      <h3 className="text-[13px] font-semibold text-[#121A2B]">{title}</h3>
      {hint && <span className="text-[11px] text-[#7C879A]">{hint}</span>}
    </div>
    {children}
  </section>
);

const Card = ({ title, use, children, className = '' }) => (
  <div className={`rounded-lg border border-[#E3E8EF] bg-white p-3 ${className}`}>
    {title && (
      <div className="mb-2 border-b border-[#EEF1F5] pb-2">
        <p className="text-[12px] font-semibold text-[#121A2B]">{title}</p>
        {use && <p className="text-[10.5px] leading-snug text-[#7C879A]">{use}</p>}
      </div>
    )}
    {children}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${on ? 'bg-[#121A2B]' : 'bg-[#C3CAD6]'}`}
  >
    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
  </button>
);

// One feature = label + one-line use + toggle. Off => fields greyed & locked
const Item = ({ label, use, on, onToggle, children }) => (
  <div className="border-b border-dashed border-[#E3E8EF] py-2.5 first:pt-0 last:border-0 last:pb-0">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold text-[#2B3547]">{label}</p>
        {use && <p className="text-[10.5px] leading-snug text-[#7C879A]">{use}</p>}
      </div>
      <Toggle on={on} onChange={onToggle} />
    </div>
    <div className={`mt-2 transition-opacity ${on ? '' : 'pointer-events-none opacity-40'}`}>{children}</div>
  </div>
);

const StrategyConfig = ({
  sellTicker, setSellTicker, sellTimeframe, setSellTimeframe, sellUnderlyingFrom, setSellUnderlyingFrom,
  sellEntryTime, setSellEntryTime, sellExitTime, setSellExitTime,
  sellStopLoss, setSellStopLoss, sellSlUnit, setSellSlUnit,
  sellTarget, setSellTarget, sellTargetUnit, setSellTargetUnit,

  buyTicker, setBuyTicker, buyTimeframe, setBuyTimeframe, buyUnderlyingFrom, setBuyUnderlyingFrom,
  buyEntryTime, setBuyEntryTime, buyExitTime, setBuyExitTime,
  buyStopLoss, setBuyStopLoss, buySlUnit, setBuySlUnit,
  buyTarget, setBuyTarget, buyTargetUnit, setBuyTargetUnit,

  fromDate, setFromDate, toDate, setToDate,
  trailMoveX, setTrailMoveX, trailPointY, setTrailPointY,
  indicators, addIndicator, updateIndicator, removeIndicator,
  legs, addLeg, updateLeg, removeLeg, setIsConfirmed,

  ticker, setTicker, timeframe, setTimeframe, underlyingFrom, setUnderlyingFrom, qty, setQty,
  transactionType, setTransactionType, entryTime, setEntryTime, exitTime, setExitTime,
  overallSL, setOverallSL, slUnit, setSlUnit,
  overallTarget, setOverallTarget, targetUnit, setTargetUnit,

  dataSource, setDataSource,

  overallStrategyTarget, setOverallStrategyTarget,
  overallStrategySL, setOverallStrategySL,
  overallStrategyTargetUnit, setOverallStrategyTargetUnit,
  overallStrategySLUnit, setOverallStrategySLUnit,
  riskExtra, setRiskExtra,
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit,
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit,

  timeLoopLimit, setTimeLoopLimit
}) => {

  const handleConfigChange = (setter, value) => {
    if (setter) setter(value);
    setIsConfirmed(false);
  };

  const rx = riskExtra || {};
  const setRX = (key, value) => {
    if (setRiskExtra) setRiskExtra(prev => ({ ...prev, [key]: value }));
    setIsConfirmed(false);
  };
  const clearRX = (keys) => {
    if (setRiskExtra) setRiskExtra(prev => {
      const next = { ...prev };
      keys.forEach((k) => { next[k] = ''; });
      return next;
    });
    setIsConfirmed(false);
  };

  const rxField = (label, key, ph) => (
    <Field label={label}>
      <input type="number" className={NUM} placeholder={ph} value={rx[key] ?? ''} onChange={(e) => setRX(key, e.target.value)} />
    </Field>
  );
  const rxUnit = (key, defaultUnit) => (
    <select className={SELECT} value={normalizeUnit(rx[key] || defaultUnit)} onChange={(e) => setRX(key, e.target.value)}>
      <option value="Rs">Rs</option>
      <option value="Pts">Pts</option>
      <option value="%">%</option>
    </select>
  );

  // ── Toggle state: ON if user switched it on OR a value already exists (AI / saved strategy) ──
  const [tg, setTg] = useState({});
  const has = (v) => Number(v) > 0;
  const OVERALL_LOCK = ['overallLockTrigger', 'overallLockProfit', 'overallLockTrailX', 'overallLockTrailY'];
  const COMBINED_LOCK = ['combinedLockTrigger', 'combinedLockProfit', 'combinedLockTrailX', 'combinedLockTrailY', 'combinedTrailX', 'combinedTrailY'];

  const on = {
    sl: tg.sl || has(overallStrategySL),
    tgt: tg.tgt || has(overallStrategyTarget),
    cSl: tg.cSl || has(combinedPremiumSL),
    cTgt: tg.cTgt || has(combinedPremiumTarget),
    lockO: tg.lockO || OVERALL_LOCK.some((k) => has(rx[k])),
    lockC: tg.lockC || COMBINED_LOCK.some((k) => has(rx[k])),
  };
  const flip = (k, clear) => (v) => {
    setTg((p) => ({ ...p, [k]: v }));
    if (!v && clear) clear();
  };

  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs, { timeLoopLimit });

  return (
    <div className="font-ui w-full animate-fade-in space-y-4 rounded-2xl bg-[#F2F4F7] p-3 text-[#121A2B]">

      {/* ───── Data source + date range ───── */}
      <TopHeader
        dataSource={dataSource}
        setDataSource={setDataSource}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleConfigChange={handleConfigChange}
      />

      {/* ───── LEG BUILDER ───── */}
      <Section title="Leg builder" hint="Each leg is one buy / sell position with its own entry, SL and target.">
        <LegsPanel
          legs={legs}
          addLeg={addLeg}
          updateLeg={updateLeg}
          removeLeg={removeLeg}
          combinedPremiumTarget={combinedPremiumTarget}
          setCombinedPremiumTarget={setCombinedPremiumTarget}
          combinedPremiumTargetUnit={combinedPremiumTargetUnit}
          setCombinedPremiumTargetUnit={setCombinedPremiumTargetUnit}
          combinedPremiumSL={combinedPremiumSL}
          setCombinedPremiumSL={setCombinedPremiumSL}
          combinedPremiumSLUnit={combinedPremiumSLUnit}
          setCombinedPremiumSLUnit={setCombinedPremiumSLUnit}
        />
      </Section>

      {/* ───── INDICATORS ───── */}
      <Section title="Entry indicators" hint="Optional. Trade is taken only when these conditions are true.">
        <IndicatorsPanel
          indicators={indicators}
          addIndicator={addIndicator}
          updateIndicator={updateIndicator}
          removeIndicator={removeIndicator}
        />
      </Section>

      {/* ───── OVERALL STRATEGY SETTINGS ───── */}
      <Section title="Overall strategy settings" hint="Applies to all legs together. Switch ON only what you need.">
        <div className="grid gap-2.5 lg:grid-cols-[1fr_1fr_1.6fr]">

          {/* Card 1: overall P&L */}
          <Card title="Overall P&L" use="Close every open leg when total profit / loss hits the limit.">
            <Item
              label="Overall stop loss"
              use="Max loss allowed for the day."
              on={on.sl}
              onToggle={flip('sl', () => handleConfigChange(setOverallStrategySL, ''))}
            >
              <UnitField
                units={['Rs', 'Pts', '%']}
                placeholder="E.g., 2000"
                value={overallStrategySL || ""}
                onValue={(e) => handleConfigChange(setOverallStrategySL, e.target.value)}
                unit={normalizeUnit(overallStrategySLUnit || "Rs")}
                onUnit={(e) => handleConfigChange(setOverallStrategySLUnit, e.target.value)}
              />
            </Item>
            <Item
              label="Overall target"
              use="Book profit once this much is made."
              on={on.tgt}
              onToggle={flip('tgt', () => handleConfigChange(setOverallStrategyTarget, ''))}
            >
              <UnitField
                units={['Rs', 'Pts', '%']}
                placeholder="E.g., 5000"
                value={overallStrategyTarget || ""}
                onValue={(e) => handleConfigChange(setOverallStrategyTarget, e.target.value)}
                unit={normalizeUnit(overallStrategyTargetUnit || "Rs")}
                onUnit={(e) => handleConfigChange(setOverallStrategyTargetUnit, e.target.value)}
              />
            </Item>
            <Item label="Max loop limit" use="How many times entry can repeat. Also used for worst-case margin." on={true} onToggle={() => {}}>
              <input
                type="number"
                className={NUM}
                placeholder="E.g., 10"
                value={timeLoopLimit || 1}
                onChange={(e) => setTimeLoopLimit(Number(e.target.value))}
              />
            </Item>
          </Card>

          {/* Card 2: combined premium */}
          <Card title="Combined premium" use="Limits on the total premium of all legs (straddle / strangle).">
            <Item
              label="Premium stop loss"
              use="Exit all legs if combined premium goes against you."
              on={on.cSl}
              onToggle={flip('cSl', () => handleConfigChange(setCombinedPremiumSL, ''))}
            >
              <UnitField
                units={['Pts', '%', 'Rs']}
                placeholder="E.g., 50"
                value={combinedPremiumSL || ""}
                onValue={(e) => handleConfigChange(setCombinedPremiumSL, e.target.value)}
                unit={normalizeUnit(combinedPremiumSLUnit)}
                onUnit={(e) => handleConfigChange(setCombinedPremiumSLUnit, e.target.value)}
              />
            </Item>
            <Item
              label="Premium target"
              use="Exit all legs when combined premium reaches this."
              on={on.cTgt}
              onToggle={flip('cTgt', () => handleConfigChange(setCombinedPremiumTarget, ''))}
            >
              <UnitField
                units={['Pts', '%', 'Rs']}
                placeholder="E.g., 150"
                value={combinedPremiumTarget || ""}
                onValue={(e) => handleConfigChange(setCombinedPremiumTarget, e.target.value)}
                unit={normalizeUnit(combinedPremiumTargetUnit)}
                onUnit={(e) => handleConfigChange(setCombinedPremiumTargetUnit, e.target.value)}
              />
            </Item>
          </Card>

          {/* Card 3: lock & trail */}
          <Card title="Lock & trail" use="Protect profit: lock a minimum, then move it up as profit grows.">
            <Item
              label="Overall (day MTM)"
              use="At trigger, lock profit. Then lock moves up by Y for every X more profit."
              on={on.lockO}
              onToggle={flip('lockO', () => clearRX(OVERALL_LOCK))}
            >
              <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-5">
                {rxField('Trigger', 'overallLockTrigger', 'e.g. 5000')}
                {rxField('Lock profit', 'overallLockProfit', 'e.g. 2000')}
                {rxField('Trail X', 'overallLockTrailX', 'e.g. 1000')}
                {rxField('Trail Y', 'overallLockTrailY', 'e.g. 500')}
                <Field label="Unit">{rxUnit('overallLockUnit', 'Rs')}</Field>
              </div>
              <div className="mt-2">
                <Check
                  label="Check overall SL / target on intrabar (High / Low)"
                  checked={!!rx.overallIntrabar}
                  onChange={(e) => setRX('overallIntrabar', e.target.checked)}
                />
              </div>
            </Item>
            <Item
              label="Combined premium (2+ legs)"
              use="Same lock & trail, plus trailing SL, on the basket premium."
              on={on.lockC}
              onToggle={flip('lockC', () => clearRX(COMBINED_LOCK))}
            >
              <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-4">
                {rxField('Lock trigger', 'combinedLockTrigger', 'e.g. 30')}
                {rxField('Lock profit', 'combinedLockProfit', 'e.g. 10')}
                {rxField('Lock trail X', 'combinedLockTrailX', 'e.g. 10')}
                {rxField('Lock trail Y', 'combinedLockTrailY', 'e.g. 5')}
                {rxField('Trail SL X', 'combinedTrailX', 'e.g. 20')}
                {rxField('Trail SL Y', 'combinedTrailY', 'e.g. 10')}
                <Field label="Unit">{rxUnit('combinedLockUnit', 'Pts')}</Field>
              </div>
            </Item>
          </Card>

        </div>
      </Section>

      {/* ───── Live margin bar ───── */}
      <div className="sticky bottom-2 z-10 flex items-center justify-between gap-4 rounded-xl bg-[#121A2B] px-4 py-2.5 text-white shadow-[0_8px_24px_rgba(18,26,43,0.28)]">
        <div>
          <p className="text-[11.5px] font-semibold">Estimated margin required</p>
          <p className="text-[10.5px] text-[#9AA4B5]">
            Based on your current legs · CE qty <span className="font-num font-semibold text-white">{ceQty}</span> · PE qty <span className="font-num font-semibold text-white">{peQty}</span>
          </p>
        </div>
        <p className="font-num text-[20px] font-semibold tabular-nums">₹{totalMargin.toLocaleString('en-IN')}</p>
      </div>

    </div>
  );
};

export default StrategyConfig;