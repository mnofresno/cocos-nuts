import { defaultPorts, AppPorts } from "./container";
import { OrderPayload, OrderResponse } from "../domain/orders";
import { ensureOrderStatusAllowed } from "../domain/orders";

type PortsOverrides = Partial<AppPorts>;

function resolvePorts(overrides?: PortsOverrides): AppPorts {
  return { ...defaultPorts, ...overrides };
}

export async function listInstruments(options?: {
  ports?: PortsOverrides;
  signal?: AbortSignal;
}) {
  const ports = resolvePorts(options?.ports);
  return ports.instruments.list(options?.signal);
}

export async function listPortfolio(options?: { ports?: PortsOverrides; signal?: AbortSignal }) {
  const ports = resolvePorts(options?.ports);
  return ports.portfolio.list(options?.signal);
}

export async function searchInstruments(
  query: string,
  options?: { ports?: PortsOverrides; signal?: AbortSignal }
) {
  const ports = resolvePorts(options?.ports);
  return ports.search.search(query, options?.signal);
}

export async function submitOrder(
  payload: OrderPayload,
  options?: { ports?: PortsOverrides; signal?: AbortSignal }
): Promise<OrderResponse> {
  const ports = resolvePorts(options?.ports);
  const result = await ports.orders.placeOrder(payload, options?.signal);
  ensureOrderStatusAllowed(payload.type, result.status);
  return result;
}

