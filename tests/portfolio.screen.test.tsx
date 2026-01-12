import { render, waitFor } from "@testing-library/react-native";
import { PortfolioScreen } from "../src/screens/PortfolioScreen";

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
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads and renders portfolio positions", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => samplePortfolio
    }) as jest.Mock;

    const { getByTestId, getByText } = render(<PortfolioScreen />);

    expect(getByTestId("portfolio-loading")).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId("portfolio-row-AL30")).toBeTruthy();
    });

    expect(getByText("Dyca SA")).toBeTruthy();
    expect(getByTestId("portfolio-row-DYCA")).toBeTruthy();
  });

  it("shows the error state when the request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500
    }) as jest.Mock;

    const { getByTestId, getByText } = render(<PortfolioScreen />);

    await waitFor(() => {
      expect(getByTestId("portfolio-error")).toBeTruthy();
    });

    expect(getByText("No se pudo cargar portfolio.")).toBeTruthy();
  });
});
