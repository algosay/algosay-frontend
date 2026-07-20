import React from 'react';

const MyStrategiesModal = ({ isOpen, onClose, isLoading, strategies, onLoad }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📂 My Saved Strategies
        </h2>
        
        {isLoading ? (
          <div className="text-center p-6 text-gray-400">Loading your strategies...</div>
        ) : strategies.length === 0 ? (
          <div className="text-center p-6 text-gray-500 bg-[#121212] rounded-xl border border-[#2d2d2d]">
            You haven't saved any strategies yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {strategies.map(strat => (
              <div key={strat.id} className="bg-[#1e1e1e] p-4 rounded-xl flex justify-between items-center border border-[#2d2d2d] hover:border-blue-500/50 transition-colors group">
                <div>
                  <h3 className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{strat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Saved on: {strat.createdAt ? new Date(strat.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
                <button 
                  onClick={() => onLoad(strat)} 
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold rounded-lg transition-all border border-blue-600/30"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStrategiesModal;