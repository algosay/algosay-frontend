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

// 🎯 NEW: INDEX STEP SIZE LOOKUP FOR UI (Dynamic Points Calculation)
export const INDEX_STEP_SIZES = {
  "NIFTY 50": 50,
  "NIFTY": 50,
  "BANKNIFTY": 100,
  "FINNIFTY": 50,
  "MIDCPNIFTY": 25,
  "SENSEX": 100
};

export const calculateLiveMargin = (currentLegs) => {
  if (!currentLegs || currentLegs.length === 0) return { totalMargin: 0, ceQty: 0, peQty: 0 };

  let ce_sell = 0;
  let pe_sell = 0;
  let ce_buy = 0;
  let pe_buy = 0;
  let buy_margin = 0;

  currentLegs.forEach(leg => {
      const position = (leg.action || leg.position || "BUY").toUpperCase();
      const optType = (leg.optionType || leg.option_type || leg.type || "CE").toUpperCase();
      
      let rawQty = parseInt(leg.lots || leg.qty || 1);
      let lots = rawQty >= 65 ? Math.floor(rawQty / 65) : rawQty;

      if (position === "SELL" || position === "SHORT") {
          if (optType.includes("CE")) { ce_sell += lots; }
          else if (optType.includes("PE")) { pe_sell += lots; }
          else { ce_sell += lots; }
      } else {
          if (optType.includes("CE")) { ce_buy += lots; }
          else if (optType.includes("PE")) { pe_buy += lots; }
          else { ce_buy += lots; }
          
          buy_margin += (lots * 5000);
      }
  });

  const ceQty = (ce_sell + ce_buy) * 65;
  const peQty = (pe_sell + pe_buy) * 65;

  const hedged_pairs = Math.min(ce_sell, pe_sell);
  const naked_ce = ce_sell - hedged_pairs;
  const naked_pe = pe_sell - hedged_pairs;

  const totalMargin = (hedged_pairs * 207238) + (naked_ce * 176042) + (naked_pe * 176042) + buy_margin;
  
  return { totalMargin, ceQty, peQty };
};