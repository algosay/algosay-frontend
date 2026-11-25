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

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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

const ResultsDashboard = ({ result, withTax, setWithTax }) => {
  const [aiAdvice, setAiAdvice] = useState(result?.ai_advice || null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const [isDownloadingMtm, setIsDownloadingMtm] = useState(false);
  const [isDownloadingProPDF, setIsDownloadingProPDF] = useState(false);

  // Filtered ledger data coming from ExecutionLedger
  const [filteredLedgerData, setFilteredLedgerData] = useState(null);

  // AI language & custom prompt
  const [aiLanguage, setAiLanguage] = useState('English');
  const [customPrompt, setCustomPrompt] = useState('');

  const dashboardRef = useRef(null);

  const originalLedger = useMemo(() => {
    return result?.Trade_Ledger || result?.ledger || [];
  }, [result]);

  const availableDTEs = useMemo(() => {
    return [...new Set(originalLedger.map(row => row.DTE))].sort((a, b) => a - b);
  }, [originalLedger]);

  const hasData = !!result && originalLedger.length > 0;

  const [selectedDays, setSelectedDays] = useState(allDays);

  const [selectedDTEs, setSelectedDTEs] = useState(() => {
    const ledger = result?.Trade_Ledger || result?.ledger || [];
    return [...new Set(ledger.map(row => row.DTE))].sort((a, b) => a - b);
  });

  const [displayResult, setDisplayResult] = useState(result);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const activeResult = displayResult || result;

  // Reset filters when a new backtest result is loaded
  useEffect(() => {
    setSelectedDays(allDays);
    const initialDTEs = [...new Set((result?.Trade_Ledger || result?.ledger || []).map(r => r.DTE))].sort((a, b) => a - b);
    setSelectedDTEs(initialDTEs);
    setDisplayResult(result);
    setAiAdvice(result?.ai_advice || null);
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

      const filteredLedger = originalLedger.filter(row =>
        selectedDays.includes(row.Day) && selectedDTEs.includes(row.DTE)
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
          body: JSON.stringify({ trade_ledger: filteredLedger, starting_capital: startingCapital })
        });

        const data = await response.json();

        if (data.status === 'success') {
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
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleDTEToggle = (dte) => {
    setSelectedDTEs(prev =>
      prev.includes(dte) ? prev.filter(d => d !== dte) : [...prev, dte]
    );
  };

  const fetchAIInsights = async () => {
    setIsLoadingAI(true);
    try {
      const payload = {
        metrics: activeResult.Strategy_Stats || activeResult.metrics,
        ledger: activeResult.Trade_Ledger || activeResult.ledger,
        target_language: aiLanguage,
        custom_user_query: customPrompt
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get_strategy_insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setAiAdvice(data.advice);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiAdvice('Failed to fetch AI insights. Please check your backend connection and try again.');
    }
    setIsLoadingAI(false);
  };

  const getLedgerData = () =>
    filteredLedgerData || activeResult.Trade_Ledger || activeResult.ledger;

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
    const rows = ledgerData.map(row =>
      Object.values(row).map(val => `"${val !== null && val !== undefined ? val : ''}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, 'Trade_Ledger_Filtered.csv');
  };

  // Excel report (Summary / All Trades / By Leg + MFE/MAE)
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
          day_mtm: activeResult.Day_MTM || {},
          meta: { capital: activeResult.Estimated_Margin || activeResult.Starting_Capital || null }
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

    const hasMinuteMtm = activeResult.Day_MTM && Object.keys(activeResult.Day_MTM).length > 0;
    if (!hasMinuteMtm && !window.confirm('This backtest has no minute-by-minute MTM data, so the report will use closed trades only (less accurate). Download anyway?')) {
      return;
    }

    setIsDownloadingMtm(true);
    try {
      const base = process.env.REACT_APP_API_URL;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade_ledger: ledgerData, day_mtm: activeResult.Day_MTM || {} })
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
        body: JSON.stringify({ trade_ledger: ledgerData, ai_advice: aiAdvice || '' })
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

    await new Promise(resolve => setTimeout(resolve, 2000));

    const element = dashboardRef.current;
    if (!element) {
      setIsExporting(false);
      return;
    }

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
      setIsExporting(false);
    }
  };

  // No result / zero trades -> render nothing (empty-state card removed)
  if (!hasData) {
    return null;
  }

  const btnBase = 'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer';

  return (
    <div
      className={`rd-root w-full animate-fade-in pb-16 ${isExporting ? 'pdf-export-mode' : ''}`}
      ref={dashboardRef}
    >
      {/* Global typography + negative (loss) red styling */}
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
        <div className="mb-6 pb-3 border-b border-slate-200 text-center">
          <h1 className="text-2xl font-semibold text-[#0F1B2D]">
            AlgoSay · Strategy pro report
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      )}

      {/* Downloads */}
      <div className="flex flex-wrap justify-end gap-2 mb-3" data-html2canvas-ignore="true">
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-[0_1px_2px_rgba(15,27,45,0.04)]" data-html2canvas-ignore="true">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#0F1B2D] font-semibold text-sm">Strategy filters</h3>
          {isRecalculating && (
            <span className="text-xs text-indigo-600 animate-pulse font-medium">Recalculating metrics...</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <span className="text-xs text-slate-500 font-medium mb-2 block">Day of week</span>
            <div className="flex flex-wrap gap-1.5">
              {allDays.map(day => {
                const isActive = selectedDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-all border ${isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                  >
                    <input type="checkbox" checked={isActive} onChange={() => handleDayToggle(day)} className="hidden" />
                    {day.substring(0, 3)}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            <span className="text-xs text-slate-500 font-medium mb-2 block">Days to expiry (DTE)</span>
            <div className="flex flex-wrap gap-1.5">
              {availableDTEs.length > 0 ? availableDTEs.map(dte => {
                const isActive = selectedDTEs.includes(dte);
                return (
                  <label
                    key={dte}
                    className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-all border ${isActive ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                  >
                    <input type="checkbox" checked={isActive} onChange={() => handleDTEToggle(dte)} className="hidden" />
                    {dte} DTE
                  </label>
                );
              }) : (
                <span className="text-xs text-slate-400 italic">No DTE data available.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4">
        <h2 className="text-lg font-semibold text-[#0F1B2D] tracking-tight">
          Performance metrics
        </h2>
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg" data-html2canvas-ignore="true">
          <span className="text-[11px] text-slate-500 font-medium">Brokerage & tax</span>
          <div
            onClick={() => setWithTax(!withTax)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${withTax ? 'bg-[#0F1B2D]' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${withTax ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
          <span className={`text-[11px] font-semibold tracking-wide ${withTax ? 'text-[#0F1B2D]' : 'text-slate-400'}`}>
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Recalculating dim overlay */}
      <div className={`transition-opacity duration-300 ${isRecalculating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <PerformanceStats result={activeResult} withTax={withTax} />
        <TaxBreakdown result={activeResult} />

        {/* AI diagnostics */}
        <div className="mt-4 mb-4 p-4 bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(15,27,45,0.04)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <h3 className="text-base font-semibold text-[#0F1B2D]">
              AI strategy diagnostics
            </h3>

            {/* Language selector */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200" data-html2canvas-ignore="true">
              {['English', 'Tamil', 'Hindi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setAiLanguage(lang)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    aiLanguage === lang
                      ? 'bg-white text-[#0F1B2D] shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-[#0F1B2D] border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Custom prompt */}
          <div className="mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200" data-html2canvas-ignore="true">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Clicking the Ask AI button will instantly generate a comprehensive, detailed backtest analysis report with deep insights for your strategy"
              className="w-full bg-transparent text-slate-700 text-sm focus:outline-none resize-none placeholder-slate-400 mb-2"
              rows="2"
            />
            <div className="flex justify-end border-t border-slate-200 pt-2 mt-1">
              <button
                onClick={fetchAIInsights}
                disabled={isLoadingAI}
                className="px-4 py-1.5 bg-[#0F1B2D] hover:bg-[#1c2d47] text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoadingAI ? 'Analyzing strategy...' : (aiAdvice ? 'Regenerate analysis' : 'Ask AI')}
              </button>
            </div>
          </div>

          {aiAdvice && (
            <div
              data-no-neg="true"
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm whitespace-pre-wrap leading-relaxed"
            >
              {aiAdvice}
            </div>
          )}

          {!aiAdvice && !isLoadingAI && (
            <p className="text-slate-500 text-sm mt-2">
              Type your specific queries above or simply click "Ask AI" to let our engine analyze your MFE, MAE, and historical sequences to suggest actionable improvements.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <EquityCurveChart result={activeResult} withTax={withTax} />

          <DrawdownChart result={activeResult} withTax={withTax} />

          <DailyHeatmap result={activeResult} withTax={withTax} />
          <MonthlyAnalytics result={activeResult} withTax={withTax} />

          <DayWiseBreakup
            ledger={activeResult.Trade_Ledger || activeResult.ledger}
            mode={withTax ? 'NET' : 'GROSS'}
          />

          <ExecutionLedger
            result={activeResult}
            withTax={withTax}
            onFilterChange={setFilteredLedgerData}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;