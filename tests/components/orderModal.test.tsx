import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { OrderModal } from "../../src/components/OrderModal";

const instrument = {
  id: 1,
  ticker: "AL30",
  name: "Bonos AL30",
  last_price: 100,
  close_price: 95
};

describe("OrderModal", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows the limit price field when selecting LIMIT", () => {
    const { queryByTestId, getByTestId } = render(
      <OrderModal instrument={instrument} onClose={() => {}} />
    );

    expect(queryByTestId("order-price-input")).toBeNull();

    fireEvent.press(getByTestId("order-type-limit"));
    expect(getByTestId("order-price-input")).toBeTruthy();
  });

  it("calculates quantity from amount mode", () => {
    const { getByTestId, getByText } = render(
      <OrderModal instrument={instrument} onClose={() => {}} />
    );

    fireEvent.press(getByTestId("order-mode-amount"));
    fireEvent.changeText(getByTestId("order-amount-input"), "250");

    expect(getByText(/Enviaremos 2 acciones/)).toBeTruthy();
  });

  it("sends an order and shows returned id/status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 55, status: "FILLED" })
    }) as jest.Mock;

    const { getByTestId } = render(<OrderModal instrument={instrument} onClose={() => {}} />);

    fireEvent.changeText(getByTestId("order-quantity-input"), "5");
    fireEvent.press(getByTestId("order-submit-button"));

    await waitFor(() => {
      expect(getByTestId("order-result")).toBeTruthy();
    });
  });

  it("shows an error when API returns an invalid status for the order type", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 12, status: "FILLED" })
    }) as jest.Mock;

    const { getByTestId } = render(<OrderModal instrument={instrument} onClose={() => {}} />);

    fireEvent.press(getByTestId("order-type-limit"));
    fireEvent.changeText(getByTestId("order-quantity-input"), "1");
    fireEvent.changeText(getByTestId("order-price-input"), "120");
    fireEvent.press(getByTestId("order-submit-button"));

    await waitFor(() => {
      expect(getByTestId("order-error")).toBeTruthy();
    });
  });
});
