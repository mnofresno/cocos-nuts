const mockUseSearch = jest.fn();
const mockUseInstruments = jest.fn();

jest.mock("../src/hooks/useSearch", () => ({
  useSearch: (query: string) => mockUseSearch(query)
}));

jest.mock("../src/hooks/useInstruments", () => ({
  useInstruments: () => mockUseInstruments()
}));

import { fireEvent, render } from "@testing-library/react-native";
import { InstrumentsScreen } from "../src/screens/InstrumentsScreen";

const sampleResults = [
  {
    id: 1,
    ticker: "AL30",
    name: "Bonos AL30",
    type: "BONOS",
    last_price: 150,
    close_price: 140
  }
];

describe("SearchScreen", () => {
  beforeEach(() => {
    mockUseInstruments.mockReturnValue({
      loading: false,
      error: null,
      data: []
    });

    mockUseSearch.mockImplementation((query: string) => {
      if (query.length >= 2) {
        return { loading: false, error: null, data: sampleResults };
      }
      return { loading: false, error: null, data: [] };
    });
  });

  afterEach(() => {
    mockUseSearch.mockReset();
    mockUseInstruments.mockReset();
  });

  it("shows idle helper before typing", () => {
    const { getByTestId, getByText } = render(<InstrumentsScreen />);

    expect(getByTestId("search-idle")).toBeTruthy();
    expect(getByText("Escribí al menos 2 letras para buscar por ticker.")).toBeTruthy();
  });

  it("renders results after entering a query", () => {
    const { getByTestId, getByText } = render(<InstrumentsScreen />);

    fireEvent.changeText(getByTestId("search-input"), "AL30");

    expect(getByTestId("search-row-AL30")).toBeTruthy();
    expect(getByText("Bonos AL30")).toBeTruthy();
  });

  it("shows an error state", () => {
    mockUseSearch.mockImplementation(() => ({
      loading: false,
      error: "No se pudo buscar instrumentos.",
      data: []
    }));

    const { getByTestId, getByText } = render(<InstrumentsScreen />);

    fireEvent.changeText(getByTestId("search-input"), "MEP");

    expect(getByTestId("search-error")).toBeTruthy();
    expect(getByText("No se pudo buscar instrumentos.")).toBeTruthy();
  });
});
