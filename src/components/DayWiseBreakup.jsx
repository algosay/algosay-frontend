import React, { useMemo } from 'react';

// 'mode' prop (idhu "GROSS" or "NET" aagavum irukkalam)
const DayWiseBreakup = ({ ledger, mode = "NET" }) => {
  const data = useMemo(() => {
    if (!ledger || !Array.isArray(ledger) || ledger.length === 0) return null;

    const summary = {};
    const totals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Total: 0 };

    ledger.forEach((trade) => {
      const keys = Object.keys(trade);
      
      const dayKey = keys.find(k => k.toLowerCase().trim() === 'day');
      const entryTimeKey = keys.find(k => k.toLowerCase().includes('entry time') || k.toLowerCase().includes('entry_time'));
      const exitTimeKey = keys.find(k => k.toLowerCase().includes('exit time') || k.toLowerCase().includes('exit_time'));
      
      // --- DYNAMIC MODE TOGGLE LOGIC ---
      let pnlKey;
      if (mode === 'GROSS') {
        pnlKey = keys.find(k => k.toLowerCase().includes('gross'));
      } else {
        pnlKey = keys.find(k => k.toLowerCase().includes('net real')) || keys.find(k => k.toLowerCase().includes('net'));
      }

      // Fallback
      if (!pnlKey) {
        pnlKey = keys.find(k => k.toLowerCase().includes('pnl')) || keys.find(k => k.toLowerCase().includes('profit'));
      }

      // --- SMART YEAR EXTRACTION ---
      const dateStr = String(trade[exitTimeKey] || trade[entryTimeKey] || '');
      let year = new Date().getFullYear();
      
      if (dateStr) {
        const yearMatch = dateStr.match(/\b(20\d{2})\b/);
        if (yearMatch) {
          year = yearMatch[1];
        } else {
          const d = new Date(dateStr.replace(" ", "T")); 
          if (!isNaN(d)) year = d.getFullYear();
        }
      }

      // --- SMART DAY EXTRACTION ---
      let dayName = null;
      const rawDay = trade[dayKey] || '';
      
      if (rawDay) {
        const shortDay = String(rawDay).trim().substring(0, 3);
        const formattedDay = shortDay.charAt(0).toUpperCase() + shortDay.substring(1).toLowerCase();
        if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(formattedDay)) {
          dayName = formattedDay;
        }
      }

      if (!dayName && dateStr) {
        const d = new Date(dateStr.replace(" ", "T"));
        if (!isNaN(d)) {
          const daysMap = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };
          dayName = daysMap[d.getDay()];
        }
      }

      if (!dayName) return; 

      // --- BULLETPROOF PNL EXTRACTION ---
      let rawPnl = pnlKey ? trade[pnlKey] : 0;
      
      const pnlString = String(rawPnl).replace(/[^\d.-]/g, '');
      const pnl = parseFloat(pnlString) || 0;

      // --- AGGREGATE PNL ---
      if (!summary[year]) {
        summary[year] = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Total: 0 };
      }

      summary[year][dayName] += pnl;
      summary[year].Total += pnl;

      totals[dayName] += pnl;
      totals.Total += pnl;
    });

    return { summary, totals };
  }, [ledger, mode]); // mode dependency, so toggle pannum bodhu re-calculate aagum.

  if (!data) return <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No trading data available for Day Wise Breakup.</div>;

  const formatPnL = (val) => {
    const num = Number(val).toFixed(0); 
    if (num > 0) return <span style={{ color: '#059669', fontWeight: '600' }}>{num}</span>;
    if (num < 0) return <span style={{ color: '#e11d48', fontWeight: '600' }}>{num}</span>;
    return <span style={{ color: '#94A3B8' }}>0</span>; 
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <h3 style={{ marginBottom: '10px', color: '#0F1B2D', fontSize: '14px', fontWeight: 600 }}>Day wise breakup</h3>
      
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#FFFFFF', fontFamily: '"IBM Plex Mono", ui-monospace, monospace' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Mon</th>
              <th style={styles.th}>Tue</th>
              <th style={styles.th}>Wed</th>
              <th style={styles.th}>Thu</th>
              <th style={styles.th}>Fri</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data.summary).map((year) => (
              <tr key={year} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={styles.td}><strong>{year}</strong></td>
                <td style={styles.td}>{formatPnL(data.summary[year].Mon)}</td>
                <td style={styles.td}>{formatPnL(data.summary[year].Tue)}</td>
                <td style={styles.td}>{formatPnL(data.summary[year].Wed)}</td>
                <td style={styles.td}>{formatPnL(data.summary[year].Thu)}</td>
                <td style={styles.td}>{formatPnL(data.summary[year].Fri)}</td>
                <td style={{ ...styles.td, backgroundColor: '#F8FAFC' }}><strong>{formatPnL(data.summary[year].Total)}</strong></td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #CBD5E1' }}>
              <td style={styles.td}><strong>Total</strong></td>
              <td style={styles.td}><strong>{formatPnL(data.totals.Mon)}</strong></td>
              <td style={styles.td}><strong>{formatPnL(data.totals.Tue)}</strong></td>
              <td style={styles.td}><strong>{formatPnL(data.totals.Wed)}</strong></td>
              <td style={styles.td}><strong>{formatPnL(data.totals.Thu)}</strong></td>
              <td style={styles.td}><strong>{formatPnL(data.totals.Fri)}</strong></td>
              <td style={{ ...styles.td, backgroundColor: '#EEF2FF' }}><strong>{formatPnL(data.totals.Total)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: {
    padding: '9px 14px',
    color: '#64748B',
    fontWeight: '600',
    fontSize: '12px'
  },
  td: {
    padding: '9px 14px',
    fontSize: '13px',
    color: '#0F1B2D'
  }
};

export default DayWiseBreakup;
