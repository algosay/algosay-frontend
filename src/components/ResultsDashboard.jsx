import React, { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EquityCurveChart from './EquityCurveChart'; 
import DrawdownChart from './DrawdownChart'; // ✨ PUDHU UPDATE: DrawdownChart Import
import PerformanceStats from './PerformanceStats';
import TaxBreakdown from './TaxBreakdown';
import DailyHeatmap from './DailyHeatmap';
import MonthlyAnalytics from './MonthlyAnalytics';
import ExecutionLedger from './ExecutionLedger';
import DayWiseBreakup from './DayWiseBreakup';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ResultsDashboard = ({ result, withTax, setWithTax }) => {
  const [aiAdvice, setAiAdvice] = useState(result?.ai_advice || null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 
  
  // 📊 Excel report download state
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  // 📈 Daily MTM report download state
  const [isDownloadingMtm, setIsDownloadingMtm] = useState(false);
  // 📑 Pro PDF tearsheet download state
  const [isDownloadingProPDF, setIsDownloadingProPDF] = useState(false);
  
  // ⚡ ExecutionLedger-oda local filtered data-va store panna state
  const [filteredLedgerData, setFilteredLedgerData] = useState(null);

  // ✨ AI MULTI-LANGUAGE & CUSTOM PROMPT STATES
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
  
  // ✨ FIX 1: Initialize selectedDTEs with actual result values to prevent [] empty-state lag on mount
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

      // ✨ FIX 2: Guard check to prevent calculations during transition reset frames
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
          Heatmap_Data: [] // ✨ FIX 3: Changed from {} to [] to make sure it is always iterable!
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
            Heatmap_Data: data.Heatmap_Data || [], // Ensure it falls back to an array
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

  // ✨ Fetch AI Insights with Language and Custom Prompt Data
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
      setAiAdvice("Failed to fetch AI insights. Backend connect aagalaya nu check pannunga thala.");
    }
    setIsLoadingAI(false);
  };

  const downloadCSV = () => {
    // ⚡ ExecutionLedger-la filter aana data iruntha atha edu, illana default ah activeResult ah use pannu
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

  // 📊 Excel report (Summary / All Trades / By Leg + MFE/MAE) built by backend from the same ledger as CSV
  const downloadExcel = async () => {
    const ledgerData = filteredLedgerData || activeResult.Trade_Ledger || activeResult.ledger;

    if (!ledgerData || ledgerData.length === 0) {
      alert("No trade data available to download.");
      return;
    }

    setIsDownloadingExcel(true);
    try {
      const base = process.env.REACT_APP_API_URL;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade_ledger: ledgerData, style: 'pro', day_mtm: activeResult.Day_MTM || {},
          meta: { capital: activeResult.Estimated_Margin || activeResult.Starting_Capital || null }
        })
      };

      let response = await fetch(`${base}/generate_report`, options);
      if (response.status === 404) {
        // if backend router is mounted with /api prefix
        response = await fetch(`${base}/api/generate_report`, options);
      }
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Backtest_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel report:", error);
      alert("Failed to generate Excel report. Please try again.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  // 📈 Daily MTM report (separate Excel: peak / dip / true drawdown / minute chart of a picked day)
  const downloadMtmExcel = async () => {
    const ledgerData = filteredLedgerData || activeResult.Trade_Ledger || activeResult.ledger;

    if (!ledgerData || ledgerData.length === 0) {
      alert("No trade data available to download.");
      return;
    }
    // No minute data? Still download: backend falls back to closed-trade MTM and labels it in the sheet.
    const hasMinuteMtm = activeResult.Day_MTM && Object.keys(activeResult.Day_MTM).length > 0;
    if (!hasMinuteMtm && !window.confirm("This backtest has no minute-by-minute MTM data, so the report will use closed trades only (less accurate). Download anyway?")) {
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Daily_MTM_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Daily MTM report:", error);
      alert("Failed to generate Daily MTM report. Please try again.");
    } finally {
      setIsDownloadingMtm(false);
    }
  };

  // 📑 Pro PDF tearsheet built by backend (crisp charts + insights). Falls back to screenshot PDF if backend fails.
  const downloadProPDF = async () => {
    const ledgerData = filteredLedgerData || activeResult.Trade_Ledger || activeResult.ledger;

    if (!ledgerData || ledgerData.length === 0) {
      alert("No trade data available to download.");
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Backtest_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Pro PDF failed, falling back to screenshot PDF:", error);
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
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false); 
    }
  };

  // Safe fallback if the backtest is null or zero trades executed
  if (!result || originalLedger.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-white border border-slate-200 rounded-xl mt-4 shadow-[0_1px_2px_rgba(15,27,45,0.04)] animate-fade-in w-full">
        <div className="w-10 h-10 mb-3 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-lg font-bold">!</div>
        <h3 className="text-lg font-semibold text-[#0F1B2D] mb-1">No trades executed</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          The backtest finished, but zero trades were logged. This happens when market data files for the selected dates are missing, or your entry conditions were never met. Check the AI logs for more details.
        </p>
      </div>
    );
  }

  const btnBase = "flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer";

  return (
    <div className={`w-full animate-fade-in pb-16 ${isExporting ? 'pdf-export-mode' : ''}`} ref={dashboardRef}>
      
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
                  <label key={day} className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-all border ${isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
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
                  <label key={dte} className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-all border ${isActive ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
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
          <span className={`text-[11px] font-semibold font-mono ${withTax ? 'text-[#0F1B2D]' : 'text-slate-400'}`}>
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
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
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
          
          {/* withTax pass pannirukken, so Day PnL / Trade PnL toggle-padi Net / Gross maarum */}
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