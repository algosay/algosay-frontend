import React from 'react';

const TopHeader = ({ dataSource, setDataSource, fromDate, setFromDate, toDate, setToDate, handleConfigChange }) => {
  return (
    <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#2d2d2d] mb-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
          ⚙️ Strategy Configurations Panel
        </h2>
        <p className="text-xs text-gray-400">Manage global intervals, trade rules, and leg parameters dynamically.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* ⚡ Data Source Toggle Switch (S3 vs Fyers) */}
        <div className="flex items-center bg-[#121212] p-1 rounded-lg border border-[#333] shadow-inner">
          <button
            onClick={() => handleConfigChange(setDataSource, 's3')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              dataSource === 's3' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ☁️ Historical (S3)
          </button>
          <button
            onClick={() => handleConfigChange(setDataSource, 'fyers')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              dataSource === 'fyers' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            🔥 Fyers (Live 30D)
          </button>
        </div>

        <div className="flex gap-3 bg-[#121212] p-2.5 rounded-lg border border-[#333]">
          <div>
            <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-wide mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => handleConfigChange(setFromDate, e.target.value)} className="bg-[#1e1e1e] border border-[#333] text-xs rounded p-1.5 text-gray-200 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-wide mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => handleConfigChange(setToDate, e.target.value)} className="bg-[#1e1e1e] border border-[#333] text-xs rounded p-1.5 text-gray-200 outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;