import React, { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EquityCurveChart from './EquityCurveChart';
import DrawdownChart from './DrawdownChart';
import PerformanceStats from './PerformanceStats';
import TaxBreakdown from './TaxBreakdown';
import DailyHeatmap from './DailyHeatmap';
import MonthlyAnalytics from './MonthlyAnalytics';
import ExecutionLedger from './ExecutionLedger';
import DayWiseBreakup from './DayWiseBreakup';
import ErrorBoundary from './ErrorBoundary';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// ---------- Null-safe ledger accessor (fixes "Cannot read properties of null (reading 'Trade_Ledger')") ----------
const getSafeLedger = (r) => {
  const l = r?.Trade_Ledger || r?.ledger || [];
  return Array.isArray(l) ? l : [];
};

// ---------- Negative value detection (loss -> red) ----------
// Matches: -1,234 | -₹1,234 | ₹-1,234 | −5.2% | (1,234) | (-5%)
const NEG_RE = /^\(?\s*(?:[₹$]\s*)?[-−–]\s*(?:[₹$]\s*)?\d/;
const PAREN_RE = /^\(\s*(?:[₹$]\s*)?\d[\d,]*\.?\d*\s*\)\s*%?$/;
const SKIP_TAGS = new Set(['STYLE', 'SCRIPT', 'TEXTAREA', 'INPUT']);

const isNegativeText = (raw) => {
  const t = (raw || '').trim();
  if (!t) return false;
  if (!(NEG_RE.test(t) || PAREN_RE.test(t))) return false;
  const m = t.match(/\d[\d,]*\.?\d*/);
  if (!m) return false;
  return parseFloat(m[0].replace(/,/g, '')) !== 0; // -0.00 is not a loss
};

// ---------- Loss metrics -> always red (even if the value is positive) ----------
const LOSS_LABELS = [
  /^(average|avg\.?) loss (on|in|per) losing/,
  /^loss ?(%|rate) ?\((periods?|days?|trades?|weeks?|months?)\)/,
  /^(max(imum)?\.? )?duration of max(imum)?\.? (drawdown|dd)/,
  /^max(imum)?\.? (losing|loss) streak/
];

// true -> label text also red; false -> only the value is red
const PAINT_LABEL = true;

// Looks like a value: "12", "45.5%", "-₹1,234", "8 periods"
const VALUE_RE = /^[-−–+₹$()\s\d.,%]*\d[-−–+₹$()\s\d.,%]*(periods?|days?|trades?|weeks?|months?)?\)?$/i;

const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

const isLossLabel = (text) => {
  const t = normalize(text);
  return t.length <= 70 && LOSS_LABELS.some((re) => re.test(t));
};

const findValueElement = (labelEl, root) => {
  let el = labelEl;
  // climb up to 3 levels, checking the neighbouring elements for the value
  for (let i = 0; i < 3 && el && el !== root; i += 1) {
    const siblings = [el.nextElementSibling, el.previousElementSibling];
    const match = siblings.find((s) => s && VALUE_RE.test(normalize(s.textContent)));
    if (match) return match;
    el = el.parentElement;
  }
  return null;
};

const paintLossMetric = (labelEl, root) => {
  const valueEl = findValueElement(labelEl, root);
  if (valueEl) valueEl.classList.add('loss-red');
  if (PAINT_LABEL) labelEl.classList.add('loss-red');
};

const paintNegatives = (root) => {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest('[data-no-neg]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent === root) continue;
    const text = node.nodeValue;
    if (!text || !text.trim()) continue;

    // Loss metric labels (textContent handles JSX-split text like "Loss % ({unit})")
    if (isLossLabel(parent.textContent)) {
      paintLossMetric(parent, root);
    }

    if (isNegativeText(text)) {
      parent.classList.add('neg-red');
    } else if (parent.classList.contains('neg-red') && !isNegativeText(parent.textContent)) {
      // value changed from negative to positive/other -> remove stale red
      parent.classList.remove('neg-red');
    }
  }
};

// =====================================================================
// AI helpers: build analysis context (PnL / day / DTE / month)
// =====================================================================
const toNum = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(String(v).replace(/[₹$,\s%]/g, '').replace(/[−–]/g, '-'));
  return Number.isNaN(n) ? null : n;
};

const cleanKey = (k) => String(k).toLowerCase().replace(/[^a-z]/g, '');

const findKey = (row, exact = [], includes = []) => {
  const keys = Object.keys(row || {});
  return (
    keys.find((k) => exact.includes(cleanKey(k))) ||
    keys.find((k) => includes.some((inc) => cleanKey(k).includes(inc)))
  );
};

const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const fmt = (n, d = 2) => (n === null || n === undefined ? 'n/a' : Number(n).toFixed(d));

// ---------- Always turn the backend AI response into a plain string (prevents render crashes) ----------
const normalizeAdvice = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(normalizeAdvice).filter(Boolean).join('\n');
  if (typeof v === 'object') {
    const inner = v.advice ?? v.text ?? v.content ?? v.message;
    if (inner !== undefined && inner !== v) return normalizeAdvice(inner);
    try {
      return JSON.stringify(v, null, 2);
    } catch (e) {
      return String(v);
    }
  }
  return String(v);
};

