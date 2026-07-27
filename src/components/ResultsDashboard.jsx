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
  
  // ⚡ PUDHU UPDATE: ExecutionLedger-oda local filtered data-va store panna puthu state
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

  // ✨ UPDATED: Fetch AI Insights with Language and Custom Prompt Data
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
    // ⚡ PUDHU UPDATE: ExecutionLedger-la filter aana data iruntha atha edu, illana default ah activeResult ah use pannu
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
        backgroundColor: '#070a13', // Match ultra dark theme
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0d121c] border border-[#1e293b] rounded-2xl mt-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">⚠️</div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">No Trades Executed</h3>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
          The backtest finished successfully, but zero trades were logged. This happens if market data files for the selected dates are missing, or if your specific entry conditions were never met. Check the AI logs for more details.
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#7000ff] drop-shadow-lg">
            ALGOSAY - Strategy Pro Report
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide">
            Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-4 mb-6" data-html2canvas-ignore="true">
        <button 
          onClick={downloadCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] hover:border-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg"
        >
          <span className="text-lg">📥</span> Download Trade Book
        </button>
        <button 
          onClick={downloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-500/30 disabled:opacity-50"
        >
          {isExporting ? (
            <><span className="animate-spin">⏳</span> Generating PDF...</>
          ) : (
            <><span className="text-lg">📄</span> Download AI Report</>
          )}
        </button>
      </div>

      {/* STOCKMOCK STYLE FILTERS SECTION - PREMIUM DESIGN */}
      <div className="bg-gradient-to-br from-[#0d121c] to-[#070a13] border border-[#1e293b] rounded-2xl p-6 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden" data-html2canvas-ignore="true">
        {/* Subtle background glow element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-slate-200 font-extrabold text-sm uppercase tracking-widest flex items-center gap-3">
            <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">⚙️</span> Strategy Filters
          </h3>
          {isRecalculating && (
            <span className="text-xs text-[#00f0ff] animate-pulse font-bold bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
              🔄 Recalculating metrics...
            </span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 relative z-10">
          {/* Day of the Week Filter */}
          <div className="flex-1">
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mb-4 block">Filter by Day</span>
            <div className="flex flex-wrap gap-3">
              {allDays.map(day => {
                const isActive = selectedDays.includes(day);
                return (
                  <label key={day} className={`flex items-center gap-2 text-xs font-bold cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 border ${isActive ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'bg-[#0f172a] text-slate-400 border-[#1e293b] hover:border-slate-600 hover:text-slate-200 shadow-sm'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDayToggle(day)} className="hidden" />
                    {day.substring(0, 3)}
                  </label>
                );
              })}
            </div>
          </div>

          {/* DTE Filter */}
          <div className="flex-1">
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mb-4 block">Filter by DTE (Days to Expiry)</span>
            <div className="flex flex-wrap gap-3">
              {availableDTEs.length > 0 ? availableDTEs.map(dte => {
                const isActive = selectedDTEs.includes(dte);
                return (
                  <label key={dte} className={`flex items-center gap-2 text-xs font-bold cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 border ${isActive ? 'bg-[#7000ff]/15 text-[#b580ff] border-[#7000ff]/50 shadow-[0_0_15px_rgba(112,0,255,0.2)]' : 'bg-[#0f172a] text-slate-400 border-[#1e293b] hover:border-slate-600 hover:text-slate-200 shadow-sm'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDTEToggle(dte)} className="hidden" />
                    {dte} DTE
                  </label>
                );
              }) : (
                <span className="text-xs text-slate-600 italic font-medium px-2 py-1">No DTE data available.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-wide">
          <span className="text-blue-500">📊</span> Performance Metrics
        </h2>
        <div className="flex items-center gap-4 bg-[#0d121c] border border-[#1e293b] px-4 py-2.5 rounded-xl shadow-lg" data-html2canvas-ignore="true">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Brokerage & Tax</span>
          <div 
            onClick={() => setWithTax(!withTax)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${withTax ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-slate-700'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${withTax ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
          <span className={`text-[11px] font-extrabold tracking-wider w-10 text-center ${withTax ? 'text-[#00f0ff]' : 'text-slate-500'}`}>
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Recalculating Dim Overlay and Safe Data Binding */}
      <div className={`transition-all duration-300 ${isRecalculating ? 'opacity-40 blur-[2px] pointer-events-none' : 'opacity-100 blur-0'}`}>
        <PerformanceStats result={activeResult} withTax={withTax} />
        <TaxBreakdown result={activeResult} />

        {/* ✨ UPDATED AI DIAGNOSTICS SECTION - PREMIUM DESIGN */}
        <div className="mt-8 mb-8 p-6 bg-gradient-to-br from-[#0d121c] to-[#070a13] border border-[#1e293b] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#b580ff] to-[#00f0ff] flex items-center gap-3 drop-shadow-sm">
              <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</span> AI Strategy Diagnostics
            </h3>
            
            {/* Language Selector Tabs */}
            <div className="flex items-center gap-2 bg-[#0a0f18] p-1.5 rounded-xl border border-[#1e293b] shadow-inner" data-html2canvas-ignore="true">
              {['English', 'Tamil', 'Hindi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setAiLanguage(lang)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                    aiLanguage === lang 
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-[#b580ff] border border-[#b580ff]/40 shadow-[0_0_10px_rgba(112,0,255,0.15)]' 
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input Area */}
          <div className="mb-6 bg-[#0a0f18] p-4 rounded-xl border border-[#1e293b] shadow-inner relative z-10 focus-within:border-[#00f0ff]/40 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all duration-300" data-html2canvas-ignore="true">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., How can I reduce drawdown? / Filter out consecutive losses / Focus on win rate..."
              className="w-full bg-transparent text-slate-200 text-sm focus:outline-none resize-none placeholder-slate-600 mb-3 font-medium leading-relaxed"
              rows="2"
            />
            <div className="flex justify-end border-t border-[#1e293b] pt-3 mt-1">
              <button 
                onClick={fetchAIInsights}
                disabled={isLoadingAI}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-extrabold rounded-lg transition-all shadow-[0_0_15px_rgba(112,0,255,0.3)] hover:shadow-[0_0_20px_rgba(112,0,255,0.5)] border border-purple-500/30 disabled:opacity-50 uppercase tracking-widest"
              >
                {isLoadingAI ? '⏳ Analyzing Strategy...' : (aiAdvice ? '🔄 Regenerate Analysis' : '🧠 Ask AI')}
              </button>
            </div>
          </div>

          {aiAdvice && (
            <div className="p-6 bg-[#0a0f18]/80 backdrop-blur-sm border border-[#1e293b] border-l-4 border-l-[#00f0ff] rounded-xl text-slate-300 text-sm whitespace-pre-wrap leading-relaxed shadow-lg relative z-10 font-medium">
              {aiAdvice}
            </div>
          )}
          
          {!aiAdvice && !isLoadingAI && (
            <p className="text-slate-500 text-sm mt-3 relative z-10 font-medium">
              Type your specific queries above or simply click <span className="text-slate-300 font-bold">"Ask AI"</span> to let our engine analyze your MFE, MAE, and historical sequences to suggest actionable improvements.
            </p>
          )}
        </div>
        {/* ✨ END OF AI DIAGNOSTICS SECTION */}

        <div className="space-y-8">
          <EquityCurveChart result={activeResult} withTax={withTax} />
          
          {/* ✨ PUDHU UPDATE: DrawdownChart Added Here */}
          <DrawdownChart result={activeResult} withTax={withTax} /> 

          <DailyHeatmap result={activeResult} withTax={withTax} />
          <MonthlyAnalytics result={activeResult} withTax={withTax} />
          
          <DayWiseBreakup 
            ledger={activeResult.Trade_Ledger || activeResult.ledger} 
            mode={withTax ? 'NET' : 'GROSS'} 
          />
          
          {/* ⚡ PUDHU UPDATE: ExecutionLedger onFilterChange-ah catch panni puthu state-la podurathu */}
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