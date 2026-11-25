import React, { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

const fmt = (n) => Math.round(Math.abs(n)).toLocaleString('en-IN');
const signedINR = (n) => `${n < 0 ? '−' : '+'}₹${fmt(n)}`;

const heat = (val, maxAbs) => {
  if (!val || !maxAbs) return {};
  const t = Math.min(1, Math.abs(val) / maxAbs);
  const a = 0.08 + Math.pow(t, 0.7) * 0.5;
  return val > 0
    ? { backgroundColor: `rgba(16,185,129,${a})`, color: '#065F46' }
    : { backgroundColor: `rgba(244,63,94,${a})`, color: '#9F1239' };
};

// mode: "GROSS" or "NET"
const DayWiseBreakup = ({ ledger, mode = 'NET' }) => {
  const data = useMemo(() => {
    if (!ledger || !Array.isArray(ledger) || ledger.length === 0) return null;

    const summary = {};
    const totals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Total: 0 };

    ledger.forEach((trade) => {
      const keys = Object.keys(trade);

      const dayKey = keys.find((k) => k.toLowerCase().trim() === 'day');
      const entryTimeKey = keys.find((k) => k.toLowerCase().includes('entry time') || k.toLowerCase().includes('entry_time'));
      const exitTimeKey = keys.find((k) => k.toLowerCase().includes('exit time') || k.toLowerCase().includes('exit_time'));

      let pnlKey;
      if (mode === 'GROSS') {
        pnlKey = keys.find((k) => k.toLowerCase().includes('gross'));
      } else {
        pnlKey = keys.find((k) => k.toLowerCase().includes('net real')) || keys.find((k) => k.toLowerCase().includes('net'));
      }

      if (!pnlKey) {
        pnlKey = keys.find((k) => k.toLowerCase().includes('pnl')) || keys.find((k) => k.toLowerCase().includes('profit'));
      }

      const dateStr = String(trade[exitTimeKey] || trade[entryTimeKey] || '');
      let year = new Date().getFullYear();

      if (dateStr) {
        const yearMatch = dateStr.match(/\b(20\d{2})\b/);
        if (yearMatch) {
          year = yearMatch[1];
        } else {
          const d = new Date(dateStr.replace(' ', 'T'));
          if (!isNaN(d)) year = d.getFullYear();
        }
      }

      let dayName = null;
      const rawDay = trade[dayKey] || '';

      if (rawDay) {
        const shortDay = String(rawDay).trim().substring(0, 3);
        const formattedDay = shortDay.charAt(0).toUpperCase() + shortDay.substring(1).toLowerCase();
        if (DAYS.includes(formattedDay)) dayName = formattedDay;
      }

      if (!dayName && dateStr) {
        const d = new Date(dateStr.replace(' ', 'T'));
        if (!isNaN(d)) {
          const daysMap = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };
          dayName = daysMap[d.getDay()];
        }
      }

      if (!dayName) return;

      const rawPnl = pnlKey ? trade[pnlKey] : 0;
      const pnl = parseFloat(String(rawPnl).replace(/[^\d.-]/g, '')) || 0;

      if (!summary[year]) {
        summary[year] = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Total: 0, Trades: 0 };
      }
      summary[year][dayName] += pnl;
      summary[year].Total += pnl;
      summary[year].Trades += 1;

      totals[dayName] += pnl;
      totals.Total += pnl;
    });

    return { summary, totals };
  }, [ledger, mode]);

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
        <p className="text-xs font-medium text-slate-600">No trading data available</p>
        <p className="mt-1 text-[11px] text-slate-400">Day wise breakup will appear once trades are loaded.</p>
      </div>
    );
  }

  const years = Object.keys(data.summary).sort((a, b) => b - a);
  const dayTotals = DAYS.map((d) => ({ day: d, val: data.totals[d] }));
  const maxDayAbs = Math.max(0, ...dayTotals.map((d) => Math.abs(d.val)));
  const maxCellAbs = Math.max(0, ...years.flatMap((y) => DAYS.map((d) => Math.abs(data.summary[y][d]))));
  const hasSpread = dayTotals.some((d) => d.val !== 0);
  const bestDay = hasSpread ? dayTotals.reduce((a, b) => (b.val > a.val ? b : a)) : null;
  const worstDay = hasSpread ? dayTotals.reduce((a, b) => (b.val < a.val ? b : a)) : null;
  const grand = data.totals.Total;

  const th = 'px-2.5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400';

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-violet-500 to-indigo-500" />

      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#0F1B2D]">Day wise breakup</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">Which weekdays make and lose your money · values in ₹</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total</p>
              <p className={`text-[15px] font-semibold tabular-nums ${grand >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {signedINR(grand)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-600">
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'GROSS' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
              {mode === 'GROSS' ? 'GROSS' : 'NET'}
            </span>
          </div>
        </div>

        {/* Weekday cards */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {dayTotals.map(({ day, val }) => {
            const isBest = bestDay && bestDay.day === day && val > 0;
            const isWorst = worstDay && worstDay.day === day && val < 0;
            const w = maxDayAbs ? Math.max(val !== 0 ? 6 : 0, (Math.abs(val) / maxDayAbs) * 100) : 0;
            return (
              <div
                key={day}
                className={`rounded-lg border px-3 py-2.5 ${
                  isBest
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : isWorst
                    ? 'border-rose-200 bg-rose-50/50'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{DAY_FULL[day]}</p>
                  {isBest && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-700">BEST</span>
                  )}
                  {isWorst && (
                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-rose-700">WEAK</span>
                  )}
                </div>
                <p className={`mt-1 text-[14px] font-semibold tabular-nums ${val > 0 ? 'text-emerald-600' : val < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                  {val === 0 ? '0' : signedINR(val)}
                </p>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className={`h-full rounded-full ${val >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                    style={{ width: `${w}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] border-collapse text-center">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Year</th>
                {DAYS.map((d) => <th key={d} className={th}>{d}</th>)}
                <th className={`${th} border-l border-slate-200 text-indigo-500`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => {
                const row = data.summary[year];
                return (
                  <tr key={year} className="border-t border-slate-100 transition-colors hover:bg-indigo-50/30">
                    <td className="px-3 py-2 text-left">
                      <span className="text-[12px] font-semibold text-[#0F1B2D]">{year}</span>
                      <span className="ml-2 text-[10px] text-slate-400">{row.Trades} trades</span>
                    </td>
                    {DAYS.map((d) => (
                      <td key={d} className="px-1 py-1.5">
                        {row[d] !== 0 ? (
                          <div
                            style={heat(row[d], maxCellAbs)}
                            className="mx-auto min-w-[64px] rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums"
                            title={`${DAY_FULL[d]} ${year}: ${signedINR(row[d])}`}
                          >
                            {row[d] < 0 ? '−' : ''}{fmt(row[d])}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    ))}
                    <td className="border-l border-slate-100 bg-slate-50/50 px-3 py-2">
                      <span className={`text-[11.5px] font-semibold tabular-nums ${row.Total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {signedINR(row.Total)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">All years</td>
                {DAYS.map((d) => (
                  <td key={d} className="px-2 py-2.5 text-[11.5px] font-semibold tabular-nums">
                    <span className={data.totals[d] > 0 ? 'text-emerald-700' : data.totals[d] < 0 ? 'text-rose-700' : 'text-slate-400'}>
                      {data.totals[d] < 0 ? '−' : ''}{fmt(data.totals[d])}
                    </span>
                  </td>
                ))}
                <td className="border-l border-slate-200 bg-indigo-50/60 px-3 py-2.5">
                  <span className={`text-[12px] font-semibold tabular-nums ${grand >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {signedINR(grand)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span>Loss</span>
          <div
            className="h-1.5 w-36 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(244,63,94,0.58), rgba(244,63,94,0.12), #F1F5F9, rgba(16,185,129,0.12), rgba(16,185,129,0.58))',
            }}
          />
          <span>Profit</span>
        </div>
      </div>
    </div>
  );
};

export default DayWiseBreakup;