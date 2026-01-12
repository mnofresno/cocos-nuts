import { useEffect, useState } from "react";
import { fetchSearch, SearchResult } from "../services/api";

type SearchState = {
  loading: boolean;
  error: string | null;
  data: SearchResult[];
};

export function useSearch(query: string) {
  const trimmed = query.trim();
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
        const data = await fetchSearch(trimmed, controller.signal);
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
