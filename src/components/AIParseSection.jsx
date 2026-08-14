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
  
  // 🟢 NEW UPDATE: State to hold Risk Management (Combined SL/Target) for Dynamic UI Preview
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

      if (data.status === "success") {
        if(setAiExplanation) setAiExplanation(data.explanation);
        if(setAiMessage) setAiMessage("Strategy Auto-Mapped Successfully! ✨");
        
        // 🚨 SMART EXTRACTION LOGIC FOR UI PREVIEW
        if(data.legs && Array.isArray(data.legs)) {
          
          let extractedTicker = '';
          const promptText = (localPrompt || '').toUpperCase();
          
          // Identify EXACT asset from User Prompt dynamically
          if (promptText.includes('MIDCPNIFTY') || promptText.includes('MIDCAP')) extractedTicker = 'MIDCPNIFTY';
          else if (promptText.includes('FINNIFTY') || promptText.includes('FIN NIFTY')) extractedTicker = 'FINNIFTY';
          else if (promptText.includes('BANKNIFTY') || promptText.includes('BANK NIFTY')) extractedTicker = 'BANKNIFTY';
          else if (promptText.includes('BANKEX')) extractedTicker = 'BANKEX';
          else if (promptText.includes('SENSEX')) extractedTicker = 'SENSEX';
          else if (promptText.includes('NIFTY')) extractedTicker = 'NIFTY';

          const enhancedLegs = data.legs.map(leg => {
            // Force the exact ticker user asked for
            const finalTicker = extractedTicker || leg.ticker || leg.asset || 'NIFTY';
            
            // Smart Extraction for Stoploss Units (Pts vs %)
            let rawSlVal = leg.stopLoss ?? leg.stop_loss ?? '';
            let slUnit = leg.slUnit || leg.sl_unit || leg.stopLossUnit || leg.stop_loss_unit || 'Pts';
            if (typeof rawSlVal === 'string') {
              if (rawSlVal.toLowerCase().includes('pt') || rawSlVal.toLowerCase().includes('point')) slUnit = 'Pts';
              else if (rawSlVal.includes('%')) slUnit = '%';
              rawSlVal = parseFloat(rawSlVal) || rawSlVal;
            }

            // Smart Extraction for Target Units (Pts vs %)
            let rawTargetVal = leg.target ?? '';
            let targetUnit = leg.targetUnit || leg.target_unit || 'Pts';
            if (typeof rawTargetVal === 'string') {
              if (rawTargetVal.toLowerCase().includes('pt') || rawTargetVal.toLowerCase().includes('point')) targetUnit = 'Pts';
              else if (rawTargetVal.includes('%')) targetUnit = '%';
              rawTargetVal = parseFloat(rawTargetVal) || rawTargetVal;
            }

            // Fallback: If user types "point" in prompt, force Pts if AI misses it
            if (promptText.includes('PT') || promptText.includes('POINT')) {
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
        const extractedRisk = {
            combinedPremiumTarget: data.combinedPremiumTarget ?? data.combined_premium_target ?? riskObj.combinedPremiumTarget ?? riskObj.combined_premium_target ?? '',
            combinedPremiumSL: data.combinedPremiumSL ?? data.combined_premium_sl ?? riskObj.combinedPremiumSL ?? riskObj.combined_premium_sl ?? '',
            overallTarget: riskObj.overallStrategyTarget ?? riskObj.overall_target ?? '',
            overallSL: riskObj.overallStrategySL ?? riskObj.overall_sl ?? ''
        };
        setParsedRisk(extractedRisk);

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

  return (
    <>
      {/* 🧠 MAIN AI INPUT SECTION - REDESIGNED */}
      <div className="w-full bg-[#05050A] border border-[#2a2b40] rounded-xl p-6 mb-6 shadow-[0_0_30px_rgba(139,92,246,0.08)] relative z-10 transition-all duration-300">
        
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          
          {/* TITLE & GLOWING BRAIN */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="flex items-center justify-center w-full h-full bg-[#05050A] rounded-full">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <defs>
                    <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop stopColor="#3b82f6" offset="0%" />
                      <stop stopColor="#ec4899" offset="100%" />
                    </linearGradient>
                  </defs>
                  <path stroke="url(#brain-gradient)" d="M9.5 3a4.5 4.5 0 0 0-4.492 4.02A4.5 4.5 0 0 0 3 11.5c0 1.556.786 2.926 2 3.734a4.5 4.5 0 0 0 2.474 6.75M14.5 3a4.5 4.5 0 0 1 4.492 4.02 4.5 4.5 0 0 1 2.008 4.48c0 1.556-.786 2.926-2 3.734a4.5 4.5 0 0 1-2.474 6.75" />
                  <path stroke="url(#brain-gradient)" d="M12 3v16" />
                  <circle stroke="url(#brain-gradient)" cx="8" cy="9" r="1" />
                  <circle stroke="url(#brain-gradient)" cx="16" cy="9" r="1" />
                  <circle stroke="url(#brain-gradient)" cx="7" cy="14" r="1" />
                  <circle stroke="url(#brain-gradient)" cx="17" cy="14" r="1" />
                  <path stroke="url(#brain-gradient)" d="M12 9H9" />
                  <path stroke="url(#brain-gradient)" d="M12 14H8" />
                  <path stroke="url(#brain-gradient)" d="M12 9h3" />
                  <path stroke="url(#brain-gradient)" d="M12 14h4" />
                </svg>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">AI Neural Engine</h2>
              <p className="text-sm text-gray-400 mt-0.5">Describe your trading logic in natural language. (Now supports dynamic previous candle color triggers & open execution)</p>
            </div>
          </div>

          {/* RIGHT SIDE BADGES */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="px-4 py-1.5 rounded-full border border-purple-800/60 bg-purple-900/10 text-purple-400 text-xs font-bold tracking-wider">
              ALGOSAY AI
            </div>
            <div className="border border-[#2a2b40] rounded-lg px-3 py-1.5 flex flex-col bg-[#0a0a0f]">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-white tracking-wider uppercase">System Online</span>
              </div>
              <span className="text-[10px] text-gray-400 leading-none">All Systems Operational</span>
            </div>
          </div>
        </div>
        
        {/* TEXTAREA & BUTTON ROW */}
        <div className="flex flex-col lg:flex-row gap-4">
          <textarea
            ref={textareaRef}
            className="flex-grow w-full bg-[#0a0a0f] border border-purple-900/40 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 text-sm placeholder:text-gray-600 transition-all resize-none shadow-inner custom-scrollbar"
            rows="3"
            placeholder="e.g., Sell sensex option CE and PE every 15 mins. If 9.15-9.30 candle is green sell PE at 9.30 open price. Target 65% stop loss 22% exit at 3.15 PM."
            value={localPrompt}
            onChange={handleTextChange}
          ></textarea>
          
          <button
            onClick={handleAIParse}
            disabled={isParsing || !localPrompt}
            className={`lg:w-48 px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              isParsing || !localPrompt 
              ? 'bg-[#1a1b26] text-gray-500 border border-[#2a2b40] cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
            }`}
          >
            {isParsing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> 
                Analyzing...
              </>
            ) : 'Analyze Logic ✨'}
          </button>
        </div>
        
        {/* AI STATUS / RESPONSE MESSAGE */}
        {aiMessage && (
          <div className={`mt-5 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            needsInfoQuestion ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
          }`}>
            {aiMessage}
          </div>
        )}
      </div>

      {/* 💬 CLARIFICATION QUESTION PROMPT */}
      {needsInfoQuestion && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-xl mb-6 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-yellow-500 flex items-center gap-2">💬 Clarification Needed</h3>
          <p className="text-sm text-gray-300">{needsInfoQuestion}</p>
        </div>
      )}

      {/* ⚙️ AI INTERPRETATION PARAMETERS LIST */}
      {aiExplanation && (
        <div className="bg-[#05050A] border border-[#2a2b40] p-5 rounded-xl mb-6 shadow-md animate-fade-in">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">⚙️ Interpretation Parameters</h3>
          <div className="space-y-2 mb-4 bg-[#0a0a0f] p-4 rounded-lg border border-[#1f2030]">
            {aiExplanation.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
              const cleanLine = line.replace(/^[\s*\-•\d.]+\s*/, '');
              return (
                <div key={index} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="text-blue-500 mt-1 text-xs">✦</span>
                  <p className="flex-1 leading-relaxed">{cleanLine}</p>
                </div>
              );
            })}

            {/* 🚨 RENDERING WITH DYNAMIC displayTicker AND displayUnit & Previous Candle Condition Badge */}
            {parsedLegs && parsedLegs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1f2030] flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detected Strategy Legs:</span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {parsedLegs.map((leg, idx) => {
                    const isOptions = (leg.segment || 'Options').toUpperCase() === 'OPTIONS';
                    
                    const legTypeColor = isOptions 
                      ? 'text-pink-400 border-pink-500/30 bg-pink-500/10' 
                      : 'text-blue-400 border-blue-500/30 bg-blue-500/10';
                      
                    const actionColor = (leg.position || leg.action || 'BUY').toUpperCase() === 'BUY' 
                      ? 'text-green-400' 
                      : 'text-red-400';

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
                      <div key={idx} className={`p-3 rounded-lg border ${legTypeColor} flex flex-col gap-2`}>
                        <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                          <span className="text-xs font-bold font-mono tracking-wide">
                            LEG #{idx + 1} | {(leg.segment || 'OPTIONS').toUpperCase()}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 ${actionColor}`}>
                            {(leg.position || leg.action || 'BUY').toUpperCase()} {leg.lots || 1} LOT(S)
                          </span>
                        </div>
                        
                        {/* Render Dynamic Previous Candle Trigger Rule Badge if present */}
                        {conditionDisplay && (
                          <div className="bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[11px] font-mono px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                            <span>{conditionDisplay}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-gray-300 flex flex-wrap gap-2 mt-1">
                          {isOptions ? (
                            <>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Asset: <strong className="text-white">{leg.displayTicker}</strong></span>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Type: <strong className="text-white">{leg.optionType || leg.option_type || 'CE'}</strong></span>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Strike: <strong className="text-white">{leg.strikeType || leg.strike_type || 'ATM'}</strong></span>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Expiry: <strong className="text-white">{leg.expiryType || leg.expiry || 'CURRENT_WEEK'}</strong></span>
                            </>
                          ) : (
                            <>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Asset: <strong className="text-white">{leg.displayTicker} FUT</strong></span>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Target: <strong className="text-white">{leg.displayTarget || '-'} {leg.displayTargetUnit}</strong></span>
                              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">SL: <strong className="text-white">{leg.displaySl || '-'} {leg.displaySlUnit}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🟢 RENDER COMBINED/OVERALL RISK MANAGEMENT BADGES */}
            {parsedRisk && (parsedRisk.combinedPremiumTarget || parsedRisk.combinedPremiumSL || parsedRisk.overallTarget || parsedRisk.overallSL) && (
              <div className="mt-4 pt-4 border-t border-[#1f2030] flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detected Risk Management:</span>
                <div className="flex flex-wrap gap-3">
                  
                  {parsedRisk.combinedPremiumTarget && (
                    <div className="bg-green-900/20 border border-green-500/30 px-3 py-1.5 rounded-lg flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Combined Target</span>
                      <span className="text-sm font-bold text-green-400">{parsedRisk.combinedPremiumTarget} Pts</span>
                    </div>
                  )}

                  {parsedRisk.combinedPremiumSL && (
                    <div className="bg-red-900/20 border border-red-500/30 px-3 py-1.5 rounded-lg flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Combined SL</span>
                      <span className="text-sm font-bold text-red-400">{parsedRisk.combinedPremiumSL} Pts</span>
                    </div>
                  )}

                  {parsedRisk.overallTarget && (
                    <div className="bg-blue-900/20 border border-blue-500/30 px-3 py-1.5 rounded-lg flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Str. Target</span>
                      <span className="text-sm font-bold text-blue-400">₹{parsedRisk.overallTarget}</span>
                    </div>
                  )}

                  {parsedRisk.overallSL && (
                    <div className="bg-orange-900/20 border border-orange-500/30 px-3 py-1.5 rounded-lg flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Str. SL</span>
                      <span className="text-sm font-bold text-orange-400">₹{parsedRisk.overallSL}</span>
                    </div>
                  )}
                  
                </div>
              </div>
            )}
          </div>
          
          {/* VALIDATION FOOTER WITH CONFIRM BUTTON */}
          <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#1f2030] p-3 rounded-lg">
            <span className="text-xs text-gray-400">
              {isConfirmed ? <span className="text-green-400">✓ Logic validated. Ready for execution.</span> : 'Review separate Buying & Selling parameters below and confirm.'}
            </span>
            <button
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                isConfirmed ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
              }`}
            >
              {isConfirmed ? 'Edit Parameters' : 'Confirm Settings'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(AIParseSection);