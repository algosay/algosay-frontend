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

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 rounded-xl mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🧾</span>
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Taxes & Charges Breakdown</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Your backtest incurred a total estimated cost of <span className="text-white font-bold">₹{Math.round(chargesVal).toLocaleString('en-IN')}</span> in taxes and brokerage. Here is the approximate breakdown:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d]">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">STT / CTT</p>
          <p className="text-sm font-mono font-bold text-red-400">₹{Math.round(chargesVal * 0.65).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d]">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">Brokerage</p>
          <p className="text-sm font-mono font-bold text-gray-300">₹{Math.round(chargesVal * 0.15).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d]">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">Exchange Charges</p>
          <p className="text-sm font-mono font-bold text-gray-300">₹{Math.round(chargesVal * 0.12).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d]">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">GST</p>
          <p className="text-sm font-mono font-bold text-gray-300">₹{Math.round(chargesVal * 0.075).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d]">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">SEBI & Stamp Duty</p>
          <p className="text-sm font-mono font-bold text-gray-300">₹{Math.round(chargesVal * 0.005).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;