const buildAnalysisContext = (ledger = [], dayMtm = {}) => {
  if (!Array.isArray(ledger) || !ledger.length) return null;
  const sample = ledger[0];

  const pnlKey = findKey(sample, ['netpnl', 'pnl', 'grosspnl', 'profit', 'pl', 'pnlnet'], ['pnl']);
  const dayKey = findKey(sample, ['day'], []);
  const dteKey = findKey(sample, ['dte'], []);
  const dateKey = findKey(sample, ['date', 'entrydate', 'tradedate'], ['date']);

  const rows = ledger.map((r) => ({
    pnl: pnlKey ? toNum(r?.[pnlKey]) : null,
    day: dayKey ? r?.[dayKey] : null,
    dte: dteKey ? r?.[dteKey] : null,
    date: dateKey && r?.[dateKey] ? String(r[dateKey]) : null
  }));

  const pnls = rows.map((r) => r.pnl).filter((v) => v !== null);
  const wins = pnls.filter((v) => v > 0);
  const losses = pnls.filter((v) => v < 0);

  const groupBy = (keyFn) => {
    const g = {};
    rows.forEach((r) => {
      const k = keyFn(r);
      if (k === null || k === undefined || r.pnl === null) return;
      if (!g[k]) g[k] = [];
      g[k].push(r.pnl);
    });
    return Object.entries(g).map(([k, v]) => ({
      group: k,
      trades: v.length,
      total_pnl: Math.round(sum(v)),
      win_rate: Math.round((v.filter((x) => x > 0).length / v.length) * 100)
    }));
  };

  const byMonth = groupBy((r) => (r.date && r.date.length >= 7 ? r.date.slice(0, 7) : null));

  return {
    detected_columns: { pnl: pnlKey || null },
    total_trades: ledger.length,
    total_pnl: Math.round(sum(pnls)),
    win_rate_pct: pnls.length ? Math.round((wins.length / pnls.length) * 100) : null,
    avg_win: wins.length ? Math.round(avg(wins)) : null,
    avg_loss: losses.length ? Math.round(avg(losses)) : null,
    largest_win: wins.length ? Math.round(Math.max(...wins)) : null,
    largest_loss: losses.length ? Math.round(Math.min(...losses)) : null,
    by_day: groupBy((r) => r.day),
    by_dte: groupBy((r) => r.dte),
    by_month: byMonth,
    has_minute_mtm: !!dayMtm && Object.keys(dayMtm).length > 0
  };
};

const contextToText = (ctx) => {
  if (!ctx) return '';
  const lines = [
    `Trades: ${ctx.total_trades}, Total PnL: ${ctx.total_pnl}, Win rate: ${fmt(ctx.win_rate_pct, 0)}%`,
    `Avg win: ${fmt(ctx.avg_win, 0)}, Avg loss: ${fmt(ctx.avg_loss, 0)}, Largest win: ${fmt(ctx.largest_win, 0)}, Largest loss: ${fmt(ctx.largest_loss, 0)}`
  ];
  if (ctx.by_day.length) lines.push(`By day: ${JSON.stringify(ctx.by_day)}`);
  if (ctx.by_dte.length) lines.push(`By DTE: ${JSON.stringify(ctx.by_dte)}`);
  if (ctx.by_month.length) lines.push(`By month: ${JSON.stringify(ctx.by_month)}`);
  return lines.join('\n');
};

const DEFAULT_QUERY =
  'Give a complete, deep backtest diagnosis. Cover: edge & consistency, best/worst weekdays and DTE, drawdown & risk of ruin, monthly behaviour, win/loss distribution, and a prioritised list of concrete improvements.';

const QUICK_PROMPTS = [
  { label: 'Full diagnosis', q: DEFAULT_QUERY },
  { label: 'Best days & DTE', q: 'Which weekdays and DTE should I trade or avoid? Show the evidence.' },
  { label: 'Drawdown & risk', q: 'Analyse drawdown, losing streaks and give position sizing / risk advice.' },
  { label: 'Monthly behaviour', q: 'How does the strategy behave month to month? Point out weak periods and what to change.' }
];

