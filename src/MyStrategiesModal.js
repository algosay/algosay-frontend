import React from 'react';

// Bespoke SVG Icons - Pure Premium
const Icons = {
  Strategy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Load: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Metadata Pill Component
const MetadataPill = ({ text, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600/10 text-blue-400 border border-blue-600/20',
    green: 'bg-green-600/10 text-green-400 border border-green-600/20',
    yellow: 'bg-yellow-600/10 text-yellow-400 border border-yellow-600/20'
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${colors[color]} tracking-wide`}>
      {text}
    </span>
  );
};

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies, onLoad, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    // Backdrop - with blur and gradient
    <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      
      {/* Modal Container - slate theme with fine details */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl w-full max-w-2xl p-7 relative shadow-[0_0_60px_-15px_rgba(30,41,59,0.5)] animate-fade-in-up">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pr-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#334155] text-white">
              <Icons.Strategy />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                My Saved Strategies
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Access your private repository of pre-configured trading plans.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-[#334155] transition-all"
          >
            ✕
          </button>
        </div>
        
        {/* Main Content Area */}
        {isLoading ? (
          <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Syncing with your database...</p>
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center p-10 bg-[#0F172A] rounded-2xl border border-[#334155]">
            <div className="p-4 bg-[#1E293B] rounded-full border border-[#334155] text-gray-600 inline-block mb-4">
              <Icons.Strategy />
            </div>
            <p className="text-gray-500 font-medium text-lg">No Strategies Found</p>
            <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
              You haven't saved any configurations yet. Your private collection will appear here once you do.
            </p>
          </div>
        ) : (
          // Strategy List - with custom scrollbar
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3 scrollbar-premium">
            {strategies.map(strat => (
              <div 
                key={strat.id} 
                className="bg-[#0F172A] p-5 rounded-2xl flex justify-between items-start border border-[#334155] hover:border-blue-600 hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)] transition-all duration-300 group"
              >
                {/* Left Side - Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                      {strat.name}
                    </h3>
                    {/* Placeholder Metadata - replace with real data when available */}
                    <MetadataPill text="RISK: MEDIUM" color="yellow" />
                    <MetadataPill text="CE/PE SPREAD" color="blue" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icons.Calendar />
                      Saved on: {strat.createdAt ? new Date(strat.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </span>
                    <span className="font-semibold">NIFTY 50 • 15m Timeframe</span>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex items-center gap-2 pr-1">
                  {/* Edit - Secondary Action */}
                  <button 
                    onClick={() => onEdit(strat)}
                    className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-yellow-600/10 hover:border-yellow-600/30 border border-transparent transition-all"
                  >
                    <Icons.Edit />
                  </button>
                  {/* Delete - Secondary Action */}
                  <button 
                    onClick={() => onDelete(strat)}
                    className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 border border-transparent transition-all"
                  >
                    <Icons.Delete />
                  </button>
                  {/* Load - Primary Action */}
                  <button 
                    onClick={() => onLoad(strat)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-extrabold rounded-full transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)] active:scale-95 group-active:scale-95 border-none"
                  >
                    <Icons.Load />
                    LOAD PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStrategiesModal;