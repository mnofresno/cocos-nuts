import { render } from "@testing-library/react-native";
import { SearchResultRow } from "../../src/components/SearchResultRow";
import { formatCurrency, formatPercent } from "../../src/lib/format";
import { calculateReturnPct } from "../../src/lib/returns";

describe("SearchResultRow", () => {
  it("renders result details with return and type", () => {
    const lastPrice = 120;
    const closePrice = 100;

    const { getByText } = render(
      <SearchResultRow
        ticker="AL30"
        name="Bonos AL30"
        type="BONOS"
        lastPrice={lastPrice}
        closePrice={closePrice}
      />
    );

    expect(getByText("AL30")).toBeTruthy();
    expect(getByText("Bonos AL30")).toBeTruthy();
    expect(getByText("BONOS")).toBeTruthy();
    expect(getByText(formatCurrency(lastPrice))).toBeTruthy();
    expect(
      getByText(formatPercent(calculateReturnPct(lastPrice, closePrice) / 100))
    ).toBeTruthy();
  });
});
