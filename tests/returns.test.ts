import { calculateReturnPct } from "../src/lib/returns";

describe("calculateReturnPct", () => {
  it("calculates positive return", () => {
    expect(calculateReturnPct(120, 100)).toBe(20);
  });

  it("calculates negative return", () => {
    expect(calculateReturnPct(90, 100)).toBe(-10);
  });

  it("returns zero when close price is zero or invalid", () => {
    expect(calculateReturnPct(120, 0)).toBe(0);
    expect(calculateReturnPct(Number.NaN, 100)).toBe(0);
  });
});
