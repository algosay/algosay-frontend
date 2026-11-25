import React from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { calculateLiveMargin } from './utils';

// 🚀 NEW UPDATE: Helper function to dynamically normalize any unit format requested by the user/AI
const normalizeUnit = (unit) => {
  if (!unit) return "Pts";
  
  const u = String(unit).toLowerCase().trim();
  
  // 'per' in includes is dangerous (e.g., 'premium' has 'per'). So we check strictly.
  if (u.includes("%") || u.includes("percent") || u === "per" || u === "pct") return "%";
  
  if (u === "rs" || u.includes("rupee") || u.includes("₹") || u.includes("inr")) return "Rs";
  
  return "Pts"; // Default fallback for everything else (including Points, Pts)
};

// 🎨 Compact layout helper (layout only - no logic)
const Section = ({ title, titleColor = 'text-gray-300', borderColor = 'border-gray-700/50', className = '', children }) => (
  <div className={`p-3 bg-[#1e1e1e] border ${borderColor} rounded-lg shadow-sm ${className}`}>
    <h3 className={`text-[11px] font-bold mb-2 uppercase tracking-wider flex items-center gap-2 ${titleColor}`}>{title}</h3>
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

  // ⚡ NEW PROPS: Data Source Selection (Fyers vs S3)
  dataSource, setDataSource,

  // 🟢 NEW UPDATE: Price-based Global/Combined Targets & SL Props (WITH UNITS)
  overallStrategyTarget, setOverallStrategyTarget,
  overallStrategySL, setOverallStrategySL,
  // 🚀 NEW: Overall Strategy Target & SL Units
  overallStrategyTargetUnit, setOverallStrategyTargetUnit,
  overallStrategySLUnit, setOverallStrategySLUnit,
  riskExtra, setRiskExtra,
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit, // 🚀 NEW: TARGET UNIT
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit, // 🚀 NEW: SL UNIT
  
  // 🔄 NEW UPDATE: Global Loop limits to calculate worst-case live margin!
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
    <div className="flex flex-col">
      <label className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">{label}</label>
      <input
        type="number"
        className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-violet-500 focus:outline-none text-xs transition-colors"
        placeholder={ph}
        value={rx[key] ?? ''}
        onChange={(e) => setRX(key, e.target.value)}
      />
    </div>
  );
  const rxUnit = (key, defaultUnit) => (
    <select
      className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-violet-500 focus:outline-none text-xs cursor-pointer"
      value={normalizeUnit(rx[key] || defaultUnit)}
      onChange={(e) => setRX(key, e.target.value)}
    >
      <option value="Rs">Rs</option>
      <option value="Pts">Pts</option>
      <option value="%">%</option>
    </select>
  );

  // 🚀 NEW UPDATE: Passing timeLoopLimit inside riskManagement object for dynamic worst-case margin UI update!
  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs, { timeLoopLimit });

  return (
    <div className="w-full animate-fade-in">
      
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

      {/* 🚀 HORIZONTAL ROW: Dynamic Loop Settings (left) + Overall Risk Management (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">

        {/* 🔄 NEW UPDATE: DYNAMIC LOOP SETTINGS */}
        <Section title="🔄 Dynamic Execution Settings" borderColor="border-purple-700/50" className="lg:col-span-3">
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-400 mb-1">Max Loop Limit (Multiplier)</label>
            <input
              type="number"
              className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-purple-500 focus:outline-none text-xs transition-colors"
              placeholder="E.g., 10"
              value={timeLoopLimit || 1}
              onChange={(e) => setTimeLoopLimit(Number(e.target.value))}
            />
          </div>
        </Section>

        {/* 🛡️ NEW UPDATE: OVERALL RISK MANAGEMENT PANEL */}
        <Section title="🛡️ Overall Risk Management (Price Based)" borderColor="border-gray-700/50" className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Overall Strategy Target */}
            <div className="flex flex-col">
              <label className="text-[10px] text-green-400 mb-1">Overall Target</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  className="bg-[#2a2a2a] w-full text-white p-1.5 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-xs transition-colors"
                  placeholder="E.g., 5000"
                  value={overallStrategyTarget || ""}
                  onChange={(e) => handleConfigChange(setOverallStrategyTarget, e.target.value)}
                />
                <select
                  className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-xs cursor-pointer"
                  value={normalizeUnit(overallStrategyTargetUnit || "Rs")}
                  onChange={(e) => handleConfigChange(setOverallStrategyTargetUnit, e.target.value)}
                >
                  <option value="Rs">Rs</option>
                  <option value="Pts">Pts</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>

            {/* Overall Strategy SL */}
            <div className="flex flex-col">
              <label className="text-[10px] text-red-400 mb-1">Overall SL</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  className="bg-[#2a2a2a] w-full text-white p-1.5 rounded border border-gray-600 focus:border-red-500 focus:outline-none text-xs transition-colors"
                  placeholder="E.g., 2000"
                  value={overallStrategySL || ""}
                  onChange={(e) => handleConfigChange(setOverallStrategySL, e.target.value)}
                />
                <select
                  className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-red-500 focus:outline-none text-xs cursor-pointer"
                  value={normalizeUnit(overallStrategySLUnit || "Rs")}
                  onChange={(e) => handleConfigChange(setOverallStrategySLUnit, e.target.value)}
                >
                  <option value="Rs">Rs</option>
                  <option value="Pts">Pts</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>

            {/* Combined Premium Target & Unit (🚀 UPDATED WITH DYNAMIC DROPDOWN) */}
            <div className="flex flex-col">
              <label className="text-[10px] text-blue-400 mb-1">Combined Premium Target</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  className="bg-[#2a2a2a] w-full text-white p-1.5 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-xs transition-colors"
                  placeholder="E.g., 150"
                  value={combinedPremiumTarget || ""}
                  onChange={(e) => handleConfigChange(setCombinedPremiumTarget, e.target.value)}
                />
                <select
                  className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-xs transition-colors cursor-pointer"
                  value={normalizeUnit(combinedPremiumTargetUnit)}
                  onChange={(e) => handleConfigChange(setCombinedPremiumTargetUnit, e.target.value)}
                >
                  <option value="Pts">Pts</option>
                  <option value="%">%</option>
                  <option value="Rs">Rs</option>
                </select>
              </div>
            </div>

            {/* Combined Premium SL & Unit (🚀 UPDATED WITH DYNAMIC DROPDOWN) */}
            <div className="flex flex-col">
              <label className="text-[10px] text-orange-400 mb-1">Combined Premium SL</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  className="bg-[#2a2a2a] w-full text-white p-1.5 rounded border border-gray-600 focus:border-orange-500 focus:outline-none text-xs transition-colors"
                  placeholder="E.g., 50"
                  value={combinedPremiumSL || ""}
                  onChange={(e) => handleConfigChange(setCombinedPremiumSL, e.target.value)}
                />
                <select
                  className="bg-[#2a2a2a] text-white p-1.5 rounded border border-gray-600 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
                  value={normalizeUnit(combinedPremiumSLUnit)}
                  onChange={(e) => handleConfigChange(setCombinedPremiumSLUnit, e.target.value)}
                >
                  <option value="Pts">Pts</option>
                  <option value="%">%</option>
                  <option value="Rs">Rs</option>
                </select>
              </div>
            </div>

          </div>
        </Section>
      </div>

      {/* 🔒 LOCK & TRAIL (OVERALL + COMBINED) */}
      <Section title="🔒 Lock & Trail (Overall MTM / Combined Premium)" borderColor="border-violet-700/40" className="mb-3">
        <div className="flex flex-col gap-2">

          {/* Overall (day MTM) */}
          <div className="bg-[#181818] border border-[#222] rounded-lg p-2">
            <p className="text-[10px] text-violet-300 mb-1.5">Overall (day MTM): once profit reaches the trigger, it gets locked in, and after that it trails by Y for every X move.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 items-end">
              {rxField('Trigger', 'overallLockTrigger', 'e.g. 5000')}
              {rxField('Lock Profit', 'overallLockProfit', 'e.g. 2000')}
              {rxField('Trail X', 'overallLockTrailX', 'e.g. 1000')}
              {rxField('Trail Y', 'overallLockTrailY', 'e.g. 500')}
              <div className="flex flex-col">
                <label className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">Unit</label>
                {rxUnit('overallLockUnit', 'Rs')}
              </div>
              <label className="flex items-center gap-2 text-[10px] text-gray-300 pb-1.5 cursor-pointer">
                <input type="checkbox" className="accent-violet-500" checked={!!rx.overallIntrabar} onChange={(e) => setRX('overallIntrabar', e.target.checked)} />
                Overall SL/Target intrabar (High/Low)
              </label>
            </div>
          </div>

          {/* Combined premium */}
          <div className="bg-[#181818] border border-[#222] rounded-lg p-2">
            <p className="text-[10px] text-cyan-300 mb-1.5">Combined premium (2+ legs basket): Lock & Trail and Trail SL.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {rxField('Lock Trigger', 'combinedLockTrigger', 'e.g. 30')}
              {rxField('Lock Profit', 'combinedLockProfit', 'e.g. 10')}
              {rxField('Lock Trail X', 'combinedLockTrailX', 'e.g. 10')}
              {rxField('Lock Trail Y', 'combinedLockTrailY', 'e.g. 5')}
              {rxField('Trail SL X', 'combinedTrailX', 'e.g. 20')}
              {rxField('Trail SL Y', 'combinedTrailY', 'e.g. 10')}
              <div className="flex flex-col">
                <label className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">Unit</label>
                {rxUnit('combinedLockUnit', 'Pts')}
              </div>
            </div>
          </div>

        </div>
      </Section>

      {/* 📊 INDICATORS PANEL */}
      <IndicatorsPanel 
        indicators={indicators} 
        addIndicator={addIndicator} 
        updateIndicator={updateIndicator} 
        removeIndicator={removeIndicator} 
      />

      {/* 📋 LEGS PANEL */}
      <LegsPanel 
        legs={legs} 
        addLeg={addLeg} 
        updateLeg={updateLeg} 
        removeLeg={removeLeg} 
        // 🟢 INTHA PROPS-A LEGS PANEL-KU PASS PANNIRUKEN 👇
        combinedPremiumTarget={combinedPremiumTarget}
        setCombinedPremiumTarget={setCombinedPremiumTarget}
        combinedPremiumTargetUnit={combinedPremiumTargetUnit} // 🚀 NEW
        setCombinedPremiumTargetUnit={setCombinedPremiumTargetUnit} // 🚀 NEW
        combinedPremiumSL={combinedPremiumSL}
        setCombinedPremiumSL={setCombinedPremiumSL}
        combinedPremiumSLUnit={combinedPremiumSLUnit} // 🚀 NEW
        setCombinedPremiumSLUnit={setCombinedPremiumSLUnit} // 🚀 NEW
      />

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