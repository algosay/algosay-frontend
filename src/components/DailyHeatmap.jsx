import React, { useMemo, useState } from 'react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CELL = 24;
const GAP = 5;

const PROFIT_SHADES = ['#A7F3D0', '#34D399', '#10B981', '#047857'];
const LOSS_SHADES = ['#FECACA', '#F87171', '#EF4444', '#B91C1C'];
const EMPTY_COLOR = '#EEF1F5';
const FLAT_COLOR = '#CBD5E1';

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

const fmtDate = (d) =>
  d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

const shadeFor = (pnl, maxProfit, maxLoss) => {
  if (pnl === 0) return FLAT_COLOR;
  const isProfit = pnl > 0;
  const max = isProfit ? maxProfit : maxLoss;
  const ratio = max > 0 ? Math.abs(pnl) / max : 0;
  const level = ratio > 0.75 ? 3 : ratio > 0.45 ? 2 : ratio > 0.2 ? 1 : 0;
  return (isProfit ? PROFIT_SHADES : LOSS_SHADES)[level];
};

const StatCard = ({ label, value, sub, tone }) => {
  const color = tone === 'profit' ? '#047857' : tone === 'loss' ? '#DC2626' : '#0F1B2D';
  return (
    <div className="flex-1 min-w-[140px] rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold leading-tight" style={{ color }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs font-medium text-slate-500">{sub}</div>}
    </div>
  );
};

const DailyHeatmap = ({ result, withTax }) => {
  const [tip, setTip] = useState(null);

  const model = useMemo(() => {
    const rows = result?.Heatmap_Data;
    if (!rows || rows.length === 0) return null;

    // date -> pnl (gross / net based on toggle)
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

  const showTip = (e, cell) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.top, cell });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#0F1B2D]">Daily profit/loss heatmap</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {first.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to{' '}
            {last.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            {' · '}{tradingDays} trading days
          </p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {withTax ? 'Net of brokerage & tax' : 'Gross P&L'}
        </span>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard
          label="Total P&L"
          value={fmtINR(total, true)}
          sub={`${winDays} win · ${lossDays} loss days`}
          tone={total > 0 ? 'profit' : total < 0 ? 'loss' : undefined}
        />
        <StatCard label="Win rate" value={`${winRate.toFixed(1)}%`} sub={`${winDays} of ${tradingDays} days`} />
        <StatCard
          label="Best day"
          value={fmtINR(best.pnl, true)}
          sub={parseKey(best.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          tone={best.pnl > 0 ? 'profit' : best.pnl < 0 ? 'loss' : undefined}
        />
        <StatCard
          label="Worst day"
          value={fmtINR(worst.pnl, true)}
          sub={parseKey(worst.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          tone={worst.pnl > 0 ? 'profit' : worst.pnl < 0 ? 'loss' : undefined}
        />
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2" onScroll={() => setTip(null)}>
        <div className="inline-flex min-w-max">
          {/* Weekday labels */}
          <div className="flex flex-col pr-3 mr-1 border-r border-slate-200" style={{ paddingTop: 26, gap: GAP }}>
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="flex items-center text-xs font-semibold text-slate-600"
                style={{ height: CELL }}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="pl-3">
            {/* Month labels */}
            <div className="flex" style={{ gap: GAP, height: 22, marginBottom: 4 }}>
              {weeks.map((week, wi) => {
                const m = week[0].date.getMonth();
                const prevM = wi > 0 ? weeks[wi - 1][0].date.getMonth() : -1;
                const showLabel = wi === 0 || m !== prevM;
                return (
                  <div key={wi} className="relative" style={{ width: CELL }}>
                    {showLabel && (
                      <span className="absolute left-0 top-0 whitespace-nowrap text-xs font-semibold text-slate-600">
                        {MONTHS[m]}
                        {m === 0 ? ` ${week[0].date.getFullYear()}` : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cells */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
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
                          borderRadius: 6,
                          boxShadow: cell.hasTrade
                            ? 'inset 0 0 0 1px rgba(15,27,45,0.06)'
                            : 'inset 0 0 0 1px rgba(15,27,45,0.03)',
                          cursor: cell.hasTrade ? 'pointer' : 'default',
                          transition: 'transform 120ms ease, box-shadow 120ms ease'
                        }}
                        onMouseOver={(e) => {
                          if (cell.hasTrade) {
                            e.currentTarget.style.transform = 'scale(1.18)';
                            e.currentTarget.style.boxShadow = '0 0 0 2px #0F1B2D';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = cell.hasTrade
                            ? 'inset 0 0 0 1px rgba(15,27,45,0.06)'
                            : 'inset 0 0 0 1px rgba(15,27,45,0.03)';
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
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-500">Colour intensity is relative to your biggest profit and loss day.</span>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Loss</span>
          <div className="flex gap-1">
            {[...LOSS_SHADES].reverse().map((c) => (
              <span key={c} style={{ width: 16, height: 16, backgroundColor: c, borderRadius: 4, display: 'inline-block' }} />
            ))}
            <span style={{ width: 16, height: 16, backgroundColor: EMPTY_COLOR, borderRadius: 4, display: 'inline-block', boxShadow: 'inset 0 0 0 1px rgba(15,27,45,0.08)' }} />
            {PROFIT_SHADES.map((c) => (
              <span key={c} style={{ width: 16, height: 16, backgroundColor: c, borderRadius: 4, display: 'inline-block' }} />
            ))}
          </div>
          <span>Profit</span>
        </div>
      </div>

      {/* Floating tooltip (fixed, never clipped by scroll area) */}
      {tip && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: tip.x,
            top: tip.y - 10,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999
          }}
        >
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(15,27,45,0.18)] min-w-[170px]">
            <div className="text-xs font-medium text-slate-500">{fmtDate(tip.cell.date)}</div>
            <div
              className="mt-1 text-base font-bold"
              style={{ color: tip.cell.pnl > 0 ? '#047857' : tip.cell.pnl < 0 ? '#DC2626' : '#475569' }}
            >
              {fmtINR(tip.cell.pnl, true)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
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