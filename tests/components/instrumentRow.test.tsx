import { render } from "@testing-library/react-native";
import { InstrumentRow } from "../../src/components/InstrumentRow";
import { formatCurrency, formatPercent } from "../../src/lib/format";

describe("InstrumentRow", () => {
  it("renders instrument details and return", () => {
    const { getByText } = render(
      <InstrumentRow
        ticker="DYCA"
        name="Dyca SA"
        lastPrice={1234.5}
        returnPct={5.2}
      />
    );

    expect(getByText("DYCA")).toBeTruthy();
    expect(getByText("Dyca SA")).toBeTruthy();
    expect(getByText(formatCurrency(1234.5))).toBeTruthy();
    expect(getByText(formatPercent(0.052))).toBeTruthy();
  });
});
