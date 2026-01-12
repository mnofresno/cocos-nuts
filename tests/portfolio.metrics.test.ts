import { calculatePortfolioMetrics } from "../src/lib/portfolio";

describe("calculatePortfolioMetrics", () => {
  it("calculates positive gain and return", () => {
    const metrics = calculatePortfolioMetrics({
      quantity: 10,
      last_price: 150,
      avg_cost_price: 100
    });

    expect(metrics.marketValue).toBe(1500);
    expect(metrics.gain).toBe(500);
    expect(metrics.returnPct).toBe(50);
  });

  it("calculates negative gain and return", () => {
    const metrics = calculatePortfolioMetrics({
      quantity: 4,
      last_price: 80,
      avg_cost_price: 100
    });

    expect(metrics.marketValue).toBe(320);
    expect(metrics.gain).toBe(-80);
    expect(metrics.returnPct).toBe(-20);
  });

  it("returns zero return when cost basis is zero", () => {
    const metrics = calculatePortfolioMetrics({
      quantity: 0,
      last_price: 200,
      avg_cost_price: 0
    });

    expect(metrics.marketValue).toBe(0);
    expect(metrics.gain).toBe(0);
    expect(metrics.returnPct).toBe(0);
  });

  it("returns NaN values when inputs are invalid", () => {
    const metrics = calculatePortfolioMetrics({
      quantity: Number.NaN,
      last_price: 200,
      avg_cost_price: 100
    });

    expect(Number.isNaN(metrics.marketValue)).toBe(true);
    expect(Number.isNaN(metrics.gain)).toBe(true);
    expect(Number.isNaN(metrics.returnPct)).toBe(true);
  });
});
