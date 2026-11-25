import React, { useMemo } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (n) => Math.round(Math.abs(n)).toLocaleString('en-IN');
const signedINR = (n) => `${n < 0 ? '−' : '+'}₹${fmt(n)}`;

// Heat-map colour: intensity scales with the size of the P&L
const heat = (val, maxAbs) => {
  if (!val || !maxAbs) return {};
  const t = Math.min(1, Math.abs(val) / maxAbs);
  const a = 0.08 + Math.pow(t, 0.7) * 0.5;
  return val > 0
    ? { backgroundColor: `rgba(16,185,129,${a})`, color: '#065F46' }
    : { backgroundColor: `rgba(244,63,94,${a})`, color: '#9F1239' };
};

const MonthlyAnalytics = ({ result, withTax }) => {
  const { monthlyPnL, years, maxAbs, yearTotals, colTotals, colCounts, entries, grandTotal, maxYearAbs } =
    useMemo(() => {
      const data = {};
      const src = result?.Heatmap_Data || [];

      src.forEach((item) => {
        if (!item.date) return;
        const d = new Date(item.date);
        if (isNaN(d.getTime())) return;
        const year = d.getFullYear().toString();
        const monthStr = MONTHS[d.getMonth()];

        let pnl = parseFloat(item.pnl || 0);
        if (withTax) {
          pnl = item.net_pnl ? parseFloat(item.net_pnl) : pnl * 0.94;
        }
        if (isNaN(pnl)) pnl = 0;

        if (!data[year]) {
          data[year] = {};
          MONTHS.forEach((m) => { data[year][m] = 0; });
        }
        data[year][monthStr] += pnl;
      });

      const ys = Object.keys(data).sort((a, b) => b - a);
      const list = [];
      const yTotals = {};
      const cTotals = {};
      const cCounts = {};
      MONTHS.forEach((m) => { cTotals[m] = 0; cCounts[m] = 0; });
      let max = 0;
      let grand = 0;

      ys.forEach((y) => {
        yTotals[y] = 0;
        MONTHS.forEach((m) => {
          const v = data[y][m] || 0;
          yTotals[y] += v;
          cTotals[m] += v;
          if (v !== 0) {
            cCounts[m] += 1;
            list.push({ year: y, month: m, val: v });
            max = Math.max(max, Math.abs(v));
          }
        });
        grand += yTotals[y];
      });

      const maxY = Math.max(0, ...ys.map((y) => Math.abs(yTotals[y])));

      return {
        monthlyPnL: data, years: ys, maxAbs: max, yearTotals: yTotals,
        colTotals: cTotals, colCounts: cCounts, entries: list, grandTotal: grand, maxYearAbs: maxY,
      };
    }, [result, withTax]);

  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;
  if (years.length === 0) return null;

  // Estimated margin (safe extraction)
  const statsSourceBase = result.Strategy_Stats || result.Metrics || result || {};
  const estimatedMargin = Number(statsSourceBase.estimated_margin || statsSourceBase.Estimated_Margin || 0);

  const base = result.Strategy_Stats || result.Metrics || result || {};
  const modeData = withTax ? (result.NET || base.NET || {}) : (result.GROSS || base.GROSS || {});
  const statsSource = withTax
    ? (modeData.Net_Strategy_Stats || modeData.Strategy_Stats || modeData || base.NET || base.Net_Strategy_Stats || base)
    : (modeData.Gross_Strategy_Stats || modeData.Strategy_Stats || modeData || base.GROSS || base.Gross_Strategy_Stats || base);

  const yearlySource = withTax
    ? (result.NET_Yearly_Stats || modeData.Yearly_Stats || base.Yearly_Stats || result.Yearly_Stats || {})
    : (result.GROSS_Yearly_Stats || modeData.Yearly_Stats || base.Yearly_Stats || result.Yearly_Stats || {});

  const roi = (total) => (estimatedMargin > 0 ? (total / estimatedMargin) * 100 : null);

  // Highlights
  const best = entries.reduce((a, b) => (b.val > (a?.val ?? -Infinity) ? b : a), null);
  const worst = entries.reduce((a, b) => (b.val < (a?.val ?? Infinity) ? b : a), null);
  const winMonths = entries.filter((e) => e.val > 0).length;
  const winPct = entries.length ? (winMonths / entries.length) * 100 : 0;
  const totalRoi = roi(grandTotal);
  const showMarkers = entries.length > 1;

  const kpis = [
    {
      label: withTax ? 'Net P&L' : 'Gross P&L',
      value: signedINR(grandTotal),
      tone: grandTotal >= 0 ? 'text-emerald-600' : 'text-rose-600',
      sub: totalRoi !== null ? `${totalRoi.toFixed(2)}% on margin` : `${years.length} yr${years.length > 1 ? 's' : ''} of data`,
    },
    {
      label: 'Best month',
      value: best ? signedINR(best.val) : '—',
      tone: 'text-emerald-600',
      sub: best ? `${best.month} ${best.year}` : '',
    },
    {
      label: 'Worst month',
      value: worst ? signedINR(worst.val) : '—',
      tone: 'text-rose-600',
      sub: worst ? `${worst.month} ${worst.year}` : '',
    },
    {
      label: 'Profitable months',
      value: `${winMonths}/${entries.length}`,
      tone: 'text-[#0F1B2D]',
      sub: `${winPct.toFixed(0)}% hit rate`,
    },
  ];

  const th = 'px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,27,45,0.04),0_12px_32px_-12px_rgba(15,27,45,0.10)]">
      {/* accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400" />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-500">Performance</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#0F1B2D]">Monthly analytics</h3>
            <p className="mt-0.5 text-xs text-slate-500">Month-by-month P&amp;L heatmap with yearly risk metrics · values in ₹</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'} shadow-[0_0_0_3px_rgba(99,102,241,0.12)]`} />
            {withTax ? 'NET · AFTER TAX' : 'GROSS'}
          </span>
        </div>

        {/* KPI strip */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{k.label}</p>
              <p className={`mt-1 font-mono text-[17px] font-semibold tabular-nums ${k.tone}`}>{k.value}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="custom-scrollbar-horizontal w-full overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full min-w-[1040px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="sticky left-0 z-20 bg-slate-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Year</th>
                {MONTHS.map((m) => <th key={m} className={th}>{m}</th>)}
                <th className={`${th} border-l border-slate-200 text-indigo-500`}>Total</th>
                <th className={`${th} text-amber-600`}>ROI %</th>
                <th className={`${th} border-l border-slate-200`}>Max DD</th>
                <th className={th}>Days MDD</th>
                <th className={th}>R / MDD</th>
              </tr>
            </thead>

            <tbody>
              {years.map((year) => {
                const yearlyTotal = yearTotals[year];
                const yData = yearlySource?.[year] || yearlySource?.[parseInt(year)] || {};
                const r = roi(yearlyTotal);
                const barW = maxYearAbs ? Math.max(6, (Math.abs(yearlyTotal) / maxYearAbs) * 100) : 0;

                const ddRaw = yData?.Max_Drawdown ?? statsSource?.['Max Drawdown'] ?? statsSource?.['Max_Drawdown'];
                const ddOk = ddRaw !== undefined && ddRaw !== null && !isNaN(ddRaw);
                const mddDays = yData?.Days_for_MDD ?? statsSource?.['Duration of Max Drawdown (Periods)'] ?? statsSource?.['Days_for_MDD'];
                const rmRaw = yData?.R_MDD ?? statsSource?.['Return / Max DD'] ?? statsSource?.['Reward_To_MDD'];
                const rmOk = rmRaw !== undefined && rmRaw !== null && !isNaN(rmRaw);
                const rm = Number(rmRaw);

                return (
                  <tr key={year} className="group border-t border-slate-100 transition-colors hover:bg-indigo-50/30">
                    <td className="sticky left-0 z-10 bg-white px-4 py-2.5 transition-colors group-hover:bg-indigo-50/60">
                      <span className="font-mono text-[13px] font-semibold text-[#0F1B2D]">{year}</span>
                    </td>

                    {MONTHS.map((month) => {
                      const val = monthlyPnL[year][month] || 0;
                      const isBest = showMarkers && best && best.year === year && best.month === month;
                      const isWorst = showMarkers && worst && worst.year === year && worst.month === month;
                      const ring = isBest
                        ? 'ring-2 ring-emerald-500/70 ring-offset-1'
                        : isWorst
                        ? 'ring-2 ring-rose-500/70 ring-offset-1'
                        : '';
                      return (
                        <td key={month} className="px-1 py-1.5 text-center">
                          {val !== 0 ? (
                            <div
                              style={heat(val, maxAbs)}
                              className={`mx-auto min-w-[64px] rounded-md px-1.5 py-1.5 font-mono text-[11.5px] font-semibold tabular-nums transition-transform duration-150 hover:scale-[1.06] ${ring}`}
                              title={`${month} ${year}: ${signedINR(val)}`}
                            >
                              {val < 0 ? '−' : ''}{fmt(val)}
                            </div>
                          ) : (
                            <span className="font-mono text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total with relative bar */}
                    <td className="border-l border-slate-100 px-3 py-2 text-center">
                      <div className={`font-mono text-[12px] font-bold tabular-nums ${yearlyTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {signedINR(yearlyTotal)}
                      </div>
                      <div className="mx-auto mt-1 h-[3px] w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${yearlyTotal >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                          style={{ width: `${barW}%` }}
                        />
                      </div>
                    </td>

                    {/* ROI */}
                    <td className="px-3 py-2 text-center">
                      {r !== null ? (
                        <span className="inline-block rounded-md bg-amber-50 px-2 py-1 font-mono text-[11.5px] font-semibold tabular-nums text-amber-700 ring-1 ring-inset ring-amber-200/70">
                          {r.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="border-l border-slate-100 px-3 py-2 text-center font-mono text-[12px] font-medium tabular-nums text-rose-600">
                      {ddOk ? Math.round(Number(ddRaw)).toLocaleString('en-IN') : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-[12px] font-medium tabular-nums text-slate-600">
                      {mddDays ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {rmOk ? (
                        <span
                          className={`inline-block rounded-md px-2 py-1 font-mono text-[11.5px] font-semibold tabular-nums ring-1 ring-inset ${
                            rm >= 0
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/70'
                              : 'bg-rose-50 text-rose-700 ring-rose-200/70'
                          }`}
                        >
                          {rm.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer: month totals across all years */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                <td className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  All years
                </td>
                {MONTHS.map((m) => {
                  const v = colTotals[m];
                  return (
                    <td key={m} className="px-1 py-3 text-center font-mono text-[11.5px] font-semibold tabular-nums">
                      {colCounts[m] ? (
                        <span className={v >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                          {v < 0 ? '−' : ''}{fmt(v)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
                <td className="border-l border-slate-200 px-3 py-3 text-center">
                  <span className={`font-mono text-[12.5px] font-bold tabular-nums ${grandTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {signedINR(grandTotal)}
                  </span>
                </td>
                <td className="px-3 py-3 text-center font-mono text-[11.5px] font-semibold tabular-nums text-amber-700">
                  {totalRoi !== null ? `${totalRoi.toFixed(2)}%` : '—'}
                </td>
                <td colSpan={3} className="border-l border-slate-200 px-3 py-3 text-center text-[10px] uppercase tracking-wider text-slate-400">
                  Σ all years
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Loss</span>
            <div
              className="h-2 w-40 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(244,63,94,0.58), rgba(244,63,94,0.12), #F1F5F9, rgba(16,185,129,0.12), rgba(16,185,129,0.58))',
              }}
            />
            <span>Profit</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm ring-2 ring-emerald-500/70 ring-offset-1" /> Best month
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm ring-2 ring-rose-500/70 ring-offset-1" /> Worst month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
