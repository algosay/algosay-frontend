import React, { useState, useMemo, useEffect } from 'react';

const ExecutionLedger = ({ result, onFilterChange }) => {
  const [showLogs, setShowLogs] = useState(false);
  
  // Filter States
  const [filterDirection, setFilterDirection] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [filterDTE, setFilterDTE] = useState('All');
  const [filterResult, setFilterResult] = useState('All');

  // Hook 1: orderedKeys (Unconditional - Always runs first)
  const orderedKeys = useMemo(() => {
    const keys = Object.keys(result?.Trade_Ledger?.[0] || {});
    
    const tradeNumKey = keys.find(k => k === 'Trade_Num' || k === 'Trade Num');
    const dateKey = keys.find(k => k.toLowerCase() === 'date' || k === 'Entry Time' || k === 'Entry_Time');
    
    if (tradeNumKey && dateKey) {
      const otherKeys = keys.filter(k => k !== tradeNumKey && k !== dateKey);
      return [tradeNumKey, dateKey, ...otherKeys];
    } else if (dateKey) {
      return [dateKey, ...keys.filter(k => k !== dateKey)];
    }
    return keys;
  }, [result?.Trade_Ledger]);

  // Hook 2: Filter Logic (Moved ABOVE the early return to fix ESLint Rule of Hooks)
  const filteredLedger = useMemo(() => {
    const ledgerData = result?.Trade_Ledger || [];
    return ledgerData.filter(trade => {
      const matchDirection = filterDirection === 'All' || (trade.Direction && String(trade.Direction).toUpperCase().includes(String(filterDirection).toUpperCase()));
      const matchDay = filterDay === 'All' || trade.Day === filterDay;
      const matchDTE = filterDTE === 'All' || String(trade.DTE) === String(filterDTE);
      const matchResult = filterResult === 'All' || trade.Result === filterResult;
      
      return matchDirection && matchDay && matchDTE && matchResult;
    });
  }, [result?.Trade_Ledger, filterDirection, filterDay, filterDTE, filterResult]);

  // Hook 3: Pass filtered data back to parent component (Moved ABOVE the early return)
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredLedger);
    }
  }, [filteredLedger, onFilterChange]);

  // ⚡ FIX: All hooks are declared safely above. Now we can early-return safely without breaking React rules!
  if (!result || !result.Trade_Ledger || result.Trade_Ledger.length === 0) return null;

  // Extract unique values for dynamic dropdowns (Safe to run now because result.Trade_Ledger exists)
  const uniqueDays = [...new Set(result.Trade_Ledger.map(t => t.Day).filter(Boolean))];
  const uniqueDTEs = [...new Set(result.Trade_Ledger.map(t => t.DTE).filter(val => val !== undefined && val !== null && val !== ''))].sort((a, b) => a - b);

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl overflow-hidden flex flex-col mt-4">
      <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#222]">
        <h3 className="text-sm font-bold text-gray-200">Execution Ledger ({filteredLedger.length} Trades)</h3>
        <button 
          onClick={() => setShowLogs(!showLogs)} 
          className="text-xs bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded transition-colors border border-[#444]"
        >
          {showLogs ? 'Hide Ledger' : 'View Ledger'}
        </button>
      </div>

      {showLogs && (
        <div className="flex flex-col">
          {/* Filters Section */}
          <div className="p-3 bg-[#252525] border-b border-[#333] flex flex-wrap gap-4 items-center">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Filters:</span>
            
            <select 
              className="bg-[#1a1a1a] text-xs text-gray-300 border border-[#444] rounded px-2 py-1 outline-none focus:border-blue-500"
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
            >
              <option value="All">All Directions</option>
              <option value="LONG">Long (Buy)</option>
              <option value="SHORT">Short (Sell)</option>
            </select>

            <select 
              className="bg-[#1a1a1a] text-xs text-gray-300 border border-[#444] rounded px-2 py-1 outline-none focus:border-blue-500"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            >
              <option value="All">All Days</option>
              {uniqueDays.map(day => <option key={day} value={day}>{day}</option>)}
            </select>

            {uniqueDTEs.length > 0 && (
              <select 
                className="bg-[#1a1a1a] text-xs text-gray-300 border border-[#444] rounded px-2 py-1 outline-none focus:border-blue-500"
                value={filterDTE}
                onChange={(e) => setFilterDTE(e.target.value)}
              >
                <option value="All">All DTE</option>
                {uniqueDTEs.map(dte => <option key={dte} value={dte}>DTE: {dte}</option>)}
              </select>
            )}

            <select 
              className="bg-[#1a1a1a] text-xs text-gray-300 border border-[#444] rounded px-2 py-1 outline-none focus:border-blue-500"
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
            >
              <option value="All">All Results</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
            </select>

            <button 
              onClick={() => {
                setFilterDirection('All');
                setFilterDay('All');
                setFilterDTE('All');
                setFilterResult('All');
              }}
              className="text-[10px] text-gray-400 hover:text-white underline ml-auto cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-[#2a2a2a] z-10 shadow-sm border-b border-[#333]">
                <tr>
                  {orderedKeys.map((header, idx) => (
                    <th key={idx} className="p-3 text-gray-400 font-semibold uppercase whitespace-nowrap">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((trade, idx) => (
                    <tr key={idx} className={`border-b border-[#333] hover:bg-[#252525] ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#1e1e1e]'}`}>
                      {orderedKeys.map((key, i) => {
                        const val = trade[key];

                        // DIRECTION COLOR FORMATTING
                        if (key === 'Direction') {
                          const valStr = val ? String(val) : '';
                          const colorClass = valStr.toLowerCase().includes('long') || valStr.toLowerCase().includes('buy')
                            ? 'text-green-500 font-bold'
                            : 'text-red-500 font-bold';

                          return (
                            <td key={i} className="p-3 whitespace-nowrap">
                              <span className={colorClass}>
                                {val ? valStr : '-'}
                              </span>
                            </td>
                          );
                        }

                        if (key === 'Exit_Reason' || key === 'Reason') {
                          return (
                            <td key={i} className="p-3 whitespace-nowrap">
                              <span className="text-[10px] text-gray-400 bg-[#333] px-2 py-0.5 rounded">{val || '-'}</span>
                            </td>
                          );
                        }
                        if (key === 'Result') {
                          return (
                            <td key={i} className={`p-3 whitespace-nowrap font-bold ${val === 'Win' ? 'text-green-400' : val === 'Loss' ? 'text-red-400' : 'text-gray-400'}`}>
                              {val || '-'}
                            </td>
                          );
                        }
                        
                        // SPOT CHANGE FORMATTING
                        if (key === 'Spot Change') {
                          const valStr = String(val || '');
                          const isPositive = valStr.includes('(+');
                          const isNegative = valStr.includes('(-') || (valStr.includes('(') && valStr.includes('-'));
                          
                          return (
                            <td key={i} className="p-3 whitespace-nowrap">
                               <span className={`font-semibold ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-300'}`}>
                                  {val !== undefined ? val : '-'}
                               </span>
                            </td>
                          );
                        }

                        // PNL & OTHER NUMBER FORMATTING
                        if (key.includes('PnL') || key === 'Net Real' || key === 'Gap Value') {
                            const numVal = parseFloat(val);
                            const formattedVal = isNaN(numVal) ? val : numVal.toLocaleString('en-IN', { maximumFractionDigits: 2 });
                            return (
                              <td key={i} className="p-3 whitespace-nowrap">
                                 <span className={`font-semibold ${numVal > 0 ? 'text-green-400' : numVal < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                                    {key.includes('PnL') || key === 'Net Real' ? '₹' : ''}{formattedVal !== undefined ? formattedVal : '-'}
                                 </span>
                              </td>
                            )
                        }
                        return <td key={i} className="p-3 whitespace-nowrap text-gray-300">{val !== undefined ? val : '-'}</td>;
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={orderedKeys.length} className="p-6 text-center text-gray-500">
                      No trades match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionLedger;