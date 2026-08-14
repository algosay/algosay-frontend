import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Globe, Activity } from 'lucide-react';

const multilingualExamples = [
  {
    lang: "Tamil (தமிழ்)",
    flag: "🇮🇳",
    input: "BANKNIFTY 9:20 AM Straddle போட்டு 25% Stoploss வை...period JAN 2025 TO DEC 2025",
    translated: "Sell Nifty/BankNifty Straddle at 9:20 AM with 25% Stoploss... period JAN 2025 TO DEC 2025",
    report: "AI Diagnostics: Win Rate 68.4% | Max DD: 4.2% | Optimized for 0DTE execution."
  },
  {
    lang: "Hindi (हिन्दी)",
    flag: "🇮🇳",
    input: "Nifty ATM Put खरीदो जब RSI 70 से ऊपर हो... period JAN 2025 TO DEC 2025",
    translated: "Buy Nifty ATM Put when RSI is above 70... period JAN 2025 TO DEC 2025",
    report: "AI विश्लेषण: जीत दर 71.2% | अधिकतम गिरावट: 3.8% | मोमेंटम फ़िल्टर पास।"
  },
  {
    lang: "Malayalam (മലയാളം)",
    flag: "🇮🇳",
    input: "RSI 30-ൽ താഴെയാകുമ്പോൾ Call Option വാങ്ങുക...",
    translated: "Buy Call Option when RSI drops below 30... period JAN 2025 TO DEC 2025",
    report: "AI വിശകലനം: വിജയ നിരക്ക് 69.5% | പ്രകടനം മികച്ചതാണ്."
  },
  {
    lang: "Telugu (తెలుగు)",
    flag: "🇮🇳",
    input: "RSI 70 దాటినప్పుడు BankNifty Put కొనండి...",
    translated: "Buy BankNifty Put when RSI crosses above 70...",
    report: "AI విశ్లేషణ: విజయ రేటు 70.8% | డ్రాడౌన్ ఆప్టిమైజ్ చేయబడింది."
  },
  {
    lang: "English (Global)",
    flag: "🌐",
    input: "Buy BankNifty ATM Put if RSI > 70 and MACD crosses...",
    translated: "Buy BankNifty ATM Put if RSI > 70 and MACD crosses...",
    report: "AI Diagnostics: Win Rate 72.1% | Sharpe Ratio: 2.14 | Institutional Grade."
  }
];

const MultilingualSection = () => {
  const [activeLangIndex, setActiveLangIndex] = useState(0);

  return (
    <motion.div 
      id="multilingual"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-[1400px] mx-auto mt-12 mb-16 relative z-20 scroll-mt-24"
    >
      <div className="text-center mb-12">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#9D4EDD]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        >
          <Globe size={14} className="animate-spin" /> Pan-India Native Support
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
          Type in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#9D4EDD] to-[#FF007A]">Your Mother Tongue</span>
        </h2>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto text-base">
          AlgoSay understands <strong className="text-white">English, Tamil, Hindi, Malayalam, and Telugu</strong> seamlessly. Get instant institutional backtests and AI Diagnostics reports in your preferred language.
        </p>
      </div>

      <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[#00E5FF] via-[#7928CA] to-[#FF007A] shadow-[0_0_50px_rgba(121,40,202,0.3)] hover:shadow-[0_0_80px_rgba(0,229,255,0.4)] transition-shadow duration-700">
        <div className="bg-[#0A0C14] rounded-[22px] p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>

          <div className="w-full lg:w-[40%] flex flex-col gap-3">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Languages size={18} className="text-[#00E5FF]" /> Select Your Language:
            </h4>
            {multilingualExamples.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, x: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLangIndex(idx)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer
                  ${activeLangIndex === idx 
                    ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#7928CA]/20 border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)] text-white' 
                    : 'bg-[#050711]/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="font-bold text-base tracking-wide">{item.lang}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${activeLangIndex === idx ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'bg-slate-700'}`}></div>
              </motion.button>
            ))}
          </div>

          <div className="w-full lg:w-[60%] flex flex-col gap-6 bg-[#050711] p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative hover:border-[#00E5FF]/30 transition-colors duration-500">
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#00E5FF] to-[#7928CA] text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]">
              Live AI Neural Translation
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-pulse"></span> Your Native Input ({multilingualExamples[activeLangIndex].lang}):
              </span>
              <div className="p-4 rounded-xl bg-black/40 border border-[#FF007A]/20 font-mono text-base text-[#00E5FF] shadow-inner transition-all duration-300">
                "{multilingualExamples[activeLangIndex].input}"
              </div>
            </div>

            <div className="flex justify-center -my-2">
              <div className="p-2 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 text-slate-400 animate-bounce shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                ↓
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span> Quant Engine Mapping (English Standard):
              </span>
              <div className="p-4 rounded-xl bg-black/40 border border-[#00E5FF]/30 font-mono text-sm text-white shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                {multilingualExamples[activeLangIndex].translated}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-[#00E676] animate-pulse" /> AlgoSay AI Diagnostics Report:
              </span>
              <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/40 font-mono text-xs text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]">
                {multilingualExamples[activeLangIndex].report}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MultilingualSection;