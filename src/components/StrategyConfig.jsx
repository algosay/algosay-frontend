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
  combinedPremiumTarget, setCombinedPremiumTarget,
  combinedPremiumTargetUnit, setCombinedPremiumTargetUnit, // 🚀 NEW: TARGET UNIT
  combinedPremiumSL, setCombinedPremiumSL,
  combinedPremiumSLUnit, setCombinedPremiumSLUnit // 🚀 NEW: SL UNIT
}) => {
  
  const handleConfigChange = (setter, value) => {
    if (setter) {
      setter(value);
    }
    setIsConfirmed(false);
  };

  const { totalMargin, ceQty, peQty } = calculateLiveMargin(legs);

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

      {/* 🛡️ NEW UPDATE: OVERALL RISK MANAGEMENT PANEL */}
      <div className="mb-4 p-4 bg-[#1e1e1e] border border-gray-700/50 rounded-lg shadow-sm">
        <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
          🛡️ Overall Risk Management (Price Based)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Overall Strategy Target */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Overall Target (₹/Pts)</label>
            <input
              type="number"
              className="bg-[#2a2a2a] text-white p-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-sm transition-colors"
              placeholder="E.g., 5000"
              value={overallStrategyTarget || ""}
              onChange={(e) => handleConfigChange(setOverallStrategyTarget, e.target.value)}
            />
          </div>

          {/* Overall Strategy SL */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Overall SL (₹/Pts)</label>
            <input
              type="number"
              className="bg-[#2a2a2a] text-white p-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none text-sm transition-colors"
              placeholder="E.g., 2000"
              value={overallStrategySL || ""}
              onChange={(e) => handleConfigChange(setOverallStrategySL, e.target.value)}
            />
          </div>

          {/* Combined Premium Target & Unit (🚀 UPDATED WITH DYNAMIC DROPDOWN) */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Combined Premium Target</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="bg-[#2a2a2a] w-full text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm transition-colors"
                placeholder="E.g., 150"
                value={combinedPremiumTarget || ""}
                onChange={(e) => handleConfigChange(setCombinedPremiumTarget, e.target.value)}
              />
              <select
                className="bg-[#2a2a2a] text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm transition-colors cursor-pointer"
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
            <label className="text-xs text-gray-400 mb-1">Combined Premium SL</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="bg-[#2a2a2a] w-full text-white p-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none text-sm transition-colors"
                placeholder="E.g., 50"
                value={combinedPremiumSL || ""}
                onChange={(e) => handleConfigChange(setCombinedPremiumSL, e.target.value)}
              />
              <select
                className="bg-[#2a2a2a] text-white p-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none text-sm transition-colors cursor-pointer"
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
      </div>

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