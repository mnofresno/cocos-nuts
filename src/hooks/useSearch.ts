import { useEffect, useState } from "react";
import { searchInstruments } from "../application/useCases";
import { defaultPorts } from "../application/container";
import { Instrument } from "../domain/instrument";

type SearchState = {
  loading: boolean;
  error: string | null;
  data: Instrument[];
};

export function useSearch(query: string) {
  const trimmed = query.trim().toUpperCase();
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    data: []
  });

  useEffect(() => {
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const run = async () => {
      setState({ loading: true, error: null, data: [] });

      try {
        const data = await searchInstruments(trimmed, {
          signal: controller.signal,
          ports: defaultPorts
        });
        setState({ loading: false, error: null, data });
      } catch (error) {
        if ((error as Error | undefined)?.name === "AbortError") return;
        setState({
          loading: false,
          error: "No se pudo buscar instrumentos.",
          data: []
        });
      }
    };

    void run();

    return () => controller.abort();
  }, [trimmed]);

  if (trimmed.length < 2) {
    return { loading: false, error: null, data: [] };
  }

  return state;
}
