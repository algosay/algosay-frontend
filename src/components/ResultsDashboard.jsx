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

// Quick Prompt Suggestions for AI Strategy Diagnostics
const PROMPT_SUGGESTIONS = [
  "How can I reduce max drawdown?",
  "Analyze my win rate vs risk-reward ratio",
  "How to handle consecutive losing streaks?",
  "Suggest optimal trailing stop loss strategies"
];

const ResultsDashboard = ({ result, withTax, setWithTax }) => {
  const [aiAdvice, setAiAdvice] = useState(result?.ai_advice || null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 
  
  // ExecutionLedger-oda local filtered data-va store panna state
  const [filteredLedgerData, setFilteredLedgerData] = useState(null);

  // AI MULTI-LANGUAGE & CUSTOM PROMPT STATES
  const [aiLanguage, setAiLanguage] = useState('English');
  const [customPrompt, setCustomPrompt] = useState('');

  const dashboardRef = useRef(null);

  // Extract available DTEs from the Trade Ledger safely
  const originalLedger = useMemo(() => {
    return result?.Trade_Ledger || result?.ledger || [];
  }, [result]);

  const availableDTEs = useMemo(() => {
    return [...new Set(originalLedger.map(row => row.DTE))].sort((a, b) => a - b);
  }, [originalLedger]);

  // Filter States
  const [selectedDays, setSelectedDays] = useState(allDays);
  
  // Initialize selectedDTEs with actual result values
  const [selectedDTEs, setSelectedDTEs] = useState(() => {
    const ledger = result?.Trade_Ledger || result?.ledger || [];
    return [...new Set(ledger.map(row => row.DTE))].sort((a, b) => a - b);
  });
  
  // State to hold the actively displayed result
  const [displayResult, setDisplayResult] = useState(result);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Guard Helper: Use activeResult to prevent rendering crashes during state sync frames
  const activeResult = displayResult || result;

  // Reset filters when a completely new backtest result is loaded
  useEffect(() => {
    setSelectedDays(allDays);
    const initialDTEs = [...new Set((result?.Trade_Ledger || result?.ledger || []).map(r => r.DTE))].sort((a, b) => a - b);
    setSelectedDTEs(initialDTEs);
    setDisplayResult(result);
    setAiAdvice(result?.ai_advice || null);
  }, [result]);

  // Auto-Recalculation Logic when Filters Change
  useEffect(() => {
    const filterAndRecalculate = async () => {
      if (!result) return;

      if (availableDTEs.length > 0 && selectedDTEs.length === 0) {
        return;
      }

      // Reset to original if all filters are selected (Default State)
      if (selectedDays.length === allDays.length && selectedDTEs.length === availableDTEs.length) {
        setDisplayResult(result);
        return;
      }

      setIsRecalculating(true);
      
      // Filter the ledger locally based on checkboxes
      const filteredLedger = originalLedger.filter(row => 
        selectedDays.includes(row.Day) && selectedDTEs.includes(row.DTE)
      );

      // Handle empty filter cases gracefully
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

      // Query Backend for metrics recalculation
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
        console.error("Error recalculating metrics:", error);
      }
      setIsRecalculating(false);
    };

    filterAndRecalculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, selectedDTEs]);

  // Toggle Handlers
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

  // Fetch AI Insights
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
      console.error("Error fetching AI insights:", error);
      setAiAdvice("Failed to fetch AI insights. Please verify backend connection.");
    }
    setIsLoadingAI(false);
  };

  const downloadCSV = () => {
    const ledgerData = filteredLedgerData || activeResult.Trade_Ledger || activeResult.ledger;
    
    if (!ledgerData || ledgerData.length === 0) {
      alert("No trade data available to download.");
      return;
    }

    const headers = Object.keys(ledgerData[0]).join(',');
    
    const rows = ledgerData.map(row => 
      Object.values(row).map(val => `"${val !== null && val !== undefined ? val : ''}"`).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Trade_Ledger_Filtered.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        backgroundColor: '#070a13',
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
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false); 
    }
  };

  // Safe fallback if zero trades executed
  if (!result || originalLedger.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0d121c] border border-[#1e293b] rounded-2xl mt-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">⚠️</div>
        <h3 className="text-2xl font-extrabold text-white mb-2 tracking-wide">No Trades Executed</h3>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed font-medium text-sm">
          The backtest finished successfully, but zero trades were logged. This happens if market data files for the selected dates are missing, or if entry conditions were never met.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full animate-fade-in pb-16 font-sans ${isExporting ? 'pdf-export-mode' : ''}`} ref={dashboardRef}>
      
      {isExporting && (
        <style>
          {`
            .pdf-export-mode {
              width: max-content !important;
              min-width: 100%;
              padding: 20px !important;
              background: #070a13 !important;
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
        <div className="mb-8 pb-4 border-b border-[#1e293b] text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#7000ff] drop-shadow-lg tracking-tight">
            ALGOSAY - Strategy Pro Report
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide text-xs">
            Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3.5 mb-6" data-html2canvas-ignore="true">
        <button 
          onClick={downloadCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1322] hover:bg-[#161f36] border border-[#1e293b] hover:border-slate-500 text-slate-200 text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Download Trade Book
        </button>
        <button 
          onClick={downloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] border border-cyan-400/30 disabled:opacity-50 tracking-wide uppercase"
        >
          {isExporting ? (
            <><span className="animate-spin text-sm">⏳</span> Generating PDF...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Download AI Report</>
          )}
        </button>
      </div>

      {/* STRATEGY FILTERS SECTION */}
      <div className="bg-gradient-to-br from-[#0c101d] via-[#090d18] to-[#060810] border border-[#1e293b] rounded-2xl p-5 sm:p-6 mb-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden" data-html2canvas-ignore="true">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 className="text-slate-100 font-extrabold text-xs tracking-widest uppercase">
              Strategy Filters
            </h3>
          </div>
          {isRecalculating && (
            <span className="text-[11px] text-[#00f0ff] animate-pulse font-bold bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Recalculating metrics...
            </span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Day Filter */}
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3 block">Filter by Day</span>
            <div className="flex flex-wrap gap-2.5">
              {allDays.map(day => {
                const isActive = selectedDays.includes(day);
                return (
                  <label key={day} className={`flex items-center gap-2 text-xs font-bold cursor-pointer px-3.5 py-1.5 rounded-lg transition-all duration-200 border ${isActive ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]' : 'bg-[#0a0f1d] text-slate-400 border-[#1a2336] hover:border-slate-600 hover:text-slate-200'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDayToggle(day)} className="hidden" />
                    {day.substring(0, 3)}
                  </label>
                );
              })}
            </div>
          </div>

          {/* DTE Filter */}
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3 block">Filter by DTE (Days to Expiry)</span>
            <div className="flex flex-wrap gap-2.5">
              {availableDTEs.length > 0 ? availableDTEs.map(dte => {
                const isActive = selectedDTEs.includes(dte);
                return (
                  <label key={dte} className={`flex items-center gap-2 text-xs font-bold cursor-pointer px-3.5 py-1.5 rounded-lg transition-all duration-200 border ${isActive ? 'bg-[#7000ff]/15 text-[#b580ff] border-[#7000ff]/50 shadow-[0_0_12px_rgba(112,0,255,0.2)]' : 'bg-[#0a0f1d] text-slate-400 border-[#1a2336] hover:border-slate-600 hover:text-slate-200'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDTEToggle(dte)} className="hidden" />
                    {dte} DTE
                  </label>
                );
              }) : (
                <span className="text-xs text-slate-500 italic font-medium">No DTE data available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* METRICS HEADER - ULTRA PREMIUM REDESIGN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 via-[#7000ff]/20 to-[#0d1322] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
              Performance Metrics
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wider">Quant summary across trade statistics</p>
          </div>
        </div>

        {/* GROSS / NET TOGGLE */}
        <div className="flex items-center gap-3 bg-[#0a0f1d] border border-[#1e293b] px-3.5 py-2 rounded-xl shadow-lg" data-html2canvas-ignore="true">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Charges:</span>
          <div 
            onClick={() => setWithTax(!withTax)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 ${withTax ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(0,240,255,0.35)]' : 'bg-slate-700'}`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${withTax ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
          <span className={`text-[11px] font-black tracking-widest w-12 text-center ${withTax ? 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]' : 'text-slate-400'}`}>
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Recalculating Overlay Container */}
      <div className={`transition-all duration-300 ${isRecalculating ? 'opacity-40 blur-[2px] pointer-events-none' : 'opacity-100 blur-0'}`}>
        <PerformanceStats result={activeResult} withTax={withTax} />
        <TaxBreakdown result={activeResult} />

        {/* ✨ AI STRATEGY DIAGNOSTICS - ULTRA-PREMIUM HIGH-TECH REDESIGN */}
        <div className="mt-8 mb-8 p-6 sm:p-7 bg-gradient-to-br from-[#0e0a1a] via-[#090a14] to-[#05070d] border border-purple-900/40 rounded-2xl shadow-[0_12px_40px_rgba(112,0,255,0.15)] relative overflow-hidden">
          {/* Neon Glow Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* AI Panel Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 mb-5 border-b border-purple-900/30 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(112,0,255,0.25)]">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 tracking-wide uppercase">
                    AI Strategy Diagnostics
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    PRO ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">Algorithmic risk evaluation, MFE/MAE sequence diagnostic & edge analysis</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-[#060810]/80 p-1 rounded-xl border border-purple-900/40 shadow-inner" data-html2canvas-ignore="true">
              {['English', 'Tamil', 'Hindi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setAiLanguage(lang)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    aiLanguage === lang 
                      ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-purple-200 border border-purple-400/40 shadow-[0_0_12px_rgba(112,0,255,0.25)]' 
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="mb-4 relative z-10" data-html2canvas-ignore="true">
            <span className="text-[10px] text-purple-300/80 font-black tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              Quick Diagnostic Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomPrompt(suggestion)}
                  className="text-xs bg-[#110e24] hover:bg-[#1a1538] text-purple-200/90 hover:text-purple-100 border border-purple-800/40 hover:border-purple-500/60 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-left shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="mb-6 bg-[#060812]/90 p-3.5 rounded-xl border border-purple-900/40 shadow-inner relative z-10 focus-within:border-purple-500/60 focus-within:shadow-[0_0_20px_rgba(112,0,255,0.15)] transition-all duration-300" data-html2canvas-ignore="true">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask custom diagnostic queries (e.g. Optimize win rate, reduce drawdown, analyze max loss streak...)"
              className="w-full bg-transparent text-slate-100 text-xs sm:text-sm focus:outline-none resize-none placeholder-slate-500 mb-2 font-medium leading-relaxed"
              rows="2"
            />
            <div className="flex justify-between items-center border-t border-purple-900/30 pt-2.5 mt-1">
              <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">Powered by Algosay Quant AI</span>
              <button 
                onClick={fetchAIInsights}
                disabled={isLoadingAI}
                className="ml-auto px-5 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-black rounded-lg transition-all shadow-[0_0_15px_rgba(112,0,255,0.35)] hover:shadow-[0_0_20px_rgba(112,0,255,0.5)] border border-purple-400/30 disabled:opacity-50 uppercase tracking-widest flex items-center gap-2"
              >
                {isLoadingAI ? (
                  <><svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Analyzing Strategy...</>
                ) : (
                  aiAdvice ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Regenerate Analysis</> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Run AI Diagnostics</>
                )}
              </button>
            </div>
          </div>

          {/* AI Output Box */}
          {aiAdvice && (
            <div className="p-5 sm:p-6 bg-[#070914]/90 backdrop-blur-md border border-purple-500/30 border-l-4 border-l-[#00f0ff] rounded-xl text-slate-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-xl relative z-10 font-medium">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-900/30">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00f0ff]">AI Diagnostic Report</span>
              </div>
              {aiAdvice}
            </div>
          )}
          
          {!aiAdvice && !isLoadingAI && (
            <div className="p-4 bg-[#070914]/60 border border-purple-900/20 rounded-xl relative z-10 text-center">
              <p className="text-slate-400 text-xs font-medium">
                Click <span className="text-purple-300 font-bold">"Run AI Diagnostics"</span> or select a prompt above to generate algorithmic insights on trade sequence, drawdown duration, and edge expectations.
              </p>
            </div>
          )}
        </div>
        {/* END OF AI DIAGNOSTICS */}

        <div className="space-y-8">
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
            onFilterChange={setFilteredLedgerData} 
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;