// ---------- Lightweight markdown renderer for AI text ----------
const renderInline = (text, keyPrefix) => {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`} className="ai-strong">{p.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{p}</React.Fragment>
    )
  );
};

const AdviceRenderer = ({ text }) => {
  const blocks = [];
  const lines = String(text || '').split('\n');
  let list = null;

  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) {
      flushList();
      return;
    }
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    const boldOnly = line.match(/^\*\*([^*]+)\*\*:?$/);
    const numHeading = line.match(/^(\d+)[.)]\s+\*\*([^*]+)\*\*:?\s*(.*)$/);
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);

    if (heading || boldOnly) {
      flushList();
      blocks.push({ type: 'h', text: (heading ? heading[1] : boldOnly[1]).replace(/\*\*/g, ''), key: idx });
    } else if (numHeading && !numHeading[3]) {
      flushList();
      blocks.push({ type: 'h', text: `${numHeading[1]}. ${numHeading[2]}`, key: idx });
    } else if (bullet || numbered) {
      if (!list) list = { type: 'ul', items: [], key: idx };
      list.items.push((bullet ? bullet[1] : numbered[2]));
    } else {
      flushList();
      blocks.push({ type: 'p', text: line, key: idx });
    }
  });
  flushList();

  return (
    <div className="ai-prose">
      {blocks.map((b) => {
        if (b.type === 'h') return <h4 key={b.key} className="ai-h">{b.text}</h4>;
        if (b.type === 'ul')
          return (
            <ul key={b.key} className="ai-ul">
              {b.items.map((it, i) => (
                <li key={`${b.key}-${i}`}>{renderInline(it, `${b.key}-${i}`)}</li>
              ))}
            </ul>
          );
        return <p key={b.key} className="ai-p">{renderInline(b.text, b.key)}</p>;
      })}
    </div>
  );
};

// ---------- Small icons ----------
const SparkIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
    <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

// [ui_core patch v1] send only the minute series to the backend (small request); keep the chart curve out of the AI prompt
const leanDayMtm = (m) => {
  const out = {};
  if (!m || typeof m !== 'object') return out;
  Object.keys(m).forEach((k) => {
    if (m[k] && Array.isArray(m[k].series)) out[k] = { series: m[k].series };
  });
  return out;
};
const withoutCurve = (s) => {
  if (!s || typeof s !== 'object' || !s.MTM_Curve) return s;
  const rest = { ...s };
  delete rest.MTM_Curve;
  return rest;
};

const ResultsDashboard = ({ result, withTax, setWithTax }) => {
  const [aiAdvice, setAiAdvice] = useState(normalizeAdvice(result?.ai_advice) || null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const [isDownloadingMtm, setIsDownloadingMtm] = useState(false);
  const [isDownloadingProPDF, setIsDownloadingProPDF] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filtered ledger data coming from ExecutionLedger
  const [filteredLedgerData, setFilteredLedgerData] = useState(null);

  // AI language & custom prompt
  const [aiLanguage, setAiLanguage] = useState('English');
  const [customPrompt, setCustomPrompt] = useState('');

  const dashboardRef = useRef(null);

  const originalLedger = useMemo(() => getSafeLedger(result), [result]);

  const availableDTEs = useMemo(() => {
    return [...new Set(originalLedger.map((row) => row?.DTE))].sort((a, b) => a - b);
  }, [originalLedger]);

  const hasData = !!result && originalLedger.length > 0;

  const [selectedDays, setSelectedDays] = useState(allDays);

  const [selectedDTEs, setSelectedDTEs] = useState(() => {
    const ledger = getSafeLedger(result);
    return [...new Set(ledger.map((row) => row?.DTE))].sort((a, b) => a - b);
  });

  const [displayResult, setDisplayResult] = useState(result);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const activeResult = displayResult || result;

  // Reset filters when a new backtest result is loaded
  useEffect(() => {
    setSelectedDays(allDays);
    const initialDTEs = [...new Set(getSafeLedger(result).map((r) => r?.DTE))].sort((a, b) => a - b);
    setSelectedDTEs(initialDTEs);
    setDisplayResult(result);
    setAiAdvice(normalizeAdvice(result?.ai_advice) || null);
    setFilteredLedgerData(null);
  }, [result]);

  // Auto-recalculation when filters change
  useEffect(() => {
    const filterAndRecalculate = async () => {
      if (!result) return;

      if (availableDTEs.length > 0 && selectedDTEs.length === 0) {
        return;
      }

      // All filters selected -> show original result
      if (selectedDays.length === allDays.length && selectedDTEs.length === availableDTEs.length) {
        setDisplayResult(result);
        return;
      }

      setIsRecalculating(true);

      const filteredLedger = originalLedger.filter(
        (row) => selectedDays.includes(row?.Day) && selectedDTEs.includes(row?.DTE)
      );

      if (filteredLedger.length === 0) {
        setDisplayResult({
          ...result,
          Strategy_Stats: {},
          Trade_Ledger: [],
          Equity_Curve: [],
          Heatmap_Data: []
        });
        setIsRecalculating(false);
        return;
      }

      try {
        const startingCapital = result.Estimated_Margin || result.Starting_Capital || result.estimated_margin || 100000;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recalculate_metrics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trade_ledger: filteredLedger, starting_capital: startingCapital, day_mtm: leanDayMtm(result?.Day_MTM) })
        });

        const data = await response.json();

        if (data?.status === 'success') {
          setDisplayResult({
            ...result,
            Strategy_Stats: data.Strategy_Stats,
            Equity_Curve: data.Equity_Curve,
            Heatmap_Data: data.Heatmap_Data || [],
            Trade_Ledger: filteredLedger
          });
        }
      } catch (error) {
        console.error('Error recalculating metrics:', error);
      }
      setIsRecalculating(false);
    };

    filterAndRecalculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, selectedDTEs]);

  // Paint negative numbers and loss metrics red (tables, cards, charts, tooltips)
  useEffect(() => {
    const root = dashboardRef.current;
    if (!root) return undefined;

    let rafId = null;
    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => paintNegatives(root));
    };

    schedule();

    // Re-run whenever child components re-render / hover tooltips appear.
    // Only childList + characterData are observed (class changes are not),
    // so adding the red class can never trigger an infinite loop.
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hasData]);

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleDTEToggle = (dte) => {
    setSelectedDTEs((prev) =>
      prev.includes(dte) ? prev.filter((d) => d !== dte) : [...prev, dte]
    );
  };

  // 🚨 Null-safe: never throws even when result / activeResult is null
  const getLedgerData = () => filteredLedgerData || getSafeLedger(activeResult);

  // Context that the AI will see (follows the ledger the user is currently viewing)
  const analysisContext = useMemo(
    () => buildAnalysisContext(getLedgerData(), activeResult?.Day_MTM || {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredLedgerData, activeResult]
  );

  const fetchAIInsights = async () => {
    setIsLoadingAI(true);
    try {
      const ledger = getLedgerData();
      const userQuery = customPrompt.trim() || DEFAULT_QUERY;
      const ctxText = contextToText(analysisContext);

      const payload = {
        metrics: withoutCurve(activeResult?.Strategy_Stats || activeResult?.metrics),
        ledger,
        day_mtm: activeResult?.Day_MTM || {},
        analysis_context: analysisContext,
        target_language: aiLanguage,
        custom_user_query: ctxText
          ? `${userQuery}\n\n[Pre-computed analysis context - use the day-wise, DTE-wise and monthly data below]\n${ctxText}`
          : userQuery
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get_strategy_insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      const text = normalizeAdvice(data?.advice ?? data?.detail ?? data?.error);
      setAiAdvice(text || 'AI returned an empty response. Please try again.');
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiAdvice('Failed to fetch AI insights. Please check your backend connection and try again.');
    }
    setIsLoadingAI(false);
  };

  const copyAdvice = async () => {
    try {
      await navigator.clipboard.writeText(aiAdvice || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const ledgerData = getLedgerData();

    if (!ledgerData || ledgerData.length === 0) {
      alert('No trade data available to download.');
      return;
    }

    const headers = Object.keys(ledgerData[0]).join(',');
    const rows = ledgerData.map((row) =>
      Object.values(row).map((val) => `"${val !== null && val !== undefined ? val : ''}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, 'Trade_Ledger_Filtered.csv');
  };

  // Excel report (Summary / All Trades / By Leg)
  const downloadExcel = async () => {
    const ledgerData = getLedgerData();

    if (!ledgerData || ledgerData.length === 0) {
      alert('No trade data available to download.');
      return;
    }

    setIsDownloadingExcel(true);
    try {
      const base = process.env.REACT_APP_API_URL;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade_ledger: ledgerData,
          style: 'pro',
          day_mtm: activeResult?.Day_MTM || {},
          meta: {
            // [report_fix v2] timeframe + SL/Target settings from the saved run
            ...(activeResult?.Strategy_Meta || {}),
            capital: activeResult?.Estimated_Margin || activeResult?.Starting_Capital || null,
            timeframe: activeResult?.timeframe || activeResult?.Strategy_Meta?.timeframe || ''
          }
        })
      };

      let response = await fetch(`${base}/generate_report`, options);
      if (response.status === 404) {
        response = await fetch(`${base}/api/generate_report`, options);
      }
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const blob = await response.blob();
      triggerDownload(blob, 'Backtest_Report.xlsx');
    } catch (error) {
      console.error('Error generating Excel report:', error);
      alert('Failed to generate Excel report. Please try again.');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  // Daily MTM report
  const downloadMtmExcel = async () => {
    const ledgerData = getLedgerData();

    if (!ledgerData || ledgerData.length === 0) {
      alert('No trade data available to download.');
      return;
    }

    const hasMinuteMtm = activeResult?.Day_MTM && Object.keys(activeResult.Day_MTM).length > 0;
    if (!hasMinuteMtm && !window.confirm('This backtest has no minute-by-minute MTM data, so the report will use closed trades only (less accurate). Download anyway?')) {
      return;
    }

    setIsDownloadingMtm(true);
    try {
      const base = process.env.REACT_APP_API_URL;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade_ledger: ledgerData, day_mtm: activeResult?.Day_MTM || {} })
      };

      let response = await fetch(`${base}/generate_mtm_report`, options);
      if (response.status === 404) {
        response = await fetch(`${base}/api/generate_mtm_report`, options);
      }
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const blob = await response.blob();
      triggerDownload(blob, 'Daily_MTM_Report.xlsx');
    } catch (error) {
      console.error('Error generating Daily MTM report:', error);
      alert('Failed to generate Daily MTM report. Please try again.');
    } finally {
      setIsDownloadingMtm(false);
    }
  };

  // Pro PDF tearsheet (falls back to screenshot PDF if backend fails)
  const downloadProPDF = async () => {
    const ledgerData = getLedgerData();

    if (!ledgerData || ledgerData.length === 0) {
      alert('No trade data available to download.');
      return;
    }

    setIsDownloadingProPDF(true);
    try {
      const base = process.env.REACT_APP_API_URL;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade_ledger: ledgerData,
          ai_advice: aiAdvice || '',
          day_mtm: activeResult?.Day_MTM || {},
          meta: {
            ...(activeResult?.Strategy_Meta || {}),
            capital: activeResult?.Estimated_Margin || activeResult?.estimated_margin || activeResult?.Starting_Capital || null,
            timeframe: activeResult?.timeframe || activeResult?.Strategy_Meta?.timeframe || ''
          }
        })
      };

      let response = await fetch(`${base}/generate_pdf`, options);
      if (response.status === 404) {
        response = await fetch(`${base}/api/generate_pdf`, options);
      }
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const blob = await response.blob();
      triggerDownload(blob, 'Backtest_Report.pdf');
    } catch (error) {
      console.error('Pro PDF failed, falling back to screenshot PDF:', error);
      setIsDownloadingProPDF(false);
      await downloadPDF();
      return;
    }
    setIsDownloadingProPDF(false);
  };

  const downloadPDF = async () => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const element = dashboardRef.current;
    if (!element) {
      setIsExporting(false);
      return;
    }

    // html2canvas crashes on a gradient inside a zero-size element (non-finite colour stop): skip such stops
    const originalAddColorStop = CanvasGradient.prototype.addColorStop;
    CanvasGradient.prototype.addColorStop = function addColorStop(offset, color) {
      if (Number.isFinite(offset)) originalAddColorStop.call(this, offset, color);
    };

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#F4F5F7',
        useCORS: true,
        windowHeight: element.scrollHeight,
        windowWidth: element.scrollWidth,
        width: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('AI_Strategy_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      CanvasGradient.prototype.addColorStop = originalAddColorStop;
      setIsExporting(false);
    }
  };

  // No result / zero trades -> render nothing (hooks above always run safely now)
  if (!hasData || !activeResult) {
    return null;
  }

  const btnBase = 'flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer';

  const ctxChips = [
    { label: 'Trades', value: analysisContext?.total_trades ?? 0, on: true },
    { label: 'Win / Loss stats', value: analysisContext?.win_rate_pct !== null && analysisContext?.win_rate_pct !== undefined ? 'Included' : 'n/a', on: analysisContext?.win_rate_pct !== null && analysisContext?.win_rate_pct !== undefined },
    { label: 'Day-wise', value: analysisContext?.by_day?.length ? 'Included' : 'n/a', on: !!analysisContext?.by_day?.length },
    { label: 'DTE', value: analysisContext?.by_dte?.length ? 'Included' : 'n/a', on: !!analysisContext?.by_dte?.length },
    { label: 'Monthly', value: analysisContext?.by_month?.length ? 'Included' : 'n/a', on: !!analysisContext?.by_month?.length },
    { label: 'Minute MTM', value: analysisContext?.has_minute_mtm ? 'Included' : 'n/a', on: !!analysisContext?.has_minute_mtm }
  ];

  return (
    <div
      className={`rd-root w-full animate-fade-in pb-16 ${isExporting ? 'pdf-export-mode' : ''}`}
      ref={dashboardRef}
    >
      {/* Global typography + negative (loss) red styling + AI card styling */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .rd-root,
          .rd-root * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }

          .rd-root .font-mono,
          .rd-root code,
          .rd-root pre,
          .rd-root kbd,
          .rd-root samp {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          }

          .rd-root {
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1, 'cv11' 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          .rd-root svg text,
          .rd-root .recharts-text,
          .rd-root .recharts-tooltip-wrapper,
          .rd-root .recharts-legend-wrapper {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
            font-variant-numeric: tabular-nums lining-nums;
          }

          .rd-root table td,
          .rd-root table th {
            font-variant-numeric: tabular-nums lining-nums;
          }

          /* =====================================================
             PROFESSIONAL TYPE SCALE (caps oversized numbers/text
             in every child component)
             ===================================================== */
          .rd-root .text-6xl,
          .rd-root .text-5xl,
          .rd-root .text-4xl,
          .rd-root .text-3xl,
          .rd-root [class*="text-[2"],
          .rd-root [class*="text-[3"],
          .rd-root [class*="text-[4"] {
            font-size: 18px !important;
            line-height: 1.25 !important;
            letter-spacing: -0.01em;
          }
          .rd-root .text-2xl { font-size: 16px !important; line-height: 1.3 !important; }
          .rd-root .text-xl  { font-size: 15px !important; line-height: 1.35 !important; }
          .rd-root .text-lg  { font-size: 14px !important; line-height: 1.4 !important; }

          /* Generic data tables (compact tables like el-table / dw-table / ma-table set their own scoped sizes) */
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) td,
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) td * {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) th,
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) th * {
            font-size: 10px !important;
            line-height: 1.3 !important;
            letter-spacing: 0.05em;
          }
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) td { padding-top: 6px !important; padding-bottom: 6px !important; }
          .rd-root table:not(.el-table):not(.dw-table):not(.ma-table) th { padding-top: 7px !important; padding-bottom: 7px !important; }

          /* Loss / negative values -> always red */
          .rd-root .neg-red,
          .rd-root .loss-red,
          .rd-root .loss-red * {
            color: #DC2626 !important;
          }
          .rd-root svg .neg-red,
          .rd-root svg text.neg-red,
          .rd-root svg tspan.neg-red,
          .rd-root svg text .neg-red,
          .rd-root svg .loss-red {
            fill: #DC2626 !important;
            color: #DC2626 !important;
          }

          /* ================= AI Diagnostics (WHITE base, compact) ================= */
          .ai-card {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            box-shadow: 0 1px 3px rgba(15,27,45,0.06);
            color: #0F172A;
          }
          .ai-card::before {
            content: '';
            position: absolute; left: 0; right: 0; top: 0; height: 3px;
            background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
            pointer-events: none;
          }
          .ai-inner { position: relative; z-index: 1; }

          .ai-badge {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 2px 9px; border-radius: 999px;
            font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
            color: #4338CA;
            background: #EEF2FF;
            border: 1px solid #C7D2FE;
          }
          .ai-dot { width: 5px; height: 5px; border-radius: 50%; background: #10B981; animation: aiPulse 1.8s ease-in-out infinite; }
          @keyframes aiPulse { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:.4; transform:scale(.8);} }

          .ai-logo {
            width: 32px; height: 32px; border-radius: 9px;
            display: flex; align-items: center; justify-content: center;
            color: #fff;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
          }

          .ai-title {
            font-size: 14px; font-weight: 700; letter-spacing: -0.01em;
            color: #0F1B2D;
          }

          .ai-seg { display: inline-flex; padding: 2px; border-radius: 9px; background: #F1F5F9; border: 1px solid #E2E8F0; }
          .ai-seg button {
            padding: 4px 11px; font-size: 11px; font-weight: 600; border-radius: 7px; cursor: pointer;
            color: #64748B; border: 1px solid transparent; transition: all .2s ease; background: transparent;
          }
          .ai-seg button:hover { color: #0F172A; }
          .ai-seg button.active {
            color: #fff;
            background: #0F1B2D;
            box-shadow: 0 2px 6px rgba(15,27,45,0.25);
          }

          .ai-chip {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 3px 9px; border-radius: 999px; font-size: 10px; font-weight: 600;
            background: #F8FAFC; border: 1px solid #E2E8F0; color: #64748B;
          }
          .ai-chip.on { color: #047857; border-color: #A7F3D0; background: #ECFDF5; }
          .ai-chip .d { width: 5px; height: 5px; border-radius: 50%; background: #CBD5E1; }
          .ai-chip.on .d { background: #10B981; }
          .ai-chip b { color: #0F172A; font-weight: 700; }

          .ai-input-wrap {
            border-radius: 11px; padding: 1px;
            background: #E2E8F0;
            transition: background .2s ease;
          }
          .ai-input-wrap:focus-within {
            background: linear-gradient(135deg, #6366F1, #06B6D4);
          }
          .ai-input {
            border-radius: 10px; background: #F8FAFC; padding: 10px 12px 8px;
          }
          .ai-input textarea {
            width: 100%; background: transparent; color: #0F172A; font-size: 12.5px; line-height: 1.55;
            outline: none; resize: none; border: none;
          }
          .ai-input textarea::placeholder { color: #94A3B8; }

          .ai-quick {
            padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 600; cursor: pointer;
            color: #4338CA; background: #EEF2FF; border: 1px solid #C7D2FE;
            transition: all .2s ease;
          }
          .ai-quick:hover { background: #E0E7FF; color: #3730A3; }

          .ai-cta {
            position: relative; display: inline-flex; align-items: center; gap: 7px;
            padding: 6px 14px; border-radius: 9px; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer;
            background: #0F1B2D;
            box-shadow: 0 4px 12px -4px rgba(15,27,45,0.5);
            transition: background .2s ease, opacity .2s ease; border: none;
          }
          .ai-cta:hover:not(:disabled) { background: #1C2D47; }
          .ai-cta:disabled { opacity: .6; cursor: not-allowed; }

          .ai-result {
            border-radius: 11px; padding: 16px 18px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-left: 3px solid #6366F1;
          }
          .ai-prose { color: #334155; font-size: 12.5px; line-height: 1.7; }
          .ai-h {
            margin: 14px 0 6px; font-size: 12.5px; font-weight: 700; letter-spacing: .01em; color: #0F1B2D;
            display: flex; align-items: center; gap: 7px;
          }
          .ai-h::before {
            content: ''; width: 4px; height: 13px; border-radius: 3px;
            background: linear-gradient(180deg, #6366F1, #06B6D4);
          }
          .ai-h:first-child { margin-top: 0; }
          .ai-p { margin: 0 0 8px; }
          .ai-ul { margin: 0 0 10px; padding: 0; list-style: none; }
          .ai-ul li { position: relative; padding: 3px 0 3px 18px; }
          .ai-ul li::before {
            content: ''; position: absolute; left: 3px; top: 11px; width: 5px; height: 5px; border-radius: 50%;
            background: #6366F1;
          }
          .ai-strong { color: #0F172A; font-weight: 700; }

          .ai-empty {
            display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 11px;
            background: #F8FAFC; border: 1px dashed #CBD5E1;
            color: #64748B; font-size: 12px; line-height: 1.55;
          }

          .ai-skel { height: 10px; border-radius: 6px; margin-bottom: 10px;
            background: linear-gradient(90deg, #F1F5F9 25%, #E0E7FF 50%, #F1F5F9 75%);
            background-size: 200% 100%; animation: aiShimmer 1.4s linear infinite; }
          @keyframes aiShimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

          .ai-ghost {
            display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 8px; cursor: pointer;
            font-size: 10.5px; font-weight: 600; color: #475569; background: #fff;
            border: 1px solid #E2E8F0; transition: all .2s ease;
          }
          .ai-ghost:hover { color: #0F172A; border-color: #A5B4FC; }
        `}
      </style>

      {isExporting && (
        <style>
          {`
            .pdf-export-mode {
              width: max-content !important;
              min-width: 100%;
              padding: 20px !important;
              background: #F4F5F7 !important;
            }
            .pdf-export-mode table,
            .pdf-export-mode tbody,
            .pdf-export-mode tr,
            .pdf-export-mode td,
            .pdf-export-mode [class*="overflow"] {
              overflow: visible !important;
              max-height: max-content !important;
              height: auto !important;
            }
            .pdf-export-mode svg, .pdf-export-mode canvas {
              animation: none !important;
              transition: none !important;
            }
          `}
        </style>
      )}

      {isExporting && (
        <div className="mb-5 pb-3 border-b border-slate-200 text-center">
          <h1 className="text-xl font-semibold text-[#0F1B2D]">
            AlgoSay · Strategy pro report
          </h1>
          <p className="text-slate-500 mt-1 text-xs">
            Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      )}

      {/* Downloads */}
      <div className="flex flex-wrap justify-end gap-1.5 mb-2.5" data-html2canvas-ignore="true">
        <button
          onClick={downloadCSV}
          disabled={isExporting}
          className={`${btnBase} bg-white hover:bg-slate-50 border border-slate-300 text-slate-700`}
        >
          Trade book (CSV)
        </button>
        <button
          onClick={downloadExcel}
          disabled={isExporting || isDownloadingExcel}
          className={`${btnBase} bg-emerald-600 hover:bg-emerald-700 text-white`}
        >
          {isDownloadingExcel ? 'Building Excel...' : 'Excel report'}
        </button>
        <button
          onClick={downloadMtmExcel}
          disabled={isExporting || isDownloadingMtm}
          className={`${btnBase} bg-amber-600 hover:bg-amber-700 text-white`}
        >
          {isDownloadingMtm ? 'Building MTM...' : 'Daily MTM (Excel)'}
        </button>
        <button
          onClick={downloadProPDF}
          disabled={isExporting || isDownloadingProPDF}
          className={`${btnBase} bg-[#0F1B2D] hover:bg-[#1c2d47] text-white`}
        >
          {isExporting ? 'Generating PDF...' : (isDownloadingProPDF ? 'Building PDF...' : 'Pro report (PDF)')}
        </button>
      </div>

      {/* Filters */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl px-3.5 py-3 mb-3 shadow-[0_1px_2px_rgba(15,27,45,0.04)]" data-html2canvas-ignore="true">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#0F1B2D] font-semibold text-[13px]">Strategy filters</h3>
          {isRecalculating && (
            <span className="text-[11px] text-indigo-600 animate-pulse font-medium">Recalculating metrics...</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400 font-semibold mb-1.5 block">Day of week</span>
            <div className="flex flex-wrap gap-1">
              {allDays.map((day) => {
                const isActive = selectedDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer px-2.5 py-0.5 rounded-full transition-all border ${isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                  >
                    <input type="checkbox" checked={isActive} onChange={() => handleDayToggle(day)} className="hidden" />
                    {day.substring(0, 3)}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400 font-semibold mb-1.5 block">Days to expiry (DTE)</span>
            <div className="flex flex-wrap gap-1">
              {availableDTEs.length > 0 ? availableDTEs.map((dte) => {
                const isActive = selectedDTEs.includes(dte);
                return (
                  <label
                    key={dte}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer px-2.5 py-0.5 rounded-full transition-all border ${isActive ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                  >
                    <input type="checkbox" checked={isActive} onChange={() => handleDTEToggle(dte)} className="hidden" />
                    {dte} DTE
                  </label>
                );
              }) : (
                <span className="text-[11px] text-slate-400 italic">No DTE data available.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-3">
        <h2 className="text-[14px] font-semibold text-[#0F1B2D] tracking-tight">
          Performance metrics
        </h2>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded-lg" data-html2canvas-ignore="true">
          <span className="text-[10.5px] text-slate-500 font-medium">Brokerage & tax</span>
          <div
            onClick={() => setWithTax(!withTax)}
            className={`w-8 h-[18px] flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${withTax ? 'bg-[#0F1B2D]' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${withTax ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
          </div>
          <span className={`text-[10.5px] font-semibold tracking-wide ${withTax ? 'text-[#0F1B2D]' : 'text-slate-400'}`}>
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Recalculating dim overlay */}
      <div className={`transition-opacity duration-300 ${isRecalculating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <ErrorBoundary name="PerformanceStats">
          <PerformanceStats result={activeResult} withTax={withTax} />
        </ErrorBoundary>
        <ErrorBoundary name="TaxBreakdown">
          <TaxBreakdown result={activeResult} />
        </ErrorBoundary>

        <div className="space-y-3 mt-3">
          <ErrorBoundary name="EquityCurveChart">
            <EquityCurveChart result={activeResult} withTax={withTax} />
          </ErrorBoundary>

          <ErrorBoundary name="DrawdownChart">
            <DrawdownChart result={activeResult} withTax={withTax} />
          </ErrorBoundary>

          <ErrorBoundary name="DailyHeatmap">
            <DailyHeatmap result={activeResult} withTax={withTax} />
          </ErrorBoundary>

          <ErrorBoundary name="MonthlyAnalytics">
            <MonthlyAnalytics result={activeResult} withTax={withTax} />
          </ErrorBoundary>

          <ErrorBoundary name="DayWiseBreakup">
            <DayWiseBreakup
              ledger={getSafeLedger(activeResult)}
              mode={withTax ? 'NET' : 'GROSS'}
            />
          </ErrorBoundary>

          <ErrorBoundary name="ExecutionLedger">
            <ExecutionLedger
              result={activeResult}
              withTax={withTax}
              onFilterChange={setFilteredLedgerData}
            />
          </ErrorBoundary>

          {/* ================= AI strategy diagnostics (below ledger) ================= */}
          <section className="ai-card" data-no-neg="true">
            <div className="ai-inner p-4 sm:p-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="ai-logo">
                    <SparkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="ai-badge"><span className="ai-dot" /> AI Engine</span>
                    </div>
                    <h3 className="ai-title">AI strategy diagnostics</h3>
                  </div>
                </div>

                <div className="ai-seg" data-html2canvas-ignore="true">
                  {['English', 'Tamil', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setAiLanguage(lang)}
                      className={aiLanguage === lang ? 'active' : ''}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data context chips */}
              <div className="mb-4" data-html2canvas-ignore="true">
                <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-slate-400 mb-1.5">
                  Data fed to AI
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ctxChips.map((c) => (
                    <span key={c.label} className={`ai-chip ${c.on ? 'on' : ''}`}>
                      <span className="d" />
                      {c.label}: <b>{c.value}</b>
                    </span>
                  ))}
                </div>
              </div>

              {/* Prompt box */}
              <div className="ai-input-wrap mb-4" data-html2canvas-ignore="true">
                <div className="ai-input">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ask anything about this backtest... or just hit Analyze for a full, deep diagnosis (edge, day & DTE performance, drawdown, monthly behaviour, improvements)"
                    rows="3"
                  />

                  <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2.5">
                    {QUICK_PROMPTS.map((p) => (
                      <button key={p.label} className="ai-quick" onClick={() => setCustomPrompt(p.q)}>
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                    <span className="text-[10.5px] text-slate-500">
                      Analyzing {analysisContext?.total_trades ?? 0} trades · {aiLanguage}
                    </span>
                    <button onClick={fetchAIInsights} disabled={isLoadingAI} className="ai-cta">
                      <SparkIcon className="w-3.5 h-3.5" />
                      {isLoadingAI ? 'Analyzing strategy...' : (aiAdvice ? 'Regenerate analysis' : 'Analyze with AI')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading skeleton */}
              {isLoadingAI && (
                <div className="ai-result">
                  <div className="ai-skel" style={{ width: '38%' }} />
                  <div className="ai-skel" style={{ width: '96%' }} />
                  <div className="ai-skel" style={{ width: '88%' }} />
                  <div className="ai-skel" style={{ width: '92%' }} />
                  <div className="ai-skel" style={{ width: '30%', marginTop: 16 }} />
                  <div className="ai-skel" style={{ width: '84%' }} />
                  <div className="ai-skel" style={{ width: '70%', marginBottom: 0 }} />
                </div>
              )}

              {/* Result */}
              {!isLoadingAI && aiAdvice && (
                <div className="ai-result">
                  <div className="flex items-center justify-between mb-3" data-html2canvas-ignore="true">
                    <span className="ai-badge">Analysis report</span>
                    <button className="ai-ghost" onClick={copyAdvice}>
                      <CopyIcon /> {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <ErrorBoundary name="AIAdvice">
                    <AdviceRenderer text={aiAdvice} />
                  </ErrorBoundary>
                </div>
              )}

              {/* Empty state */}
              {!isLoadingAI && !aiAdvice && (
                <div className="ai-empty">
                  <SparkIcon className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span>
                    Review the ledger above, then let the AI study your day-wise, DTE-wise and monthly behaviour
                    to suggest actionable improvements.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;