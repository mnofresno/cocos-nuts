import { render } from "@testing-library/react-native";
import { PortfolioScreen } from "../src/screens/PortfolioScreen";

const mockUsePortfolio = jest.fn();

jest.mock("../src/hooks/usePortfolio", () => ({
  usePortfolio: () => mockUsePortfolio()
}));

const samplePortfolio = [
  {
    id: 10,
    ticker: "AL30",
    name: "Bonos AL30",
    quantity: 20,
    last_price: 150,
    avg_cost_price: 120
  },
  {
    id: 11,
    ticker: "DYCA",
    name: "Dyca SA",
    quantity: 5,
    last_price: 80,
    avg_cost_price: 100
  }
];

describe("PortfolioScreen", () => {
  beforeEach(() => {
    mockUsePortfolio.mockReturnValue({
      loading: false,
      error: null,
      data: samplePortfolio
    });
  });

  afterEach(() => {
    mockUsePortfolio.mockReset();
  });

  it("loads and renders portfolio positions", () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <PortfolioScreen />
    );

    expect(queryByTestId("portfolio-loading")).toBeNull();

    expect(getByTestId("portfolio-row-AL30")).toBeTruthy();
    expect(getByText("Dyca SA")).toBeTruthy();
    expect(getByTestId("portfolio-row-DYCA")).toBeTruthy();
  });

  it("shows the error state when the request fails", () => {
    mockUsePortfolio.mockReturnValue({
      loading: false,
      error: "No se pudo cargar portfolio.",
      data: []
    });

    const { getByTestId, getByText } = render(<PortfolioScreen />);

    expect(getByTestId("portfolio-error")).toBeTruthy();
    expect(getByText("No se pudo cargar portfolio.")).toBeTruthy();
  });
});
