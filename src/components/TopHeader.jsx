import React from 'react';

const TopHeader = ({ dataSource, setDataSource, fromDate, setFromDate, toDate, setToDate, handleConfigChange }) => {
  const seg = (active) =>
    `flex h-6 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition-all ${
      active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-[0_8px_24px_-14px_rgba(79,70,229,0.45)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/70 via-white to-white px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_6px_14px_-6px_rgba(79,70,229,0.7)]">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-5 4 4 8-9" />
              <path d="M14 7h6v6" />
            </svg>
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">Strategy builder</h2>
            <p className="text-[11px] text-slate-500">Pick the data and dates, set risk limits, then define each leg.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ⚡ Data Source Toggle Switch (S3 vs Fyers) */}
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button onClick={() => handleConfigChange(setDataSource, 's3')} className={seg(dataSource === 's3')}>
              <span className={`h-1.5 w-1.5 rounded-full ${dataSource === 's3' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
              Historical · S3
            </button>
            <button onClick={() => handleConfigChange(setDataSource, 'fyers')} className={seg(dataSource === 'fyers')}>
              <span className={`h-1.5 w-1.5 rounded-full ${dataSource === 'fyers' ? 'bg-orange-500' : 'bg-slate-300'}`} />
              Fyers · Live 30D
            </button>
          </div>

          {/* Date range as one joined control */}
          <div className="flex h-8 items-center rounded-lg border border-slate-200 bg-white px-1 transition-colors hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleConfigChange(setFromDate, e.target.value)}
              className="h-full bg-transparent px-1.5 font-num text-[11.5px] text-slate-900 outline-none"
              aria-label="From date"
            />
            <span className="rounded bg-indigo-50 px-1.5 py-px text-[10px] font-semibold text-indigo-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleConfigChange(setToDate, e.target.value)}
              className="h-full bg-transparent px-1.5 font-num text-[11.5px] text-slate-900 outline-none"
              aria-label="To date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
