import React from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { calculateLiveMargin } from './utils';
import { SELECT, NUM, Field, UnitField, Check } from './ui';

// 🚀 Helper function to dynamically normalize any unit format requested by the user/AI
const normalizeUnit = (unit) => {
  if (!unit) return "Pts";
  const u = String(unit).toLowerCase().trim();
  if (u.includes("%") || u.includes("percent") || u === "per" || u === "pct") return "%";
  if (u === "rs" || u.includes("rupee") || u.includes("₹") || u.includes("inr")) return "Rs";
  return "Pts";
};

// ─────────────────────────────────────────────────────────────
// SECTION: one numbered, colour-coded segment of the builder.
// `bare` = body has no padding (used when the child already is a card)
// ─────────────────────────────────────────────────────────────
const Section = ({ no, title, purpose, scope, color, bare, children }) => (
  <section className="overflow-hidden rounded-xl border border-[#DDE2E9] bg-white shadow-[0_1px_2px_rgba(18,26,43,0.04)]">
    <header className="flex items-center gap-3 border-b border-[#E9EDF2] bg-[#FAFBFC] px-3 py-2">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-num text-[12px] font-bold text-white"
        style={{ background: color }}
      >
        {no}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[13px] font-semibold leading-tight text-[#121A2B]">{title}</h3>
        <p className="truncate text-[11px] leading-tight text-[#7C879A]">{purpose}</p>
      </div>
      {scope && (
        <span
          className="hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block"
          style={{ background: `${color}18`, color }}
        >
          {scope}
        </span>
      )}
    </header>
    <div className={bare ? 'bg-[#F4F6F9] p-2' : 'p-3'}>{children}</div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// BLOCK: a small separate card inside a section (one job each)
// ─────────────────────────────────────────────────────────────
const Block = ({ title, use, children, className = '' }) => (
  <div className={`rounded-lg border border-[#E3E8EF] bg-[#FAFBFC] p-2.5 ${className}`}>
    <div className="mb-2 border-b border-dashed border-[#E3E8EF] pb-1.5">
      <p className="text-[12px] font-semibold text-[#121A2B]">{title}</p>
      <p className="text-[10.5px] leading-snug text-[#7C879A]">{use}</p>
    </div>
    {children}
  </div>
);

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
  overallTarget, setOverallTarget, targetUnit, setTargetUnit,

  // ⚡ Data Source Selection (Fyers vs S3)
  dataSource, setDataSource,

  // 🟢 Price-based Global/Combined Targets & SL Props (WITH UNITS)
  overallStrategyTarget, setOverallStrategyTarget,
  overallStrategySL, setOverallStrategySL,
  overallStrategyTargetUnit, setOverallStrategyTargetUnit,
  overallStrategySLUnit, setOverallStrategySLUnit,
  riskExtra, setRiskExtra,
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit,
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit,

  // 🔄 Global Loop limits to calculate worst-case live margin!
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
  const rxField = (label, key, ph) => (
    <Field label={label}>
      <input
        type="number"
        className={NUM}
        placeholder={ph}
        value={rx[key] ?? ''}
        onChange={(e) => setRX(key, e.target.value)}
      />
    </Field>
  );
  const rxUnit = (key, defaultUnit) => (
    <select
      className={SELECT}
      value={normalizeUnit(rx[key] || defaultUnit)}
      onChange={(e) => setRX(key, e.target.value)}
    >
      <option value="Rs">Rs</option>
      <option value="Pts">Pts</option>
      <option value="%">%</option>
    </select>
  );

  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs, { timeLoopLimit });

  // Colours per segment (one identity each)
  const C = { legs: '#2F5BEA', ind: '#7A4FD6', risk: '#D64545', lock: '#1F9D6B' };

  // How many risk / lock fields are filled (for the overview strip)
  const riskSet = [overallStrategyTarget, overallStrategySL, combinedPremiumTarget, combinedPremiumSL].filter((v) => Number(v) > 0).length;
  const lockSet = ['overallLockTrigger', 'combinedLockTrigger', 'combinedTrailX'].filter((k) => Number(rx[k]) > 0).length;

  const chips = [
    { no: 1, label: 'Legs', val: `${legs.length}`, color: C.legs },
    { no: 2, label: 'Indicators', val: `${indicators.length}`, color: C.ind },
    { no: 3, label: 'Risk limits', val: `${riskSet} set`, color: C.risk },
    { no: 4, label: 'Lock & trail', val: `${lockSet} set`, color: C.lock },
  ];

  return (
    <div className="font-ui w-full animate-fade-in space-y-3 rounded-2xl bg-[#F2F4F7] p-3 text-[#121A2B]">

      {/* 📅 TOP-HEADER SECTION: data source + date range */}
      <TopHeader
        dataSource={dataSource}
        setDataSource={setDataSource}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleConfigChange={handleConfigChange}
      />

      {/* 🧭 OVERVIEW STRIP: whole strategy at a glance */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chips.map((c) => (
          <div key={c.no} className="flex items-center gap-2 rounded-lg border border-[#DDE2E9] bg-white px-2.5 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded font-num text-[11px] font-bold text-white" style={{ background: c.color }}>{c.no}</span>
            <div className="leading-tight">
              <p className="text-[10.5px] text-[#7C879A]">{c.label}</p>
              <p className="font-num text-[12.5px] font-semibold">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═════════ 1 · LEGS ═════════ */}
      <Section
        no={1}
        title="What to trade"
        purpose="Each leg = one buy/sell position: asset, strike, lots, timing and its own SL / target."
        scope="Per leg"
        color={C.legs}
        bare
      >
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

      {/* ═════════ 2 · INDICATORS ═════════ */}
      <Section
        no={2}
        title="When to enter"
        purpose="Optional indicator conditions (RSI, Supertrend, EMA...) that must be true before a trade is taken."
        scope="Entry filter"
        color={C.ind}
        bare
      >
        <IndicatorsPanel
          indicators={indicators}
          addIndicator={addIndicator}
          updateIndicator={updateIndicator}
          removeIndicator={removeIndicator}
        />
      </Section>

      {/* ═════════ 3 · RISK & EXECUTION ═════════ */}
      <Section
        no={3}
        title="Risk & execution"
        purpose="Hard limits for the whole strategy. When one is hit, all open positions close."
        scope="Whole strategy"
        color={C.risk}
      >
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[0.8fr_1.1fr_1.1fr]">

          <Block title="Loop limit" use="Max times the entry condition can repeat in a day. Also used for worst-case margin.">
            <Field label="Max loop (multiplier)">
              <input
                type="number"
                className={NUM}
                placeholder="E.g., 10"
                value={timeLoopLimit || 1}
                onChange={(e) => setTimeLoopLimit(Number(e.target.value))}
              />
            </Field>
          </Block>

          <Block title="Overall P&L limit" use="Exit everything when total profit or loss of all legs reaches this.">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field label="Overall target">
                <UnitField
                  units={['Rs', 'Pts', '%']}
                  placeholder="E.g., 5000"
                  value={overallStrategyTarget || ""}
                  onValue={(e) => handleConfigChange(setOverallStrategyTarget, e.target.value)}
                  unit={normalizeUnit(overallStrategyTargetUnit || "Rs")}
                  onUnit={(e) => handleConfigChange(setOverallStrategyTargetUnit, e.target.value)}
                />
              </Field>
              <Field label="Overall stop loss">
                <UnitField
                  units={['Rs', 'Pts', '%']}
                  placeholder="E.g., 2000"
                  value={overallStrategySL || ""}
                  onValue={(e) => handleConfigChange(setOverallStrategySL, e.target.value)}
                  unit={normalizeUnit(overallStrategySLUnit || "Rs")}
                  onUnit={(e) => handleConfigChange(setOverallStrategySLUnit, e.target.value)}
                />
              </Field>
            </div>
          </Block>

          <Block title="Combined premium limit" use="Target / SL on the total premium of all legs together (straddle, strangle).">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field label="Premium target">
                <UnitField
                  units={['Pts', '%', 'Rs']}
                  placeholder="E.g., 150"
                  value={combinedPremiumTarget || ""}
                  onValue={(e) => handleConfigChange(setCombinedPremiumTarget, e.target.value)}
                  unit={normalizeUnit(combinedPremiumTargetUnit)}
                  onUnit={(e) => handleConfigChange(setCombinedPremiumTargetUnit, e.target.value)}
                />
              </Field>
              <Field label="Premium stop loss">
                <UnitField
                  units={['Pts', '%', 'Rs']}
                  placeholder="E.g., 50"
                  value={combinedPremiumSL || ""}
                  onValue={(e) => handleConfigChange(setCombinedPremiumSL, e.target.value)}
                  unit={normalizeUnit(combinedPremiumSLUnit)}
                  onUnit={(e) => handleConfigChange(setCombinedPremiumSLUnit, e.target.value)}
                />
              </Field>
            </div>
          </Block>

        </div>
      </Section>

      {/* ═════════ 4 · LOCK & TRAIL ═════════ */}
      <Section
        no={4}
        title="Lock & trail"
        purpose="Protect profit once the strategy is in the money: lock a minimum, then move it up as profit grows."
        scope="Whole strategy"
        color={C.lock}
      >
        <div className="grid gap-2.5 xl:grid-cols-2">

          <Block
            title="Overall (day MTM)"
            use="Profit reaches the trigger → lock profit. After that, lock moves up by Y for every X more profit."
          >
            <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-5">
              {rxField('Trigger', 'overallLockTrigger', 'e.g. 5000')}
              {rxField('Lock profit', 'overallLockProfit', 'e.g. 2000')}
              {rxField('Trail X', 'overallLockTrailX', 'e.g. 1000')}
              {rxField('Trail Y', 'overallLockTrailY', 'e.g. 500')}
              <Field label="Unit">{rxUnit('overallLockUnit', 'Rs')}</Field>
            </div>
            <div className="mt-2 border-t border-dashed border-[#E3E8EF] pt-2">
              <Check
                label="Check overall SL / target on intrabar (High / Low)"
                checked={!!rx.overallIntrabar}
                onChange={(e) => setRX('overallIntrabar', e.target.checked)}
              />
            </div>
          </Block>

          <Block
            title="Combined premium (2+ legs)"
            use="Same lock & trail, plus a trailing SL, applied on the combined premium of the basket."
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
          </Block>

        </div>
      </Section>

      {/* 💰 Live Estimated Margin: sticky bar */}
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