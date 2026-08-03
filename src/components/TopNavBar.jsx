import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Update path based on your folder structure

const TopNavBar = ({ 
  user, 
  isSubscribed, 
  subscriptionPlan, 
  userCredits, 
  openStrategiesModal, 
  setShowProfileModal, 
  setShowPricingModal,
  isFyersConnected, // ⚡ NEW: Added to check Fyers connection status
  handleFyersLogin  // ⚡ NEW: Function to trigger Fyers login flow
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 md:px-6 bg-[#020205] border-b border-[#16162a] shadow-[0_4px_30px_rgba(0,0,0,0.4)] sticky top-0 z-50">
      
      {/* LEFT: App Logo & Name */}
      <div className="flex items-center gap-3">
        <img src="/image/logo.png" alt="AlgoSay Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-bold tracking-wide">
            <span className="text-white">Algo</span><span className="text-blue-500">Say</span>
          </span>
          <span className="text-[9px] md:text-[10px] text-cyan-400 font-bold tracking-[0.2em]">PRO QUANT EDGE</span>
        </div>
      </div>

      {/* RIGHT: Action Buttons */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* Pill-shaped container for secondary actions (Desktop) */}
        <div className="hidden lg:flex items-center bg-[#070710] border border-[#1e1e30] rounded-full px-2 py-1 shadow-inner">
          <button 
            onClick={() => openStrategiesModal('my_strategies')}
            className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 border-r border-[#1e1e30]"
          >
            <span className="text-yellow-500">📂</span> My Strategies
          </button>
          
          <button 
            onClick={() => openStrategiesModal('default_strategies')}
            className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 border-r border-[#1e1e30]"
          >
            <span className="text-orange-400">📜</span> Default Templates
          </button>

          <button 
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-purple-500">👤</span> {user?.email || user?.displayName}
          </button>
        </div>

        {/* ⚡ NEW: Fyers Login / Connection Badge */}
        {isFyersConnected ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#001405] border border-green-600/40 rounded-full shadow-inner cursor-default">
            <span className="text-green-500 text-sm">🟢</span>
            <span className="text-xs font-bold text-green-500 tracking-wide hidden md:block">
              FYERS CONNECTED
            </span>
          </div>
        ) : (
          <button 
            onClick={handleFyersLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#140500] hover:bg-[#240a00] border border-orange-600/40 rounded-full shadow-inner transition-all cursor-pointer"
          >
            <span className="text-orange-500 text-sm">🔥</span>
            <span className="text-xs font-bold text-orange-500 tracking-wide hidden md:block">
              FYERS LOGIN
            </span>
          </button>
        )}

        {/* Credits / Pro Badge Button */}
        <button 
          onClick={() => setShowPricingModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141000] hover:bg-[#201a00] border border-yellow-600/40 rounded-full shadow-inner transition-all cursor-pointer"
        >
          <span className="text-yellow-500 text-sm">✨</span>
          <span className="text-xs font-bold text-yellow-500 tracking-wide">
            {isSubscribed ? `PRO: ${subscriptionPlan.toUpperCase()}` : `${userCredits} CREDITS`}
          </span>
        </button>

        {/* Logout Button (Neon Red Theme) */}
        <button 
          onClick={() => signOut(auth)}
          className="px-4 py-1.5 bg-transparent border border-[#e11d48] text-[#f43f5e] hover:bg-[#e11d48]/10 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] text-xs md:text-sm font-bold rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;