import React from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { calculateLiveMargin } from './utils';
import { SELECT, NUM, Field, UnitField, Check, SubHead, Panel } from './ui';

// 🚀 Helper function to dynamically normalize any unit format requested by the user/AI
const normalizeUnit = (unit) => {
  if (!unit) return "Pts";
  
  const u = String(unit).toLowerCase().trim();
  
  // 'per' in includes is dangerous (e.g., 'premium' has 'per'). So we check strictly.
  if (u.includes("%") || u.includes("percent") || u === "per" || u === "pct") return "%";
  
  if (u === "rs" || u.includes("rupee") || u.includes("₹") || u.includes("inr")) return "Rs";
  
  return "Pts"; // Default fallback for everything else (including Points, Pts)
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
  overallTarget, setOverallTarget, targetUnit, setTargetUnit,

  // ⚡ Data Source Selection (Fyers vs S3)
  dataSource, setDataSource,

  // 🟢 Price-based Global/Combined Targets & SL Props (WITH UNITS)
  overallStrategyTarget, setOverallStrategyTarget,
  overallStrategySL, setOverallStrategySL,
  // 🚀 Overall Strategy Target & SL Units
  overallStrategyTargetUnit, setOverallStrategyTargetUnit,
  overallStrategySLUnit, setOverallStrategySLUnit,
  riskExtra, setRiskExtra,
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit, // 🚀 TARGET UNIT
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit, // 🚀 SL UNIT
  
  // 🔄 Global Loop limits to calculate worst-case live margin!
  timeLoopLimit, setTimeLoopLimit
}) => {
  
  const handleConfigChange = (setter, value) => {
    if (setter) {
      setter(value);
    }
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

  // 🚀 Passing timeLoopLimit inside riskManagement object for dynamic worst-case margin UI update!
  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs, { timeLoopLimit });

  return (
    <div className="font-ui w-full animate-fade-in space-y-2.5 rounded-2xl bg-[#F2F4F7] p-3 text-[#121A2B]">
      
      {/* 📅 TOP-HEADER SECTION */}
      <TopHeader 
        dataSource={dataSource} 
        setDataSource={setDataSource} 
        fromDate={fromDate} 
        setFromDate={setFromDate} 
        toDate={toDate} 
        setToDate={setToDate} 
        handleConfigChange={handleConfigChange} 
      />

      {/* 📋 1. LEGS PANEL */}
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

      {/* 📊 2. INDICATORS PANEL */}
      <IndicatorsPanel 
        indicators={indicators} 
        addIndicator={addIndicator} 
        updateIndicator={updateIndicator} 
        removeIndicator={removeIndicator} 
      />

      {/* 🛡️ 3. RISK & EXECUTION: loop limit + overall + combined premium, all in ONE row */}
      <Panel title="Risk & execution" caption="Limits applied to the whole strategy">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

          {/* 🔄 Dynamic loop limit */}
          <Field label="Max loop limit (multiplier)">
            <input
              type="number"
              className={NUM}
              placeholder="E.g., 10"
              value={timeLoopLimit || 1}
              onChange={(e) => setTimeLoopLimit(Number(e.target.value))}
            />
          </Field>

          {/* Overall Strategy Target */}
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

          {/* Overall Strategy SL */}
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

          {/* Combined Premium Target & Unit */}
          <Field label="Combined premium target">
            <UnitField
              units={['Pts', '%', 'Rs']}
              placeholder="E.g., 150"
              value={combinedPremiumTarget || ""}
              onValue={(e) => handleConfigChange(setCombinedPremiumTarget, e.target.value)}
              unit={normalizeUnit(combinedPremiumTargetUnit)}
              onUnit={(e) => handleConfigChange(setCombinedPremiumTargetUnit, e.target.value)}
            />
          </Field>

          {/* Combined Premium SL & Unit */}
          <Field label="Combined premium stop loss">
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
      </Panel>

      {/* 🔒 4. LOCK & TRAIL (OVERALL + COMBINED) */}
      <Panel title="Lock & trail" caption="Protect profit at the strategy level">
        <div className="grid gap-4 xl:grid-cols-2">

          {/* Overall (day MTM) */}
          <div>
            <SubHead title="Overall (day MTM)" caption="Once profit reaches the trigger it is locked in; after that the lock trails by Y for every X move." />
            <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-5">
              {rxField('Trigger', 'overallLockTrigger', 'e.g. 5000')}
              {rxField('Lock profit', 'overallLockProfit', 'e.g. 2000')}
              {rxField('Trail X', 'overallLockTrailX', 'e.g. 1000')}
              {rxField('Trail Y', 'overallLockTrailY', 'e.g. 500')}
              <Field label="Unit">{rxUnit('overallLockUnit', 'Rs')}</Field>
            </div>
            <div className="mt-2">
              <Check label="Overall SL / target on intrabar (High / Low)" checked={!!rx.overallIntrabar} onChange={(e) => setRX('overallIntrabar', e.target.checked)} />
            </div>
          </div>

          {/* Combined premium */}
          <div>
            <SubHead title="Combined premium (basket of 2+ legs)" caption="Lock & trail and trailing SL on the combined premium." />
            <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {rxField('Lock trigger', 'combinedLockTrigger', 'e.g. 30')}
              {rxField('Lock profit', 'combinedLockProfit', 'e.g. 10')}
              {rxField('Lock trail X', 'combinedLockTrailX', 'e.g. 10')}
              {rxField('Lock trail Y', 'combinedLockTrailY', 'e.g. 5')}
              {rxField('Trail SL X', 'combinedTrailX', 'e.g. 20')}
              {rxField('Trail SL Y', 'combinedTrailY', 'e.g. 10')}
              <Field label="Unit">{rxUnit('combinedLockUnit', 'Pts')}</Field>
            </div>
          </div>

        </div>
      </Panel>

      {/* 💰 Live Estimated Margin: sticky bar, always visible while you scroll the legs */}
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