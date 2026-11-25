import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AIParseSection = ({ 
  aiPrompt, setAiPrompt, isParsing, setIsParsing, 
  aiMessage, setAiMessage,             
  needsInfoQuestion, setNeedsInfoQuestion, 
  aiExplanation, setAiExplanation,         
  isConfirmed, setIsConfirmed,
  onParsedDataSuccess                  
}) => {

  // 🛠️ FIX: Local state added to prevent focus loss during heavy parent re-renders
  const [localPrompt, setLocalPrompt] = useState(aiPrompt || "");
  const textareaRef = useRef(null);

  // 🚨 State to hold and display parsed legs clearly before confirmation
  const [parsedLegs, setParsedLegs] = useState([]);
  
  // 🟢 State to hold Risk Management (Combined SL/Target) for Dynamic UI Preview
  const [parsedRisk, setParsedRisk] = useState(null);

  // Sync external prompt changes (e.g., if a template is loaded from parent) to local state
  useEffect(() => {
    if (aiPrompt !== localPrompt) {
      setLocalPrompt(aiPrompt || "");
    }
  }, [aiPrompt]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setLocalPrompt(val); // Update local state instantly so typing is smooth
    if (setAiPrompt) setAiPrompt(val); // Pass to parent silently
  };

  const handleAIParse = async () => {
    setIsParsing(true);
    
    // Clear previous results
    if(setAiMessage) setAiMessage(null);
    if(setAiExplanation) setAiExplanation(null);
    if(setNeedsInfoQuestion) setNeedsInfoQuestion(null);
    setParsedLegs([]); 
    setParsedRisk(null); // 🟢 Clear previous risk data

    try {
      const response = await axios.post("https://algosay-backend.onrender.com/parse_strategy", {
        prompt: localPrompt // using localPrompt here for safety
      });
      
      const data = response.data;
      const promptText = (localPrompt || '').toUpperCase(); // 🚀 Declared early for global use

      if (data.status === "success") {
        if(setAiExplanation) setAiExplanation(data.explanation);
        if(setAiMessage) setAiMessage("Strategy Auto-Mapped Successfully! ✨");
        
        // 🚨 SMART EXTRACTION LOGIC FOR UI PREVIEW
        let enhancedLegs = [];
        if(data.legs && Array.isArray(data.legs)) {
          
          let extractedTicker = '';
          
          // Identify EXACT asset from User Prompt dynamically
          if (promptText.includes('MIDCPNIFTY') || promptText.includes('MIDCAP')) extractedTicker = 'MIDCPNIFTY';
          else if (promptText.includes('FINNIFTY') || promptText.includes('FIN NIFTY')) extractedTicker = 'FINNIFTY';
          else if (promptText.includes('BANKNIFTY') || promptText.includes('BANK NIFTY')) extractedTicker = 'BANKNIFTY';
          else if (promptText.includes('BANKEX')) extractedTicker = 'BANKEX';
          else if (promptText.includes('SENSEX')) extractedTicker = 'SENSEX';
          else if (promptText.includes('NIFTY')) extractedTicker = 'NIFTY';

          enhancedLegs = data.legs.map(leg => {
            // Force the exact ticker user asked for
            const finalTicker = extractedTicker || leg.ticker || leg.asset || 'NIFTY';
            
            // Smart Extraction for Stoploss Units (Pts vs %)
            let rawSlVal = leg.stopLoss ?? leg.stop_loss ?? '';
            let slUnit = leg.slUnit || leg.sl_unit || leg.stopLossUnit || leg.stop_loss_unit || 'Pts';
            if (typeof rawSlVal === 'string') {
              if (rawSlVal.toLowerCase().includes('pt') || rawSlVal.toLowerCase().includes('point')) slUnit = 'Pts';
              else if (rawSlVal.includes('%')) slUnit = '%';
              else if (rawSlVal.toLowerCase().includes('rs') || rawSlVal.toLowerCase().includes('rupee')) slUnit = 'Rs';
              rawSlVal = parseFloat(rawSlVal) || rawSlVal;
            }

            // Smart Extraction for Target Units (Pts vs %)
            let rawTargetVal = leg.target ?? '';
            let targetUnit = leg.targetUnit || leg.target_unit || 'Pts';
            if (typeof rawTargetVal === 'string') {
              if (rawTargetVal.toLowerCase().includes('pt') || rawTargetVal.toLowerCase().includes('point')) targetUnit = 'Pts';
              else if (rawTargetVal.includes('%')) targetUnit = '%';
              else if (rawTargetVal.toLowerCase().includes('rs') || rawTargetVal.toLowerCase().includes('rupee')) targetUnit = 'Rs';
              rawTargetVal = parseFloat(rawTargetVal) || rawTargetVal;
            }

            // Fallback: Exact word matching for Pts in Legs
            const hasPtsLeg = /\b(PT|PTS|POINT|POINTS)\b/.test(promptText);
            if (hasPtsLeg) {
              if (!leg.target_unit && !leg.targetUnit && typeof leg.target !== 'string') targetUnit = 'Pts';
              if (!leg.sl_unit && !leg.slUnit && typeof (leg.stopLoss ?? leg.stop_loss) !== 'string') slUnit = 'Pts';
            }

            return {
              ...leg,
              displayTicker: finalTicker,
              displayTarget: rawTargetVal,
              displayTargetUnit: targetUnit,
              displaySl: rawSlVal,
              displaySlUnit: slUnit
            };
          });

          setParsedLegs(enhancedLegs);
        }

        // 🟢 DYNAMIC RISK MANAGEMENT EXTRACTION FOR PREVIEW UI 
        const riskObj = data.risk_management || {};
        
        // 🚀 SMART EXTRACTION FOR COMBINED TARGET & UNIT
        let rawCombTarget = data.combinedPremiumTarget ?? data.combined_premium_target ?? riskObj.combinedPremiumTarget ?? riskObj.combined_premium_target ?? '';
        let combTargetUnit = data.combinedPremiumTargetUnit ?? data.combined_premium_target_unit ?? riskObj.combinedPremiumTargetUnit ?? riskObj.combined_premium_target_unit ?? '';
        
        // Check inside string if backend sends value + unit together (e.g., "50 pts")
        if (typeof rawCombTarget === 'string') {
          const lowerTarget = rawCombTarget.toLowerCase();
          if (lowerTarget.includes('%')) combTargetUnit = '%';
          else if (lowerTarget.includes('pt') || lowerTarget.includes('point')) combTargetUnit = 'Pts';
          else if (lowerTarget.includes('rs') || lowerTarget.includes('rupee')) combTargetUnit = 'Rs';
          rawCombTarget = parseFloat(rawCombTarget) || rawCombTarget;
        }

        // 🚀 SMART EXTRACTION FOR COMBINED SL & UNIT
        let rawCombSL = data.combinedPremiumSL ?? data.combined_premium_sl ?? riskObj.combinedPremiumSL ?? riskObj.combined_premium_sl ?? '';
        let combSLUnit = data.combinedPremiumSLUnit ?? data.combined_premium_sl_unit ?? riskObj.combinedPremiumSLUnit ?? riskObj.combined_premium_sl_unit ?? '';
        
        // Check inside string if backend sends value + unit together (e.g., "20 %")
        if (typeof rawCombSL === 'string') {
          const lowerSL = rawCombSL.toLowerCase();
          if (lowerSL.includes('%')) combSLUnit = '%';
          else if (lowerSL.includes('pt') || lowerSL.includes('point')) combSLUnit = 'Pts';
          else if (lowerSL.includes('rs') || lowerSL.includes('rupee')) combSLUnit = 'Rs';
          rawCombSL = parseFloat(rawCombSL) || rawCombSL;
        }

        // 🧠 AI HALLUCINATION FIXER: FORCE OVERRIDE (🚀 EXACT WORD MATCH FIX)
        // \b (Word Boundary) செக் செய்வதால் "UniveRSal" அல்லது "oPTions" என்ற வார்த்தைகளுக்குள் உள்ள RS, PT-ஐ எடுக்காது.
        const hasPts = /\b(PT|PTS|POINT|POINTS)\b/.test(promptText);
        const hasRs = /\b(RS|RUPEE|RUPEES)\b/.test(promptText);
        const hasPercent = /(%|\bPERCENT\b)/.test(promptText);

        if (hasPts && !hasPercent) {
          if (rawCombTarget) combTargetUnit = 'Pts';
          if (rawCombSL) combSLUnit = 'Pts';
        } else if (hasRs && !hasPercent) {
          if (rawCombTarget) combTargetUnit = 'Rs';
          if (rawCombSL) combSLUnit = 'Rs';
        }

        // Final safety fallback
        combTargetUnit = combTargetUnit || 'Pts';
        combSLUnit = combSLUnit || 'Pts';

        // 🚀 SMART EXTRACTION FOR OVERALL STRATEGY TARGET & UNIT (top-level + risk_management, camel + snake case)
        let rawOverallTarget = data.overallStrategyTarget ?? data.overall_strategy_target ?? data.overallTarget ?? data.overall_target ?? riskObj.overallTarget ?? riskObj.overallStrategyTarget ?? riskObj.overall_strategy_target ?? riskObj.overall_target ?? '';
        let overallTargetUnit = data.overallStrategyTargetUnit ?? data.overall_strategy_target_unit ?? data.overallTargetUnit ?? data.overall_target_unit ?? riskObj.overallTargetUnit ?? riskObj.overallStrategyTargetUnit ?? riskObj.overall_strategy_target_unit ?? riskObj.overall_target_unit ?? '';

        if (typeof rawOverallTarget === 'string') {
          const lowerOT = rawOverallTarget.toLowerCase();
          if (lowerOT.includes('%')) overallTargetUnit = '%';
          else if (lowerOT.includes('pt') || lowerOT.includes('point')) overallTargetUnit = 'Pts';
          else if (lowerOT.includes('rs') || lowerOT.includes('rupee') || lowerOT.includes('₹')) overallTargetUnit = 'Rs';
          rawOverallTarget = parseFloat(rawOverallTarget) || rawOverallTarget;
        }

        // 🚀 SMART EXTRACTION FOR OVERALL STRATEGY SL & UNIT
        let rawOverallSL = data.overallStrategySL ?? data.overall_strategy_sl ?? data.overallSL ?? data.overall_sl ?? riskObj.overallSL ?? riskObj.overallStrategySL ?? riskObj.overall_strategy_sl ?? riskObj.overall_sl ?? '';
        let overallSLUnit = data.overallStrategySLUnit ?? data.overall_strategy_sl_unit ?? data.overallSLUnit ?? data.overall_sl_unit ?? riskObj.overallSLUnit ?? riskObj.overallStrategySLUnit ?? riskObj.overall_strategy_sl_unit ?? riskObj.overall_sl_unit ?? '';

        if (typeof rawOverallSL === 'string') {
          const lowerOSL = rawOverallSL.toLowerCase();
          if (lowerOSL.includes('%')) overallSLUnit = '%';
          else if (lowerOSL.includes('pt') || lowerOSL.includes('point')) overallSLUnit = 'Pts';
          else if (lowerOSL.includes('rs') || lowerOSL.includes('rupee') || lowerOSL.includes('₹')) overallSLUnit = 'Rs';
          rawOverallSL = parseFloat(rawOverallSL) || rawOverallSL;
        }

        // Final safety fallback (Overall defaults to Rs)
        overallTargetUnit = overallTargetUnit || 'Rs';
        overallSLUnit = overallSLUnit || 'Rs';

        const extractedRisk = {
          combinedPremiumTarget: rawCombTarget,
          combinedPremiumTargetUnit: combTargetUnit,
          combinedPremiumSL: rawCombSL,
          combinedPremiumSLUnit: combSLUnit,
          overallTarget: rawOverallTarget,
          overallTargetUnit: overallTargetUnit,
          overallSL: rawOverallSL,
          overallSLUnit: overallSLUnit
        };
        setParsedRisk(extractedRisk);

        // 🚨 CRITICAL FIX: INJECT FIXED UNITS BACK INTO `data` BEFORE PASSING TO PARENT!
        data.combined_premium_target = rawCombTarget;
        data.combined_premium_target_unit = combTargetUnit;
        data.combinedPremiumTarget = rawCombTarget;
        data.combinedPremiumTargetUnit = combTargetUnit;

        data.combined_premium_sl = rawCombSL;
        data.combined_premium_sl_unit = combSLUnit;
        data.combinedPremiumSL = rawCombSL;
        data.combinedPremiumSLUnit = combSLUnit;
        
        if (!data.risk_management) data.risk_management = {};
        data.risk_management.combined_premium_target = rawCombTarget;
        data.risk_management.combined_premium_target_unit = combTargetUnit;
        data.risk_management.combinedPremiumTarget = rawCombTarget;
        data.risk_management.combinedPremiumTargetUnit = combTargetUnit;

        data.risk_management.combined_premium_sl = rawCombSL;
        data.risk_management.combined_premium_sl_unit = combSLUnit;
        data.risk_management.combinedPremiumSL = rawCombSL;
        data.risk_management.combinedPremiumSLUnit = combSLUnit;

        // 🚨 INJECT OVERALL TARGET / SL (+ UNITS) INTO `data` SO PARENT AUTO-FILLS THE OVERALL RISK UI
        data.overall_strategy_target = rawOverallTarget;
        data.overallStrategyTarget = rawOverallTarget;
        data.overall_strategy_target_unit = overallTargetUnit;
        data.overallStrategyTargetUnit = overallTargetUnit;

        data.overall_strategy_sl = rawOverallSL;
        data.overallStrategySL = rawOverallSL;
        data.overall_strategy_sl_unit = overallSLUnit;
        data.overallStrategySLUnit = overallSLUnit;

        data.risk_management.overall_strategy_target = rawOverallTarget;
        data.risk_management.overallStrategyTarget = rawOverallTarget;
        data.risk_management.overall_target = rawOverallTarget;
        data.risk_management.overallTarget = rawOverallTarget;
        data.risk_management.overall_strategy_target_unit = overallTargetUnit;
        data.risk_management.overallStrategyTargetUnit = overallTargetUnit;
        data.risk_management.overallTargetUnit = overallTargetUnit;

        data.risk_management.overall_strategy_sl = rawOverallSL;
        data.risk_management.overallStrategySL = rawOverallSL;
        data.risk_management.overall_sl = rawOverallSL;
        data.risk_management.overallSL = rawOverallSL;
        data.risk_management.overall_strategy_sl_unit = overallSLUnit;
        data.risk_management.overallStrategySLUnit = overallSLUnit;
        data.risk_management.overallSLUnit = overallSLUnit;

        // Enhanced Legs details passed back to parent
        if (enhancedLegs.length > 0) {
          data.legs = enhancedLegs;
        }

        if(onParsedDataSuccess) onParsedDataSuccess(data);
        
      } else {
        if(setNeedsInfoQuestion) setNeedsInfoQuestion(data.message || "Can you specify the timeframe?");
      }
      
    } catch (error) {
      console.error("Error connecting to AI:", error);
      if(setAiMessage) setAiMessage("Failed to parse strategy. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const chip = "bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500";

  return (
    <>
      {/* MAIN AI INPUT SECTION */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-[0_1px_2px_rgba(15,27,45,0.04)] relative z-10">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0F1B2D] shrink-0">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <g stroke="#A5B4FC">
                  <path d="M9.5 3a4.5 4.5 0 0 0-4.492 4.02A4.5 4.5 0 0 0 3 11.5c0 1.556.786 2.926 2 3.734a4.5 4.5 0 0 0 2.474 6.75M14.5 3a4.5 4.5 0 0 1 4.492 4.02 4.5 4.5 0 0 1 2.008 4.48c0 1.556-.786 2.926-2 3.734a4.5 4.5 0 0 1-2.474 6.75" />
                  <path d="M12 3v16" />
                  <circle cx="8" cy="9" r="1" />
                  <circle cx="16" cy="9" r="1" />
                  <circle cx="7" cy="14" r="1" />
                  <circle cx="17" cy="14" r="1" />
                  <path d="M12 9H9" />
                  <path d="M12 14H8" />
                  <path d="M12 9h3" />
                  <path d="M12 14h4" />
                </g>
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#0F1B2D] tracking-tight">Describe your strategy</h2>
              <p className="text-xs text-slate-500 mt-0.5">Write your trading logic in plain language. Previous candle colour triggers and open-price execution are supported.</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="px-2.5 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
              AlgoSay AI
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-600">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Textarea + button */}
        <div className="flex flex-col lg:flex-row gap-3">
          <textarea
            ref={textareaRef}
            className="flex-grow w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F1B2D] focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm placeholder:text-slate-400 transition-all resize-none custom-scrollbar"
            rows="3"
            placeholder="e.g., Sell sensex option CE and PE every 15 mins. If 9.15-9.30 candle is green sell PE at 9.30 open price. Target 65% stop loss 22% exit at 3.15 PM."
            value={localPrompt}
            onChange={handleTextChange}
          ></textarea>

          <button
            onClick={handleAIParse}
            disabled={isParsing || !localPrompt}
            className={`lg:w-44 px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              isParsing || !localPrompt
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-[#0F1B2D] hover:bg-[#1c2d47] text-white shadow-sm cursor-pointer'
            }`}
          >
            {isParsing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Analyze logic'}
          </button>
        </div>

        {/* AI status message */}
        {aiMessage && (
          <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
            needsInfoQuestion ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {aiMessage}
          </div>
        )}
      </div>

      {/* Clarification question */}
      {needsInfoQuestion && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-amber-900">Clarification needed</h3>
          <p className="text-sm text-amber-900/80">{needsInfoQuestion}</p>
        </div>
      )}

      {/* AI interpretation */}
      {aiExplanation && (
        <div className="bg-white border border-slate-200 p-4 rounded-xl mb-4 shadow-[0_1px_2px_rgba(15,27,45,0.04)] animate-fade-in">
          <h3 className="text-sm font-semibold text-[#0F1B2D] mb-2">How the AI read your strategy</h3>
          <div className="space-y-1.5 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {aiExplanation.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
              const cleanLine = line.replace(/^[\s*\-•\d.]+\s*/, '');
              return (
                <div key={index} className="flex items-start gap-2 text-[13px] text-slate-700">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
                  <p className="flex-1 leading-relaxed">{cleanLine}</p>
                </div>
              );
            })}

            {/* Detected legs */}
            {parsedLegs && parsedLegs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-500 mb-0.5">Detected legs</span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {parsedLegs.map((leg, idx) => {
                    const isOptions = (leg.segment || 'Options').toUpperCase() === 'OPTIONS';
                    const isBuy = (leg.position || leg.action || 'BUY').toUpperCase() === 'BUY';

                    const legTypeColor = isOptions
                      ? 'border-indigo-200 bg-indigo-50/50'
                      : 'border-sky-200 bg-sky-50/50';

                    const actionColor = isBuy
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200';

                    // Extract condition info for UI badge preview
                    const conditionVal = (leg.condition || leg.trigger_condition || '').toUpperCase();
                    let conditionDisplay = null;
                    if (conditionVal.includes('GREEN')) {
                      conditionDisplay = `Entry Condition: Previous Candle = Green -> ${(leg.position || leg.action || 'BUY').toUpperCase()} ${(leg.optionType || leg.option_type || 'CE')} at Open`;
                    } else if (conditionVal.includes('RED')) {
                      conditionDisplay = `Entry Condition: Previous Candle = Red -> ${(leg.position || leg.action || 'BUY').toUpperCase()} ${(leg.optionType || leg.option_type || 'CE')} at Open`;
                    } else if (conditionVal) {
                      conditionDisplay = `Entry Condition: ${conditionVal}`;
                    }

                    return (
                      <div key={idx} className={`p-2.5 rounded-lg border ${legTypeColor} flex flex-col gap-1.5`}>
                        <div className="flex justify-between items-center border-b border-slate-200/80 pb-1.5">
                          <span className="text-xs font-semibold font-mono text-[#0F1B2D]">
                            Leg {idx + 1} · {(leg.segment || 'OPTIONS').toUpperCase()}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${actionColor}`}>
                            {(leg.position || leg.action || 'BUY').toUpperCase()} {leg.lots || 1} lot(s)
                          </span>
                        </div>

                        {conditionDisplay && (
                          <div className="bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-mono px-2 py-1 rounded flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                            <span>{conditionDisplay}</span>
                          </div>
                        )}

                        <div className="text-[11px] flex flex-wrap gap-1.5">
                          {isOptions ? (
                            <>
                              <span className={chip}>Asset <strong className="text-[#0F1B2D] font-semibold">{leg.displayTicker}</strong></span>
                              <span className={chip}>Type <strong className="text-[#0F1B2D] font-semibold">{leg.optionType || leg.option_type || 'CE'}</strong></span>
                              <span className={chip}>Strike <strong className="text-[#0F1B2D] font-semibold">{
                                (() => {
                                  const c = leg.strikeCriteria || 'Strike Type';
                                  if (c === 'Closest Premium') return `Closest Premium ₹${leg.targetPremium || 0}`;
                                  if (c === 'Premium Range') return `Premium ₹${leg.lowerPremium || 0}-${leg.upperPremium || 0}`;
                                  if (c === '% of Spot') return `${leg.spotPercent || 0}% ${leg.strikeType || 'OTM'} of Spot`;
                                  if (c === 'Straddle Width') return `${leg.straddleMultiplier || 1}x Straddle ${leg.strikeType || 'OTM'}`;
                                  return `${leg.strikeType || leg.strike_type || 'ATM'}${leg.distance ? ' ' + leg.distance : ''}`;
                                })()
                              }</strong></span>
                              <span className={chip}>Expiry <strong className="text-[#0F1B2D] font-semibold">{leg.expiryType || leg.expiry || 'CURRENT_WEEK'}</strong></span>
                            </>
                          ) : (
                            <>
                              <span className={chip}>Asset <strong className="text-[#0F1B2D] font-semibold">{leg.displayTicker} FUT</strong></span>
                              <span className={chip}>Target <strong className="text-[#0F1B2D] font-semibold">{leg.displayTarget || '-'} {leg.displayTargetUnit}</strong></span>
                              <span className={chip}>SL <strong className="text-[#0F1B2D] font-semibold">{leg.displaySl || '-'} {leg.displaySlUnit}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detected risk management */}
            {parsedRisk && (parsedRisk.combinedPremiumTarget || parsedRisk.combinedPremiumSL || parsedRisk.overallTarget || parsedRisk.overallSL) && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-500 mb-0.5">Detected risk management</span>
                <div className="flex flex-wrap gap-2">

                  {parsedRisk.combinedPremiumTarget && (
                    <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Combined target</span>
                      <span className="text-sm font-semibold font-mono text-emerald-700">
                        {parsedRisk.combinedPremiumTarget} {parsedRisk.combinedPremiumTargetUnit}
                      </span>
                    </div>
                  )}

                  {parsedRisk.combinedPremiumSL && (
                    <div className="bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Combined SL</span>
                      <span className="text-sm font-semibold font-mono text-rose-700">
                        {parsedRisk.combinedPremiumSL} {parsedRisk.combinedPremiumSLUnit}
                      </span>
                    </div>
                  )}

                  {parsedRisk.overallTarget && (
                    <div className="bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Overall strategy target</span>
                      <span className="text-sm font-semibold font-mono text-sky-700">{parsedRisk.overallTarget} {parsedRisk.overallTargetUnit}</span>
                    </div>
                  )}

                  {parsedRisk.overallSL && (
                    <div className="bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Overall strategy SL</span>
                      <span className="text-sm font-semibold font-mono text-orange-700">{parsedRisk.overallSL} {parsedRisk.overallSLUnit}</span>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Confirm footer */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
            <span className="text-xs text-slate-500">
              {isConfirmed ? <span className="text-emerald-700 font-medium">✓ Logic validated. Ready for execution.</span> : 'Review the buying and selling parameters below, then confirm.'}
            </span>
            <button
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isConfirmed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-[#0F1B2D] text-white hover:bg-[#1c2d47]'
              }`}
            >
              {isConfirmed ? 'Edit parameters' : 'Confirm settings'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(AIParseSection);