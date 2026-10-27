import React, { useState } from 'react';

const AssetSelectionStep = ({ portfolioBreakdown, onNext, onBack }) => {
  // 🌟 Default-ஆக எந்தவொரு இன்ஸ்ட்ருமென்ட்டும் செலக்ட் ஆகாமல் இருக்க empty object
  const [selectedAssets, setSelectedAssets] = useState({});

  const handleCheckboxToggle = (segmentName, assetName) => {
    const currentSelected = selectedAssets[segmentName] || [];
    let updated;
    
    if (currentSelected.includes(assetName)) {
      // ஏற்கனவே இருந்திருந்தால் நீக்கிவிடவும் (Uncheck)
      updated = currentSelected.filter(name => name !== assetName);
    } else {
      // புதியதாகச் சேர்த்தால் (Check)
      updated = [...currentSelected, assetName];
    }

    setSelectedAssets({
      ...selectedAssets,
      [segmentName]: updated
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-white bg-[#070710] rounded-2xl border border-[#1e1e30]">
      <h2 className="text-xl font-bold text-cyan-400">Step 4: Select Your Preferred Instruments</h2>
      <p className="text-xs text-gray-400">
        Default-ஆக எதுவும் தேர்ந்தெடுக்கப்படவில்லை. உங்கள் விருப்பமான இன்ஸ்ட்ருமென்ட்களை மட்டும் டிக் செய்யவும். 
        ஒவ்வொரு செக்மென்ட்டுக்கும் ஒதுக்கப்பட்ட தொகை நீங்கள் தேர்ந்தெடுக்கும் ஃபண்டுகளுக்கு இடையே சமமாகப் பிரிக்கப்படும்.
      </p>

      <div className="space-y-6">
        {portfolioBreakdown.map((seg) => {
          const segAllocatedCapital = seg.allocated_capital; // எ.கா: ₹15,000
          const chosenInSegment = selectedAssets[seg.segment] || [];
          const count = chosenInSegment.length;
          
          // 🧮 ஒரு ஃபண்டுக்கான தொகை கணக்கீடு (Capital per Instrument)
          const capitalPerFund = count > 0 ? segAllocatedCapital / count : 0;

          return (
            <div key={seg.segment} className="p-4 bg-[#020205] border border-[#1e1e30] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">{seg.segment} ({seg.weight_percentage}%)</h3>
                  <p className="text-xs text-gray-400">Allocated Budget: <span className="text-cyan-400">{formatCurrency(segAllocatedCapital)}</span></p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-purple-400">{count} Selected</span> | 
                  <span className="text-green-400 ml-1">
                    {count > 0 ? `${formatCurrency(capitalPerFund)} / fund` : '₹0 / fund'}
                  </span>
                </div>
              </div>

              {/* 120+ Assets List with checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#16162a]">
                {seg.assets.map((asset) => {
                  const isChecked = chosenInSegment.includes(asset.name);
                  return (
                    <label 
                      key={asset.symbol || asset.name}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-cyan-950/30 border-cyan-500 text-white' 
                          : 'bg-[#070710] border-[#1e1e30] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle(seg.segment, asset.name)}
                          className="w-4 h-4 accent-cyan-500 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold">{asset.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Type: {asset.type}</div>
                        </div>
                      </div>
                      {isChecked && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded">
                          {formatCurrency(capitalPerFund)}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-800 rounded-xl text-xs font-bold">Back</button>
        <button 
          onClick={() => onNext(selectedAssets)} 
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-xs font-bold cursor-pointer"
        >
          Generate Wealth Dashboard →
        </button>
      </div>
    </div>
  );
};

export default AssetSelectionStep;