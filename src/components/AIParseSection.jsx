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
        
        // Parent component-ku AI extract panna exact data-va apdiye anuppuroom (No forced default overrides)
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
      {/* 🧠 MAIN AI INPUT SECTION - REDESIGNED */}
      <div className="w-full bg-[#05050A] border border-[#2a2b40] rounded-xl p-6 mb-6 shadow-[0_0_30px_rgba(139,92,246,0.08)] relative z-10 transition-all duration-300">
        
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          
          {/* TITLE & GLOWING BRAIN */}
          <div className="flex items-center gap-4">
            {/* Colorful Glowing Brain Icon Container */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="flex items-center justify-center w-full h-full bg-[#05050A] rounded-full">
                {/* Custom Tech Brain SVG */}
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
              <p className="text-sm text-gray-400 mt-0.5">Describe your trading logic in natural language or mix.</p>
            </div>
          </div>

          {/* RIGHT SIDE BADGES (Matching Image) */}
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
            className="flex-grow w-full bg-[#0a0a0f] border border-purple-900/40 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 text-sm placeholder:text-gray-600 transition-all resize-none shadow-inner custom-scrollbar"
            rows="3"
            placeholder="e.g., Call Ratio Backspread. 1.Sell 1 ITM CE, 2. Buy 2 OTM  +50  3.buy OTM +100 CE. 30% both SL. Exit at 15:15, Current Expiry. JUN 16 2025 JUN 17 2025 10 LOT   nifty 5 min time frame  9.45 am candle close exactly....buy future 10 lot at 10.00am target 1000 point stoploss 500 point  exit 3.15  SELL future 10 lot at 11.00am target 1000 point stoploss 500 point  exit 3.15 
"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          ></textarea>
          
          <button
            onClick={handleAIParse}
            disabled={isParsing || !aiPrompt}
            className={`lg:w-48 px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              isParsing || !aiPrompt 
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

      {/* 💬 CLARIFICATION QUESTION PROMPT (Retained exactly as requested) */}
      {needsInfoQuestion && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-xl mb-6 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-yellow-500 flex items-center gap-2">💬 Clarification Needed</h3>
          <p className="text-sm text-gray-300">{needsInfoQuestion}</p>
        </div>
      )}

      {/* ⚙️ AI INTERPRETATION PARAMETERS LIST (Retained exactly as requested) */}
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

export default AIParseSection;