import { fireEvent, render, waitFor } from "@testing-library/react-native";
import App from "../App";

const sampleInstruments = [
  {
    id: 99,
    ticker: "BTC",
    name: "Bitcoin Tracker",
    last_price: 123,
    close_price: 120
  }
];

const sampleSearchResults = [
  {
    id: 1,
    ticker: "AL30",
    name: "Bonos AL30",
    type: "BONOS",
    last_price: 150.5,
    close_price: 140
  }
];

describe("Search flow (e2e)", () => {
  beforeEach(() => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes("/search")) {
        return Promise.resolve({
          ok: true,
          json: async () => sampleSearchResults
        });
      }

      if (url.includes("/instruments")) {
        return Promise.resolve({
          ok: true,
          json: async () => sampleInstruments
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("allows searching instruments from the app entry", async () => {
    const { getByTestId, getByText } = render(<App />);

    const input = getByTestId("search-input");
    fireEvent.changeText(input, "AL30");

    await waitFor(() => {
      expect(getByTestId("search-row-AL30")).toBeTruthy();
    });

    expect(getByText("Bonos AL30")).toBeTruthy();
  });

  it("opens the order modal from a search result", async () => {
    const { getByTestId } = render(<App />);

    const input = getByTestId("search-input");
    fireEvent.changeText(input, "AL30");

    await waitFor(() => {
      expect(getByTestId("search-row-AL30")).toBeTruthy();
    });

    fireEvent.press(getByTestId("search-row-AL30"));

    await waitFor(() => {
      expect(getByTestId("order-modal")).toBeTruthy();
    });
  });
});
