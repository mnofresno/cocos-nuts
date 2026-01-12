const mockUseSearch = jest.fn();

jest.mock("../src/hooks/useSearch", () => ({
  useSearch: (query: string) => mockUseSearch(query)
}));

import { fireEvent, render } from "@testing-library/react-native";
import { SearchScreen } from "../src/screens/SearchScreen";

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
    mockUseSearch.mockImplementation((query: string) => {
      if (query.length >= 2) {
        return { loading: false, error: null, data: sampleResults };
      }
      return { loading: false, error: null, data: [] };
    });
  });

  afterEach(() => {
    mockUseSearch.mockReset();
  });

  it("shows idle helper before typing", () => {
    const { getByTestId, getByText } = render(<SearchScreen />);

    expect(getByTestId("search-idle")).toBeTruthy();
    expect(getByText("Buscá por ticker para ver resultados.")).toBeTruthy();
  });

  it("renders results after entering a query", () => {
    const { getByTestId, getByText } = render(<SearchScreen />);

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

    const { getByTestId, getByText } = render(<SearchScreen />);

    fireEvent.changeText(getByTestId("search-input"), "MEP");

    expect(getByTestId("search-error")).toBeTruthy();
    expect(getByText("No se pudo buscar instrumentos.")).toBeTruthy();
  });
});
