import React from 'react';
import { Bot, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const AIParseSection = ({ 
  aiPrompt, 
  setAiPrompt, 
  isParsing, 
  aiMessage, 
  needsInfoQuestion, 
  aiExplanation, 
  handleAIParse 
}) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2d2d2d] shadow-2xl mb-8 relative overflow-hidden group">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
          <Bot className="text-blue-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">AI Neural Engine</h2>
      </div>

      <p className="text-gray-400 text-sm mb-6 max-w-2xl">
        Describe your strategy logic to auto-configure settings.
      </p>

      {/* Input Area */}
      <div className="relative">
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="E.g., Sell Nifty ATM Call and Put at 9:20 AM, exit at 3:15 PM. Stop loss 20% on each leg..."
          className="w-full bg-[#121212] text-gray-200 border border-[#333] rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 resize-y"
        />
        
        {/* ✨ THE MOST IMPORTANT BUTTON FIX ✨ */}
        <button
          onClick={handleAIParse} // 👈 DIRECT CONNECTION TO APP.JS
          disabled={isParsing || !aiPrompt.trim()}
          className={`absolute bottom-4 right-4 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            isParsing || !aiPrompt.trim()
              ? 'bg-[#2d2d2d] text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5'
          }`}
        >
          {isParsing ? (
            <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Parsing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Analyze Logic</>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {aiMessage && (
        <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${
          needsInfoQuestion ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          {needsInfoQuestion ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
          <div>
            <h4 className="font-semibold mb-1">{aiMessage}</h4>
            {needsInfoQuestion && <p className="text-sm opacity-90">{needsInfoQuestion}</p>}
          </div>
        </div>
      )}

      {/* AI Explanation Result */}
      {aiExplanation && (
        <div className="mt-6 p-5 bg-[#121212]/80 rounded-lg border border-[#333] relative">
          <div className="absolute -top-3 left-4 bg-[#1a1a1a] px-2 text-xs font-bold text-gray-500 tracking-wider flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Interpretation
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mt-2">
            {aiExplanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIParseSection;