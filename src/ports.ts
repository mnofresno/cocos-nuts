import { Instrument } from "./domain/instrument";
import { PortfolioPosition } from "./domain/portfolio";
import { OrderPayload, OrderResponse } from "./domain/orders";

export interface InstrumentsRepository {
  list(signal?: AbortSignal): Promise<Instrument[]>;
}

export interface PortfolioRepository {
  list(signal?: AbortSignal): Promise<PortfolioPosition[]>;
}

export interface SearchRepository {
  search(query: string, signal?: AbortSignal): Promise<Instrument[]>;
}

export interface OrdersGateway {
  placeOrder(payload: OrderPayload, signal?: AbortSignal): Promise<OrderResponse>;
}

