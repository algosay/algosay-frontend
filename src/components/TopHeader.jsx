import React from 'react';

const TopHeader = ({ dataSource, setDataSource, fromDate, setFromDate, toDate, setToDate, handleConfigChange }) => {
  const seg = (active) =>
    `flex h-6 items-center gap-1.5 rounded px-2.5 text-[11px] font-semibold transition-all ${
      active ? 'bg-white text-[#121A2B] shadow-[0_1px_2px_rgba(18,26,43,0.14)]' : 'text-[#7C879A] hover:text-[#121A2B]'
    }`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDE2E9] bg-white px-3.5 py-2.5">
      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#121A2B]">Strategy builder</h2>
        <p className="text-[11px] text-[#7C879A]">Pick the data and dates, set risk limits, then define each leg.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* ⚡ Data Source Toggle Switch (S3 vs Fyers) */}
        <div className="flex items-center gap-0.5 rounded-md border border-[#E9EDF2] bg-[#F2F4F7] p-0.5">
          <button onClick={() => handleConfigChange(setDataSource, 's3')} className={seg(dataSource === 's3')}>
            <span className={`h-1.5 w-1.5 rounded-full ${dataSource === 's3' ? 'bg-[#2F5BEA]' : 'bg-[#C3CAD6]'}`} />
            Historical · S3
          </button>
          <button onClick={() => handleConfigChange(setDataSource, 'fyers')} className={seg(dataSource === 'fyers')}>
            <span className={`h-1.5 w-1.5 rounded-full ${dataSource === 'fyers' ? 'bg-[#F08A24]' : 'bg-[#C3CAD6]'}`} />
            Fyers · Live 30D
          </button>
        </div>

        {/* Date range as one joined control */}
        <div className="flex h-8 items-center rounded-md border border-[#DDE2E9] bg-white px-1 transition-colors focus-within:border-[#2F5BEA] focus-within:ring-2 focus-within:ring-[#2F5BEA]/15">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleConfigChange(setFromDate, e.target.value)}
            className="h-full bg-transparent px-1.5 font-num text-[11.5px] text-[#121A2B] outline-none"
            aria-label="From date"
          />
          <span className="px-1 text-[10.5px] text-[#9AA4B5]">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleConfigChange(setToDate, e.target.value)}
            className="h-full bg-transparent px-1.5 font-num text-[11.5px] text-[#121A2B] outline-none"
            aria-label="To date"
          />
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
