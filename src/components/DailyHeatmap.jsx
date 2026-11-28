import React, { useMemo, useState } from 'react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CELL = 16;
const GAP = 3;
const MONTH_GAP = 8; // extra space where a new month starts

// [report_fix v5] soft palette
const PROFIT_SHADES = ['#E6F7EC', '#C8EDD6', '#9DDDB6', '#6CC995'];
const LOSS_SHADES = ['#FDECEE', '#FAD2D7', '#F4AEB7', '#E98A96'];
const EMPTY_COLOR = '#F8FAFC';
const FLAT_COLOR = '#E2E8F0';

const pad = (n) => String(n).padStart(2, '0');
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = (s) => {
  const [y, m, d] = String(s).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

const fmtINR = (n, withSign = false) => {
  const v = Math.round(n);
  const sign = v < 0 ? '-' : withSign && v > 0 ? '+' : '';
  return `${sign}₹${Math.abs(v).toLocaleString('en-IN')}`;
};

// Compact money: 1.2L / 45k
const fmtCompact = (n, withSign = false) => {
  const a = Math.abs(n);
  const sign = n < 0 ? '-' : withSign && n > 0 ? '+' : '';
  let t;
  if (a >= 1e7) t = `${(a / 1e7).toFixed(2)}Cr`;
  else if (a >= 1e5) t = `${(a / 1e5).toFixed(2)}L`;
  else if (a >= 1e3) t = `${(a / 1e3).toFixed(1)}k`;
  else t = String(Math.round(a));
  return `${sign}₹${t}`;
};

const fmtDate = (d) =>
  d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

const fmtShort = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });

const shadeFor = (pnl, maxProfit, maxLoss) => {
  if (pnl === 0) return FLAT_COLOR;
  const isProfit = pnl > 0;
  const max = isProfit ? maxProfit : maxLoss;
  const ratio = max > 0 ? Math.abs(pnl) / max : 0;
  const level = ratio > 0.75 ? 3 : ratio > 0.45 ? 2 : ratio > 0.2 ? 1 : 0;
  return (isProfit ? PROFIT_SHADES : LOSS_SHADES)[level];
};

