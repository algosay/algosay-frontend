import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────
// Small UI helpers
// ─────────────────────────────────────────────────────────────
const Section = ({ title, hint, right, children }) => (
  <section>
    <div className="mb-1.5 flex items-center justify-between gap-2 px-0.5">
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="text-[13px] font-semibold text-[#121A2B]">{title}</h3>
        {hint && <span className="truncate text-[11px] text-[#7C879A]">{hint}</span>}
      </div>
      {right}
    </div>
    {children}
  </section>
);

const Box = ({ className = '', children }) => (
  <div className={`rounded-lg border border-[#DDE2E9] bg-white p-3 ${className}`}>{children}</div>
);

const Cell = ({ label, value, tone }) => (
  <div className="min-w-0 rounded-md border border-[#E9EDF2] bg-[#FAFBFC] px-2 py-1.5">
    <p className="text-[10px] font-medium uppercase tracking-wide text-[#7C879A]">{label}</p>
    <p className={`font-num truncate text-[12px] font-semibold ${tone || 'text-[#121A2B]'}`}>{value}</p>
  </div>
);

const RiskTile = ({ label, value, unit, accent, text }) => (
  <div className={`min-w-[150px] flex-1 rounded-lg border border-[#DDE2E9] border-t-[3px] bg-white px-3 py-2 ${accent}`}>
    <p className="text-[10.5px] font-medium text-[#5B667A]">{label}</p>
    <p className={`font-num mt-0.5 text-[16px] font-semibold tabular-nums ${text}`}>
      {value} <span className="text-[11px] font-medium">{unit}</span>
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Returns true only for a real, non-zero value ("", null, undefined, 0, "0", "00" => false)
const isFilled = (v) => {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  if (s === '') return false;
  const n = parseFloat(s);
  if (!isNaN(n)) return n !== 0;
  return true;
};

// Turns "65%" / "20 pts" / "500" into a number when possible
const toNumberIfPossible = (v) => {
  if (typeof v !== 'string') return v;
  const n = parseFloat(v);
  return isNaN(n) ? v : n;
};

// Detects the unit from a string value and cleans the value itself
const parseValueUnit = (rawValue, rawUnit, defaultUnit) => {
  let value = rawValue ?? '';
  let unit = rawUnit || '';
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower.includes('%')) unit = '%';
    else if (lower.includes('pt') || lower.includes('point')) unit = 'Pts';
    else if (lower.includes('rs') || lower.includes('rupee') || lower.includes('₹')) unit = 'Rs';
    value = toNumberIfPossible(value);
  }
  return { value, unit: unit || defaultUnit };
};

