import { render, RenderAPI, waitFor } from "@testing-library/react-native";
import { useEffect } from "react";
import { Text } from "react-native";
import { useSubmitOrder } from "../../src/hooks/useSubmitOrder";
import { OrderPayload, OrderSide, OrderType } from "../../src/types/orders";

type TesterProps = {
  payload: OrderPayload;
  trigger: boolean;
};

function HookTester({ payload, trigger }: TesterProps) {
  const { submit, ...state } = useSubmitOrder();

  useEffect(() => {
    if (!trigger) return;
    submit(payload).catch(() => undefined);
  }, [payload, submit, trigger]);

  return <Text testID="state">{JSON.stringify(state)}</Text>;
}

function readState(getByTestId: RenderAPI["getByTestId"]) {
  return JSON.parse(getByTestId("state").props.children as string) as Pick<
    ReturnType<typeof useSubmitOrder>,
    "submitting" | "error" | "result"
  >;
}

describe("useSubmitOrder", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits an order and returns the response when status is valid", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 10, status: "FILLED" })
    }) as jest.Mock;

    const payload: OrderPayload = {
      instrument_id: 1,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      quantity: 5
    };

    const { getByTestId, rerender } = render(<HookTester payload={payload} trigger />) as RenderAPI;
    rerender(<HookTester payload={payload} trigger />);

    await waitFor(() => {
      const state = readState(getByTestId);
      expect(state.submitting).toBe(false);
      expect(state.result?.status).toBe("FILLED");
    });
  });

  it("surfaces an error when the returned status is not allowed for the order type", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99, status: "FILLED" })
    }) as jest.Mock;

    const payload: OrderPayload = {
      instrument_id: 1,
      side: OrderSide.SELL,
      type: OrderType.LIMIT,
      quantity: 3,
      price: 120
    };

    const { getByTestId, rerender } = render(<HookTester payload={payload} trigger />) as RenderAPI;
    rerender(<HookTester payload={payload} trigger />);

    await waitFor(() => {
      const state = readState(getByTestId);
      expect(state.error).toContain("Estado");
      expect(state.result).toBeNull();
    });
  });
});
