// 🛠️ SMART NORMALIZER HELPERS (Fixes AI Backend String / Case Mismatch)
export const normalizeCriteria = (criteria) => {
  if (!criteria) return 'Strike Type';
  const c = criteria.toString().toLowerCase().trim();
  if (c.includes('closest') || c.includes('premium')) return 'Closest Premium';
  if (c.includes('range')) return 'Premium Range';
  return 'Strike Type';
};

export const normalizeUnit = (unit) => {
  if (!unit) return '%';
  const u = unit.toString().toLowerCase().trim();
  
  if (u.includes('pt') || u.includes('point') || u === 'pts') return 'Pts';
  
  // 🚀 புதிதாக சேர்க்கப்பட்ட வரி: "Rs" என்பதை கண்டுபிடிக்க
  if (u === 'rs' || u.includes('rupee') || u === 'inr') return 'Rs';
  
  return '%';
};

// 🚨 NEW: SMART SEGMENT NORMALIZER (Fixes Spot Default Bug)
export const normalizeSegment = (segment, optionType) => {
  if (optionType && ['CE', 'PE', 'CALL', 'PUT'].includes(optionType.toString().toUpperCase())) {
    return 'Options';
  }
  if (!segment) return 'Options';
  const s = segment.toString().toLowerCase().trim();
  if (s.includes('opt') || s.includes('option') || s === 'ce' || s === 'pe') return 'Options';
  if (s.includes('fut') || s.includes('future')) return 'Futures';
  if (s.includes('spot') || s.includes('cash') || s.includes('eq')) return 'Spot';
  return 'Options';
};

// 🎯 NEW: INDICATOR PARAMETER SANITIZER (Data Type Casting)
// Ensures settings going to backend are properly casted to Int/Float
export const sanitizeIndicatorSettings = (indicators) => {
  if (!indicators || !Array.isArray(indicators)) return [];
  
  return indicators.map(indicator => {
    let sanitized = { ...indicator };
    
    // Support both flat structure and nested 'params' object
    let targetObj = sanitized.params ? sanitized.params : sanitized;

    Object.keys(targetObj).forEach(key => {
      const val = targetObj[key];
      if (val === null || val === undefined || val === '') return;

      const keyLower = key.toLowerCase();
      
      // Integer conversion for Window, Period, Fast, Slow, Signal etc.
      if (['period', 'window', 'fast', 'slow', 'signal', 'length'].some(k => keyLower.includes(k))) {
        targetObj[key] = parseInt(val, 10);
      } 
      // Float conversion for Multiplier, StdDev, etc.
      else if (['multiplier', 'std', 'deviation'].some(k => keyLower.includes(k))) {
        targetObj[key] = parseFloat(val);
      }
    });

    return sanitized;
  });
};

// 🎯 NEW: INDEX STEP SIZE LOOKUP FOR UI (Dynamic Points Calculation)
export const INDEX_STEP_SIZES = {
  "NIFTY 50": 50,
  "NIFTY": 50,
  "BANKNIFTY": 100,
  "FINNIFTY": 50,
  "MIDCPNIFTY": 25,
  "SENSEX": 100
};

// =========================================================================
// 🚀 DYNAMIC MARGIN & LOT SIZE CALCULATOR LOGIC START
// =========================================================================

const LOT_SIZES = {
  "NIFTY": 65, "BANKNIFTY": 30, "FINNIFTY": 60,
  "MIDCPNIFTY": 120, "MIDCAPNIFTY": 120, "SENSEX": 20, "BANKEX": 30
};

const NAKED_MARGIN = {
  "NIFTY": 176042.0, "BANKNIFTY": 165000.0, "FINNIFTY": 135000.0,
  "MIDCPNIFTY": 110000.0, "MIDCAPNIFTY": 110000.0, "SENSEX": 185000.0, "BANKEX": 175000.0
};

