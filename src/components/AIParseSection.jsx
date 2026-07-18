import React from 'react';
import axios from 'axios';

const AIParseSection = ({ 
  aiPrompt, setAiPrompt, isParsing, setIsParsing, 
  aiMessage, setAiMessage,             // 🟢 Puthusa Add panni irukkom
  needsInfoQuestion, setNeedsInfoQuestion, // 🟢 Puthusa Add panni irukkom
  aiExplanation, setAiExplanation,         // 🟢 Puthusa Add panni irukkom
  isConfirmed, setIsConfirmed,
  onParsedDataSuccess                  // 🟢 Puthusa Add panni irukkom (To pass data to parent)
}) => {

  const handleAIParse = async () => {
    setIsParsing(true);
    
    // Pazhaiya results-ah clear panrom
    if(setAiMessage) setAiMessage(null);
    if(setAiExplanation) setAiExplanation(null);
    if(setNeedsInfoQuestion) setNeedsInfoQuestion(null);

    try {
      const response = await axios.post("https://algosay-backend.onrender.com/parse_strategy", {
        prompt: aiPrompt
      });
      
      const data = response.data; // Axios-la result 'data'-kulla thaan irukkum

      if (data.status === "success") {
        // AI kudutha explanation-ah state-la set panrom (Ithuthaan UI-la theriyum)
        if(setAiExplanation) setAiExplanation(data.explanation);
        if(setAiMessage) setAiMessage("Strategy Auto-Mapped Successfully! ✨");
        
        // Parent component-ku full config (legs, risk) anupa intha callback use aagum
        if(onParsedDataSuccess) onParsedDataSuccess(data);
      } else {
        // AI-ku innum details thevai patta
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
      {/* 🧠 MAIN AI INPUT SECTION */}
      <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl p-5 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h2 className="text-lg font-bold text-white">AI Neural Engine</h2>
              <p className="text-xs text-gray-400">Describe your strategy logic to auto-configure settings.</p>
            </div>
          </div>
          {/* ✨ VISUAL INDICATOR */}
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Split Directional Mapping Enabled
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            className="flex-grow bg-[#121212] border border-[#333] rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 text-sm placeholder:text-gray-600 transition-colors resize-none"
            rows="2"
            placeholder="e.g., Sell Nifty ATM 10 lots at 9:20 AM with 25% SL and 50% Target, then Buy OTM CE/PE 10 lots at 9:45 AM with 80% SL..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          ></textarea>
          <button
            onClick={handleAIParse}
            disabled={isParsing || !aiPrompt}
            className={`md:w-56 px-4 py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              isParsing || !aiPrompt 
              ? 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            {isParsing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> 
                Analyzing...
              </>
            ) : 'Analyze Logic ⚡'}
          </button>
        </div>
        
        {/* AI STATUS / RESPONSE MESSAGE */}
        {aiMessage && (
          <div className={`mt-4 p-3 rounded-md text-xs font-semibold flex items-center gap-2 ${
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
        <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 rounded-xl mb-6 shadow-md animate-fade-in">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">⚙️ Interpretation Parameters</h3>
          <div className="space-y-2 mb-4 bg-[#141414] p-4 rounded-lg border border-[#262626]">
            {aiExplanation.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
              const cleanLine = line.replace(/^[\s*\-•\d.]+\s*/, '');
              return (
                <div key={index} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="text-blue-500 mt-1 text-xs">✦</span>
                  <p className="flex-1 leading-relaxed">{cleanLine}</p>
                </div>
              );
            })}
          </div>
          
          {/* VALIDATION FOOTER WITH CONFIRM BUTTON */}
          <div className="flex items-center justify-between bg-[#121212] border border-[#2d2d2d] p-3 rounded-lg">
            <span className="text-xs text-gray-400">
              {isConfirmed ? <span className="text-green-400">✓ Logic validated. Ready for execution.</span> : 'Review separate Buying & Selling parameters below and confirm.'}
            </span>
            <button
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                isConfirmed ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-blue-600 text-white hover:bg-blue-700'
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

export default AIParseSection;