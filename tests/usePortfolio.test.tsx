import { render, waitFor } from "@testing-library/react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { listPortfolio } from "../src/application/useCases";
import { usePortfolio } from "../src/hooks/usePortfolio";

jest.mock("../src/application/useCases", () => ({
  listPortfolio: jest.fn()
}));

const mockListPortfolio = listPortfolio as jest.MockedFunction<typeof listPortfolio>;

const samplePortfolio = [
  {
    id: 101,
    ticker: "AL30",
    name: "Bonos AL30",
    quantity: 2,
    last_price: 150,
    avg_cost_price: 120
  },
  {
    id: 102,
    ticker: "DYCA",
    name: "Dyca SA",
    quantity: 5,
    last_price: 80,
    avg_cost_price: 100
  }
];

function PortfolioHookTester({ onUpdate }: { onUpdate?: (state: ReturnType<typeof usePortfolio>) => void }) {
  const state = usePortfolio();

  useEffect(() => {
    onUpdate?.(state);
  }, [onUpdate, state]);

  return (
    <View>
      <Text testID="loading">{state.loading ? "loading" : "loaded"}</Text>
      <Text testID="error">{state.error ?? ""}</Text>
      <Text testID="tickers">{state.data.map((item) => item.ticker).join(",")}</Text>
    </View>
  );
}

describe("usePortfolio", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches and exposes portfolio data", async () => {
    mockListPortfolio.mockResolvedValue(samplePortfolio);

    const { getByTestId } = render(<PortfolioHookTester />);

    await waitFor(() => expect(getByTestId("loading").props.children).toBe("loaded"));

    expect(mockListPortfolio).toHaveBeenCalledTimes(1);
    expect(getByTestId("tickers").props.children).toBe("AL30,DYCA");
    expect(getByTestId("error").props.children).toBe("");
  });

  it("returns an error message when the request fails", async () => {
    mockListPortfolio.mockRejectedValue(new Error("Network error"));

    const { getByTestId } = render(<PortfolioHookTester />);

    await waitFor(() => expect(getByTestId("loading").props.children).toBe("loaded"));

    expect(getByTestId("error").props.children).toBe("No se pudo cargar portfolio.");
    expect(getByTestId("tickers").props.children).toBe("");
  });
});
