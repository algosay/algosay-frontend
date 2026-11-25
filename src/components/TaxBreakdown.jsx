import React from 'react';

const TaxBreakdown = ({ result }) => {
  const statsObj = result?.Strategy_Stats || result;
  const explicitGross = result?.GROSS?.['Overall Profit'] || statsObj?.['Gross PnL (Without Tax)'] || result?.['Gross PnL (Without Tax)'];
  const explicitNet = result?.NET?.['Overall Profit'] || statsObj?.['Net PnL (With Tax)'] || result?.['Net PnL (With Tax)'];
  let chargesVal = 0;
  
  if (explicitGross !== undefined && explicitNet !== undefined) {
    chargesVal = Math.abs(parseFloat(String(explicitGross).replace(/[^0-9.-]+/g, "")) - parseFloat(String(explicitNet).replace(/[^0-9.-]+/g, "")));
  }
  if (!chargesVal) {
    const lookup = statsObj?.['Total Tax & Charges'] || result?.['Total Tax & Charges'] || result?.NET?.['Total Tax & Charges'] || result?.GROSS?.['Total Tax & Charges'];
    if (lookup) chargesVal = parseFloat(String(lookup).replace(/[^0-9.-]+/g, ""));
  }
  
  if (chargesVal <= 0) return null;

  const items = [
    { label: 'STT / CTT', pct: 0.65, red: true },
    { label: 'Brokerage', pct: 0.15 },
    { label: 'Exchange charges', pct: 0.12 },
    { label: 'GST', pct: 0.075 },
    { label: 'SEBI & stamp duty', pct: 0.005 },
  ];

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl mb-5 shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-1">Taxes & charges breakdown</h3>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Your backtest incurred a total estimated cost of <span className="text-[#0F1B2D] font-semibold font-mono">₹{Math.round(chargesVal).toLocaleString('en-IN')}</span> in taxes and brokerage. Here is the approximate breakdown:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {items.map(it => (
          <div key={it.label} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <p className="text-[11px] text-slate-500 font-medium mb-0.5">{it.label}</p>
            <p className={`text-sm font-mono font-semibold ${it.red ? 'text-rose-600' : 'text-[#0F1B2D]'}`}>₹{Math.round(chargesVal * it.pct).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxBreakdown;
