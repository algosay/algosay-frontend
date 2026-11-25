import React, { useState, useMemo, useEffect } from 'react';

// Safely convert "₹1,234" / "1,234" / number to number
const toNum = (v) => {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  const n = parseFloat(String(v ?? '').replace(/[₹,\s]/g, ''));
  return isNaN(n) ? 0 : n;
};

// Net / Gross PnL based on the toggle
const getPnl = (trade, withTax) => {
  if (!trade) return 0;
  const keys = Object.keys(trade);
  const netKey = keys.find((k) => k === 'Net Real PnL' || k === 'Net PnL' || k === 'Net Real');
  const grossKey = keys.find((k) => k === 'Gross PnL (No Tax)' || k === 'Gross PnL');
  const key = withTax ? netKey || grossKey : grossKey || netKey;
  if (key) return toNum(trade[key]);

  const fallbackKey = keys.find((k) => k.includes('PnL') || k === 'Net Real');
  return fallbackKey ? toNum(trade[fallbackKey]) : 0;
};

// -₹1,200 / +₹1,200 / ₹0
const fmtMoney = (n, signed = false) => {
  const v = Math.round((n || 0) * 100) / 100;
  const sign = v < 0 ? '-' : signed && v > 0 ? '+' : '';
  return `${sign}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

const tone = (v) => (v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-500');

// Backend link fields (hidden from the table)
const HIDDEN_KEYS = ['Leg_ID', 'Chain_Seq', 'Parent_Trade_Num', 'Leg ID', 'Chain Seq', 'Parent Trade Num'];

const typeBadge = (t) => {
  if (t.includes('SL Re-entry')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (t.includes('Target Re-execute')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (t.includes('Target Re-entry')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const isPnlKey = (k) => k.includes('PnL') || k === 'Net Real';
const isNumericKey = (k) => isPnlKey(k) || k === 'Gap Value';

const selectCls =
  'h-8 bg-white text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-2.5 outline-none cursor-pointer hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors';

const Kpi = ({ label, value, valueClass = 'text-slate-800' }) => (
  <div className="flex-1 min-w-[140px] px-5 py-3.5">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-0.5 text-lg font-bold leading-tight ${valueClass}`}>{value}</div>
  </div>
);

