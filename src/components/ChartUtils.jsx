import { useEffect, useState } from 'react';

export const FONT =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const COLORS = {
  ink: '#0F1B2D',
  muted: '#64748B',
  grid: '#E8ECF2',
  profit: '#059669',
  loss: '#DC2626',
  accent: '#4F46E5'
};

// ---------- Data parsing ----------
const parseList = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const findKey = (obj, terms) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = Object.keys(obj);
  for (const term of terms) {
    const clean = term.toLowerCase().replace(/[_ ]/g, '');
    const found = keys.find((k) => k.toLowerCase().replace(/[_ ]/g, '') === clean);
    if (found !== undefined) return obj[found];
  }
  return undefined;
};

const toNumber = (raw) => {
  if (raw === undefined || raw === null) return undefined;
  const n = typeof raw === 'string' ? parseFloat(raw.replace(/[^0-9.-]+/g, '')) : Number(raw);
  return Number.isNaN(n) ? undefined : n;
};

const DATE_KEYS = ['Date', 'TradeDate', 'trade_date', 'Exit_Time', 'time', 'timestamp', 'trade_time', 'date'];

// Returns [{ value, short, full }] starting with a "Start" point at 0
export const buildSeries = (result, withTax) => {
  const equity = parseList(result?.Equity_Curve);
  const ledger = parseList(result?.Trade_Ledger);
  const points = [{ value: 0, short: 'Start', full: 'Start' }];

  equity.forEach((pt, i) => {
    const pnl = toNumber(findKey(pt, ['Cumulative_PnL', 'cumulative_pnl', 'cumulativePnl', 'pnl', 'profit'])) ?? 0;
    const net =
      toNumber(findKey(pt, ['Cumulative_Net_PnL', 'cumulative_net_pnl', 'netPnl', 'net_pnl'])) ?? pnl * 0.94;

    let rawDate = findKey(pt, DATE_KEYS);
    if (!rawDate && ledger.length > 0) {
      const lp = ledger[i] || ledger[i - 1] || ledger[ledger.length - 1];
      if (lp) rawDate = findKey(lp, [...DATE_KEYS, 'ExitTime', 'Entry_Time']);
    }

    let short;
    let full;
    if (rawDate) {
      const s = String(rawDate);
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) {
        short = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        full = d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      } else {
        short = s.includes(' ') ? s.split(' ')[0] : s;
        full = s;
      }
    } else {
      short = `T-${i + 1}`;
      full = `Trade ${i + 1}`;
    }

    points.push({ value: withTax ? net : pnl, short, full });
  });

  return { points, hasData: equity.length > 0 };
};

// ---------- Formatting ----------
export const fmtINR = (n, signed = false) => {
  const v = Math.round(n || 0);
  const sign = v < 0 ? '-' : signed && v > 0 ? '+' : '';
  return `${sign}₹${Math.abs(v).toLocaleString('en-IN')}`;
};

const trim = (x) => String(parseFloat(x.toFixed(2)));

export const fmtAxis = (v) => {
  if (v === 0) return '₹0';
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  let t;
  if (a >= 1e7) t = `${trim(a / 1e7)}Cr`;
  else if (a >= 1e5) t = `${trim(a / 1e5)}L`;
  else if (a >= 1e3) t = `${trim(a / 1e3)}k`;
  else t = String(Math.round(a));
  return `${sign}₹${t}`;
};

// ---------- Scale ----------
export const niceScale = (min, max, target = 6) => {
  let lo = min;
  let hi = max;
  if (lo === hi) hi = lo + 1000;
  const rough = (hi - lo) / (target - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const start = Math.floor(lo / step) * step;
  const end = Math.ceil(hi / step) * step;
  const ticks = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo: start, hi: end, ticks };
};

export const makeGeo = (w, h, pad, n, lo, hi) => {
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  return {
    plotW,
    plotH,
    xOf: (i) => pad.left + (n > 1 ? i / (n - 1) : 0) * plotW,
    yOf: (v) => pad.top + plotH * (1 - (v - lo) / (hi - lo))
  };
};

// ---------- Canvas helpers ----------
export const setupCanvas = (canvas, w, h) => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return ctx;
};

export const drawGrid = (ctx, { w, pad, ticks, yOf }) => {
  ctx.font = `500 11.5px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ticks.forEach((t) => {
    const y = yOf(t);
    ctx.strokeStyle = t === 0 ? 'rgba(15,27,45,0.45)' : COLORS.grid;
    ctx.lineWidth = t === 0 ? 1.25 : 1;
    ctx.setLineDash(t === 0 ? [] : [3, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = t < 0 ? COLORS.loss : COLORS.muted;
    ctx.fillText(fmtAxis(t), pad.left - 12, y);
  });
};

export const drawXLabels = (ctx, { points, xOf, plotW, h, pad }) => {
  const n = points.length;
  const maxLabels = Math.max(2, Math.floor(plotW / 80));
  const step = Math.max(1, Math.ceil(n / maxLabels));
  ctx.font = `500 11.5px ${FONT}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textBaseline = 'top';
  let lastDrawn = -Infinity;
  points.forEach((p, i) => {
    const isLast = i === n - 1;
    const onStep = i % step === 0;
    if (!onStep && !(isLast && i - lastDrawn >= step * 0.6)) return;
    ctx.textAlign = i === 0 ? 'left' : isLast ? 'right' : 'center';
    ctx.fillText(p.short, xOf(i), h - pad.bottom + 14);
    lastDrawn = i;
  });
};

// ---------- Hooks ----------
export const useContainerWidth = (ref, active = true) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setW(el.clientWidth);
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref, active]);
  return w;
};

// Redraw canvas once web fonts (Inter) are ready
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => alive && setReady(true));
    }
    return () => {
      alive = false;
    };
  }, []);
  return ready;
};