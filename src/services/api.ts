export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://dummy-api-topaz.vercel.app";

export type Instrument = {
  id: number;
  ticker: string;
  name: string;
  last_price: number;
  close_price: number;
};

export async function fetchInstruments(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/instruments`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch instruments (${response.status})`);
  }
  const data = await response.json();
  return data as Instrument[];
}
