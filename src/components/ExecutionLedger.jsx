import React, { useState, useMemo, useEffect } from 'react';

// 🚀 "₹", "," ellam remove panni safe-ah number-ah maathum
const toNum = (v) => {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  const n = parseFloat(String(v ?? '').replace(/[₹,\s]/g, ''));
  return isNaN(n) ? 0 : n;
};

// 🚀 Toggle (withTax) padi Net / Gross PnL edukkum.
const getPnl = (trade, withTax) => {
  if (!trade) return 0;
  const keys = Object.keys(trade);
  const netKey = keys.find(k => k === 'Net Real PnL' || k === 'Net PnL' || k === 'Net Real');
  const grossKey = keys.find(k => k === 'Gross PnL (No Tax)' || k === 'Gross PnL');
  const key = withTax ? (netKey || grossKey) : (grossKey || netKey);
  if (key) return toNum(trade[key]);

  // Fallback: old format data-kku
  const fallbackKey = keys.find(k => k.includes('PnL') || k === 'Net Real');
  return fallbackKey ? toNum(trade[fallbackKey]) : 0;
};

// 🚀 Backend link fields (table-la column-ah kaattaama maraikkanum) - underscore + space rendu format-um
const HIDDEN_KEYS = ['Leg_ID', 'Chain_Seq', 'Parent_Trade_Num', 'Leg ID', 'Chain Seq', 'Parent Trade Num'];