const ExecutionLedger = ({ result, onFilterChange, withTax = false }) => {
  const [showLogs, setShowLogs] = useState(false);

  const [filterDirection, setFilterDirection] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [filterDTE, setFilterDTE] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [filterSegment, setFilterSegment] = useState('All');

  const pnlModeLabel = withTax ? 'Net' : 'Gross';

  const orderedKeys = useMemo(() => {
    const keys = Object.keys(result?.Trade_Ledger?.[0] || {});

    const tradeNumKey = keys.find((k) => k === 'Trade_Num' || k === 'Trade Num');
    const tradeTypeKey = keys.find((k) => k === 'Trade_Type' || k === 'Trade Type');
    const dateKey = keys.find((k) => k.toLowerCase() === 'date');
    const entryTimeKey = keys.find((k) => k === 'Entry Time' || k === 'Entry_Time');
    const tickerKey = keys.find((k) => k.toLowerCase() === 'ticker' || k === 'Symbol');

    const frontKeys = [];
    if (tradeNumKey) frontKeys.push(tradeNumKey);
    if (tradeTypeKey) frontKeys.push(tradeTypeKey);
    if (dateKey) frontKeys.push(dateKey);
    else if (entryTimeKey) frontKeys.push(entryTimeKey);

    const otherKeys = keys.filter(
      (k) =>
        !frontKeys.includes(k) &&
        k !== tickerKey &&
        !HIDDEN_KEYS.includes(k) &&
        !k.toUpperCase().includes('MFE') &&
        !k.toUpperCase().includes('MAE')
    );

    const entryIndex = otherKeys.findIndex((k) => k === entryTimeKey);
    if (tickerKey) {
      if (entryIndex !== -1) otherKeys.splice(entryIndex, 0, tickerKey);
      else otherKeys.unshift(tickerKey);
    }

    return [...frontKeys, ...otherKeys];
  }, [result?.Trade_Ledger]);

  const filteredLedger = useMemo(() => {
    const ledgerData = result?.Trade_Ledger || [];
    return ledgerData.filter((trade) => {
      const matchDirection =
        filterDirection === 'All' ||
        (trade.Direction && String(trade.Direction).toUpperCase().includes(String(filterDirection).toUpperCase()));
      const matchDay = filterDay === 'All' || trade.Day === filterDay;
      const matchDTE = filterDTE === 'All' || String(trade.DTE) === String(filterDTE);
      const matchResult = filterResult === 'All' || trade.Result === filterResult;
      const matchSegment = filterSegment === 'All' || trade.Segment === filterSegment;
      return matchDirection && matchDay && matchDTE && matchResult && matchSegment;
    });
  }, [result?.Trade_Ledger, filterDirection, filterDay, filterDTE, filterResult, filterSegment]);

  // Re-entry / Re-execute rows attach to their parent trade.
  // Priority: Leg_ID -> Parent_Trade_Num -> Ticker + Entry Price + Date (old saved backtests)
  const groupedLedger = useMemo(() => {
    const groupedList = [];
    const byLeg = {};

    const tickerOf = (t) => t.Symbol || t.symbol || t.Ticker || t.ticker;
    const priceOf = (t) => toNum(t.Entry_Price ?? t['Entry Price']).toFixed(2);
    const numOf = (t) => String(t.Trade_Num ?? t['Trade Num'] ?? '');

    filteredLedger.forEach((trade) => {
      const tradeType = String(trade.Trade_Type || trade['Trade Type'] || '').toLowerCase();
      const isReentry =
        tradeType.includes('re-entry') || tradeType.includes('re-execute') || tradeType.includes('reentry');
      const pnlValue = getPnl(trade, withTax);
      const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';
      const legId = trade.Leg_ID ?? trade['Leg ID'];
      const parentNum = trade.Parent_Trade_Num ?? trade['Parent Trade Num'];

      if (isReentry) {
        let parent = null;

        if (legId && byLeg[legId]) {
          parent = byLeg[legId];
        } else if (parentNum !== null && parentNum !== undefined && parentNum !== '') {
          parent = groupedList.find((g) => numOf(g.firstTrade) === String(parentNum)) || null;
        } else if (!legId) {
          for (let i = groupedList.length - 1; i >= 0; i--) {
            const g = groupedList[i];
            if (
              g.dateStr === dateStr &&
              tickerOf(g.firstTrade) === tickerOf(trade) &&
              priceOf(g.firstTrade) === priceOf(trade)
            ) {
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

      const group = { firstTrade: trade, reentries: [], totalPnl: pnlValue, totalTrades: 1, dateStr };
      groupedList.push(group);
      if (legId && !byLeg[legId]) byLeg[legId] = group;
    });

    return groupedList;
  }, [filteredLedger, withTax]);

  const dailyPnLs = useMemo(() => {
    const totals = {};
    filteredLedger.forEach((trade) => {
      const dateStr = trade.Date || trade.date || trade.Day || 'Unknown Date';
      totals[dateStr] = (totals[dateStr] || 0) + getPnl(trade, withTax);
    });
    return totals;
  }, [filteredLedger, withTax]);

  const dateRowCounts = useMemo(() => {
    const counts = {};
    groupedLedger.forEach((group) => {
      counts[group.dateStr] = (counts[group.dateStr] || 0) + 1;
    });
    return counts;
  }, [groupedLedger]);

  const hasAnyReentries = useMemo(() => groupedLedger.some((g) => g.reentries.length > 0), [groupedLedger]);

  const kpis = useMemo(() => {
    const pnls = filteredLedger.map((t) => getPnl(t, withTax));
    const total = pnls.reduce((a, b) => a + b, 0);
    const wins = pnls.filter((p) => p > 0).length;
    return { count: pnls.length, total, winRate: pnls.length ? (wins / pnls.length) * 100 : 0 };
  }, [filteredLedger, withTax]);

  useEffect(() => {
    if (onFilterChange) onFilterChange(filteredLedger);
  }, [filteredLedger, onFilterChange]);

  if (!result || !result.Trade_Ledger || result.Trade_Ledger.length === 0) return null;

  const uniqueDays = [...new Set(result.Trade_Ledger.map((t) => t.Day).filter(Boolean))];
  const uniqueSegments = [...new Set(result.Trade_Ledger.map((t) => t.Segment).filter(Boolean))];
  const uniqueDTEs = [
    ...new Set(result.Trade_Ledger.map((t) => t.DTE).filter((val) => val !== undefined && val !== null && val !== ''))
  ].sort((a, b) => {
    if (a === 'N/A') return 1;
    if (b === 'N/A') return -1;
    return a - b;
  });

  const activeFilters = [filterSegment, filterDirection, filterDay, filterDTE, filterResult].filter(
    (f) => f !== 'All'
  ).length;

  const totalColumnsCount = orderedKeys.length + (hasAnyReentries ? 2 : 0) + 1;
  const thBase = 'px-3.5 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap';
  const tdBase = 'px-3.5 py-3 whitespace-nowrap text-[13px]';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(15,27,45,0.06)]">
      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#0F1B2D]">Execution ledger</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredLedger.length} executions · {pnlModeLabel} P&amp;L
          </p>
        </div>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="text-xs bg-[#0F1B2D] hover:bg-[#1c2d47] text-white px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer"
        >
          {showLogs ? 'Hide ledger' : 'View ledger'}
        </button>
      </div>

      {/* KPI strip */}
      <div className="flex flex-wrap border-t border-slate-200 bg-slate-50/60 divide-x divide-slate-200">
        <Kpi label="Trades" value={kpis.count.toLocaleString('en-IN')} />
        <Kpi label="Win rate" value={`${kpis.winRate.toFixed(1)}%`} />
        <Kpi label={`Total P&L (${pnlModeLabel})`} value={fmtMoney(kpis.total, true)} valueClass={tone(kpis.total)} />
      </div>

      {showLogs && (
        <div className="flex flex-col border-t border-slate-200">
          {/* Filters */}
          <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap gap-2.5 items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Filters</span>

            {uniqueSegments.length > 0 && (
              <select className={selectCls} value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)}>
                <option value="All">All segments</option>
                {uniqueSegments.map((seg) => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
            )}

            <select className={selectCls} value={filterDirection} onChange={(e) => setFilterDirection(e.target.value)}>
              <option value="All">All directions</option>
              <option value="LONG">Long (Buy)</option>
              <option value="SHORT">Short (Sell)</option>
            </select>

            <select className={selectCls} value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
              <option value="All">All days</option>
              {uniqueDays.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            {uniqueDTEs.length > 0 && (
              <select className={selectCls} value={filterDTE} onChange={(e) => setFilterDTE(e.target.value)}>
                <option value="All">All DTE</option>
                {uniqueDTEs.map((dte) => (
                  <option key={dte} value={dte}>DTE: {dte}</option>
                ))}
              </select>
            )}

            <select className={selectCls} value={filterResult} onChange={(e) => setFilterResult(e.target.value)}>
              <option value="All">All results</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
            </select>

            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setFilterSegment('All');
                  setFilterDirection('All');
                  setFilterDay('All');
                  setFilterDTE('All');
                  setFilterResult('All');
                }}
                className="ml-auto h-8 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                Clear filters ({activeFilters})
              </button>
            )}
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto max-h-[560px] overflow-y-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_#E2E8F0]">
                <tr>
                  {orderedKeys.map((header, idx) => (
                    <th
                      key={idx}
                      className={`${thBase} text-slate-500 ${isNumericKey(header) ? 'text-right' : ''}`}
                    >
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                  {hasAnyReentries && <th className={`${thBase} text-indigo-600`}>Re-entries</th>}
                  {hasAnyReentries && (
                    <th className={`${thBase} text-slate-500 text-right`}>Trade P&amp;L ({pnlModeLabel})</th>
                  )}
                  <th className={`${thBase} text-slate-500 text-center border-l border-slate-200`}>
                    Day P&amp;L ({pnlModeLabel})
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedLedger.length > 0 ? (
                  groupedLedger.map((group, idx) => {
                    const trade = group.firstTrade;
                    const currentTradeDate = group.dateStr;
                    const isFirstOfDate = idx === 0 || groupedLedger[idx - 1].dateStr !== currentTradeDate;
                    const dayTotal = dailyPnLs[currentTradeDate] || 0;

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          isFirstOfDate && idx !== 0 ? 'border-t-2 border-t-slate-200' : ''
                        }`}
                      >
                        {orderedKeys.map((key, i) => {
                          const val = trade[key];

                          if (key === 'Trade_Type' || key === 'Trade Type') {
                            const valStr = val ? String(val) : 'Initial Trade';
                            return (
                              <td key={i} className={tdBase}>
                                <span
                                  className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${typeBadge(valStr)}`}
                                >
                                  {valStr}
                                </span>
                              </td>
                            );
                          }

                          if (key === 'Direction') {
                            const valStr = val ? String(val) : '';
                            if (!valStr) return <td key={i} className={`${tdBase} text-slate-400`}>-</td>;
                            const isLong =
                              valStr.toLowerCase().includes('long') || valStr.toLowerCase().includes('buy');
                            return (
                              <td key={i} className={tdBase}>
                                <span
                                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                    isLong ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  {valStr}
                                </span>
                              </td>
                            );
                          }

                          if (key === 'Exit_Reason' || key === 'Reason') {
                            return (
                              <td key={i} className={tdBase}>
                                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {val || '-'}
                                </span>
                              </td>
                            );
                          }

                          if (key === 'Result') {
                            const cls =
                              val === 'Win'
                                ? 'bg-emerald-50 text-emerald-700'
                                : val === 'Loss'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-slate-100 text-slate-500';
                            return (
                              <td key={i} className={tdBase}>
                                <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
                                  {val || '-'}
                                </span>
                              </td>
                            );
                          }

                          if (key === 'Spot Change') {
                            const valStr = String(val || '');
                            const isPositive = valStr.includes('(+');
                            const isNegative = valStr.includes('(-') || (valStr.includes('(') && valStr.includes('-'));
                            return (
                              <td key={i} className={tdBase}>
                                <span
                                  className={`font-semibold ${
                                    isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-600'
                                  }`}
                                >
                                  {val !== undefined ? val : '-'}
                                </span>
                              </td>
                            );
                          }

                          if (isNumericKey(key)) {
                            const numVal = parseFloat(String(val ?? '').replace(/[₹,\s]/g, ''));
                            if (isNaN(numVal)) {
                              return (
                                <td key={i} className={`${tdBase} text-right text-slate-500`}>
                                  {val !== undefined && val !== null && val !== '' ? val : '-'}
                                </td>
                              );
                            }
                            return (
                              <td key={i} className={`${tdBase} text-right`}>
                                <span className={`font-semibold tabular-nums ${tone(numVal)}`}>
                                  {isPnlKey(key)
                                    ? fmtMoney(numVal)
                                    : numVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td key={i} className={`${tdBase} text-slate-700`}>
                              {val !== undefined && val !== null && val !== '' ? val : '-'}
                            </td>
                          );
                        })}

                        {/* Re-entries */}
                        {hasAnyReentries && (
                          <td className={tdBase}>
                            {group.reentries.length > 0 ? (
                              <div className="flex flex-col gap-1.5">
                                {group.reentries.map((re, rIdx) => {
                                  const rType = re.Trade_Type || re['Trade Type'] || 'Re-entry';
                                  const rReason = re.Exit_Reason || re.Reason || 'Exit';
                                  const formatPrice = (v) =>
                                    !isNaN(parseFloat(v)) ? parseFloat(v).toFixed(2) : v || '-';
                                  const rEntryPrice = formatPrice(re.Entry_Price || re['Entry Price']);
                                  const rExitPrice = formatPrice(re.Exit_Price || re['Exit Price']);
                                  const rPnl = getPnl(re, withTax);

                                  return (
                                    <div key={rIdx} className="flex items-center gap-2">
                                      <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold min-w-[34px] text-center ${typeBadge(rType)}`}
                                      >
                                        {rType.replace('Re-entry', 'RE').replace('Re-execute', 'RX')}
                                      </span>
                                      <span className="text-[11px] text-slate-500">
                                        {re.Entry_Time || re['Entry Time']} ➔ {re.Exit_Time || re['Exit Time']}
                                      </span>
                                      <span className="text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 tabular-nums">
                                        ₹{rEntryPrice} ➔ ₹{rExitPrice}
                                      </span>
                                      <span className="text-[10px] font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                        {rReason}
                                      </span>
                                      <span className={`text-[11px] font-semibold tabular-nums ${tone(rPnl)}`}>
                                        {fmtMoney(rPnl, true)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">No re-entries</span>
                            )}
                          </td>
                        )}

                        {/* Combined trade PnL */}
                        {hasAnyReentries && (
                          <td className={`${tdBase} text-right`}>
                            <span className={`text-sm font-bold tabular-nums ${tone(group.totalPnl)}`}>
                              {fmtMoney(group.totalPnl)}
                            </span>
                            {group.totalTrades > 1 && (
                              <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                                {group.totalTrades} trades
                              </span>
                            )}
                          </td>
                        )}

                        {/* Day PnL card (once per date) */}
                        {isFirstOfDate && (
                          <td
                            rowSpan={dateRowCounts[currentTradeDate]}
                            className="px-3 py-2.5 whitespace-nowrap align-middle border-l border-slate-200 bg-slate-50/70"
                          >
                            <div
                              className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${
                                dayTotal >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                              }`}
                            >
                              <span className="text-[11px] font-medium text-slate-500">{currentTradeDate}</span>
                              <span className={`mt-0.5 text-base font-bold tabular-nums ${tone(dayTotal)}`}>
                                {fmtMoney(dayTotal, true)}
                              </span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                                {pnlModeLabel}
                              </span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={totalColumnsCount} className="p-10 text-center text-sm text-slate-400">
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