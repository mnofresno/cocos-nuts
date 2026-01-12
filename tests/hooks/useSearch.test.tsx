import { render, RenderAPI, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { useSearch } from "../../src/hooks/useSearch";

function HookTester({ query }: { query: string }) {
  const state = useSearch(query);
  return <Text testID="state">{JSON.stringify(state)}</Text>;
}

function readState(getByTestId: RenderAPI["getByTestId"]) {
  return JSON.parse(getByTestId("state").props.children as string) as ReturnType<
    typeof useSearch
  >;
}

describe("useSearch", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("stays idle when query is too short", () => {
    const { getByTestId } = render(<HookTester query="A" />);

    const state = readState(getByTestId);
    expect(state.loading).toBe(false);
    expect(state.data).toHaveLength(0);
    expect(state.error).toBeNull();
  });

  it("fetches results when query is present", async () => {
    const sampleResults = [
      {
        id: 1,
        ticker: "AL30",
        name: "Bonos AL30",
        type: "BONOS",
        last_price: 150.5,
        close_price: 140
      }
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleResults
    }) as jest.Mock;

    const { getByTestId, rerender } = render(<HookTester query="AL" />);

    await waitFor(() => {
      const state = readState(getByTestId);
      expect(state.loading).toBe(false);
      expect(state.data).toHaveLength(1);
    });

    const state = readState(getByTestId);
    expect(state.data[0].ticker).toBe("AL30");

    rerender(<HookTester query="AL3" />);
    await waitFor(() => {
      const latest = readState(getByTestId);
      expect(latest.loading).toBe(false);
      expect(latest.data[0].ticker).toBe("AL30");
    });
  });

  it("returns an error message when the request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500
    }) as jest.Mock;

    const { getByTestId, rerender } = render(<HookTester query="MEP" />);

    rerender(<HookTester query="MEP" />);

    await waitFor(() => {
      const state = readState(getByTestId);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("No se pudo buscar instrumentos.");
    });
  });
});
