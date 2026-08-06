import React from 'react';
import TopHeader from './TopHeader';
import IndicatorsPanel from './IndicatorsPanel';
import LegsPanel from './LegsPanel';
import { calculateLiveMargin } from './utils';

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
  dataSource, setDataSource
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