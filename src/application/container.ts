import { createHttpClient, HttpClientAdapters } from "../infrastructure/http/httpClient";
import {
  InstrumentsRepository,
  OrdersGateway,
  PortfolioRepository,
  SearchRepository
} from "../ports";

export type AppPorts = {
  instruments: InstrumentsRepository;
  portfolio: PortfolioRepository;
  search: SearchRepository;
  orders: OrdersGateway;
};

const httpAdapters: HttpClientAdapters = createHttpClient();

export const defaultPorts: AppPorts = {
  instruments: httpAdapters.instruments,
  portfolio: httpAdapters.portfolio,
  search: httpAdapters.search,
  orders: httpAdapters.orders
};

