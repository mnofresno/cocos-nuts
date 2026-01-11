import { render, waitFor } from "@testing-library/react-native";
import App from "../App";

const sampleInstruments = [
  {
    id: 99,
    ticker: "AL30",
    name: "Bonos AL30",
    last_price: 150.5,
    close_price: 145
  }
];

describe("Instruments flow (e2e)", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleInstruments
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the instruments list from the app entry", async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByTestId("instrument-row-AL30")).toBeTruthy();
    });

    expect(getByText("Bonos AL30")).toBeTruthy();
  });
});
