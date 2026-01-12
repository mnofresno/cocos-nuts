import { DomainError } from "./errors";

export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL"
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT"
}

export enum OrderStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  FILLED = "FILLED"
}

export type OrderPayload = {
  instrument_id: number;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
};

export type OrderResponse = {
  id: number;
  status: OrderStatus;
};

const STATUS_RULES: Record<OrderType, OrderStatus[]> = {
  [OrderType.MARKET]: [OrderStatus.REJECTED, OrderStatus.FILLED],
  [OrderType.LIMIT]: [OrderStatus.PENDING, OrderStatus.REJECTED]
};

export function ensureOrderStatusAllowed(type: OrderType, status: OrderStatus) {
  if (!STATUS_RULES[type].includes(status)) {
    throw new DomainError(`Estado ${status} no es válido para orden ${type}`);
  }
}

export function isStatusAllowed(type: OrderType, status: OrderStatus) {
  return STATUS_RULES[type].includes(status);
}

