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

  // 📏 Auto-grow textarea: content ku thagundha maari height maarum (max 480px, adhukku mela scroll)
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 480) + 'px';
  };

  useEffect(() => {
    autoResize();
  }, [localPrompt]);

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

  // ⌨️ Ctrl+Enter / ⌘+Enter = Analyze logic shortcut
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isParsing && localPrompt) {
      e.preventDefault();
      handleAIParse();
    }
  };

  // Spec-cell styles for leg cards (label on top, value below)
  const chip = "bg-white px-2.5 py-1.5 rounded-md border border-slate-200 flex flex-col gap-0.5 min-w-0";
  const chipLabel = "text-[10px] font-semibold uppercase tracking-wider text-slate-500";
  const chipValue = "text-[12.5px] font-semibold text-[#0B1220] font-mono truncate";

  const wordCount = (localPrompt || '').trim() ? (localPrompt || '').trim().split(/\s+/).length : 0;

  return (
    <>
      {/* Font setup (Inter for UI, JetBrains Mono for numbers) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

          .ap-root {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .ap-root .font-mono {
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-variant-numeric: tabular-nums;
          }
        `}
      </style>

      {/* MAIN AI INPUT SECTION */}
      <div className="ap-root w-full bg-white border border-slate-200 rounded-2xl mb-4 shadow-[0_1px_3px_rgba(11,18,32,0.06),0_8px_24px_rgba(11,18,32,0.04)] relative z-10 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"></div>

        <div className="p-5">

          {/* Header row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B1220] to-[#1E2B4D] shrink-0 ring-4 ring-indigo-50 shadow-sm">
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
                <h2 className="text-[17px] font-bold text-[#0B1220] tracking-[-0.015em]">Describe your strategy</h2>
                <p className="text-[13px] text-slate-600 mt-0.5 leading-snug">Write your trading logic in plain language. Previous candle colour triggers and open-price execution are supported.</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-bold tracking-wide">
                AlgoSay AI
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-medium text-slate-700">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Textarea + button */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-grow w-full flex flex-col">
              <textarea
                ref={textareaRef}
                className="w-full min-h-[160px] max-h-[480px] overflow-y-auto bg-slate-50/70 border border-slate-300 rounded-xl p-4 text-[#0B1220] focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-[15px] leading-relaxed placeholder:text-slate-400 transition-all resize-none custom-scrollbar"
                rows="6"
                placeholder="e.g., Sell sensex option CE and PE every 15 mins. If 9.15-9.30 candle is green sell PE at 9.30 open price. Target 65% stop loss 22% exit at 3.15 PM."
                value={localPrompt}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
              ></textarea>

              {/* Counter + shortcut hint */}
              <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-500">
                <span className="font-mono">{(localPrompt || '').length} chars · {wordCount} words</span>
                <span className="hidden sm:inline">
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-mono text-slate-600">Ctrl</kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-mono text-slate-600">Enter</kbd>
                  {' to analyze'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAIParse}
              disabled={isParsing || !localPrompt}
              className={`lg:w-44 lg:self-start lg:h-12 px-5 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                isParsing || !localPrompt
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0B1220] to-[#1E2B4D] hover:from-[#16213a] hover:to-[#2a3a63] text-white shadow-[0_6px_16px_rgba(11,18,32,0.25)] hover:-translate-y-px cursor-pointer'
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
              ) : (
                <>
                  Analyze logic
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* AI status message */}
          {aiMessage && (
            <div className={`mt-4 px-3.5 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 ${
              needsInfoQuestion ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${needsInfoQuestion ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              {aiMessage}
            </div>
          )}
        </div>
      </div>

      {/* Clarification question */}
      {needsInfoQuestion && (
        <div className="ap-root bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-4 rounded-xl mb-4 flex flex-col gap-1">
          <h3 className="text-sm font-bold text-amber-900">Clarification needed</h3>
          <p className="text-[14px] text-amber-900/90 leading-relaxed">{needsInfoQuestion}</p>
        </div>
      )}

      {/* AI interpretation */}
      {aiExplanation && (
        <div className="ap-root bg-white border border-slate-200 p-5 rounded-2xl mb-4 shadow-[0_1px_3px_rgba(11,18,32,0.06),0_8px_24px_rgba(11,18,32,0.04)] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-sky-500"></span>
            <h3 className="text-[15px] font-bold text-[#0B1220] tracking-[-0.01em]">How the AI read your strategy</h3>
          </div>

          <div className="space-y-2 mb-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {aiExplanation.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
              const cleanLine = line.replace(/^[\s*\-•\d.]+\s*/, '');
              return (
                <div key={index} className="flex items-start gap-2.5 text-[14px] text-slate-800">
                  <span className="mt-[2px] flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono shrink-0">{index + 1}</span>
                  <p className="flex-1 leading-relaxed">{cleanLine}</p>
                </div>
              );
            })}

            {/* Detected legs */}
            {parsedLegs && parsedLegs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Detected legs</span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {parsedLegs.map((leg, idx) => {
                    const isOptions = (leg.segment || 'Options').toUpperCase() === 'OPTIONS';
                    const isBuy = (leg.position || leg.action || 'BUY').toUpperCase() === 'BUY';

                    const legTypeColor = isBuy
                      ? 'border-slate-200 border-l-4 border-l-emerald-500 bg-white'
                      : 'border-slate-200 border-l-4 border-l-rose-500 bg-white';

                    const segmentPill = isOptions
                      ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                      : 'text-sky-700 bg-sky-50 border-sky-200';

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
                      <div key={idx} className={`p-3 rounded-xl border ${legTypeColor} shadow-[0_1px_2px_rgba(11,18,32,0.04)] flex flex-col gap-2`}>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="flex items-center gap-2 text-[13px] font-bold text-[#0B1220]">
                            Leg {idx + 1}
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${segmentPill}`}>
                              {(leg.segment || 'OPTIONS').toUpperCase()}
                            </span>
                          </span>
                          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border ${actionColor}`}>
                            {(leg.position || leg.action || 'BUY').toUpperCase()} {leg.lots || 1} lot(s)
                          </span>
                        </div>

                        {conditionDisplay && (
                          <div className="bg-violet-50 border border-violet-200 text-violet-900 text-[11.5px] font-mono px-2.5 py-1.5 rounded-md flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shrink-0"></span>
                            <span>{conditionDisplay}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-1.5">
                          {isOptions ? (
                            <>
                              <div className={chip}><span className={chipLabel}>Asset</span><strong className={chipValue}>{leg.displayTicker}</strong></div>
                              <div className={chip}><span className={chipLabel}>Type</span><strong className={chipValue}>{leg.optionType || leg.option_type || 'CE'}</strong></div>
                              <div className={chip}><span className={chipLabel}>Strike</span><strong className={chipValue}>{
                                (() => {
                                  const c = leg.strikeCriteria || 'Strike Type';
                                  if (c === 'Closest Premium') return `Closest Premium ₹${leg.targetPremium || 0}`;
                                  if (c === 'Premium Range') return `Premium ₹${leg.lowerPremium || 0}-${leg.upperPremium || 0}`;
                                  if (c === '% of Spot') return `${leg.spotPercent || 0}% ${leg.strikeType || 'OTM'} of Spot`;
                                  if (c === 'Straddle Width') return `${leg.straddleMultiplier || 1}x Straddle ${leg.strikeType || 'OTM'}`;
                                  return `${leg.strikeType || leg.strike_type || 'ATM'}${leg.distance ? ' ' + leg.distance : ''}`;
                                })()
                              }</strong></div>
                              <div className={chip}><span className={chipLabel}>Expiry</span><strong className={chipValue}>{leg.expiryType || leg.expiry || 'CURRENT_WEEK'}</strong></div>
                            </>
                          ) : (
                            <>
                              <div className={chip}><span className={chipLabel}>Asset</span><strong className={chipValue}>{leg.displayTicker} FUT</strong></div>
                              <div className={chip}><span className={chipLabel}>Target</span><strong className={chipValue}>{leg.displayTarget || '-'} {leg.displayTargetUnit}</strong></div>
                              <div className={chip}><span className={chipLabel}>SL</span><strong className={chipValue}>{leg.displaySl || '-'} {leg.displaySlUnit}</strong></div>
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
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Detected risk management</span>
                <div className="flex flex-wrap gap-2.5">

                  {parsedRisk.combinedPremiumTarget && (
                    <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-500 px-3.5 py-2 rounded-xl flex flex-col min-w-[140px] shadow-[0_1px_2px_rgba(11,18,32,0.04)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Combined target</span>
                      <span className="text-[17px] font-bold font-mono text-emerald-700 mt-0.5">
                        {parsedRisk.combinedPremiumTarget} <span className="text-[11px] font-semibold">{parsedRisk.combinedPremiumTargetUnit}</span>
                      </span>
                    </div>
                  )}

                  {parsedRisk.combinedPremiumSL && (
                    <div className="bg-white border border-slate-200 border-t-4 border-t-rose-500 px-3.5 py-2 rounded-xl flex flex-col min-w-[140px] shadow-[0_1px_2px_rgba(11,18,32,0.04)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Combined SL</span>
                      <span className="text-[17px] font-bold font-mono text-rose-700 mt-0.5">
                        {parsedRisk.combinedPremiumSL} <span className="text-[11px] font-semibold">{parsedRisk.combinedPremiumSLUnit}</span>
                      </span>
                    </div>
                  )}

                  {parsedRisk.overallTarget && (
                    <div className="bg-white border border-slate-200 border-t-4 border-t-sky-500 px-3.5 py-2 rounded-xl flex flex-col min-w-[140px] shadow-[0_1px_2px_rgba(11,18,32,0.04)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall strategy target</span>
                      <span className="text-[17px] font-bold font-mono text-sky-700 mt-0.5">{parsedRisk.overallTarget} <span className="text-[11px] font-semibold">{parsedRisk.overallTargetUnit}</span></span>
                    </div>
                  )}

                  {parsedRisk.overallSL && (
                    <div className="bg-white border border-slate-200 border-t-4 border-t-orange-500 px-3.5 py-2 rounded-xl flex flex-col min-w-[140px] shadow-[0_1px_2px_rgba(11,18,32,0.04)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall strategy SL</span>
                      <span className="text-[17px] font-bold font-mono text-orange-700 mt-0.5">{parsedRisk.overallSL} <span className="text-[11px] font-semibold">{parsedRisk.overallSLUnit}</span></span>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Confirm footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
            <span className="text-[13px] text-slate-600">
              {isConfirmed ? <span className="text-emerald-700 font-semibold">✓ Logic validated. Ready for execution.</span> : 'Review the buying and selling parameters below, then confirm.'}
            </span>
            <button
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                isConfirmed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-gradient-to-r from-[#0B1220] to-[#1E2B4D] text-white shadow-sm hover:shadow-md'
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