const toneText = (v) => (v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-700');

const Kpi = ({ label, value, sub, tone }) => (
  <div className="px-3.5 py-2">
    <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</div>
    <div className={`mt-0.5 text-[13px] font-semibold leading-tight tabular-nums ${tone || 'text-[#0F1B2D]'}`}>
      {value}
    </div>
    {sub && <div className="mt-0.5 text-[10px] font-medium text-slate-400">{sub}</div>}
  </div>
);

const DailyHeatmap = ({ result, withTax }) => {
  const [tip, setTip] = useState(null);

  const model = useMemo(() => {
    const rows = result?.Heatmap_Data;
    if (!rows || rows.length === 0) return null;

    const byDate = new Map();
    rows.forEach((r) => {
      let v = parseFloat(r.pnl || 0);
      if (withTax && r.net_pnl !== undefined && r.net_pnl !== null) v = parseFloat(r.net_pnl);
      if (Number.isNaN(v)) v = 0;
      byDate.set(String(r.date).slice(0, 10), v);
    });

    const dates = [...byDate.keys()].sort();
    const first = parseKey(dates[0]);
    const last = parseKey(dates[dates.length - 1]);

    // Start from the Monday of the first week
    const start = new Date(first);
    const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));

    const weeks = [];
    const cur = new Date(start);
    while (cur <= last) {
      const week = [];
      for (let i = 0; i < 5; i += 1) {
        const d = new Date(cur);
        d.setDate(cur.getDate() + i);
        const key = toKey(d);
        const has = byDate.has(key);
        week.push({ key, date: d, hasTrade: has, pnl: has ? byDate.get(key) : 0 });
      }
      weeks.push(week);
      cur.setDate(cur.getDate() + 7);
    }

    const values = [...byDate.entries()].map(([date, pnl]) => ({ date, pnl }));
    const profits = values.filter((v) => v.pnl > 0).map((v) => v.pnl);
    const losses = values.filter((v) => v.pnl < 0).map((v) => Math.abs(v.pnl));
    const maxProfit = profits.length ? Math.max(...profits) : 0;
    const maxLoss = losses.length ? Math.max(...losses) : 0;

    const total = values.reduce((s, v) => s + v.pnl, 0);
    const winDays = profits.length;
    const lossDays = losses.length;
    const best = values.reduce((a, b) => (b.pnl > a.pnl ? b : a), values[0]);
    const worst = values.reduce((a, b) => (b.pnl < a.pnl ? b : a), values[0]);

    return {
      weeks, maxProfit, maxLoss, total, winDays, lossDays,
      tradingDays: values.length, best, worst, first, last
    };
  }, [result, withTax]);

  if (!model) return null;

  const { weeks, maxProfit, maxLoss, total, winDays, lossDays, tradingDays, best, worst, first, last } = model;
  const winRate = tradingDays ? (winDays / tradingDays) * 100 : 0;
  const avgDay = tradingDays ? total / tradingDays : 0;

  const showTip = (e, cell) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.top, cell });
  };

  const restShadow = (has) =>
    has ? 'inset 0 0 0 1px rgba(15,27,45,0.07)' : 'inset 0 0 0 1px rgba(15,27,45,0.03)';

  const monthStartsAt = (wi) => wi > 0 && weeks[wi][0].date.getMonth() !== weeks[wi - 1][0].date.getMonth();

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-rose-400" />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[#0F1B2D]">Daily P&amp;L heatmap</h3>
            <p className="mt-0.5 text-[10.5px] text-slate-500">
              {fmtShort(first)} to {fmtShort(last)} · {tradingDays} trading days
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>

        {/* KPI strip */}
        <div className="mb-4 grid grid-cols-2 divide-x divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60 sm:grid-cols-5 sm:divide-y-0">
          <Kpi label="Total" value={fmtINR(total, true)} sub={`${winDays}W · ${lossDays}L days`} tone={toneText(total)} />
          <Kpi label="Win rate" value={`${winRate.toFixed(1)}%`} sub={`${winDays}/${tradingDays} days`} />
          <Kpi label="Avg / day" value={fmtCompact(avgDay, true)} tone={toneText(avgDay)} />
          <Kpi label="Best day" value={fmtCompact(best.pnl, true)} sub={fmtShort(parseKey(best.date))} tone={toneText(best.pnl)} />
          <Kpi label="Worst day" value={fmtCompact(worst.pnl, true)} sub={fmtShort(parseKey(worst.date))} tone={toneText(worst.pnl)} />
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto pb-1" onScroll={() => setTip(null)}>
          <div className="inline-flex min-w-max">
            <div className="mr-1 flex flex-col pr-2" style={{ paddingTop: 20, gap: GAP }}>
              {WEEKDAYS.map((d) => (
                <div key={d} className="flex items-center text-[10px] font-medium text-slate-500" style={{ height: CELL }}>
                  {d}
                </div>
              ))}
            </div>

            <div>
              {/* Month labels */}
              <div className="flex" style={{ gap: GAP, height: 16, marginBottom: 4 }}>
                {weeks.map((week, wi) => {
                  const m = week[0].date.getMonth();
                  const showLabel = wi === 0 || monthStartsAt(wi);
                  return (
                    <div
                      key={wi}
                      className="relative"
                      style={{ width: CELL, marginLeft: monthStartsAt(wi) ? MONTH_GAP : 0 }}
                    >
                      {showLabel && (
                        <span className="absolute left-0 top-0 whitespace-nowrap text-[10px] font-semibold text-slate-600">
                          {MONTHS[m]}
                          {m === 0 ? ` '${String(week[0].date.getFullYear()).slice(2)}` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cells */}
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div
                    key={wi}
                    className="flex flex-col"
                    style={{ gap: GAP, marginLeft: monthStartsAt(wi) ? MONTH_GAP : 0 }}
                  >
                    {week.map((cell) => {
                      const bg = cell.hasTrade ? shadeFor(cell.pnl, maxProfit, maxLoss) : EMPTY_COLOR;
                      return (
                        <div
                          key={cell.key}
                          onMouseEnter={cell.hasTrade ? (e) => showTip(e, cell) : undefined}
                          onMouseLeave={() => setTip(null)}
                          style={{
                            width: CELL,
                            height: CELL,
                            backgroundColor: bg,
                            borderRadius: 4,
                            boxShadow: restShadow(cell.hasTrade),
                            cursor: cell.hasTrade ? 'pointer' : 'default',
                            transition: 'transform 120ms ease, box-shadow 120ms ease'
                          }}
                          onMouseOver={(e) => {
                            if (cell.hasTrade) {
                              e.currentTarget.style.transform = 'scale(1.22)';
                              e.currentTarget.style.boxShadow = '0 0 0 1.5px #0F1B2D';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = restShadow(cell.hasTrade);
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          <span className="text-[10px] text-slate-400">Intensity is relative to your biggest profit and loss day.</span>
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
            <span>Loss</span>
            <div className="flex gap-[3px]">
              {[...LOSS_SHADES].reverse().map((c) => (
                <span key={c} style={{ width: 11, height: 11, backgroundColor: c, borderRadius: 3, display: 'inline-block' }} />
              ))}
              <span style={{ width: 11, height: 11, backgroundColor: EMPTY_COLOR, borderRadius: 3, display: 'inline-block', boxShadow: 'inset 0 0 0 1px rgba(15,27,45,0.08)' }} />
              {PROFIT_SHADES.map((c) => (
                <span key={c} style={{ width: 11, height: 11, backgroundColor: c, borderRadius: 3, display: 'inline-block' }} />
              ))}
            </div>
            <span>Profit</span>
          </div>
        </div>
      </div>

      {/* Floating tooltip (dark glass) */}
      {tip && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: tip.x,
            top: tip.y - 8,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999
          }}
        >
          <div
            data-no-neg="true"
            className="min-w-[130px] rounded-lg px-2.5 py-1.5 shadow-[0_12px_30px_rgba(15,27,45,0.35)]"
            style={{ background: 'rgba(15,27,45,0.94)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-[10px] font-medium text-slate-300">{fmtDate(tip.cell.date)}</div>
            <div
              className="mt-0.5 text-[13px] font-semibold tabular-nums"
              style={{ color: tip.cell.pnl > 0 ? '#34D399' : tip.cell.pnl < 0 ? '#FB7185' : '#CBD5E1' }}
            >
              {fmtINR(tip.cell.pnl, true)}
            </div>
            <div className="mt-0.5 text-[9.5px] font-medium text-slate-400">
              {tip.cell.pnl > 0 ? 'Profit day' : tip.cell.pnl < 0 ? 'Loss day' : 'Flat day'}
              {' · '}{withTax ? 'Net' : 'Gross'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyHeatmap;
