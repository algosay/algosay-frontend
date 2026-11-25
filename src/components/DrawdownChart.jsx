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
} from './chartUtils';

const HEIGHT = 340;
const PAD = { top: 24, right: 28, bottom: 44, left: 76 };
const MIN_STEP = 34;
const LINE = '#E11D48';

const Stat = ({ label, value, valueClass = 'text-slate-800' }) => (
  <div className="min-w-[110px]">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-0.5 text-lg font-bold leading-tight ${valueClass}`}>{value}</div>
  </div>
);

const DrawdownChart = ({ result, withTax }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [hover, setHover] = useState(null);

  const { points, hasData } = useMemo(() => {
    const series = buildSeries(result, withTax);
    let peak = 0;
    const dd = series.points.map((p) => {
      if (p.value > peak) peak = p.value;
      return { ...p, value: p.value - peak }; // always 0 or negative
    });
    return { points: dd, hasData: series.hasData };
  }, [result, withTax]);

  const n = points.length;
  const containerW = useContainerWidth(wrapRef, hasData);
  const fontsReady = useFontsReady();
  const chartW = Math.max(containerW, n * MIN_STEP + PAD.left + PAD.right);

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
    ctx.lineWidth = 2.25;
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
      ctx.arc(mx, my, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();

      const label = `Max DD ${fmtINR(stats.max)}`;
      ctx.font = '600 11.5px "Inter", -apple-system, "Segoe UI", Arial, sans-serif';
      const tw = ctx.measureText(label).width;
      const flip = mx + tw + 24 > chartW - PAD.right;
      ctx.textBaseline = 'middle';
      ctx.textAlign = flip ? 'right' : 'left';
      ctx.fillStyle = '#B91C1C';
      ctx.fillText(label, flip ? mx - 12 : mx + 12, Math.max(my - 14, PAD.top + 8));
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
      ctx.arc(hx, hy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = LINE;
      ctx.beginPath();
      ctx.arc(hx, hy, 3, 0, Math.PI * 2);
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

  if (!hasData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500 shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
        No drawdown data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-[0_1px_3px_rgba(15,27,45,0.06)] w-full relative">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#0F1B2D]">Drawdown curve</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distance from the running equity peak ({withTax ? 'net' : 'gross'})
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Stat
            label="Max drawdown"
            value={fmtINR(stats.max)}
            valueClass={stats.max < 0 ? 'text-rose-600' : 'text-slate-800'}
          />
          <Stat
            label="Current drawdown"
            value={fmtINR(stats.current)}
            valueClass={stats.current < 0 ? 'text-rose-600' : 'text-emerald-600'}
          />
          <Stat label="Time underwater" value={`${stats.underwaterPct.toFixed(0)}%`} />
        </div>
      </div>

      <div ref={wrapRef} className="overflow-x-auto w-full pb-1">
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
            const flip = x > chartW - 210;
            return (
              <div
                className="absolute pointer-events-none z-20 min-w-[170px] rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(15,27,45,0.18)]"
                style={{
                  left: x,
                  top: Math.max(8, Math.min(y - 24, HEIGHT - 110)),
                  transform: flip ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)'
                }}
              >
                <div className="text-xs font-medium text-slate-500">{p.full}</div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Drawdown from peak
                </div>
                <div className={`text-lg font-bold leading-tight ${p.value < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {p.value < 0 ? fmtINR(p.value) : 'At peak'}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DrawdownChart;