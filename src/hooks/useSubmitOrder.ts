import { useCallback, useState } from "react";
import { submitOrder } from "../application/useCases";
import { defaultPorts } from "../application/container";
import { DomainError, HttpError } from "../domain/errors";
import { isStatusAllowed, type OrderPayload, type OrderResponse } from "../domain/orders";

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
      const result = await submitOrder(payload, { ports: defaultPorts });
      setState({ submitting: false, error: null, result });
      return result;
    } catch (error) {
      let message = "No se pudo enviar la orden.";
      if (error instanceof DomainError) {
        message = error.message;
      } else if (error instanceof Error && !(error instanceof HttpError)) {
        message = error.message;
      }
      setState({ submitting: false, error: message, result: null });
      throw error;
    }
  }, []);

  return { ...state, submit, reset };
}

export { isStatusAllowed };