const AIParseSection = ({
  aiPrompt, setAiPrompt, isParsing, setIsParsing,
  aiMessage, setAiMessage,
  needsInfoQuestion, setNeedsInfoQuestion,
  aiExplanation, setAiExplanation,
  isConfirmed, setIsConfirmed,
  onParsedDataSuccess
}) => {

  // Local state prevents focus loss during heavy parent re-renders
  const [localPrompt, setLocalPrompt] = useState(aiPrompt || "");
  const textareaRef = useRef(null);

  // Parsed legs + risk for preview before confirmation
  const [parsedLegs, setParsedLegs] = useState([]);
  const [parsedRisk, setParsedRisk] = useState(null);

  // Sync external prompt changes (e.g. template loaded by parent)
  useEffect(() => {
    if (aiPrompt !== localPrompt) {
      setLocalPrompt(aiPrompt || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPrompt]);

  // Auto-grow textarea (max 480px, then scroll)
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
    setLocalPrompt(val);
    if (setAiPrompt) setAiPrompt(val);
  };

  const handleAIParse = async () => {
    setIsParsing(true);

    // Clear previous results
    if (setAiMessage) setAiMessage(null);
    if (setAiExplanation) setAiExplanation(null);
    if (setNeedsInfoQuestion) setNeedsInfoQuestion(null);
    if (setIsConfirmed) setIsConfirmed(false);
    setParsedLegs([]);
    setParsedRisk(null);

    try {
      const response = await axios.post("https://algosay-backend.onrender.com/parse_strategy", {
        prompt: localPrompt
      });

      const data = response.data;
      const promptText = (localPrompt || '').toUpperCase();

      if (data.status === "success") {
        if (setAiExplanation) setAiExplanation(data.explanation);
        if (setAiMessage) setAiMessage("Strategy auto-mapped successfully");

        // ── Smart extraction for UI preview ──
        let enhancedLegs = [];
        if (data.legs && Array.isArray(data.legs)) {

          let extractedTicker = '';

          // Identify exact asset from the user prompt
          if (promptText.includes('MIDCPNIFTY') || promptText.includes('MIDCAP')) extractedTicker = 'MIDCPNIFTY';
          else if (promptText.includes('FINNIFTY') || promptText.includes('FIN NIFTY')) extractedTicker = 'FINNIFTY';
          else if (promptText.includes('BANKNIFTY') || promptText.includes('BANK NIFTY')) extractedTicker = 'BANKNIFTY';
          else if (promptText.includes('BANKEX')) extractedTicker = 'BANKEX';
          else if (promptText.includes('SENSEX')) extractedTicker = 'SENSEX';
          else if (promptText.includes('NIFTY')) extractedTicker = 'NIFTY';

          enhancedLegs = data.legs.map(leg => {
            const finalTicker = extractedTicker || leg.ticker || leg.asset || 'NIFTY';

            // Stoploss value + unit
            let rawSlVal = leg.stopLoss ?? leg.stop_loss ?? '';
            let slUnit = leg.slUnit || leg.sl_unit || leg.stopLossUnit || leg.stop_loss_unit || 'Pts';
            if (typeof rawSlVal === 'string') {
              if (rawSlVal.toLowerCase().includes('pt') || rawSlVal.toLowerCase().includes('point')) slUnit = 'Pts';
              else if (rawSlVal.includes('%')) slUnit = '%';
              else if (rawSlVal.toLowerCase().includes('rs') || rawSlVal.toLowerCase().includes('rupee')) slUnit = 'Rs';
              rawSlVal = toNumberIfPossible(rawSlVal);
            }

            // Target value + unit
            let rawTargetVal = leg.target ?? '';
            let targetUnit = leg.targetUnit || leg.target_unit || 'Pts';
            if (typeof rawTargetVal === 'string') {
              if (rawTargetVal.toLowerCase().includes('pt') || rawTargetVal.toLowerCase().includes('point')) targetUnit = 'Pts';
              else if (rawTargetVal.includes('%')) targetUnit = '%';
              else if (rawTargetVal.toLowerCase().includes('rs') || rawTargetVal.toLowerCase().includes('rupee')) targetUnit = 'Rs';
              rawTargetVal = toNumberIfPossible(rawTargetVal);
            }

            // Fallback: exact word match for Pts
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

        // ── Risk management extraction ──
        const riskObj = data.risk_management || {};

        // Combined target + unit
        const combT = parseValueUnit(
          data.combinedPremiumTarget ?? data.combined_premium_target ?? riskObj.combinedPremiumTarget ?? riskObj.combined_premium_target ?? '',
          data.combinedPremiumTargetUnit ?? data.combined_premium_target_unit ?? riskObj.combinedPremiumTargetUnit ?? riskObj.combined_premium_target_unit ?? '',
          ''
        );
        let rawCombTarget = combT.value;
        let combTargetUnit = combT.unit;

        // Combined SL + unit
        const combS = parseValueUnit(
          data.combinedPremiumSL ?? data.combined_premium_sl ?? riskObj.combinedPremiumSL ?? riskObj.combined_premium_sl ?? '',
          data.combinedPremiumSLUnit ?? data.combined_premium_sl_unit ?? riskObj.combinedPremiumSLUnit ?? riskObj.combined_premium_sl_unit ?? '',
          ''
        );
        let rawCombSL = combS.value;
        let combSLUnit = combS.unit;

        // AI hallucination fixer: exact word match (\b)
        const hasPts = /\b(PT|PTS|POINT|POINTS)\b/.test(promptText);
        const hasRs = /\b(RS|RUPEE|RUPEES)\b/.test(promptText);
        const hasPercent = /(%|\bPERCENT\b)/.test(promptText);

        if (hasPts && !hasPercent) {
          if (isFilled(rawCombTarget)) combTargetUnit = 'Pts';
          if (isFilled(rawCombSL)) combSLUnit = 'Pts';
        } else if (hasRs && !hasPercent) {
          if (isFilled(rawCombTarget)) combTargetUnit = 'Rs';
          if (isFilled(rawCombSL)) combSLUnit = 'Rs';
        }

        combTargetUnit = combTargetUnit || 'Pts';
        combSLUnit = combSLUnit || 'Pts';

        // Overall strategy target + unit
        const overT = parseValueUnit(
          data.overallStrategyTarget ?? data.overall_strategy_target ?? data.overallTarget ?? data.overall_target ?? riskObj.overallTarget ?? riskObj.overallStrategyTarget ?? riskObj.overall_strategy_target ?? riskObj.overall_target ?? '',
          data.overallStrategyTargetUnit ?? data.overall_strategy_target_unit ?? data.overallTargetUnit ?? data.overall_target_unit ?? riskObj.overallTargetUnit ?? riskObj.overallStrategyTargetUnit ?? riskObj.overall_strategy_target_unit ?? riskObj.overall_target_unit ?? '',
          'Rs'
        );
        const rawOverallTarget = overT.value;
        const overallTargetUnit = overT.unit;

        // Overall strategy SL + unit
        const overS = parseValueUnit(
          data.overallStrategySL ?? data.overall_strategy_sl ?? data.overallSL ?? data.overall_sl ?? riskObj.overallSL ?? riskObj.overallStrategySL ?? riskObj.overall_strategy_sl ?? riskObj.overall_sl ?? '',
          data.overallStrategySLUnit ?? data.overall_strategy_sl_unit ?? data.overallSLUnit ?? data.overall_sl_unit ?? riskObj.overallSLUnit ?? riskObj.overallStrategySLUnit ?? riskObj.overall_strategy_sl_unit ?? riskObj.overall_sl_unit ?? '',
          'Rs'
        );
        const rawOverallSL = overS.value;
        const overallSLUnit = overS.unit;

        setParsedRisk({
          combinedPremiumTarget: rawCombTarget,
          combinedPremiumTargetUnit: combTargetUnit,
          combinedPremiumSL: rawCombSL,
          combinedPremiumSLUnit: combSLUnit,
          overallTarget: rawOverallTarget,
          overallTargetUnit: overallTargetUnit,
          overallSL: rawOverallSL,
          overallSLUnit: overallSLUnit
        });

        // Inject fixed units back into `data` BEFORE passing to parent
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

        // Overall target / SL (+ units) so parent auto-fills the overall risk UI
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

        if (enhancedLegs.length > 0) {
          data.legs = enhancedLegs;
        }

        if (onParsedDataSuccess) onParsedDataSuccess(data);

      } else {
        if (setNeedsInfoQuestion) setNeedsInfoQuestion(data.message || "Can you specify the timeframe?");
      }

    } catch (error) {
      console.error("Error connecting to AI:", error);
      if (setAiMessage) setAiMessage("Failed to parse strategy. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  // Ctrl+Enter / Cmd+Enter = Analyze
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isParsing && localPrompt) {
      e.preventDefault();
      handleAIParse();
    }
  };

  const wordCount = (localPrompt || '').trim() ? (localPrompt || '').trim().split(/\s+/).length : 0;

  // ✅ FIX: always a real boolean (never 0 / "" / null) so React never prints "0"
  const showCombTarget = !!parsedRisk && isFilled(parsedRisk.combinedPremiumTarget);
  const showCombSL = !!parsedRisk && isFilled(parsedRisk.combinedPremiumSL);
  const showOverallTarget = !!parsedRisk && isFilled(parsedRisk.overallTarget);
  const showOverallSL = !!parsedRisk && isFilled(parsedRisk.overallSL);
  const hasRisk = showCombTarget || showCombSL || showOverallTarget || showOverallSL;
  const hasCombined = showCombTarget || showCombSL;
  const hasOverall = showOverallTarget || showOverallSL;

  // Clean the explanation into numbered steps
  const explanationLines = (aiExplanation || '')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^[\s*\-•\d.]+\s*/, ''));

  return (
    <div className="font-ui mb-4 w-full space-y-4 rounded-2xl bg-[#F2F4F7] p-3 text-[#121A2B]">

      {/* ═════════ 1. DESCRIBE YOUR STRATEGY ═════════ */}
      <Section
        title="Describe your strategy"
        hint="Write your trading logic in your own language."
        right={
          <span className="flex items-center gap-1.5 rounded-full border border-[#DDE2E9] bg-white px-2.5 py-0.5 text-[10.5px] font-medium text-[#5B667A]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1F9D6B]" />
            AlgoSay AI · online
          </span>
        }
      >
        <Box className="p-4">
          <textarea
            ref={textareaRef}
            rows="8"
            className="custom-scrollbar max-h-[480px] min-h-[220px] w-full resize-none overflow-y-auto rounded-md border border-[#C9D1DD] bg-white p-4 text-[13.5px] leading-relaxed text-[#121A2B] outline-none transition-colors placeholder:text-[#9AA4B5] focus:border-[#2F5BEA] focus:ring-2 focus:ring-[#2F5BEA]/15"
            placeholder="e.g., Sell sensex option CE and PE every 15 mins. If 9.15-9.30 candle is green sell PE at 9.30 open price. Target 65% stop loss 22% exit at 3.15 PM."
            value={localPrompt}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />

          {/* Counter + shortcut hint */}
          <div className="mt-1.5 flex items-center justify-between px-0.5 text-[10.5px] text-[#7C879A]">
            <span className="font-num">{(localPrompt || '').length} chars · {wordCount} words</span>
            <span className="hidden sm:inline">
              <kbd className="font-num rounded border border-[#DDE2E9] bg-[#F7F8FA] px-1 py-px text-[10px]">Ctrl</kbd>
              {' + '}
              <kbd className="font-num rounded border border-[#DDE2E9] bg-[#F7F8FA] px-1 py-px text-[10px]">Enter</kbd>
              {' to analyze'}
            </span>
          </div>

          {/* Analyze button */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={handleAIParse}
              disabled={isParsing || !localPrompt}
              className={`flex h-10 min-w-[200px] items-center justify-center gap-2 rounded-md px-8 text-[13px] font-semibold transition-colors ${
                isParsing || !localPrompt
                  ? 'cursor-not-allowed border border-[#DDE2E9] bg-[#F2F4F7] text-[#9AA4B5]'
                  : 'cursor-pointer bg-[#121A2B] text-white hover:bg-[#25314D]'
              }`}
            >
              {isParsing ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze logic
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Status message */}
          {aiMessage ? (
            <div className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-medium ${
              needsInfoQuestion
                ? 'border-[#F0D9A8] bg-[#FFF8E6] text-[#8A5A00]'
                : 'border-[#BFE5D3] bg-[#E4F6EE] text-[#157550]'
            }`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${needsInfoQuestion ? 'bg-[#E2B04A]' : 'bg-[#1F9D6B]'}`} />
              {aiMessage}
            </div>
          ) : null}
        </Box>
      </Section>

      {/* ═════════ CLARIFICATION NEEDED ═════════ */}
      {needsInfoQuestion ? (
        <Section title="Clarification needed" hint="AI needs one more detail to continue.">
          <div className="rounded-lg border border-[#F0D9A8] border-l-[3px] border-l-[#E2B04A] bg-[#FFF8E6] p-3">
            <p className="text-[12.5px] leading-relaxed text-[#8A5A00]">{needsInfoQuestion}</p>
          </div>
        </Section>
      ) : null}

      {aiExplanation ? (
        <>
          {/* ═════════ 2. HOW THE AI READ IT ═════════ */}
          <Section title="How the AI read your strategy" hint="Check each line matches what you meant.">
            <Box>
              <div className="flex flex-col gap-1.5">
                {explanationLines.map((line, index) => (
                  <div key={index} className="flex items-start gap-2.5 rounded-md border border-[#E9EDF2] bg-[#FAFBFC] px-2.5 py-2">
                    <span className="font-num mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121A2B] text-[10px] font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-[12.5px] leading-relaxed text-[#2B3547]">{line}</p>
                  </div>
                ))}
              </div>
            </Box>
          </Section>

          {/* ═════════ 3. DETECTED LEGS ═════════ */}
          {parsedLegs.length > 0 ? (
            <Section title="Detected legs" hint={`${parsedLegs.length} leg${parsedLegs.length > 1 ? 's' : ''} found`}>
              <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                {parsedLegs.map((leg, idx) => {
                  const isOptions = (leg.segment || 'Options').toUpperCase() === 'OPTIONS';
                  const position = (leg.position || leg.action || 'BUY').toUpperCase();
                  const isBuy = position === 'BUY';
                  const optType = leg.optionType || leg.option_type || 'CE';

                  // Entry-condition banner
                  const conditionVal = (leg.condition || leg.trigger_condition || '').toUpperCase();
                  let conditionDisplay = null;
                  if (conditionVal.includes('GREEN')) {
                    conditionDisplay = `Previous candle = Green → ${position} ${optType} at open`;
                  } else if (conditionVal.includes('RED')) {
                    conditionDisplay = `Previous candle = Red → ${position} ${optType} at open`;
                  } else if (conditionVal) {
                    conditionDisplay = conditionVal;
                  }

                  // Strike text
                  const c = leg.strikeCriteria || 'Strike Type';
                  let strikeText;
                  if (c === 'Closest Premium') strikeText = `Premium ≈ ₹${leg.targetPremium || 0}`;
                  else if (c === 'Premium Range') strikeText = `₹${leg.lowerPremium || 0} – ${leg.upperPremium || 0}`;
                  else if (c === '% of Spot') strikeText = `${leg.spotPercent || 0}% ${leg.strikeType || 'OTM'}`;
                  else if (c === 'Straddle Width') strikeText = `${leg.straddleMultiplier || 1}x ${leg.strikeType || 'OTM'}`;
                  else strikeText = `${leg.strikeType || leg.strike_type || 'ATM'}${leg.distance ? ' ' + leg.distance : ''}`;

                  const hasTarget = isFilled(leg.displayTarget);
                  const hasSl = isFilled(leg.displaySl);

                  return (
                    <div key={idx} className="flex overflow-hidden rounded-lg border border-[#DDE2E9] bg-white">
                      {/* side colour = BUY / SELL */}
                      <div className={`w-1 shrink-0 ${isBuy ? 'bg-[#1F9D6B]' : 'bg-[#D64545]'}`} />

                      <div className="min-w-0 flex-1 p-3">
                        {/* Header */}
                        <div className="mb-2 flex items-center gap-2 border-b border-[#EEF1F5] pb-2">
                          <span className="font-num text-[11px] font-semibold text-[#7C879A]">L{idx + 1}</span>
                          <span className={`rounded px-1.5 py-px text-[10.5px] font-bold ${isBuy ? 'bg-[#E4F6EE] text-[#157550]' : 'bg-[#FDECEC] text-[#B42F2F]'}`}>
                            {position}
                          </span>
                          <span className={`rounded border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide ${
                            isOptions ? 'border-[#D5DEFA] bg-[#EEF2FF] text-[#2F5BEA]' : 'border-[#CFE6F3] bg-[#EAF6FC] text-[#1B7BA8]'
                          }`}>
                            {(leg.segment || 'OPTIONS').toUpperCase()}
                          </span>
                          <span className="font-num ml-auto text-[11.5px] font-semibold text-[#121A2B]">
                            {leg.lots || 1} lot{(leg.lots || 1) > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Entry condition */}
                        {conditionDisplay ? (
                          <div className="mb-2 flex items-center gap-2 rounded-md border border-[#D9D3F5] bg-[#F5F3FF] px-2.5 py-1.5 text-[11.5px] font-medium text-[#4B3BA8]">
                            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#7C5CFF]" />
                            <span>{conditionDisplay}</span>
                          </div>
                        ) : null}

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                          <Cell label="Asset" value={isOptions ? leg.displayTicker : `${leg.displayTicker} FUT`} />
                          {isOptions ? <Cell label="Type" value={optType} /> : null}
                          {isOptions ? <Cell label="Strike" value={strikeText} /> : null}
                          {isOptions ? <Cell label="Expiry" value={leg.expiryType || leg.expiry || 'CURRENT_WEEK'} /> : null}
                          <Cell
                            label="Target"
                            value={hasTarget ? `${leg.displayTarget} ${leg.displayTargetUnit}` : '-'}
                            tone={hasTarget ? 'text-[#157550]' : 'text-[#9AA4B5]'}
                          />
                          <Cell
                            label="Stop loss"
                            value={hasSl ? `${leg.displaySl} ${leg.displaySlUnit}` : '-'}
                            tone={hasSl ? 'text-[#B42F2F]' : 'text-[#9AA4B5]'}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {/* ═════════ 4. DETECTED RISK MANAGEMENT ═════════ */}
          {hasRisk ? (
            <Section title="Detected risk management" hint="Only values found in your strategy are shown.">
              <Box>
                <div className="space-y-3">
                  {hasCombined ? (
                    <div>
                      <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#7C879A]">
                        Combined premium
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {showCombTarget ? (
                          <RiskTile
                            label="Combined target"
                            value={parsedRisk.combinedPremiumTarget}
                            unit={parsedRisk.combinedPremiumTargetUnit}
                            accent="border-t-[#1F9D6B]"
                            text="text-[#157550]"
                          />
                        ) : null}
                        {showCombSL ? (
                          <RiskTile
                            label="Combined stop loss"
                            value={parsedRisk.combinedPremiumSL}
                            unit={parsedRisk.combinedPremiumSLUnit}
                            accent="border-t-[#D64545]"
                            text="text-[#B42F2F]"
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {hasOverall ? (
                    <div>
                      <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#7C879A]">
                        Overall strategy
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {showOverallTarget ? (
                          <RiskTile
                            label="Overall target"
                            value={parsedRisk.overallTarget}
                            unit={parsedRisk.overallTargetUnit}
                            accent="border-t-[#1F9D6B]"
                            text="text-[#157550]"
                          />
                        ) : null}
                        {showOverallSL ? (
                          <RiskTile
                            label="Overall stop loss"
                            value={parsedRisk.overallSL}
                            unit={parsedRisk.overallSLUnit}
                            accent="border-t-[#D64545]"
                            text="text-[#B42F2F]"
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </Box>
            </Section>
          ) : null}

          {/* ═════════ 5. CONFIRM ═════════ */}
          {setIsConfirmed ? (
            <div className="flex justify-center">
              <button
                onClick={() => setIsConfirmed(true)}
                disabled={isConfirmed}
                className={`flex h-10 min-w-[200px] items-center justify-center gap-2 rounded-md px-8 text-[13px] font-semibold transition-colors ${
                  isConfirmed
                    ? 'cursor-default border border-[#BFE5D3] bg-[#E4F6EE] text-[#157550]'
                    : 'cursor-pointer bg-[#1F9D6B] text-white hover:bg-[#178159]'
                }`}
              >
                {isConfirmed ? '✓ Strategy confirmed' : 'Looks correct – Confirm'}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default AIParseSection;