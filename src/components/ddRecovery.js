// [algosay pro v2] drawdown period + recovery helper (DrawdownChart + MonthlyAnalytics)
const dayOf = (p) =>
  String((p && p.full) || '').replace(/\s+\d{1,2}:\d{2}(:\d{2})?(\s*[AaPp][Mm])?\s*$/, '').trim();
const shortDay = (s) => String(s).replace(/^[A-Za-z]{3,9},?\s*/, '').replace(/,?\s*\d{4}$/, '').trim();

export const fmtDays = (d) => (d <= 0 ? 'same day' : `${d} day${d > 1 ? 's' : ''}`);

export function ddRecovery(points) {
  if (!points || points.length < 2) return null;
  const n = points.length;
  let min = 0;
  let trough = -1;
  for (let i = 0; i < n; i += 1) {
    if (points[i].value < min) { min = points[i].value; trough = i; }
  }
  if (trough < 0) return null;
  let peak = trough;
  while (peak > 0 && points[peak].value < 0) peak -= 1;
  let rec = -1;
  for (let i = trough + 1; i < n; i += 1) {
    if (points[i].value >= 0) { rec = i; break; }
  }
  const days = points.map(dayOf);
  const span = (a, b) => Math.max(new Set(days.slice(a, b + 1)).size - 1, 0);
  const peakLabel = days[peak] || days[Math.min(peak + 1, n - 1)];
  return {
    peakDay: shortDay(peakLabel),
    troughDay: shortDay(days[trough]),
    troughFull: days[trough],
    fallDays: span(peak, trough),
    recovered: rec >= 0,
    recoverDay: rec >= 0 ? shortDay(days[rec]) : '',
    recoverDays: rec >= 0 ? span(trough, rec) : 0,
    stillDays: rec >= 0 ? 0 : span(trough, n - 1),
  };
}
