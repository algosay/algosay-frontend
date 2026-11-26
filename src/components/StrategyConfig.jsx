import React, { useState } from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { SELECT, NUM, Field, UnitField, Check } from './ui';

const normalizeUnit = (unit) => {
  if (!unit) return "Pts";
  const u = String(unit).toLowerCase().trim();
  if (u.includes("%") || u.includes("percent") || u === "per" || u === "pct") return "%";
  if (u === "rs" || u.includes("rupee") || u.includes("₹") || u.includes("inr")) return "Rs";
  return "Pts";
};

// ─────────────── Accent palette (full class strings so Tailwind JIT keeps them) ───────────────
const A = {
  indigo: {
    bar: 'from-indigo-500 to-violet-500',
    border: 'border-indigo-200',
    head: 'from-indigo-50 via-white to-white',
    chip: 'bg-indigo-50 text-indigo-600 ring-indigo-200',
    on: 'border-indigo-300 bg-indigo-50/50',
    toggle: 'bg-indigo-600',
    glow: 'shadow-[0_8px_24px_-14px_rgba(79,70,229,0.45)]',
  },
  rose: {
    bar: 'from-rose-500 to-orange-400',
    border: 'border-rose-200',
    head: 'from-rose-50 via-white to-white',
    chip: 'bg-rose-50 text-rose-600 ring-rose-200',
    on: 'border-rose-300 bg-rose-50/50',
    toggle: 'bg-rose-500',
    glow: 'shadow-[0_8px_24px_-14px_rgba(225,29,72,0.4)]',
  },
  emerald: {
    bar: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-200',
    head: 'from-emerald-50 via-white to-white',
    chip: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
    on: 'border-emerald-300 bg-emerald-50/50',
    toggle: 'bg-emerald-500',
    glow: 'shadow-[0_8px_24px_-14px_rgba(5,150,105,0.4)]',
  },
  amber: {
    bar: 'from-amber-400 to-orange-500',
    border: 'border-amber-200',
    head: 'from-amber-50 via-white to-white',
    chip: 'bg-amber-50 text-amber-600 ring-amber-200',
    on: 'border-amber-300 bg-amber-50/50',
    toggle: 'bg-amber-500',
    glow: 'shadow-[0_8px_24px_-14px_rgba(217,119,6,0.4)]',
  },
  violet: {
    bar: 'from-violet-500 to-fuchsia-500',
    border: 'border-violet-200',
    head: 'from-violet-50 via-white to-white',
    chip: 'bg-violet-50 text-violet-600 ring-violet-200',
    on: 'border-violet-300 bg-violet-50/50',
    toggle: 'bg-violet-600',
    glow: 'shadow-[0_8px_24px_-14px_rgba(124,58,237,0.4)]',
  },
};

// ─────────────── Small icons ───────────────
const Ico = ({ children }) => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const IcoPnl = () => (<Ico><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></Ico>);
const IcoLayers = () => (<Ico><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></Ico>);
const IcoLock = () => (<Ico><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></Ico>);

// Section heading sits OUTSIDE the cards
const Section = ({ title, hint, accent = 'indigo', children }) => (
  <section>
    <div className="mb-2 flex items-center gap-2 px-0.5">
      <span className={`h-4 w-1 rounded-full bg-gradient-to-b ${A[accent].bar}`} />
      <h3 className="text-[13px] font-semibold tracking-tight text-slate-900">{title}</h3>
      {hint && <span className="hidden text-[11px] text-slate-500 sm:inline">{hint}</span>}
    </div>
    {children}
  </section>
);

// Main card: coloured top bar + tinted header + icon chip
const Card = ({ title, use, accent = 'indigo', icon, children, className = '' }) => {
  const c = A[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-white ${c.border} ${c.glow} ${className}`}>
      <div className={`h-[3px] w-full bg-gradient-to-r ${c.bar}`} />
      {title && (
        <div className={`flex items-start gap-2.5 border-b ${c.border} bg-gradient-to-r ${c.head} px-3 py-2`}>
          {icon && (
            <span className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1 ${c.chip}`}>{icon}</span>
          )}
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-900">{title}</p>
            {use && <p className="text-[10.5px] leading-snug text-slate-500">{use}</p>}
          </div>
        </div>
      )}
      <div className="space-y-2 p-3">{children}</div>
    </div>
  );
};

const Toggle = ({ on, onChange, accent = 'indigo' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${on ? A[accent].toggle : 'bg-slate-300'}`}
  >
    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
  </button>
);

// One feature = one tile. ON => coloured border + tint. OFF => fields greyed & locked
const Item = ({ label, use, on, onToggle, accent = 'indigo', children }) => (
  <div className={`rounded-lg border p-2.5 transition-colors ${on ? A[accent].on : 'border-slate-200 bg-slate-50/70'}`}>
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-800">
          <span className={`h-1.5 w-1.5 rounded-full ${on ? A[accent].toggle : 'bg-slate-300'}`} />
          {label}
        </p>
        {use && <p className="pl-3 text-[10.5px] leading-snug text-slate-500">{use}</p>}
      </div>
      <Toggle on={on} onChange={onToggle} accent={accent} />
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

  return (
    <div className="font-ui w-full animate-fade-in space-y-4 rounded-2xl bg-gradient-to-b from-[#F5F7FC] to-[#ECEFF7] p-3 text-slate-900">

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
      <Section title="Leg builder" hint="Each leg is one buy / sell position with its own entry, SL and target." accent="indigo">
        <LegsPanel
          legs={legs}
          addLeg={addLeg}
          updateLeg={updateLeg}
          removeLeg={removeLeg}
        />
      </Section>

      {/* ───── INDICATORS ───── */}
      <Section title="Entry indicators" hint="Optional. Trade is taken only when these conditions are true." accent="emerald">
        <IndicatorsPanel
          indicators={indicators}
          addIndicator={addIndicator}
          updateIndicator={updateIndicator}
          removeIndicator={removeIndicator}
        />
      </Section>

      {/* ───── OVERALL STRATEGY SETTINGS ───── */}
      <Section title="Overall strategy settings" hint="Applies to all legs together. Switch ON only what you need." accent="violet">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.6fr]">

          {/* Card 1: overall P&L */}
          <Card title="Overall P&L" use="Close every open leg when total profit / loss hits the limit." accent="indigo" icon={<IcoPnl />}>
            <Item
              label="Overall stop loss"
              use="Max loss allowed for the day."
              accent="rose"
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
              accent="emerald"
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
            <Item label="Max loop limit" use="How many times entry can repeat." accent="indigo" on={true} onToggle={() => {}}>
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
          <Card title="Combined premium" use="Limits on the total premium of all legs (straddle / strangle)." accent="amber" icon={<IcoLayers />}>
            <Item
              label="Premium stop loss"
              use="Exit all legs if combined premium goes against you."
              accent="rose"
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
              accent="emerald"
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
          <Card title="Lock & trail" use="Protect profit: lock a minimum, then move it up as profit grows." accent="violet" icon={<IcoLock />}>
            <Item
              label="Overall (day MTM)"
              use="At trigger, lock profit. Then lock moves up by Y for every X more profit."
              accent="violet"
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
              <div className="mt-2 rounded-md border border-violet-100 bg-white px-2.5 py-1.5">
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
              accent="violet"
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

    </div>
  );
};

export default StrategyConfig;