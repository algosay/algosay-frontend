import React from 'react';

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const TaxBreakdown = ({ result }) => {
  const statsObj = result?.Strategy_Stats || result;
  const explicitGross = result?.GROSS?.['Overall Profit'] || statsObj?.['Gross PnL (Without Tax)'] || result?.['Gross PnL (Without Tax)'];
  const explicitNet = result?.NET?.['Overall Profit'] || statsObj?.['Net PnL (With Tax)'] || result?.['Net PnL (With Tax)'];
  let chargesVal = 0;

  if (explicitGross !== undefined && explicitNet !== undefined) {
    chargesVal = Math.abs(num(explicitGross) - num(explicitNet));
  }
  if (!chargesVal) {
    const lookup = statsObj?.['Total Tax & Charges'] || result?.['Total Tax & Charges'] || result?.NET?.['Total Tax & Charges'] || result?.GROSS?.['Total Tax & Charges'];
    if (lookup) chargesVal = num(lookup);
  }

  if (chargesVal <= 0) return null;

  // Real split saved by the backend (sum of every trade's charges). Older runs may not have it.
  const split = statsObj?.['Charges Split'] || result?.['Charges Split'] || result?.NET?.['Charges Split'] || result?.GROSS?.['Charges Split'];
  const hasSplit = !!split && typeof split === 'object';
  const g = (k) => (hasSplit ? num(split[k]) : 0);
  const inr = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

  let items = [];
  if (hasSplit) {
    items = [
      { label: 'STT / CTT', val: g('STT'), red: true },
      { label: 'Brokerage', val: g('Brokerage') },
      { label: 'Exchange charges', val: g('Exchange Charges') },
      { label: 'GST', val: g('GST') },
      { label: 'SEBI & stamp duty', val: g('SEBI Charges') + g('Stamp Duty') },
    ];
    const other = chargesVal - items.reduce((a, it) => a + it.val, 0);
    if (other >= 1) items.push({ label: 'Other', val: other });
  }

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl mb-5 shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-1">Taxes & charges breakdown</h3>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Your backtest incurred a total estimated cost of <span className="text-[#0F1B2D] font-semibold font-mono">{inr(chargesVal)}</span> in taxes and brokerage.{hasSplit ? ' Here is the breakdown:' : ' Run the backtest again to see the detailed split.'}
      </p>
      {hasSplit && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {items.map(it => (
            <div key={it.label} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium mb-0.5">{it.label}</p>
              <p className={`text-sm font-mono font-semibold ${it.red ? 'text-rose-600' : 'text-[#0F1B2D]'}`}>{inr(it.val)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaxBreakdown;
