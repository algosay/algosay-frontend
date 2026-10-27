import React, { useState } from 'react';
import axios from 'axios';

const WealthConfigView = ({ onPlanCalculated, onError }) => {
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18); // Default Balanced
  const [loading, setLoading] = useState(false);

  // Quick preset capital buttons
  const presetCapitals = [50000, 100000, 250000, 500000, 1000000];

  // Target return profile categories
  const targetProfiles = [
    { label: 'Conservative (10-12%)', value: 12, tag: 'Safe Buffer', color: 'border-green-500/40 text-green-400 bg-green-950/20' },
    { label: 'Balanced (15-20%)', value: 18, tag: 'Moderate Growth', color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { label: 'Aggressive (30-50%)', value: 35, tag: 'High Alpha', color: 'border-orange-500/40 text-orange-400 bg-orange-950/20' },
    { label: 'Extreme High (100%+)', value: 85, tag: 'High Beta / Risk', color: 'border-red-500/40 text-red-400 bg-red-950/20' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calls FastAPI endpoint we created earlier
      const response = await axios.post('/api/wealth/calculate-plan', {
        capital: Number(capital),
        target_return: Number(targetReturn)
      });

      if (response.data && response.data.status === 'success') {
        onPlanCalculated(response.data.data);
      } else {
        if (onError) onError("Failed to fetch wealth plan from backend.");
      }
    } catch (err) {
      console.error("Wealth calculation error:", err);
      if (onError) onError("Server communication error. Please check FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-[#070710] border border-[#1e1e30] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] my-6 relative overflow-hidden">
      
      {/* Background Neon Glow Effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          💎 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AlgoSay Wealth Engine</span>
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mt-2">
          Configure your capital and target return to generate an institutional-grade multi-segment asset allocation blueprint.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Investment Capital Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
            1. Enter Investment Capital (₹)
          </label>
          
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-cyan-400 font-bold text-lg">₹</span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-[#020205] border border-[#2a2a40] focus:border-cyan-500 rounded-xl text-white text-lg font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="e.g., 100000"
              required
            />
          </div>

          {/* Quick preset capital pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-gray-500 self-center mr-1">Quick Select:</span>
            {presetCapitals.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCapital(amt)}
                className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  Number(capital) === amt 
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'bg-[#020205] border-[#1e1e30] text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                ₹{(amt / 1000 >= 100 ? `${amt / 100000}L` : `${amt / 1000}K`)}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: Target Return Selection (Slider & Profile Cards) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
              2. Select Target Annual Return (%)
            </label>
            <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/50 rounded-lg text-purple-400 font-mono font-bold text-sm">
              {targetReturn}% p.a.
            </span>
          </div>

          {/* Profile Cards Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {targetProfiles.map((profile) => (
              <div
                key={profile.value}
                onClick={() => setTargetReturn(profile.value)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  Number(targetReturn) === profile.value
                    ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-[#020205] border-[#1e1e30] hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{profile.label.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${profile.color}`}>
                    {profile.tag}
                  </span>
                </div>
                <div className="text-sm font-mono font-bold text-purple-300">
                  Target: {profile.value}%
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Range Slider */}
          <div className="pt-2 bg-[#020205] p-4 rounded-xl border border-[#1e1e30]">
            <div className="flex justify-between text-xs text-gray-400 mb-1 font-mono">
              <span>Conservative (10%)</span>
              <span>Balanced (20%)</span>
              <span>Aggressive (50%)</span>
              <span>Extreme (100%+)</span>
            </div>
            <input
              type="range"
              min="8"
              max="120"
              step="1"
              value={targetReturn}
              onChange={(e) => setTargetReturn(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">⚡</span>
              <span>Running Quantum Portfolio Allocation...</span>
            </>
          ) : (
            <>
              <span>🚀 Generate Cyberpunk Wealth Blueprint</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default WealthConfigView;