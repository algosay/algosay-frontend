import React, { useMemo } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (n) => Math.round(Math.abs(n)).toLocaleString('en-IN');
const signedINR = (n) => `${n < 0 ? '−' : '+'}₹${fmt(n)}`;

const STYLES = `
  .rd-root table.ma-table td,
  .rd-root table.ma-table td * { font-size: 10.5px !important; line-height: 1.3 !important; }
  .rd-root table.ma-table td { padding: 5px 3px !important; }
  .rd-root table.ma-table th,
  .rd-root table.ma-table th * { font-size: 9.5px !important; line-height: 1.2 !important; letter-spacing: .07em; }
  .rd-root table.ma-table th { padding: 6px 4px !important; }
  .rd-root table.ma-table td .ma-year { font-size: 11.5px !important; }
  .rd-root table.ma-table td .ma-tot { font-size: 11px !important; }
  .rd-root table.ma-table tfoot td, .rd-root table.ma-table tfoot td * { font-size: 10.5px !important; }
`;

const toneText = (v) => (v >= 0 ? 'text-emerald-600' : 'text-rose-600');

const MonthlyAnalytics = ({ result, withTax }) => {
  const { monthlyPnL, years, yearTotals, colTotals, colCounts, entries, grandTotal } =
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
          }
        });
        grand += yTotals[y];
      });

      return {
        monthlyPnL: data, years: ys, yearTotals: yTotals,
        colTotals: cTotals, colCounts: cCounts, entries: list, grandTotal: grand,
      };
    }, [result, withTax]);

  if (!result || !result.Heatmap_Data || result.Heatmap_Data.length === 0) return null;
  if (years.length === 0) return null;

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

  const best = entries.reduce((a, b) => (b.val > (a?.val ?? -Infinity) ? b : a), null);
  const worst = entries.reduce((a, b) => (b.val < (a?.val ?? Infinity) ? b : a), null);
  const winMonths = entries.filter((e) => e.val > 0).length;
  const winPct = entries.length ? (winMonths / entries.length) * 100 : 0;
  const totalRoi = roi(grandTotal);

  const kpis = [
    {
      label: withTax ? 'Net P&L' : 'Gross P&L',
      value: signedINR(grandTotal),
      tone: toneText(grandTotal),
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

  const th = 'text-center font-semibold uppercase text-slate-400';

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      <style>{STYLES}</style>
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400" />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[#0F1B2D]">Monthly analytics</h3>
            <p className="mt-0.5 text-[10.5px] text-slate-500">Month-by-month P&amp;L with yearly risk metrics · values in ₹</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
            {withTax ? 'NET · AFTER TAX' : 'GROSS'}
          </span>
        </div>

        {/* KPI strip */}
        <div className="mb-3.5 grid grid-cols-2 divide-x divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60 lg:grid-cols-4 lg:divide-y-0">
          {kpis.map((k) => (
            <div key={k.label} className="px-3.5 py-2">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">{k.label}</p>
              <p className={`mt-0.5 text-[13px] font-semibold leading-tight tabular-nums ${k.tone}`}>{k.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="custom-scrollbar-horizontal w-full overflow-x-auto rounded-lg border border-slate-200">
          <table className="ma-table w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 z-20 bg-slate-50 px-3 text-left font-semibold uppercase text-slate-400">Year</th>
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

                const ddRaw = yData?.Max_Drawdown ?? statsSource?.['Max Drawdown'] ?? statsSource?.['Max_Drawdown'];
                const ddOk = ddRaw !== undefined && ddRaw !== null && !isNaN(ddRaw);
                const mddDays = yData?.Days_for_MDD ?? statsSource?.['Duration of Max Drawdown (Periods)'] ?? statsSource?.['Days_for_MDD'];
                const rmRaw = yData?.R_MDD ?? statsSource?.['Return / Max DD'] ?? statsSource?.['Reward_To_MDD'];
                const rmOk = rmRaw !== undefined && rmRaw !== null && !isNaN(rmRaw);
                const rm = Number(rmRaw);

                return (
                  <tr key={year} className="group border-t border-slate-100 transition-colors hover:bg-indigo-50/30">
                    <td className="sticky left-0 z-10 bg-white px-3 transition-colors group-hover:bg-indigo-50/60">
                      <span className="ma-year font-semibold text-[#0F1B2D]">{year}</span>
                    </td>

                    {MONTHS.map((month) => {
                      const val = monthlyPnL[year][month] || 0;
                      return (
                        <td
                          key={month}
                          className={`text-center font-semibold tabular-nums ${val !== 0 ? toneText(val) : ''}`}
                          title={`${month} ${year}: ${signedINR(val)}`}
                        >
                          {val !== 0 ? `${val < 0 ? '−' : ''}${fmt(val)}` : <span className="text-slate-300">—</span>}
                        </td>
                      );
                    })}

                    <td className="border-l border-slate-100 text-center">
                      <div className={`ma-tot font-semibold tabular-nums ${toneText(yearlyTotal)}`}>
                        {signedINR(yearlyTotal)}
                      </div>
                    </td>

                    <td className="text-center">
                      {r !== null ? (
                        <span className="font-semibold tabular-nums text-amber-700">{r.toFixed(2)}%</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="border-l border-slate-100 text-center font-medium tabular-nums text-rose-600">
                      {ddOk ? Math.round(Number(ddRaw)).toLocaleString('en-IN') : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="text-center font-medium tabular-nums text-slate-600">
                      {mddDays ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="text-center">
                      {rmOk ? (
                        <span className={`font-semibold tabular-nums ${rm >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
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

            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="sticky left-0 z-10 bg-slate-50 px-3 text-left font-semibold uppercase text-slate-500">
                  All years
                </td>
                {MONTHS.map((m) => {
                  const v = colTotals[m];
                  return (
                    <td key={m} className="text-center font-semibold tabular-nums">
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
                <td className="border-l border-slate-200 text-center">
                  <span className={`font-semibold tabular-nums ${toneText(grandTotal)}`}>
                    {signedINR(grandTotal)}
                  </span>
                </td>
                <td className="text-center font-semibold tabular-nums text-amber-700">
                  {totalRoi !== null ? `${totalRoi.toFixed(2)}%` : '—'}
                </td>
                <td colSpan={3} className="border-l border-slate-200 text-center uppercase text-slate-400">
                  Σ all years
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MonthlyAnalytics;