const HEDGED_MARGIN = {
  "NIFTY": 207238.0, "BANKNIFTY": 195000.0, "FINNIFTY": 155000.0,
  "MIDCPNIFTY": 130000.0, "MIDCAPNIFTY": 130000.0, "SENSEX": 215000.0, "BANKEX": 200000.0
};

const BUY_MARGIN = {
  "NIFTY": 5000.0, "BANKNIFTY": 4500.0, "FINNIFTY": 4000.0,
  "MIDCPNIFTY": 3500.0, "MIDCAPNIFTY": 3500.0, "SENSEX": 5000.0, "BANKEX": 4500.0
};

export const getLotSize = (ticker) => {
  if (!ticker) return 65;
  const cleanTicker = String(ticker).trim().toUpperCase();
  
  if (LOT_SIZES[cleanTicker]) return LOT_SIZES[cleanTicker];
  
  for (const [key, lot] of Object.entries(LOT_SIZES)) {
      if (cleanTicker.includes(key)) return lot;
  }
  return 65; 
};

export const calculateLiveMargin = (currentLegs) => {
  if (!currentLegs || !Array.isArray(currentLegs) || currentLegs.length === 0) {
      return { totalMargin: 0, ceQty: 0, peQty: 0 };
  }

  let totalMargin = 0;
  let ceTotalQty = 0; 
  let peTotalQty = 0;

  // Group legs by Ticker to handle multi-index strategies dynamically
  let legsByTicker = {};
  currentLegs.forEach(leg => {
      const ticker = String(leg.symbol || leg.Symbol || leg.asset || leg.ticker || leg.Ticker || leg.instrument || "NIFTY").trim().toUpperCase();
      if (!legsByTicker[ticker]) legsByTicker[ticker] = [];
      legsByTicker[ticker].push(leg);
  });

  for (const [ticker, tickerLegs] of Object.entries(legsByTicker)) {
      const lotSize = getLotSize(ticker);
      const nakedMarginVal = NAKED_MARGIN[ticker] || 176042.0;
      const hedgedPairVal = HEDGED_MARGIN[ticker] || 207238.0;
      const buyMarginVal = BUY_MARGIN[ticker] || 5000.0;

      let ceSellLots = 0;
      let peSellLots = 0;
      let buyMargin = 0;

      tickerLegs.forEach(leg => {
          const position = String(leg.action || leg.position || "BUY").toUpperCase();
          const optType = String(leg.optionType || leg.option_type || leg.type || "CE").toUpperCase();
          
          let rawQty = parseInt(leg.lots || leg.qty || leg.quantity || 1, 10);
          let lots = rawQty >= lotSize ? Math.floor(rawQty / lotSize) : rawQty;
          let actualQty = lots * lotSize; 

          if (optType.includes("CE") || optType.includes("CALL")) {
              ceTotalQty += actualQty;
          } else if (optType.includes("PE") || optType.includes("PUT")) {
              peTotalQty += actualQty;
          } else {
              ceTotalQty += actualQty; // fallback
          }

          if (position === "SELL" || position === "SHORT") {
              if (optType.includes("CE") || optType.includes("CALL")) {
                  ceSellLots += lots;
              } else if (optType.includes("PE") || optType.includes("PUT")) {
                  peSellLots += lots;
              } else {
                  totalMargin += (lots * nakedMarginVal);
              }
          } else {
              buyMargin += (lots * buyMarginVal);
          }
      });

      const hedgedPairs = Math.min(ceSellLots, peSellLots);
      const nakedCe = ceSellLots - hedgedPairs;
      const nakedPe = peSellLots - hedgedPairs;

      totalMargin += (hedgedPairs * hedgedPairVal);
      totalMargin += (nakedCe * nakedMarginVal);
      totalMargin += (nakedPe * nakedMarginVal);
      totalMargin += buyMargin;
  }

  return { totalMargin, ceQty: ceTotalQty, peQty: peTotalQty };
};