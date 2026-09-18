import React, { useState, useMemo, useEffect } from 'react';

const ExecutionLedger = ({ result, onFilterChange }) => {
  const [showLogs, setShowLogs] = useState(false);
  
  // Filter States
  const [filterDirection, setFilterDirection] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [filterDTE, setFilterDTE] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [filterSegment, setFilterSegment] = useState('All');

  // Helper to extract PnL
  const getPnl = (trade) => {
    let pnlValue = 0;
    const pnlKey = Object.keys(trade).find(k => k.includes('PnL') || k === 'Net Real');
    if (pnlKey && trade[pnlKey] !== undefined) {
        pnlValue = parseFloat(trade[pnlKey]) || 0;
    }
    return pnlValue;
  };

  // Hook 1: orderedKeys (Unconditional - Always runs first)
  const orderedKeys = useMemo(() => {
    const keys = Object.keys(result?.Trade_Ledger?.[0] || {});
    
    const tradeNumKey = keys.find(k => k === 'Trade_Num' || k === 'Trade Num');
    const tradeTypeKey = keys.find(k => k === 'Trade_Type' || k === 'Trade Type'); 
    const dateKey = keys.find(k => k.toLowerCase() === 'date');
    const entryTimeKey = keys.find(k => k === 'Entry Time' || k === 'Entry_Time');
    const tickerKey = keys.find(k => k.toLowerCase() === 'ticker' || k === 'Symbol');

    // 1. Prepare front keys (Trade Num, Trade Type, and Date)
    const frontKeys = [];
    if (tradeNumKey) frontKeys.push(tradeNumKey);
    if (tradeTypeKey) frontKeys.push(tradeTypeKey); 
    if (dateKey) {
      frontKeys.push(dateKey);
    } else if (!dateKey && entryTimeKey) {
      frontKeys.push(entryTimeKey);
    }

    // 2. Prepare remaining keys by excluding front keys, Ticker, AND removing MFE/MAE
    let otherKeys = keys.filter(k => 
      !frontKeys.includes(k) && 
      k !== tickerKey && 
      !k.toUpperCase().includes('MFE') && 
      !k.toUpperCase().includes('MAE')    
    );

    // 3. Find Entry Time in the remaining keys
    const entryIndex = otherKeys.findIndex(k => k === entryTimeKey);

    // 4. Insert Ticker right before Entry Time
    if (tickerKey) {
      if (entryIndex !== -1) {
        otherKeys.splice(entryIndex, 0, tickerKey);
      } else {
        otherKeys.unshift(tickerKey);
      }
    }

    return [...frontKeys, ...otherKeys];
  }, [result?.Trade_Ledger]);

  // Hook 2: Filter Logic
  const filteredLedger = useMemo(() => {
    const ledgerData = result?.Trade_Ledger || [];
    return ledgerData.filter(trade => {
      const matchDirection = filterDirection === 'All' || (trade.Direction && String(trade.Direction).toUpperCase().includes(String(filterDirection).toUpperCase()));
      const matchDay = filterDay === 'All' || trade.Day === filterDay;
      const matchDTE = filterDTE === 'All' || String(trade.DTE) === String(filterDTE);
      const matchResult = filterResult === 'All' || trade.Result === filterResult;
      const matchSegment = filterSegment === 'All' || trade.Segment === filterSegment;
      
      return matchDirection && matchDay && matchDTE && matchResult && matchSegment;
    });
  }, [result?.Trade_Ledger, filterDirection, filterDay, filterDTE, filterResult, filterSegment]);

  // 🚀 NEW UPDATE: Sequential Grouping - Initial Trades on New Rows, Re-entries on the side!
  const groupedLedger = useMemo(() => {
    const groupedList = [];
    
    filteredLedger.forEach(trade => {
      const tradeType = String(trade.Trade_Type || trade['Trade Type'] || '').toLowerCase();
      // Identify if it's a re-entry or re-execute
      const isReentry = tradeType.includes('re-entry') || tradeType.includes('re-execute') || tradeType.includes('reentry');
      const pnlValue = getPnl(trade);
      const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';

      if (!isReentry) {
        // Create a new independent row for EVERY Initial Trade (Kila Kila varum)
        groupedList.push({
          firstTrade: trade,
          reentries: [],
          totalPnl: pnlValue,
          totalTrades: 1,
          dateStr: dateStr
        });
      } else {
        // It's a re-entry. Find its parent Initial Trade from the same ticker moving backwards.
        const ticker = trade.Symbol || trade.symbol || trade.Ticker;
        let foundParent = false;
        
        for (let i = groupedList.length - 1; i >= 0; i--) {
          const parentTrade = groupedList[i].firstTrade;
          const parentTicker = parentTrade.Symbol || parentTrade.symbol || parentTrade.Ticker;
          
          if (parentTicker === ticker) {
            groupedList[i].reentries.push(trade);
            groupedList[i].totalPnl += pnlValue;
            groupedList[i].totalTrades += 1;
            foundParent = true;
            break;
          }
        }
        
        // Fallback: If no parent found (rare data issue), make it its own row
        if (!foundParent) {
          groupedList.push({
            firstTrade: trade,
            reentries: [],
            totalPnl: pnlValue,
            totalTrades: 1,
            dateStr: dateStr
          });
        }
      }
    });
    
    return groupedList;
  }, [filteredLedger]);

  // 🚀 NEW UPDATE: Pre-calculate the combined total PnL for each specific Date
  const dailyPnLs = useMemo(() => {
    const totals = {};
    filteredLedger.forEach(trade => {
        const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';
        const pnlValue = getPnl(trade);
        if (!totals[dateStr]) totals[dateStr] = 0;
        totals[dateStr] += pnlValue;
    });
    return totals;
  }, [filteredLedger]);

  // Check if there are ANY re-entries in the entire ledger to conditionally show/hide columns
  const hasAnyReentries = useMemo(() => {
    return groupedLedger.some(group => group.reentries.length > 0);
  }, [groupedLedger]);

  // Hook 3: Pass filtered data back to parent component
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredLedger); 
    }
  }, [filteredLedger, onFilterChange]);

  // Early return if no data
  if (!result || !result.Trade_Ledger || result.Trade_Ledger.length === 0) return null;

  // Extract unique values for dynamic dropdowns
  const uniqueDays = [...new Set(result.Trade_Ledger.map(t => t.Day).filter(Boolean))];
  const uniqueSegments = [...new Set(result.Trade_Ledger.map(t => t.Segment).filter(Boolean))];

  // Adjusted Sorting logic to safely handle 'N/A'
  const uniqueDTEs = [...new Set(result.Trade_Ledger.map(t => t.DTE).filter(val => val !== undefined && val !== null && val !== ''))].sort((a, b) => {
    if (a === 'N/A') return 1;
    if (b === 'N/A') return -1;
    return a - b;
  });

  const totalColumnsCount = orderedKeys.length + (hasAnyReentries ? 2 : 0);

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
            
            {uniqueSegments.length > 0 && (
              <select 
                className="bg-[#1a1a1a] text-xs text-gray-300 border border-[#444] rounded px-2 py-1 outline-none focus:border-blue-500"
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value)}
              >
                <option value="All">All Segments</option>
                {uniqueSegments.map(seg => <option key={seg} value={seg}>{seg}</option>)}
              </select>
            )}

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
                setFilterSegment('All');
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
                  {/* Dynamic Headers: Visible ONLY if re-entries exist */}
                  {hasAnyReentries && <th className="p-3 text-indigo-400 font-semibold uppercase whitespace-nowrap bg-[#2a2a2a]">Re-entries Details</th>}
                  {hasAnyReentries && <th className="p-3 text-emerald-400 font-semibold uppercase whitespace-nowrap bg-[#2a2a2a]">Combined PnL</th>}
                </tr>
              </thead>
              <tbody>
                {groupedLedger.length > 0 ? (
                  groupedLedger.map((group, idx) => {
                    const trade = group.firstTrade;
                    const currentTradeDate = group.dateStr;
                    
                    // 🚀 LOGIC: Identify if this row is the first trade of a New Date to show the Combined Day Summary
                    const isFirstOfDate = idx === 0 || groupedLedger[idx - 1].dateStr !== currentTradeDate;

                    return (
                      <React.Fragment key={idx}>
                        {/* 🚀 NEW UPDATE: Day Combined Profit Row */}
                        {isFirstOfDate && currentTradeDate !== 'Unknown Date' && (
                           <tr className="bg-[#111] border-b border-[#444]">
                              <td colSpan={totalColumnsCount} className="p-2 text-center text-xs text-gray-400 tracking-wide uppercase">
                                 Date: <span className="font-bold text-gray-200 mr-4 ml-1">{currentTradeDate}</span>
                                 | Day Combined PnL: 
                                 <span className={`font-bold ml-2 text-sm ${dailyPnLs[currentTradeDate] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {dailyPnLs[currentTradeDate] >= 0 ? '+' : ''}₹{dailyPnLs[currentTradeDate].toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                 </span>
                              </td>
                           </tr>
                        )}

                        <tr className={`border-b border-[#333] hover:bg-[#252525] ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#1e1e1e]'}`}>
                          {/* Render Standard Base Columns for the Initial Trade */}
                          {orderedKeys.map((key, i) => {
                            const val = trade[key];

                            // TRADE TYPE COLOR FORMATTING
                            if (key === 'Trade_Type' || key === 'Trade Type') {
                              const valStr = val ? String(val) : 'Initial Trade';
                              let badgeColor = 'bg-[#333] text-gray-300 border-[#444]'; 

                              if (valStr.includes('SL Re-entry')) {
                                badgeColor = 'bg-amber-950/60 text-amber-400 border-amber-800/60';
                              } else if (valStr.includes('Target Re-execute')) {
                                badgeColor = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
                              } else if (valStr.includes('Target Re-entry')) {
                                badgeColor = 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60';
                              }

                              return (
                                <td key={i} className="p-3 whitespace-nowrap">
                                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${badgeColor}`}>
                                    {valStr}
                                  </span>
                                </td>
                              );
                            }

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

                          {/* Dynamic Column: Inline Re-entries */}
                          {hasAnyReentries && (
                            <td className="p-3 whitespace-nowrap">
                              {group.reentries.length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                  {group.reentries.map((re, rIdx) => {
                                    const rType = re.Trade_Type || re['Trade Type'] || 'Re-entry';
                                    const rReason = re.Exit_Reason || re.Reason || 'Exit';
                                    
                                    // Price Formatting
                                    const formatPrice = (val) => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : (val || '-');
                                    const rEntryPrice = formatPrice(re.Entry_Price || re['Entry Price']);
                                    const rExitPrice = formatPrice(re.Exit_Price || re['Exit Price']);

                                    const rPnl = getPnl(re);
                                    
                                    let rBadgeColor = 'bg-[#333] text-gray-300 border-[#444]';
                                    if (rType.includes('SL Re-entry')) {
                                      rBadgeColor = 'bg-amber-950/60 text-amber-400 border-amber-800/60';
                                    } else if (rType.includes('Target Re-execute')) {
                                      rBadgeColor = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
                                    } else if (rType.includes('Target Re-entry')) {
                                      rBadgeColor = 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60';
                                    }

                                    return (
                                      <div key={rIdx} className="flex items-center gap-2">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium min-w-[45px] text-center ${rBadgeColor}`}>
                                          {rType.replace('Re-entry', 'RE').replace('Re-execute', 'RX')}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          {re.Entry_Time || re['Entry Time']} ➔ {re.Exit_Time || re['Exit Time']}
                                        </span>
                                        <span className="text-[10px] text-gray-300 font-mono tracking-tight bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">
                                          ₹{rEntryPrice} ➔ ₹{rExitPrice}
                                        </span>
                                        <span className="text-[9px] bg-[#333] px-1.5 py-0.5 rounded text-gray-300">
                                          {rReason}
                                        </span>
                                        <span className={`text-[10px] font-bold ${rPnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                          {rPnl > 0 ? '+' : ''}₹{rPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-600 text-[10px] italic">No Re-entries</span>
                              )}
                            </td>
                          )}

                          {/* Dynamic Column: Combined PnL */}
                          {hasAnyReentries && (
                            <td className={`p-3 whitespace-nowrap font-bold text-sm ${group.totalPnl > 0 ? 'text-green-500' : group.totalPnl < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              ₹{group.totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              {group.totalTrades > 1 && (
                                <span className="block text-[9px] font-normal text-gray-400 mt-0.5">({group.totalTrades} Trades)</span>
                              )}
                            </td>
                          )}

                        </tr>
                      </React.Fragment>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={totalColumnsCount} className="p-6 text-center text-gray-500">
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