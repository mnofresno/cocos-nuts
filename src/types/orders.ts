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
