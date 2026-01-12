import { listInstruments, listPortfolio, searchInstruments, submitOrder } from "../application/useCases";
import { API_BASE_URL } from "../infrastructure/http/httpClient";
import { Instrument } from "../domain/instrument";
import { PortfolioPosition } from "../domain/portfolio";
import { OrderPayload, OrderResponse } from "../domain/orders";
import { SearchResult } from "../domain/searchResult";

export { API_BASE_URL };

export async function fetchInstruments(signal?: AbortSignal): Promise<Instrument[]> {
  return listInstruments({ signal });
}

export async function fetchPortfolio(signal?: AbortSignal): Promise<PortfolioPosition[]> {
  return listPortfolio({ signal });
}

export async function fetchSearch(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  return searchInstruments(query, { signal });
}

export async function placeOrder(
  payload: OrderPayload,
  signal?: AbortSignal
): Promise<OrderResponse> {
  return submitOrder(payload, { signal });
}
