import { Instrument } from "../../domain/instrument";
import { PortfolioPosition } from "../../domain/portfolio";
import { HttpError } from "../../domain/errors";
import { OrderPayload, OrderResponse } from "../../domain/orders";
import {
  InstrumentsRepository,
  OrdersGateway,
  PortfolioRepository,
  SearchRepository
} from "../../ports";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://dummy-api-topaz.vercel.app";

async function parseJson<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    let details: string | undefined;
    try {
      const data = await response.json();
      details = typeof data?.message === "string" ? data.message : undefined;
    } catch {
      // ignore parsing errors
    }
    const suffix = details ? `: ${details}` : "";
    throw new HttpError(`${context} (${response.status})${suffix}`, response.status);
  }
  return response.json() as Promise<T>;
}

export function createHttpClient(baseUrl: string = API_BASE_URL) {
  const buildUrl = (path: string) => `${baseUrl}${path}`;

  const instruments: InstrumentsRepository = {
    list: async (signal?: AbortSignal) => {
      const response = await fetch(buildUrl("/instruments"), { signal });
      return parseJson<Instrument[]>(response, "Failed to fetch instruments");
    }
  };

  const portfolio: PortfolioRepository = {
    list: async (signal?: AbortSignal) => {
      const response = await fetch(buildUrl("/portfolio"), { signal });
      return parseJson<PortfolioPosition[]>(response, "Failed to fetch portfolio");
    }
  };

  const search: SearchRepository = {
    search: async (query: string, signal?: AbortSignal) => {
      const response = await fetch(
        `${buildUrl("/search")}?query=${encodeURIComponent(query)}`,
        { signal }
      );
      return parseJson<Instrument[]>(response, "Failed to search instruments");
    }
  };

  const orders: OrdersGateway = {
    placeOrder: async (payload: OrderPayload, signal?: AbortSignal) => {
      const response = await fetch(buildUrl("/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal
      });

      return parseJson<OrderResponse>(response, "Failed to place order");
    }
  };

  return { instruments, portfolio, search, orders };
}

export type HttpClientAdapters = ReturnType<typeof createHttpClient>;

