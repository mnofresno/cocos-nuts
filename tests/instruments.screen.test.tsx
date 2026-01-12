const mockUseInstruments = jest.fn();

jest.mock("../src/hooks/useInstruments", () => ({
  useInstruments: () => mockUseInstruments()
}));

import { render } from "@testing-library/react-native";
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
    mockUseInstruments.mockReturnValue({
      loading: false,
      error: null,
      data: sampleInstruments
    });
  });

  afterEach(() => {
    mockUseInstruments.mockReset();
  });

  it("loads and renders instruments", async () => {
    const { getByTestId, getByText } = render(<InstrumentsScreen />);

    expect(getByText("Cocos Nuts")).toBeTruthy();
    expect(getByTestId("instrument-row-COCO")).toBeTruthy();
  });
});
