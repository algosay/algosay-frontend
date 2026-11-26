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
};

// Metric grouping (normalized keys)
const GROUPS = [
  { id: 'returns', title: 'Returns', keys: ['overallprofit', 'averageprofitperperiod', 'maxprofitinsingleperiod', 'nooftradesperiods'] },
  { id: 'winloss', title: 'Win / Loss', keys: ['winperiods', 'lossperiods', 'averageprofitonwinningperiods', 'averagelossonlosingperiods', 'maxwinstreak', 'maxlosingstreak', 'maxlossinsingleperiod'] },
  { id: 'risk', title: 'Drawdown & Risk', keys: ['maxdrawdown', 'durationofmaxdrawdownperiods', 'returnmaxdd', 'maxddoccurrenceperiodindex', 'stresslevelindex', 'systemsurvivalprobability'] },
  { id: 'quality', title: 'Edge & Quality', keys: ['profitfactor', 'rewardtoriskratio', 'expectancyratio', 'sortinoratio', 'tailratio', 'suggestedkellysizing', 'scalability'] },
];

const HERO_KEYS = new Set(['overallprofit', 'winperiods', 'maxdrawdown']);

// Always RED (risk / loss metrics)
const RED_KEYS = new Set([
  'lossperiods', 'averagelossonlosingperiods', 'maxlossinsingleperiod',
  'maxdrawdown', 'durationofmaxdrawdownperiods', 'maxlosingstreak',
]);

// GREEN when > 0
const GREEN_KEYS = new Set([
  'overallprofit', 'averageprofitperperiod', 'maxprofitinsingleperiod', 'winperiods',
  'averageprofitonwinningperiods', 'maxwinstreak', 'profitfactor', 'rewardtoriskratio',
  'expectancyratio', 'returnmaxdd', 'sortinoratio', 'tailratio',
]);

// Explicit format map (no substring guessing)
const PCT_KEYS = new Set(['winperiods', 'lossperiods']);
const INT_KEYS = new Set(['nooftradesperiods', 'durationofmaxdrawdownperiods', 'maxwinstreak', 'maxlosingstreak', 'maxddoccurrenceperiodindex']);
const RATIO_KEYS = new Set(['returnmaxdd', 'rewardtoriskratio', 'profitfactor', 'expectancyratio', 'sortinoratio', 'tailratio']);

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

const CARD =
  'group relative overflow-hidden rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-[0_6px_16px_-10px_rgba(15,27,45,0.25)]';
const LABEL = 'text-[9.5px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-slate-400 break-words';
const VALUE = 'mt-1 text-[13px] font-semibold leading-tight tabular-nums tracking-tight';

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

const HeroKpi = ({ label, value, valueClass = 'text-white', children }) => (
  <div className="min-w-[130px] flex-1 px-4 py-3">
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
    <p className={`mt-1 text-[17px] font-semibold leading-none tabular-nums tracking-tight ${valueClass}`}>{value}</p>
    {children}
  </div>
);

const PerformanceStats = ({ result, withTax }) => {
  if (!result) {
    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200/80 bg-white px-3 py-3">
            <div className="h-2 w-16 rounded bg-slate-100" />
            <div className="mt-2.5 h-4 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const strategyStats = result.Strategy_Stats || {};

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
  if (!statsSource) return null;

  const excludedKeys = ['sharpe', 'max days in any drawdown', 'gross pnl', 'net pnl', 'recovery speed', 'system edge', 'equity smoothness'];

  const entries = Object.entries(statsSource)
    .filter(([key]) => !excludedKeys.some((ex) => key.toLowerCase().includes(ex)))
    .map(([key, value]) => ({ key, value, n: norm(key) }));

  // Backend sends Estimated_Margin_Used; accept both names
  const margin = strategyStats.Estimated_Margin_Used ?? strategyStats.estimated_margin;
  const marginNum = margin !== undefined && margin !== null ? Number(margin) : null;
  const marginOk = marginNum !== null && !isNaN(marginNum);

  const get = (n) => entries.find((e) => e.n === n)?.value;
  const profit = toNumber(get('overallprofit'));
  const winPct = Math.min(100, Math.max(0, toNumber(get('winperiods'))));
  const dd = toNumber(get('maxdrawdown'));
  const rom = marginOk && marginNum > 0 ? (profit / marginNum) * 100 : null;
  const ddPct = marginOk && marginNum > 0 ? (Math.abs(dd) / marginNum) * 100 : null;

  // Build sections
  const sections = GROUPS.map((g) => ({
    ...g,
    items: g.keys.map((k) => entries.find((e) => e.n === k)).filter((e) => e && !HERO_KEYS.has(e.n)),
  }));
  const placed = new Set(GROUPS.flatMap((g) => g.keys));
  const others = entries.filter((e) => !placed.has(e.n));
  if (others.length) sections.push({ id: 'other', title: 'Other', items: others });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-indigo-500">Overview</p>
          <h3 className="mt-0.5 text-[13px] font-semibold tracking-tight text-[#0F1B2D]">Performance statistics</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9.5px] font-semibold text-slate-500">
            {entries.length + 1} metrics
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[9.5px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
            {withTax ? 'NET · AFTER TAX' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Costs banner (NET only) */}
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

      {/* Hero strip */}
      <div className="relative mb-4 overflow-hidden rounded-xl bg-[#0F1B2D] shadow-[0_8px_24px_-12px_rgba(15,27,45,0.5)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300" />
        <div className="flex flex-wrap divide-x divide-white/10">
          <HeroKpi label="Overall profit" value={inr(profit)} valueClass={profit < 0 ? 'text-rose-400' : 'text-emerald-300'}>
            {rom !== null && (
              <p className={`mt-1.5 text-[10px] font-medium ${rom < 0 ? 'text-rose-300/80' : 'text-emerald-200/80'}`}>
                {rom >= 0 ? '+' : ''}{rom.toFixed(1)}% on margin
              </p>
            )}
          </HeroKpi>

          <HeroKpi label="Win rate" value={`${winPct.toFixed(1)}%`}>
            <div className="mt-2 flex h-1 overflow-hidden rounded-full bg-white/10">
              <div className="bg-emerald-400" style={{ width: `${winPct}%` }} />
              <div className="flex-1 bg-rose-400" />
            </div>
          </HeroKpi>

          <HeroKpi label="Max drawdown" value={inr(dd)} valueClass="text-rose-400">
            {ddPct !== null && <p className="mt-1.5 text-[10px] font-medium text-rose-300/80">{ddPct.toFixed(1)}% of margin</p>}
          </HeroKpi>

          <HeroKpi label="Estimated margin" value={marginOk ? inr(marginNum) : 'N/A'} valueClass="text-indigo-300">
            <p className="mt-1.5 text-[10px] font-medium text-slate-400">Peak capital required</p>
          </HeroKpi>
        </div>
      </div>

      {/* Grouped metrics */}
      <div className="space-y-4">
        {sections.map(
          (s) =>
            s.items.length > 0 && (
              <section key={s.id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-3 w-[3px] rounded-full ${s.id === 'risk' ? 'bg-rose-400' : 'bg-indigo-400'}`} />
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{s.title}</h4>
                  <span className="text-[9.5px] font-medium text-slate-400">{s.items.length}</span>
                  <div className="h-px flex-1 bg-slate-200/70" />
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                  {s.items.map(({ key, value, n }) => (
                    <MetricCard
                      key={key}
                      label={key.replace(/_/g, ' ').toLowerCase()}
                      title={key}
                      value={fmtValue(key, value)}
                      tone={pickTone(n, value)}
                    />
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
};

export default PerformanceStats;
