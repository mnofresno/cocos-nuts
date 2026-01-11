import { render, waitFor } from "@testing-library/react-native";
import { InstrumentsScreen } from "../src/screens/InstrumentsScreen";

const sampleInstruments = [
  {
    id: 1,
    ticker: "DYCA",
    name: "Dyca SA",
    last_price: 120,
    close_price: 100
  },
  {
    id: 2,
    ticker: "COCO",
    name: "Cocos Nuts",
    last_price: 80,
    close_price: 100
  }
];

describe("InstrumentsScreen", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleInstruments
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads and renders instruments", async () => {
    const { getByTestId, getByText } = render(<InstrumentsScreen />);

    expect(getByTestId("instruments-loading")).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId("instrument-row-DYCA")).toBeTruthy();
    });

    expect(getByText("Cocos Nuts")).toBeTruthy();
    expect(getByTestId("instrument-row-COCO")).toBeTruthy();
  });
});
