export type PortfolioPosition = {
  quantity: number;
  last_price: number;
  avg_cost_price: number;
};

export type PortfolioMetrics = {
  marketValue: number;
  gain: number;
  returnPct: number;
};

export function calculatePortfolioMetrics(position: PortfolioPosition): PortfolioMetrics {
  const { quantity, last_price, avg_cost_price } = position;

  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(last_price) ||
    !Number.isFinite(avg_cost_price)
  ) {
    return { marketValue: Number.NaN, gain: Number.NaN, returnPct: Number.NaN };
  }

  const marketValue = quantity * last_price;
  const costBasis = quantity * avg_cost_price;
  const gain = marketValue - costBasis;
  const returnPct = costBasis === 0 ? 0 : (gain / costBasis) * 100;

  return { marketValue, gain, returnPct };
}
