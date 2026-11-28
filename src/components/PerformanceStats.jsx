import React from 'react';

const norm = (k) => String(k).toLowerCase().replace(/[^a-z0-9]/g, '');

const toNumber = (v) => {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  const n = parseFloat(String(v ?? '').replace(/[₹,%\s]/g, ''));
  return isNaN(n) ? 0 : n;
};

const inr = (n) => `${n < 0 ? '−' : ''}₹${Math.round(Math.abs(n)).toLocaleString('en-IN')}`;

const TONES = {
  neg: { card: 'border-rose-200/80 bg-rose-50/50', bar: 'bg-rose-400', text: 'text-rose-600', dot: 'bg-rose-500' },
  pos: { card: 'border-slate-200/80 bg-white', bar: 'bg-emerald-400', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  neutral: { card: 'border-slate-200/80 bg-white', bar: 'bg-slate-200', text: 'text-[#0F1B2D]', dot: 'bg-slate-300' },
  margin: { card: 'border-slate-200/80 bg-white', bar: 'bg-indigo-400', text: 'text-indigo-600', dot: 'bg-indigo-500' },
};

// Always RED (risk / loss metrics)
const RED_KEYS = new Set([
  'lossperiods', 'averagelossonlosingperiods', 'maxlossinsingleperiod',
  'maxdrawdown', 'durationofmaxdrawdownperiods', 'maxlosingstreak',
]);

// GREEN when > 0
const GREEN_KEYS = new Set([
  'overallprofit', 'averageprofitperperiod', 'maxprofitinsingleperiod', 'winperiods',
  'averageprofitonwinningperiods', 'maxwinstreak', 'profitfactor', 'rewardtoriskratio',
  'expectancyratio', 'returnmaxdd', 'sortinoratio', 'tailratio', 'bestday', 'avgprofitperday',
]);

// Explicit format map (no substring guessing)
const PCT_KEYS = new Set(['winperiods', 'lossperiods']);
const INT_KEYS = new Set(['nooftradesperiods', 'durationofmaxdrawdownperiods', 'maxwinstreak', 'maxlosingstreak', 'maxddoccurrenceperiodindex', 'tradingdays', 'noofentriessignals']); // [algosay look v1] counts are not money
const RATIO_KEYS = new Set(['returnmaxdd', 'rewardtoriskratio', 'profitfactor', 'expectancyratio', 'sortinoratio', 'sortinoratiodailyann', 'tailratio']); // [algosay look v1]

const fmtValue = (key, raw) => {
  if (raw === null || raw === undefined || raw === '') return '–';
  if (typeof raw === 'string' && isNaN(Number(raw))) return raw; // "98.5%", "45 / 100", "High"
  const num = Number(raw);
  if (isNaN(num)) return String(raw);
  const n = norm(key);
  if (PCT_KEYS.has(n)) return `${num.toFixed(2)}%`;
  if (INT_KEYS.has(n)) return Math.round(num).toLocaleString('en-IN');
  if (RATIO_KEYS.has(n)) return num.toFixed(2);
  return inr(num);
};

const pickTone = (n, raw) => {
  if (RED_KEYS.has(n)) return TONES.neg;
  const num = toNumber(raw);
  if (typeof raw !== 'string' || !isNaN(Number(raw))) {
    if (num < 0) return TONES.neg;
    if (num > 0 && GREEN_KEYS.has(n)) return TONES.pos;
  }
  return TONES.neutral;
};

// One shared card: every metric (incl. margin) has the same size, compact like the execution ledger
const CARD =
  'group relative overflow-hidden rounded-lg border px-3 py-2 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_6px_16px_-10px_rgba(15,27,45,0.25)]';
const LABEL = 'text-[9.5px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-slate-400 break-words';
const VALUE = 'mt-1 text-[13px] font-semibold leading-tight tabular-nums tracking-tight';
const GRID = 'grid grid-cols-2 gap-2.5 md:grid-cols-4 xl:grid-cols-5';

const MetricCard = ({ label, value, tone, title }) => (
  <div className={`${CARD} ${tone.card}`} title={title || label}>
    <div className={`absolute inset-x-0 top-0 h-[2px] ${tone.bar} opacity-70 transition-opacity group-hover:opacity-100`} />
    <div className="flex items-start gap-1.5">
      <span className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
      <p className={`${LABEL} min-h-[23px]`}>{label}</p>
    </div>
    <p className={`${VALUE} ${tone.text}`}>{value}</p>
  </div>
);

// [report_fix v3] display helpers: dates + clearer labels (drawdown comes from the MTM engine)
const fmtDay = (iso) => {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).replace(' ', '-');
};

