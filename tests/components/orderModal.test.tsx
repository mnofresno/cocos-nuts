import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { OrderModal } from "../../src/components/OrderModal";
import { ToastProvider } from "../../src/components/Toast";

const instrument = {
  id: 1,
  ticker: "AL30",
  name: "Bonos AL30",
  last_price: 100,
  close_price: 95
};

const renderWithToast = (component: React.ReactNode) => {
  return render(<ToastProvider>{component}</ToastProvider>);
};

describe("OrderModal", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows the limit price field when selecting LIMIT", () => {
    const { queryByTestId, getByTestId } = renderWithToast(
      <OrderModal instrument={instrument} onClose={() => { }} />
    );

    expect(queryByTestId("order-price-input")).toBeNull();

    fireEvent.press(getByTestId("order-type-limit"));
    expect(getByTestId("order-price-input")).toBeTruthy();
  });

  it("calculates quantity from amount mode", () => {
    const { getByTestId, getByText } = renderWithToast(
      <OrderModal instrument={instrument} onClose={() => { }} />
    );

    fireEvent.press(getByTestId("order-mode-amount"));
    fireEvent.changeText(getByTestId("order-amount-input"), "250");

    expect(getByText(/Enviaremos 2 acciones/)).toBeTruthy();
  });

  it("sends an order, triggers Toast and calls onClose", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 55, status: "FILLED" })
    }) as jest.Mock;

    const onCloseMock = jest.fn();
    const { getByTestId, getByText } = renderWithToast(
      <OrderModal instrument={instrument} onClose={onCloseMock} />
    );

    fireEvent.changeText(getByTestId("order-quantity-input"), "5");
    fireEvent.press(getByTestId("order-submit-button"));

    await waitFor(() => {
      // Modal should call onClose
      expect(onCloseMock).toHaveBeenCalled();
      // Toast should be visible (we can search for the text in the provider)
      expect(getByText(/Orden enviada: FILLED/)).toBeTruthy();
    });
  });

  it("shows an error when API returns an invalid status for the order type", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 12, status: "FILLED" })
    }) as jest.Mock;

    const { getByTestId } = renderWithToast(
      <OrderModal instrument={instrument} onClose={() => { }} />
    );

    fireEvent.press(getByTestId("order-type-limit"));
    fireEvent.changeText(getByTestId("order-quantity-input"), "1");
    fireEvent.changeText(getByTestId("order-price-input"), "120");
    fireEvent.press(getByTestId("order-submit-button"));

    await waitFor(() => {
      expect(getByTestId("order-error")).toBeTruthy();
    });
  });
});