// Trade type badge colours (light theme)
const typeBadge = (t) => {
  if (t.includes('SL Re-entry')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (t.includes('Target Re-execute')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (t.includes('Target Re-entry')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const selectCls = "bg-white text-xs text-slate-700 border border-slate-300 rounded-md px-2 py-1 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const ExecutionLedger = ({ result, onFilterChange, withTax = false }) => {
  const [showLogs, setShowLogs] = useState(false);

  // Filter States
  const [filterDirection, setFilterDirection] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [filterDTE, setFilterDTE] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [filterSegment, setFilterSegment] = useState('All');

  const pnlModeLabel = withTax ? 'Net' : 'Gross';

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

    // 2. Prepare remaining keys by excluding front keys, Ticker, link fields, AND removing MFE/MAE
    let otherKeys = keys.filter(k =>
      !frontKeys.includes(k) &&
      k !== tickerKey &&
      !HIDDEN_KEYS.includes(k) &&
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

  // 🚀 Grouping: Re-entry / Re-execute correct parent-oda attach aagum.
  // Priority: 1) Leg_ID (backend chain id)  2) Parent_Trade_Num  3) Ticker + Entry Price + Date (old saved backtests)
  const groupedLedger = useMemo(() => {
    const groupedList = [];
    const byLeg = {}; // Leg_ID -> group

    const tickerOf = (t) => t.Symbol || t.symbol || t.Ticker || t.ticker;
    const priceOf = (t) => toNum(t.Entry_Price ?? t['Entry Price']).toFixed(2);
    const numOf = (t) => String(t.Trade_Num ?? t['Trade Num'] ?? '');

    filteredLedger.forEach(trade => {
      const tradeType = String(trade.Trade_Type || trade['Trade Type'] || '').toLowerCase();
      const isReentry = tradeType.includes('re-entry') || tradeType.includes('re-execute') || tradeType.includes('reentry');
      const pnlValue = getPnl(trade, withTax);
      const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';
      const legId = trade.Leg_ID ?? trade['Leg ID'];
      const parentNum = trade.Parent_Trade_Num ?? trade['Parent Trade Num'];

      if (isReentry) {
        let parent = null;

        if (legId && byLeg[legId]) {
          parent = byLeg[legId];
        } else if (parentNum !== null && parentNum !== undefined && parentNum !== '') {
          parent = groupedList.find(g => numOf(g.firstTrade) === String(parentNum)) || null;
        } else if (!legId) {
          // Old data (Leg_ID illa): Ticker + Entry Price + Date match
          for (let i = groupedList.length - 1; i >= 0; i--) {
            const g = groupedList[i];
            if (g.dateStr === dateStr && tickerOf(g.firstTrade) === tickerOf(trade) && priceOf(g.firstTrade) === priceOf(trade)) {
              parent = g;
              break;
            }
          }
        }

        if (parent) {
          parent.reentries.push(trade);
          parent.totalPnl += pnlValue;
          parent.totalTrades += 1;
          return;
        }
      }

      // Initial trade (or re-entry whose parent is hidden by a filter) -> own row
      const group = {
        firstTrade: trade,
        reentries: [],
        totalPnl: pnlValue,
        totalTrades: 1,
        dateStr: dateStr
      };
      groupedList.push(group);
      if (legId && !byLeg[legId]) byLeg[legId] = group;
    });

    return groupedList;
  }, [filteredLedger, withTax]);

  // Pre-calculate the combined total PnL for each specific Date (toggle-padi Net / Gross)
  const dailyPnLs = useMemo(() => {
    const totals = {};
    filteredLedger.forEach(trade => {
        const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';
        const pnlValue = getPnl(trade, withTax);
        if (!totals[dateStr]) totals[dateStr] = 0;
        totals[dateStr] += pnlValue;
    });
    return totals;
  }, [filteredLedger, withTax]);

  // Calculate how many rows each date has (for rowSpan on the side box)
  const dateRowCounts = useMemo(() => {
    const counts = {};
    groupedLedger.forEach(group => {
       const d = group.dateStr;
       counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  }, [groupedLedger]);

  // Check if there are ANY re-entries in the entire ledger
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

  const uniqueDTEs = [...new Set(result.Trade_Ledger.map(t => t.DTE).filter(val => val !== undefined && val !== null && val !== ''))].sort((a, b) => {
    if (a === 'N/A') return 1;
    if (b === 'N/A') return -1;
    return a - b;
  });

  // +1 column for the Day Total side column
  const totalColumnsCount = orderedKeys.length + (hasAnyReentries ? 2 : 0) + 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col mt-4 shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="text-sm font-semibold text-[#0F1B2D]">Execution ledger <span className="text-slate-400 font-normal font-mono">({filteredLedger.length} trades)</span></h3>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="text-xs bg-[#0F1B2D] hover:bg-[#1c2d47] text-white px-3 py-1.5 rounded-md transition-colors font-semibold cursor-pointer"
        >
          {showLogs ? 'Hide ledger' : 'View ledger'}
        </button>
      </div>

      {showLogs && (
        <div className="flex flex-col">
          {/* Filters Section */}
          <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap gap-3 items-center">
            <span className="text-xs text-slate-500 font-semibold">Filters</span>

            {uniqueSegments.length > 0 && (
              <select
                className={selectCls}
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value)}
              >
                <option value="All">All Segments</option>
                {uniqueSegments.map(seg => <option key={seg} value={seg}>{seg}</option>)}
              </select>
            )}

            <select
              className={selectCls}
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
            >
              <option value="All">All Directions</option>
              <option value="LONG">Long (Buy)</option>
              <option value="SHORT">Short (Sell)</option>
            </select>

            <select
              className={selectCls}
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            >
              <option value="All">All Days</option>
              {uniqueDays.map(day => <option key={day} value={day}>{day}</option>)}
            </select>

            {uniqueDTEs.length > 0 && (
              <select
                className={selectCls}
                value={filterDTE}
                onChange={(e) => setFilterDTE(e.target.value)}
              >
                <option value="All">All DTE</option>
                {uniqueDTEs.map(dte => <option key={dte} value={dte}>DTE: {dte}</option>)}
              </select>
            )}

            <select
              className={selectCls}
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
              className="text-[11px] text-slate-500 hover:text-[#0F1B2D] underline ml-auto cursor-pointer"
            >
              Clear filters
            </button>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
                <tr>
                  {orderedKeys.map((header, idx) => (
                    <th key={idx} className="p-2.5 text-slate-500 font-semibold whitespace-nowrap">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                  {/* Dynamic Headers */}
                  {hasAnyReentries && <th className="p-2.5 text-indigo-600 font-semibold whitespace-nowrap bg-slate-50">Re-entries details</th>}
                  {hasAnyReentries && <th className="p-2.5 text-emerald-600 font-semibold whitespace-nowrap bg-slate-50">Trade PnL ({pnlModeLabel})</th>}

                  {/* Day Total Header on the extreme right */}
                  <th className="p-2.5 text-violet-600 font-semibold whitespace-nowrap bg-slate-50 border-l border-slate-200 text-center">Day PnL ({pnlModeLabel})</th>
                </tr>
              </thead>
              <tbody>
                {groupedLedger.length > 0 ? (
                  groupedLedger.map((group, idx) => {
                    const trade = group.firstTrade;
                    const currentTradeDate = group.dateStr;

                    // Identify if this row is the first trade of a New Date to spawn the rowSpan box
                    const isFirstOfDate = idx === 0 || groupedLedger[idx - 1].dateStr !== currentTradeDate;

                    return (
                      <tr key={idx} className={`border-b border-slate-100 hover:bg-indigo-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>

                        {/* Standard Base Columns */}
                        {orderedKeys.map((key, i) => {
                          const val = trade[key];

                          // TRADE TYPE COLOR FORMATTING
                          if (key === 'Trade_Type' || key === 'Trade Type') {
                            const valStr = val ? String(val) : 'Initial Trade';
                            return (
                              <td key={i} className="p-2.5 whitespace-nowrap">
                                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${typeBadge(valStr)}`}>
                                  {valStr}
                                </span>
                              </td>
                            );
                          }

                          // DIRECTION COLOR FORMATTING
                          if (key === 'Direction') {
                            const valStr = val ? String(val) : '';
                            const colorClass = valStr.toLowerCase().includes('long') || valStr.toLowerCase().includes('buy')
                              ? 'text-emerald-600 font-semibold'
                              : 'text-rose-600 font-semibold';

                            return (
                              <td key={i} className="p-2.5 whitespace-nowrap">
                                <span className={colorClass}>
                                  {val ? valStr : '-'}
                                </span>
                              </td>
                            );
                          }

                          if (key === 'Exit_Reason' || key === 'Reason') {
                            return (
                              <td key={i} className="p-2.5 whitespace-nowrap">
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{val || '-'}</span>
                              </td>
                            );
                          }
                          if (key === 'Result') {
                            return (
                              <td key={i} className={`p-2.5 whitespace-nowrap font-semibold ${val === 'Win' ? 'text-emerald-600' : val === 'Loss' ? 'text-rose-600' : 'text-slate-500'}`}>
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
                              <td key={i} className="p-2.5 whitespace-nowrap">
                                 <span className={`font-semibold ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-600'}`}>
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
                                <td key={i} className="p-2.5 whitespace-nowrap">
                                   <span className={`font-semibold font-mono ${numVal > 0 ? 'text-emerald-600' : numVal < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                                      {key.includes('PnL') || key === 'Net Real' ? '₹' : ''}{formattedVal !== undefined ? formattedVal : '-'}
                                   </span>
                                </td>
                              )
                          }
                          return <td key={i} className="p-2.5 whitespace-nowrap text-slate-700">{val !== undefined && val !== null ? val : '-'}</td>;
                        })}

                        {/* Inline Re-entries */}
                        {hasAnyReentries && (
                          <td className="p-2.5 whitespace-nowrap">
                            {group.reentries.length > 0 ? (
                              <div className="flex flex-col gap-1.5">
                                {group.reentries.map((re, rIdx) => {
                                  const rType = re.Trade_Type || re['Trade Type'] || 'Re-entry';
                                  const rReason = re.Exit_Reason || re.Reason || 'Exit';

                                  const formatPrice = (val) => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2) : (val || '-');
                                  const rEntryPrice = formatPrice(re.Entry_Price || re['Entry Price']);
                                  const rExitPrice = formatPrice(re.Exit_Price || re['Exit Price']);
                                  const rPnl = getPnl(re, withTax);

                                  return (
                                    <div key={rIdx} className="flex items-center gap-2">
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium min-w-[45px] text-center ${typeBadge(rType)}`}>
                                        {rType.replace('Re-entry', 'RE').replace('Re-execute', 'RX')}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        {re.Entry_Time || re['Entry Time']} ➔ {re.Exit_Time || re['Exit Time']}
                                      </span>
                                      <span className="text-[10px] text-slate-700 font-mono tracking-tight bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                        ₹{rEntryPrice} ➔ ₹{rExitPrice}
                                      </span>
                                      <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                        {rReason}
                                      </span>
                                      <span className={`text-[10px] font-semibold font-mono ${rPnl > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {rPnl > 0 ? '+' : ''}₹{rPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">No re-entries</span>
                            )}
                          </td>
                        )}

                        {/* Trade Combined PnL */}
                        {hasAnyReentries && (
                          <td className={`p-2.5 whitespace-nowrap font-semibold font-mono text-sm ${group.totalPnl > 0 ? 'text-emerald-600' : group.totalPnl < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                            ₹{group.totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            {group.totalTrades > 1 && (
                              <span className="block text-[9px] font-normal text-slate-400 mt-0.5">({group.totalTrades} trades)</span>
                            )}
                          </td>
                        )}

                        {/* Combined Day PnL Side Box (Only renders once per date using rowSpan) */}
                        {isFirstOfDate && (
                           <td
                             rowSpan={dateRowCounts[currentTradeDate]}
                             className="p-2.5 whitespace-nowrap align-middle border-l border-slate-200 bg-slate-50"
                           >
                              <div className={`flex flex-col items-center justify-center p-2.5 rounded-lg border ${dailyPnLs[currentTradeDate] >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                 <span className="text-[10px] text-slate-500 mb-0.5 font-medium">{currentTradeDate}</span>
                                 <span className={`font-semibold font-mono text-base ${dailyPnLs[currentTradeDate] >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {dailyPnLs[currentTradeDate] >= 0 ? '+' : ''}₹{dailyPnLs[currentTradeDate].toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                 </span>
                                 <span className="text-[10px] text-slate-400 mt-0.5">{pnlModeLabel}</span>
                              </div>
                           </td>
                        )}

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={totalColumnsCount} className="p-6 text-center text-slate-400">
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
