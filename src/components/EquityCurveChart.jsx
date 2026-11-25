import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  COLORS,
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

const HEIGHT = 340;
const PAD = { top: 20, right: 24, bottom: 40, left: 68 };
const MIN_STEP = 30;

const tone = (v) => (v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-700');

const Stat = ({ label, value, valueClass }) => (
  <div className="min-w-[96px]">
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-0.5 text-[15px] font-semibold leading-tight tabular-nums ${valueClass}`}>{value}</div>
  </div>
);

const EquityCurveChart = ({ result, withTax }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [hover, setHover] = useState(null);

  const { points, hasData } = useMemo(() => buildSeries(result, withTax), [result, withTax]);
  const n = points.length;
  const containerW = useContainerWidth(wrapRef, hasData);
  const fontsReady = useFontsReady();
  const chartW = Math.max(containerW, n * MIN_STEP + PAD.left + PAD.right);

  const scale = useMemo(() => {
    const vals = points.map((p) => p.value);
    return niceScale(Math.min(0, ...vals), Math.max(0, ...vals), 6);
  }, [points]);

  const geo = useMemo(
    () => makeGeo(chartW, HEIGHT, PAD, n, scale.lo, scale.hi),
    [chartW, n, scale]
  );

  const stats = useMemo(() => {
    const vals = points.map((p) => p.value);
    return { final: vals[vals.length - 1], peak: Math.max(...vals), low: Math.min(...vals) };
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || n < 2 || !chartW) return;

    const ctx = setupCanvas(canvas, chartW, HEIGHT);
    const { xOf, yOf, plotW } = geo;
    const zeroY = yOf(0);
    const bottomY = HEIGHT - PAD.bottom;

    drawGrid(ctx, { w: chartW, pad: PAD, ticks: scale.ticks, yOf });

    const fillPath = () => {
      ctx.beginPath();
      ctx.moveTo(xOf(0), zeroY);
      points.forEach((p, i) => ctx.lineTo(xOf(i), yOf(p.value)));
      ctx.lineTo(xOf(n - 1), zeroY);
      ctx.closePath();
    };

    // Profit area (above zero)
    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD.left, PAD.top - 6, plotW, zeroY - (PAD.top - 6));
    ctx.clip();
    let g = ctx.createLinearGradient(0, PAD.top, 0, zeroY);
    g.addColorStop(0, 'rgba(5,150,105,0.24)');
    g.addColorStop(1, 'rgba(5,150,105,0.02)');
    ctx.fillStyle = g;
    fillPath();
    ctx.fill();
    ctx.restore();

    // Loss area (below zero)
    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD.left, zeroY, plotW, bottomY - zeroY + 6);
    ctx.clip();
    g = ctx.createLinearGradient(0, zeroY, 0, bottomY);
    g.addColorStop(0, 'rgba(220,38,38,0.03)');
    g.addColorStop(1, 'rgba(220,38,38,0.22)');
    ctx.fillStyle = g;
    fillPath();
    ctx.fill();
    ctx.restore();

    // Equity line
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(xOf(i), yOf(p.value)) : ctx.lineTo(xOf(i), yOf(p.value))));
    ctx.stroke();

    drawXLabels(ctx, { points, xOf, plotW, h: HEIGHT, pad: PAD });

    // End-point marker
    const lx = xOf(n - 1);
    const ly = yOf(points[n - 1].value);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.accent;
    ctx.beginPath();
    ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
    ctx.fill();

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
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = COLORS.accent;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points, n, chartW, geo, scale, hover, fontsReady]);

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
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-500 shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
        No equity data available for the selected filters.
      </div>
    );
  }

  const modeLabel = withTax ? 'Net' : 'Gross';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-[0_1px_3px_rgba(15,27,45,0.06)] w-full relative">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1B2D]">Equity curve</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cumulative {modeLabel.toLowerCase()} P&amp;L across {n - 1} trades
          </p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-2">
          <Stat label={`${modeLabel} result`} value={fmtINR(stats.final, true)} valueClass={tone(stats.final)} />
          <Stat label="Peak" value={fmtINR(stats.peak, true)} valueClass={tone(stats.peak)} />
          <Stat label="Lowest" value={fmtINR(stats.low, true)} valueClass={tone(stats.low)} />
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
            const prev = hover > 0 ? points[hover - 1].value : null;
            const delta = prev === null ? null : p.value - prev;
            const x = geo.xOf(hover);
            const y = geo.yOf(p.value);
            const flip = x > chartW - 200;
            return (
              <div
                className="absolute pointer-events-none z-20 min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,27,45,0.16)]"
                style={{
                  left: x,
                  top: Math.max(8, Math.min(y - 24, HEIGHT - 120)),
                  transform: flip ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)'
                }}
              >
                <div className="text-[11px] font-medium text-slate-500">{p.full}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Cumulative {modeLabel.toLowerCase()} P&amp;L
                </div>
                <div className={`text-[15px] font-semibold leading-tight tabular-nums ${tone(p.value)}`}>
                  {fmtINR(p.value, true)}
                </div>
                {delta !== null && (
                  <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-slate-100 pt-1.5 text-[11px]">
                    <span className="font-medium text-slate-500">Change</span>
                    <span className={`font-semibold tabular-nums ${tone(delta)}`}>{fmtINR(delta, true)}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default EquityCurveChart;