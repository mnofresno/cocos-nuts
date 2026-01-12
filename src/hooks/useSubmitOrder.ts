import { useCallback, useState } from "react";
import { placeOrder } from "../services/api";
import { OrderPayload, OrderResponse, OrderStatus, OrderType } from "../types/orders";

const STATUS_RULES: Record<OrderType, OrderStatus[]> = {
  [OrderType.MARKET]: [OrderStatus.REJECTED, OrderStatus.FILLED],
  [OrderType.LIMIT]: [OrderStatus.PENDING, OrderStatus.REJECTED]
};

function isStatusAllowed(type: OrderType, status: OrderStatus) {
  return STATUS_RULES[type].includes(status);
}

type SubmitState = {
  submitting: boolean;
  error: string | null;
  result: OrderResponse | null;
};

export function useSubmitOrder() {
  const [state, setState] = useState<SubmitState>({
    submitting: false,
    error: null,
    result: null
  });

  const reset = useCallback(() => {
    setState({ submitting: false, error: null, result: null });
  }, []);

  const submit = useCallback(async (payload: OrderPayload) => {
    setState({ submitting: true, error: null, result: null });
    try {
      const result = await placeOrder(payload);
      if (!isStatusAllowed(payload.type, result.status)) {
        throw new Error(
          `Estado ${result.status} no es válido para orden ${payload.type}`
        );
      }
      setState({ submitting: false, error: null, result });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo enviar la orden.";
      setState({ submitting: false, error: message, result: null });
      throw error;
    }
  }, []);

  return { ...state, submit, reset };
}

export { isStatusAllowed };
