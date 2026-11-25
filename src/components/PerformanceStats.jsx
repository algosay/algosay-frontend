import React from 'react';

const TONES = {
  neg: { bar: 'bg-rose-400', text: 'text-rose-600', dot: 'bg-rose-500' },
  pos: { bar: 'bg-emerald-400', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  neutral: { bar: 'bg-slate-200', text: 'text-[#0F1B2D]', dot: 'bg-slate-300' },
  // CHANGED: estimated margin uses the same white card, only the colour is different (indigo)
  margin: { bar: 'bg-indigo-400', text: 'text-indigo-600', dot: 'bg-indigo-500' },
};

// CHANGED: one shared card layout so every metric (incl. margin) has the same size
const CARD =
  'group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_6px_18px_-10px_rgba(15,27,45,0.18)]';
const LABEL = 'truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400';
const VALUE = 'mt-2 text-base font-semibold tabular-nums tracking-tight'; // 16px (was 19px / 26px)

const PerformanceStats = ({ result, withTax }) => {
  // Loading state
  if (!result) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-200/80 bg-white px-4 py-4">
            <div className="h-2 w-16 rounded bg-slate-100" />
            <div className="mt-3 h-5 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  // Strategy_Stats extraction
  const strategyStats = result.Strategy_Stats || {};

  // Structure mismatch
  if (!strategyStats.NET && !strategyStats.GROSS) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white p-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">!</span>
        <div>
          <p className="text-sm font-semibold text-rose-700">Data structure mismatch</p>
          <p className="mt-0.5 text-xs text-rose-600/80">
            Backend is not sending 'NET' and 'GROSS' keys inside Strategy_Stats.
          </p>
        </div>
      </div>
    );
  }

  const statsSource = withTax ? strategyStats.NET : strategyStats.GROSS;
  const totalTax = strategyStats['Total Tax & Charges'] || 0;

  if (!statsSource) return null;

  // Excluded keys
  const excludedKeys = [
    'sharpe', 'max days in any drawdown', 'gross pnl', 'net pnl',
    'recovery speed', 'system edge', 'equity smoothness',
  ];

  const finalStats = Object.entries(statsSource).filter(([key]) => {
    const lowerKey = key.toLowerCase();
    return !excludedKeys.some((exclude) => lowerKey.includes(exclude));
  });

  const margin = strategyStats.estimated_margin;
  const marginOk = margin !== undefined && margin !== null;

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-500">Overview</p>
          <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-[#0F1B2D]">Performance statistics</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            {finalStats.length + 1} metrics
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${withTax ? 'bg-amber-500' : 'bg-indigo-500'}`} />
            {withTax ? 'NET · AFTER TAX' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Total tax highlight (NET mode only) */}
      {withTax && totalTax > 0 && (
        <div className="relative mb-4 overflow-hidden rounded-xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-white">
          <div className="absolute inset-y-0 left-0 w-1 bg-rose-400" />
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 pl-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600">Costs deducted</p>
              <p className="mt-1 text-sm font-semibold text-[#0F1B2D]">Total brokerage &amp; taxes</p>
              <p className="mt-0.5 max-w-md text-xs text-slate-500">
                This amount has been removed from your gross profit to show the real net metrics below.
              </p>
            </div>
            <p className="shrink-0 text-lg font-semibold tabular-nums text-rose-600">
              −₹{Math.round(totalTax).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {/* Metrics grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        {/* Estimated margin: same size / white base as every other card, only font colour differs */}
        <div className={CARD} title="Estimated margin required: capital needed to run this strategy">
          <div className={`absolute inset-x-0 top-0 h-[2px] ${TONES.margin.bar} opacity-70 transition-opacity group-hover:opacity-100`} />
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONES.margin.dot}`} />
            <p className={LABEL}>estimated margin</p>
          </div>
          <p className={`${VALUE} ${TONES.margin.text}`}>
            {marginOk ? `₹${Math.round(margin).toLocaleString('en-IN')}` : 'N/A'}
          </p>
        </div>

        {finalStats.map(([key, value]) => {
          let strVal = String(value);
          const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
          const numericVal = parseFloat(strVal.replace(/[^0-9.-]+/g, ''));

          const isNotMoney =
            lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('%') ||
            lowerKey.includes('days') || lowerKey.includes('periods') || lowerKey.includes('probability') ||
            lowerKey.includes('index') || lowerKey.includes('streak') || lowerKey.includes('return') ||
            lowerKey.includes('smoothness') || lowerKey.includes('kelly') || lowerKey.includes('sizing') ||
            lowerKey.includes('scalability');
          const isMoney = !isNotMoney && !isNaN(numericVal);

          // Formatting
          if (
            lowerKey.includes('duration') || lowerKey.includes('streak') || lowerKey.includes('occurrence') ||
            lowerKey.includes('trades') || lowerKey.includes('periods')
          ) {
            strVal = isNaN(numericVal) ? strVal : Math.round(numericVal).toString();
          } else if (isMoney && !lowerKey.includes('totaltrades')) {
            strVal =
              numericVal >= 0
                ? `₹${Math.round(numericVal).toLocaleString('en-IN')}`
                : `-₹${Math.round(Math.abs(numericVal)).toLocaleString('en-IN')}`;
          } else if (lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return')) {
            strVal = isNaN(numericVal) ? strVal : numericVal.toFixed(2);
          } else if (lowerKey.includes('%') && !strVal.includes('%')) {
            strVal = `${strVal}%`;
          }

          // Colour logic
          const isNegative = strVal.includes('-');
          const isPositiveNumber =
            !isNegative && /[1-9]/.test(strVal) && !isNaN(parseFloat(strVal.replace(/[^0-9.-]+/g, '')));

          let tone = TONES.neutral;
          if (isNegative) {
            tone = TONES.neg;
          } else if (
            isPositiveNumber &&
            (lowerKey.includes('pnl') || lowerKey.includes('profit') || lowerKey.includes('win') ||
              lowerKey.includes('factor') || lowerKey.includes('ratio') || lowerKey.includes('return'))
          ) {
            tone = TONES.pos;
          }

          return (
            <div key={key} className={CARD}>
              <div className={`absolute inset-x-0 top-0 h-[2px] ${tone.bar} opacity-70 transition-opacity group-hover:opacity-100`} />
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                <p className={LABEL} title={key}>
                  {key.replace(/_/g, ' ').toLowerCase()}
                </p>
              </div>
              <p className={`${VALUE} ${tone.text}`}>{strVal}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceStats;
