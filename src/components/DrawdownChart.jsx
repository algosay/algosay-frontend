import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSeries,
  fmtINR,
  niceScale,
  makeGeo,
  setupCanvas,
  drawGrid,
  drawXLabels,
  useContainerWidth,
  useFontsReady
} from './ChartUtils';
import { ddRecovery, fmtDays } from './ddRecovery'; // [algosay pro v2]

const HEIGHT = 300;
const PAD = { top: 22, right: 26, bottom: 40, left: 68 };
const MIN_STEP = 34;
const LINE = '#E11D48';

const Stat = ({ label, value, sub, valueClass = 'text-slate-800' }) => (  // [ui_v8]
  <div className="min-w-[92px] px-3.5 py-1.5">
    <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</div>
    <div className={`mt-0.5 text-[13px] font-semibold leading-tight tabular-nums ${valueClass}`}>{value}</div>
    {sub && <div className="mt-0.5 text-[9.5px] text-slate-500 tabular-nums">{sub}</div>}
  </div>
);

const DrawdownChart = ({ result, withTax }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [hover, setHover] = useState(null);

  const { points, hasData, basis } = useMemo(() => {
    const series = buildSeries(result, withTax);
    let peak = 0;
    const dd = series.points.map((p) => {
      if (p.value > peak) peak = p.value;
      return { ...p, value: p.value - peak }; // always 0 or negative
    });
    return { points: dd, hasData: series.hasData, basis: series.basis };
  }, [result, withTax]);

  const n = points.length;
  const containerW = useContainerWidth(wrapRef, hasData);
  const fontsReady = useFontsReady();
  const chartW = Math.max(containerW, n * (basis === 'mtm' ? 0 : MIN_STEP) + PAD.left + PAD.right); // [ui_core patch v1]

  const stats = useMemo(() => {
    const vals = points.map((p) => p.value);
    const min = Math.min(...vals);
    const minIdx = vals.indexOf(min);
    const underwater = vals.slice(1).filter((v) => v < 0).length;
    return {
      max: min,
      maxIdx: minIdx,
      current: vals[vals.length - 1],
      underwaterPct: n > 1 ? (underwater / (n - 1)) * 100 : 0
    };
  }, [points, n]);

  const scale = useMemo(() => niceScale(stats.max === 0 ? -1000 : stats.max, 0, 6), [stats.max]);
  const rec = useMemo(() => ddRecovery(points), [points]);
  const geo = useMemo(() => makeGeo(chartW, HEIGHT, PAD, n, scale.lo, scale.hi), [chartW, n, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || n < 2 || !chartW) return;

    const ctx = setupCanvas(canvas, chartW, HEIGHT);
    const { xOf, yOf, plotW } = geo;
    const zeroY = yOf(0);
    const bottomY = HEIGHT - PAD.bottom;

    drawGrid(ctx, { w: chartW, pad: PAD, ticks: scale.ticks, yOf });

    // Underwater area
    const g = ctx.createLinearGradient(0, zeroY, 0, bottomY);
    g.addColorStop(0, 'rgba(225,29,72,0.04)');
    g.addColorStop(1, 'rgba(225,29,72,0.30)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(xOf(0), zeroY);
    points.forEach((p, i) => ctx.lineTo(xOf(i), yOf(p.value)));
    ctx.lineTo(xOf(n - 1), zeroY);
    ctx.closePath();
    ctx.fill();

    // Line
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(xOf(i), yOf(p.value)) : ctx.lineTo(xOf(i), yOf(p.value))));
    ctx.stroke();

    drawXLabels(ctx, { points, xOf, plotW, h: HEIGHT, pad: PAD });

    // Max drawdown marker
    if (stats.max < 0) {
      const mx = xOf(stats.maxIdx);
      const my = yOf(stats.max);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(mx, my, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.arc(mx, my, 3.6, 0, Math.PI * 2);
      ctx.fill();

      // [ui_v7] in-chart Max DD text removed
    }

    // Hover crosshair
    if (hover !== null && points[hover]) {
      const hx = xOf(hover);
      const hy = yOf(points[hover].value);
      ctx.strokeStyle = 'rgba(15,27,45,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hx, PAD.top);
      ctx.lineTo(hx, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(hx, hy, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 2.25;
      ctx.stroke();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points, n, chartW, geo, scale, stats, hover, fontsReady]);

  const handleMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || n < 2) return;
    const rect = canvas.getBoundingClientRect();
    const rel = (e.clientX - rect.left - PAD.left) / geo.plotW;
    if (rel < -0.02 || rel > 1.02) {
      setHover(null);
      return;
    }
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };

  const margin = Number(result?.Strategy_Stats?.estimated_margin || result?.Strategy_Stats?.Estimated_Margin || result?.Estimated_Margin || 0);
  const ddSub = stats.max < 0 ? [
    margin > 0 ? `${((Math.abs(stats.max) / margin) * 100).toFixed(2)}% of margin` : null,
    points[stats.maxIdx]?.full
  ].filter(Boolean).join(' | ') : '';

  if (!hasData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
        No drawdown data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-rose-400 via-rose-500 to-orange-400" />

      <div className="p-4">
        <div className="mb-3 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-[13px] font-semibold text-[#0F1B2D]">Drawdown curve</h3>
              <p className="mt-0.5 text-[10.5px] text-slate-500">
                {basis === 'mtm' ? 'Minute-by-minute MTM, distance from the running peak' : 'Distance from the running equity peak'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9.5px] font-semibold tracking-wider text-slate-600">
              <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
              {withTax ? 'NET' : 'GROSS'}
            </span>
          </div>
          <div className="flex flex-wrap divide-x divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60">
            <Stat
              label="Max drawdown"
              value={fmtINR(stats.max)}
              sub={ddSub}
              valueClass={stats.max < 0 ? 'text-rose-600' : 'text-slate-800'}
            />
            <Stat
              label="Current drawdown"
              value={fmtINR(stats.current)}
              valueClass={stats.current < 0 ? 'text-rose-600' : 'text-emerald-600'}
            />
            <Stat label="Time underwater" value={`${stats.underwaterPct.toFixed(0)}%`} />
            {rec && (
              <Stat label="Max DD period" value={fmtDays(rec.fallDays)} sub={`${rec.peakDay} to ${rec.troughDay}`} />
            )}
            {rec && (
              <Stat
                label="Recovery"
                value={rec.recovered ? fmtDays(rec.recoverDays) : 'Not yet'}
                sub={rec.recovered ? `Recovered ${rec.recoverDay}` : `${rec.stillDays} days since low`}
                valueClass={rec.recovered ? 'text-emerald-600' : 'text-rose-600'}
              />
            )}
          </div>
        </div>

        <div ref={wrapRef} className="w-full overflow-x-auto pb-1">
          <div style={{ width: chartW, height: HEIGHT, position: 'relative' }}>
            <canvas
              ref={canvasRef}
              className="block cursor-crosshair"
              onMouseMove={handleMove}
              onMouseLeave={() => setHover(null)}
            />

            {hover !== null && points[hover] && (() => {
              const p = points[hover];
              const x = geo.xOf(hover);
              const y = geo.yOf(p.value);
              const flip = x > chartW - 200;
              return (
                <div
                  data-no-neg="true"
                  className="pointer-events-none absolute z-20 min-w-[150px] rounded-lg px-2.5 py-1.5 shadow-[0_12px_30px_rgba(15,27,45,0.35)]"
                  style={{
                    left: x,
                    top: Math.max(8, Math.min(y - 24, HEIGHT - 100)),
                    transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
                    background: 'rgba(15,27,45,0.94)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="text-[10px] font-medium text-slate-300">{p.full}</div>
                  <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Drawdown from peak
                  </div>
                  <div
                    className="text-[13px] font-semibold leading-tight tabular-nums"
                    style={{ color: p.value < 0 ? '#FB7185' : '#34D399' }}
                  >
                    {p.value < 0 ? fmtINR(p.value) : 'At peak'}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawdownChart;
