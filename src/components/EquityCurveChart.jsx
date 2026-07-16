import React, { useEffect, useRef, useState } from 'react';

const EquityCurveChart = ({ result, withTax }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  const findKeyInsensitive = (obj, searchTerms) => {
    if (!obj || typeof obj !== 'object') return undefined;
    const objectKeys = Object.keys(obj);
    for (let term of searchTerms) {
      const cleanTerm = term.toLowerCase().replace(/[_ ]/g, "");
      const found = objectKeys.find(k => k.toLowerCase().replace(/[_ ]/g, "") === cleanTerm);
      if (found !== undefined) return obj[found];
    }
    return undefined;
  };

  const mappedEquity = [{ Display_PnL: 0, Date: 'Start', Label: 'Start' }];

  // 1. Equity_Curve டேட்டாவை மாற்றுதல்
  let equityData = [];
  if (result && result.Equity_Curve) {
    if (typeof result.Equity_Curve === 'string') {
      try {
        equityData = JSON.parse(result.Equity_Curve);
      } catch (error) {
        console.error("Error parsing Equity_Curve JSON:", error);
      }
    } else if (Array.isArray(result.Equity_Curve)) {
      equityData = result.Equity_Curve;
    }
  }

  // 2. பாதுகாப்புக்காக Trade_Ledger டேட்டாவையும் எடுத்துக்கொள்கிறோம் (தேதி இல்லை என்றால் இதிலிருந்து எடுக்க)
  let ledgerData = [];
  if (result && result.Trade_Ledger) {
    if (typeof result.Trade_Ledger === 'string') {
      try {
        ledgerData = JSON.parse(result.Trade_Ledger);
      } catch (error) {
        console.error("Error parsing Trade_Ledger JSON:", error);
      }
    } else if (Array.isArray(result.Trade_Ledger)) {
      ledgerData = result.Trade_Ledger;
    }
  }

  // 3. Map through the properly parsed Array
  if (equityData && equityData.length > 0) {
    equityData.forEach((pt, i) => {
      let rawPnl = findKeyInsensitive(pt, ['Cumulative_PnL', 'cumulative_pnl', 'cumulativePnl', 'pnl', 'profit']);
      let pnl = 0;
      if (rawPnl !== undefined && rawPnl !== null) {
        pnl = typeof rawPnl === 'string' ? parseFloat(rawPnl.replace(/[^0-9.-]+/g, "")) : Number(rawPnl);
      }
      if (isNaN(pnl)) pnl = 0;

      let rawNet = findKeyInsensitive(pt, ['Cumulative_Net_PnL', 'cumulative_net_pnl', 'netPnl', 'net_pnl']);
      let netPnl = 0;
      if (rawNet !== undefined && rawNet !== null) {
        netPnl = typeof rawNet === 'string' ? parseFloat(rawNet.replace(/[^0-9.-]+/g, "")) : Number(rawNet);
      } else {
        netPnl = pnl * 0.94;
      }
      if (isNaN(netPnl)) netPnl = 0;

      // முதலில் Equity Curve-ல் தேதி இருக்கிறதா என்று தேடும்
      let rawDate = findKeyInsensitive(pt, ['Date', 'TradeDate', 'trade_date', 'Exit_Time', 'time', 'timestamp', 'trade_time', 'date']);
      
      // மாஸ்டர் அப்டேட்: Equity_Curve-ல் தேதி இல்லை என்றால், Trade_Ledger-ல் இருந்து தேதியை எடுக்கும்!
      if (!rawDate && ledgerData && ledgerData.length > 0) {
        // பெரும்பாலும் 0-வது இன்டெக்ஸ் 'Start' என்பதால் i அல்லது i-1 செக் செய்யப்படுகிறது
        let ledgerPt = ledgerData[i] || ledgerData[i - 1] || ledgerData[ledgerData.length - 1];
        if (ledgerPt) {
          rawDate = findKeyInsensitive(ledgerPt, ['Date', 'TradeDate', 'trade_date', 'Exit_Time', 'ExitTime', 'time', 'timestamp', 'trade_time', 'date', 'Entry_Time']);
        }
      }

      let displayLabel = "";
      let isFallback = false;

      if (rawDate) {
        let dateStr = String(rawDate);
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          displayLabel = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        } else {
          displayLabel = dateStr.includes(' ') ? dateStr.split(' ')[0] : dateStr;
        }
      } else {
        displayLabel = (i + 1).toString();
        isFallback = true;
      }

      mappedEquity.push({
        Display_PnL: withTax ? netPnl : pnl,
        Date: isFallback ? "T-" + displayLabel : displayLabel, // தேதி கிடைத்தால் தேதியைக் காட்டும், இல்லைனா மட்டும் T-1 என்று காட்டும்
        Label: isFallback ? "Trade " + (i + 1) : displayLabel
      });
    });
  }

  const dataPointsCount = mappedEquity.length;
  const dynamicWidth = Math.max(1000, dataPointsCount * 55);
  const chartHeight = 400;

  const pnlValues = mappedEquity.map(d => d.Display_PnL);
  const maxAbsValue = Math.max(...pnlValues.map(v => Math.abs(v)));
  const domainLimit = maxAbsValue === 0 ? 1000 : maxAbsValue * 1.15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dataPointsCount <= 1) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dynamicWidth, chartHeight);

    const paddingLeft = 100;
    const paddingRight = 50;
    const paddingTop = 30;
    const paddingBottom = 75; // தேதிகள் சாய்வாக எழுதப்படுவதால் வெட்டப்படாமல் இருக்க கொஞ்சம் கூட்டப்பட்டுள்ளது

    const plotWidth = dynamicWidth - paddingLeft - paddingRight;
    const plotHeight = chartHeight - paddingTop - paddingBottom;

    const getX = (index) => paddingLeft + (index / (dataPointsCount - 1)) * plotWidth;
    const getY = (value) => {
      const ratio = (value - (-domainLimit)) / (domainLimit * 2);
      return paddingTop + plotHeight * (1 - ratio);
    };

    // Background Grid
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const val = -domainLimit + (i / gridLines) * (domainLimit * 2);
      const y = getY(val);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(dynamicWidth - paddingRight, y);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      let label = '₹0';
      if (val !== 0) {
        const formatted = Math.abs(val) >= 1000 ? (Math.abs(val) / 1000).toFixed(1) + "k" : Math.round(Math.abs(val));
        label = val > 0 ? "+₹" + formatted : "-₹" + formatted;
      }
      ctx.fillText(label, paddingLeft - 15, y);
      ctx.setLineDash([4, 4]);
    }

    // Zero line
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, getY(0));
    ctx.lineTo(dynamicWidth - paddingRight, getY(0));
    ctx.stroke();

    // Area Gradient
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotHeight);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.01)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(0));
    for (let i = 0; i < dataPointsCount; i++) {
      ctx.lineTo(getX(i), getY(mappedEquity[i].Display_PnL));
    }
    ctx.lineTo(getX(dataPointsCount - 1), getY(0));
    ctx.closePath();
    ctx.fill();

    // Line Path
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < dataPointsCount; i++) {
      if (i === 0) ctx.moveTo(getX(i), getY(mappedEquity[i].Display_PnL));
      else ctx.lineTo(getX(i), getY(mappedEquity[i].Display_PnL));
    }
    ctx.stroke();

    // X-Axis Text Labels
    ctx.fillStyle = '#a3a3a3';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';

    mappedEquity.forEach((pt, i) => {
      if (dataPointsCount > 20 && i % Math.ceil(dataPointsCount / 12) !== 0 && i !== dataPointsCount - 1) return;
      
      const x = getX(i);
      const y = chartHeight - paddingBottom + 12;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(pt.Date, 0, 0);
      ctx.restore();
    });

  }, [mappedEquity, dynamicWidth, domainLimit, dataPointsCount]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const paddingLeft = 100;
    const paddingRight = 50;
    const plotWidth = dynamicWidth - paddingLeft - paddingRight;

    const relativeX = mouseX - paddingLeft;
    if (relativeX < 0 || relativeX > plotWidth) {
      setHoverData(null);
      return;
    }

    const index = Math.round((relativeX / plotWidth) * (dataPointsCount - 1));
    if (index >= 0 && index < dataPointsCount) {
      setHoverData({
        ...mappedEquity[index],
        x: (relativeX / plotWidth) * (rect.width - (paddingLeft * (rect.width / dynamicWidth)) - (paddingRight * (rect.width / dynamicWidth))) + (paddingLeft * (rect.width / dynamicWidth)),
        y: mouseY
      });
    }
  };

  if (!equityData || equityData.length === 0) {
    return <div className="p-4 text-white font-semibold">No data available for chart</div>;
  }

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 md:p-6 rounded-xl shadow-lg w-full relative">
      <h3 className="text-sm font-bold text-gray-300 mb-6">Equity Curve (Cumulative PnL)</h3>
      
      <div className="overflow-x-auto w-full custom-scrollbar-horizontal pb-2" ref={containerRef}>
        <div style={{ width: dynamicWidth + "px", height: chartHeight + "px", position: 'relative' }}>
          
          <canvas
            ref={canvasRef}
            width={dynamicWidth}
            height={chartHeight}
            className="block cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverData(null)}
          />

          {hoverData && (
            <div 
              className="absolute bg-[#111111] border border-gray-700 p-3 rounded-lg shadow-2xl text-white pointer-events-none z-50 min-w-[140px]"
              style={{ 
                left: hoverData.x + 15 + "px", 
                top: Math.min(hoverData.y, chartHeight - 120) + "px",
                transform: hoverData.x > (dynamicWidth * 0.7) ? 'translateX(-120%)' : 'none'
              }}
            >
              <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wide">
                {hoverData.Label}
              </p>
              <p className="text-[10px] text-gray-400">Cumulative {withTax ? 'Net' : 'Gross'} PnL:</p>
              <div className={`text-base font-bold ${hoverData.Display_PnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {hoverData.Display_PnL >= 0 ? '+' : ''}₹{Math.round(hoverData.Display_PnL).toLocaleString('en-IN')}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EquityCurveChart;