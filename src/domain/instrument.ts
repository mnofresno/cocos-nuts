export type Instrument = {
  id: number;
  ticker: string;
  name: string;
  last_price: number;
  close_price: number;
  type?: string;
};

