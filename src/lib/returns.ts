export function calculateReturnPct(lastPrice: number, closePrice: number) {
  if (!Number.isFinite(lastPrice) || !Number.isFinite(closePrice) || closePrice === 0) {
    return 0;
  }
  return ((lastPrice - closePrice) / closePrice) * 100;
}