const displayFor = (key, value, mtmDD) => {
  const n = norm(key);
  // [report_fix v6] trade-level metrics say "trades", day-level ones say "days"
  const LABELS = {
    nooftradesperiods: 'no. of trades (legs)',
    averageprofitperperiod: 'avg profit per trade',
    winperiods: 'win % (trades)',
    lossperiods: 'loss % (trades)',
    averageprofitonwinningperiods: 'avg profit on winning trades',
    averagelossonlosingperiods: 'avg loss on losing trades',
    maxprofitinsingleperiod: 'max profit in single trade',
    maxlossinsingleperiod: 'max loss in single trade',
    maxwinstreak: 'max win streak (trades)',
    maxlosingstreak: 'max losing streak (trades)',
    durationofmaxdrawdownperiods: 'duration of max drawdown (trades)',
    maxddoccurrenceperiodindex: 'max dd occurrence (trade no.)',
  };
  const base = { label: LABELS[n] || key.replace(/_/g, ' ').toLowerCase(), value: fmtValue(key, value) };
  if (n === 'sortinoratio') return { ...base, label: 'sortino ratio (per trade)' };
  if (!mtmDD) return base;
  if (n === 'maxddoccurrenceperiodindex' && !isNaN(Number(value))) {
    const day = fmtDay(mtmDD.trough_day);
    return { label: 'max dd occurrence (trade no.)', value: `Trade ${Math.round(Number(value)) + 1}${day ? ` (${day})` : ''}` };
  }
  if (n === 'durationofmaxdrawdownperiods' && mtmDD.unit === 'days') {
    return { label: 'longest drawdown (days)', value: `${mtmDD.duration} days${mtmDD.range ? ` (${mtmDD.range})` : ''}` };
  }
  return base;
};

const PerformanceStats = ({ result, withTax }) => {
  // Loading state (25 placeholders = 5 x 5)
  if (!result) {
    return (
      <div className={GRID}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200/80 bg-white px-3 py-3">
            <div className="h-2 w-16 rounded bg-slate-100" />
            <div className="mt-2.5 h-4 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const strategyStats = result.Strategy_Stats || {};

  // Structure mismatch
  if (!strategyStats.NET && !strategyStats.GROSS) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white p-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">!</span>
        <div>
          <p className="text-sm font-semibold text-rose-700">Data structure mismatch</p>
          <p className="mt-0.5 text-xs text-rose-600/80">Backend is not sending 'NET' and 'GROSS' keys inside Strategy_Stats.</p>
        </div>
      </div>
    );
  }

  const statsSource = withTax ? strategyStats.NET : strategyStats.GROSS;
  const totalTax = strategyStats['Total Tax & Charges'] || 0;
  const mtmDD = strategyStats.MTM_DD || null; // [report_fix v3]
  if (!statsSource) return null;

  // Excluded keys
  const excludedKeys = ['sharpe', 'max days in any drawdown', 'gross pnl', 'net pnl', 'recovery speed', 'system edge', 'equity smoothness'];

  const finalStats = Object.entries(statsSource).filter(([key]) => {
    const lowerKey = key.toLowerCase();
    return !excludedKeys.some((ex) => lowerKey.includes(ex));
  });

  // Backend sends Estimated_Margin_Used; accept both names
  const margin = strategyStats.Estimated_Margin_Used ?? strategyStats.estimated_margin;
  const marginNum = margin !== undefined && margin !== null ? Number(margin) : null;
  const marginOk = marginNum !== null && !isNaN(marginNum);

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-indigo-500">Overview</p>
          <h3 className="mt-0.5 text-[13px] font-semibold tracking-tight text-[#0F1B2D]">Performance statistics</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9.5px] font-semibold text-slate-500">
            {finalStats.length + 1} metrics
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[9.5px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
            {withTax ? 'NET · AFTER TAX' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Total tax highlight (NET mode only) */}
      {withTax && totalTax > 0 && (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-white">
          <div className="absolute inset-y-0 left-0 w-1 bg-rose-400" />
          <div className="flex flex-wrap items-center justify-between gap-3 py-2 pl-5 pr-4">
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-rose-600">Costs deducted</p>
              <p className="mt-0.5 text-[12px] font-semibold text-[#0F1B2D]">Total brokerage &amp; taxes</p>
              <p className="max-w-md text-[10.5px] text-slate-500">Removed from gross profit to show the real net metrics below.</p>
            </div>
            <p className="shrink-0 text-[15px] font-semibold tabular-nums text-rose-600">−₹{Math.round(totalTax).toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {mtmDD && mtmDD.trough_day && (
        <p className="mb-2 text-[10.5px] text-slate-500">
          {`Max drawdown: ${mtmDD.peak_day ? `peak ${fmtDay(mtmDD.peak_day)} to ` : ''}low ${fmtDay(mtmDD.trough_day)}. Measured on minute-by-minute MTM equity, after charges.`}
        </p>
      )}

      {/* Metrics grid: margin first, then every metric in backend order (5 columns) */}
      <div className={GRID}>
        <MetricCard
          label="estimated margin"
          title="Estimated margin required: peak capital needed to run this strategy"
          value={marginOk ? inr(marginNum) : 'N/A'}
          tone={TONES.margin}
        />

        {finalStats.map(([key, value]) => (
          <MetricCard
            key={key}
            label={displayFor(key, value, mtmDD).label}
            title={key}
            value={displayFor(key, value, mtmDD).value}
            tone={pickTone(norm(key), value)}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceStats;
