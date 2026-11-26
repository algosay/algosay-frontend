import React, { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

const fmt = (n) => Math.round(Math.abs(n)).toLocaleString('en-IN');
const signedINR = (n) => `${n < 0 ? '−' : '+'}₹${fmt(n)}`;

const compact = (n) => {
  const a = Math.abs(n);
  const sign = n < 0 ? '−' : n > 0 ? '+' : '';
  let t;
  if (a >= 1e7) t = `${(a / 1e7).toFixed(2)}Cr`;
  else if (a >= 1e5) t = `${(a / 1e5).toFixed(2)}L`;
  else if (a >= 1e3) t = `${(a / 1e3).toFixed(1)}k`;
  else t = String(Math.round(a));
  return `${sign}₹${t}`;
};

const heat = (val, maxAbs) => {
  if (!val || !maxAbs) return {};
  const t = Math.min(1, Math.abs(val) / maxAbs);
  const a = 0.1 + Math.pow(t, 0.7) * 0.55;
  return val > 0
    ? { backgroundColor: `rgba(16,185,129,${a})`, color: t > 0.7 ? '#064E3B' : '#065F46' }
    : { backgroundColor: `rgba(244,63,94,${a})`, color: t > 0.7 ? '#881337' : '#9F1239' };
};

const STYLES = `
  .rd-root table.dw-table td,
  .rd-root table.dw-table td * { font-size: 11px !important; line-height: 1.3 !important; }
  .rd-root table.dw-table td { padding: 4px 6px !important; }
  .rd-root table.dw-table th,
  .rd-root table.dw-table th * { font-size: 9.5px !important; line-height: 1.2 !important; letter-spacing: .08em; }
  .rd-root table.dw-table th { padding: 6px 8px !important; }
  .rd-root table.dw-table td .dw-sub { font-size: 9.5px !important; }
  .rd-root table.dw-table tfoot td, .rd-root table.dw-table tfoot td * { font-size: 11.5px !important; }
`;

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
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-6 text-center">
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

  const th = 'text-center font-semibold uppercase text-slate-400';

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      <style>{STYLES}</style>
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-violet-500 to-indigo-500" />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[#0F1B2D]">Day wise breakup</h3>
            <p className="mt-0.5 text-[10.5px] text-slate-500">Which weekdays make and lose your money</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-right leading-tight">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">Total</p>
              <p className={`text-[13px] font-semibold tabular-nums ${grand >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {signedINR(grand)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] font-semibold tracking-wider text-slate-600">
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'GROSS' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
              {mode === 'GROSS' ? 'GROSS' : 'NET'}
            </span>
          </div>
        </div>

        {/* Diverging weekday bars */}
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
          <div className="space-y-1.5">
            {dayTotals.map(({ day, val }) => {
              const isBest = bestDay && bestDay.day === day && val > 0;
              const isWorst = worstDay && worstDay.day === day && val < 0;
              const pct = maxDayAbs ? Math.max(val !== 0 ? 2 : 0, (Math.abs(val) / maxDayAbs) * 100) : 0;
              const barStyle =
                val >= 0
                  ? { left: '50%', width: `${pct / 2}%`, background: 'linear-gradient(90deg,#34D399,#059669)' }
                  : { right: '50%', width: `${pct / 2}%`, background: 'linear-gradient(270deg,#FB7185,#E11D48)' };
              return (
                <div key={day} className="flex items-center gap-2.5">
                  <div className="flex w-[62px] shrink-0 items-center gap-1">
                    <span className="text-[10.5px] font-semibold text-slate-600">{day}</span>
                    {isBest && <span className="rounded bg-emerald-100 px-1 text-[8.5px] font-bold text-emerald-700">BEST</span>}
                    {isWorst && <span className="rounded bg-rose-100 px-1 text-[8.5px] font-bold text-rose-700">WEAK</span>}
                  </div>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-200/70" title={DAY_FULL[day]}>
                    <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400/60" />
                    <div className="absolute inset-y-0 rounded-full" style={barStyle} />
                  </div>
                  <span
                    className={`w-[78px] shrink-0 text-right text-[11.5px] font-semibold tabular-nums ${
                      val > 0 ? 'text-emerald-600' : val < 0 ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {val === 0 ? '0' : compact(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="dw-table w-full min-w-[560px] border-collapse text-center">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold uppercase text-slate-400">Year</th>
                {DAYS.map((d) => <th key={d} className={th}>{d}</th>)}
                <th className={`${th} border-l border-slate-200 text-indigo-500`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => {
                const row = data.summary[year];
                return (
                  <tr key={year} className="border-t border-slate-100 transition-colors hover:bg-indigo-50/30">
                    <td className="px-3 text-left">
                      <span className="font-semibold text-[#0F1B2D]">{year}</span>
                      <span className="dw-sub ml-1.5 text-slate-400">{row.Trades} trades</span>
                    </td>
                    {DAYS.map((d) => (
                      <td key={d}>
                        {row[d] !== 0 ? (
                          <div
                            style={heat(row[d], maxCellAbs)}
                            className="mx-auto min-w-[58px] rounded px-1.5 py-0.5 font-semibold tabular-nums"
                            title={`${DAY_FULL[d]} ${year}: ${signedINR(row[d])}`}
                          >
                            {row[d] < 0 ? '−' : ''}{fmt(row[d])}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    ))}
                    <td className="border-l border-slate-100 bg-slate-50/50">
                      <span className={`font-semibold tabular-nums ${row.Total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {signedINR(row.Total)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-3 text-left font-semibold uppercase text-slate-500">All years</td>
                {DAYS.map((d) => (
                  <td key={d} className="font-semibold tabular-nums">
                    <span className={data.totals[d] > 0 ? 'text-emerald-700' : data.totals[d] < 0 ? 'text-rose-700' : 'text-slate-400'}>
                      {data.totals[d] < 0 ? '−' : ''}{fmt(data.totals[d])}
                    </span>
                  </td>
                ))}
                <td className="border-l border-slate-200 bg-indigo-50/60">
                  <span className={`font-semibold tabular-nums ${grand >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {signedINR(grand)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-500">
          <span>Loss</span>
          <div
            className="h-1.5 w-32 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(244,63,94,0.65), rgba(244,63,94,0.14), #F1F5F9, rgba(16,185,129,0.14), rgba(16,185,129,0.65))',
            }}
          />
          <span>Profit</span>
          <span className="ml-auto text-slate-400">values in ₹</span>
        </div>
      </div>
    </div>
  );
};

export default DayWiseBreakup;
