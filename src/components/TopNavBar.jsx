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
  isFyersConnected,
  handleFyersLogin,
  activeTab,       // 'trade' or 'wealth'
  setActiveTab
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 md:px-6 bg-white border-b border-slate-200 sticky top-0 z-50">

      {/* LEFT: Logo + mode switcher */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2.5">
          <img src="/image/logo.png" alt="AlgoSay Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-semibold tracking-tight">
              <span className="text-[#0F1B2D]">Algo</span><span className="text-indigo-600">Say</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Pro quant edge</span>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('trade')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'trade'
                ? 'bg-white text-[#0F1B2D] shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-[#0F1B2D] border border-transparent'
            }`}
          >
            Intraday algo
          </button>
          <button
            onClick={() => setActiveTab('wealth')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'wealth'
                ? 'bg-white text-[#0F1B2D] shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-[#0F1B2D] border border-transparent'
            }`}
          >
            Wealth allocator
          </button>
        </div>
      </div>

      {/* RIGHT: actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Secondary actions (desktop) */}
        <div className="hidden lg:flex items-center border border-slate-200 rounded-lg bg-white divide-x divide-slate-200">
          <button
            onClick={() => openStrategiesModal('my_strategies')}
            className="px-3 py-1.5 text-slate-600 hover:text-[#0F1B2D] hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer rounded-l-lg"
          >
            My strategies
          </button>
          <button
            onClick={() => openStrategiesModal('default_strategies')}
            className="px-3 py-1.5 text-slate-600 hover:text-[#0F1B2D] hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
          >
            Default templates
          </button>
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-3 py-1.5 text-slate-600 hover:text-[#0F1B2D] hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer rounded-r-lg max-w-[200px] truncate"
          >
            {user?.email || user?.displayName}
          </button>
        </div>

        {/* Fyers badge */}
        {isFyersConnected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold text-emerald-700 hidden md:block">Fyers connected</span>
          </div>
        ) : (
          <button
            onClick={handleFyersLogin}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-[11px] font-semibold text-orange-700 hidden md:block">Fyers login</span>
          </button>
        )}

        {/* Credits / Pro badge */}
        <button
          onClick={() => setShowPricingModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-all cursor-pointer"
        >
          <span className="text-[11px] font-semibold text-amber-800 font-mono">
            {isSubscribed ? `PRO: ${subscriptionPlan.toUpperCase()}` : `${userCredits} credits`}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => signOut(auth)}
          className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-md transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;