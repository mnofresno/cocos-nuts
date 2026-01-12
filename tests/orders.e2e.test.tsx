import { fireEvent, render, waitFor } from "@testing-library/react-native";
import App from "../App";

const instruments = [
  {
    id: 1,
    ticker: "COCO",
    name: "Cocos Nuts",
    last_price: 50,
    close_price: 45
  }
];

describe("Orders flow (e2e)", () => {
  let lastOrderBody: Record<string, unknown> | null;

  beforeEach(() => {
    lastOrderBody = null;
    global.fetch = jest.fn((url: string, options?: { body?: string }) => {
      if (url.includes("/instruments")) {
        return Promise.resolve({
          ok: true,
          json: async () => instruments
        });
      }

      if (url.includes("/orders")) {
        lastOrderBody = JSON.parse((options?.body as string) ?? "{}");
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 777, status: "FILLED" })
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

  it("opens the modal from instruments and sends a market order using amount mode", async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByTestId("instrument-row-COCO")).toBeTruthy();
    });

    fireEvent.press(getByTestId("instrument-row-COCO"));

    fireEvent.press(getByTestId("order-mode-amount"));
    fireEvent.changeText(getByTestId("order-amount-input"), "120");
    fireEvent.press(getByTestId("order-submit-button"));

    await waitFor(() => {
      expect(getByTestId("order-result")).toBeTruthy();
    });

    expect(lastOrderBody?.quantity).toBe(2);
    expect(lastOrderBody?.type).toBe("MARKET");
    expect(lastOrderBody?.instrument_id).toBe(1);
  });
});
