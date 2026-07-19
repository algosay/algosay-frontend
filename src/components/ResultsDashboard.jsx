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

  const fetchAIInsights = async () => {
    setIsLoadingAI(true);
    try {
      const payload = {
        metrics: activeResult.Strategy_Stats || activeResult.metrics, 
        ledger: activeResult.Trade_Ledger || activeResult.ledger
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
        backgroundColor: '#121212', 
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#121212] border border-[#2d2d2d] rounded-lg mt-6 shadow-lg animate-fade-in w-full">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-gray-200 mb-2">No Trades Executed</h3>
        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
          The backtest finished successfully, but zero trades were logged. This happens if market data files for the selected dates are missing, or if your specific entry conditions were never met. Check the AI logs for more details.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full animate-fade-in pb-16 ${isExporting ? 'pdf-export-mode' : ''}`} ref={dashboardRef}>
      
      {isExporting && (
        <style>
          {`
            .pdf-export-mode {
              width: max-content !important;
              min-width: 100%;
              padding: 20px !important;
              background: #121212 !important;
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
        <div className="mb-8 pb-4 border-b border-[#2d2d2d] text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            ALGOSAY - Strategy Pro Report
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3 mb-4" data-html2canvas-ignore="true">
        <button 
          onClick={downloadCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-gray-600 text-gray-200 text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
        >
          📥 Download Trade Book (CSV)
        </button>
        <button 
          onClick={downloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors shadow-lg disabled:opacity-50"
        >
          {isExporting ? '⏳ Generating PDF...' : '📄 Download AI Report (PDF)'}
        </button>
      </div>

      {/* STOCKMOCK STYLE FILTERS SECTION */}
      <div className="bg-[#121212] border border-[#2d2d2d] rounded-lg p-5 mb-6" data-html2canvas-ignore="true">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-200 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="text-blue-500">⚙️</span> Strategy Filters
          </h3>
          {isRecalculating && (
            <span className="text-xs text-blue-400 animate-pulse font-semibold">🔄 Recalculating metrics...</span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Day of the Week Filter */}
          <div className="flex-1">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3 block">Filter by Day</span>
            <div className="flex flex-wrap gap-2">
              {allDays.map(day => {
                const isActive = selectedDays.includes(day);
                return (
                  <label key={day} className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-full transition-all border ${isActive ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' : 'bg-[#1e1e1e] text-gray-400 border-gray-700 hover:border-gray-500'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDayToggle(day)} className="hidden" />
                    {day.substring(0, 3)}
                  </label>
                );
              })}
            </div>
          </div>

          {/* DTE Filter */}
          <div className="flex-1">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3 block">Filter by DTE (Days to Expiry)</span>
            <div className="flex flex-wrap gap-2">
              {availableDTEs.length > 0 ? availableDTEs.map(dte => {
                const isActive = selectedDTEs.includes(dte);
                return (
                  <label key={dte} className={`flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-full transition-all border ${isActive ? 'bg-purple-900/30 text-purple-400 border-purple-700/50' : 'bg-[#1e1e1e] text-gray-400 border-gray-700 hover:border-gray-500'}`}>
                    <input type="checkbox" checked={isActive} onChange={() => handleDTEToggle(dte)} className="hidden" />
                    {dte} DTE
                  </label>
                );
              }) : (
                <span className="text-xs text-gray-600 italic">No DTE data available.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Performance Metrics
        </h2>
        <div className="flex items-center gap-3 bg-[#1e1e1e] border border-[#2d2d2d] px-3 py-2 rounded-lg" data-html2canvas-ignore="true">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Brokerage & Tax</span>
          <div 
            onClick={() => setWithTax(!withTax)}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${withTax ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${withTax ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
          <span className={`text-[10px] font-bold ${withTax ? 'text-blue-400' : 'text-gray-500'}`}>
            {withTax ? 'NET' : 'GROSS'}
          </span>
        </div>
      </div>

      {/* Recalculating Dim Overlay and Safe Data Binding */}
      <div className={`transition-opacity duration-300 ${isRecalculating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <PerformanceStats result={activeResult} withTax={withTax} />
        <TaxBreakdown result={activeResult} />

        <div className="mt-6 mb-6 p-5 bg-[#121212] border border-[#2d2d2d] rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center gap-2">
              <span className="text-xl">✨</span> AI Strategy Diagnostics
            </h3>
            {!aiAdvice && (
              <button 
                onClick={fetchAIInsights}
                disabled={isLoadingAI}
                data-html2canvas-ignore="true"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {isLoadingAI ? 'Analyzing Strategy...' : 'Analyze Strategy with AI'}
              </button>
            )}
          </div>

          {aiAdvice && (
            <div className="p-4 bg-[#1e1e1e] border border-[#3d3d3d] rounded-md text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {aiAdvice}
            </div>
          )}
          {!aiAdvice && !isLoadingAI && (
            <p className="text-gray-500 text-sm">
              Click the button to let our AI analyze your MFE, MAE, Duration, and Win/Loss sequence to suggest improvements.
            </p>
          )}
        </div>

        <div className="space-y-6">
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