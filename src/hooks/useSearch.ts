import { useEffect, useState } from "react";
import { fetchSearch, SearchResult } from "../services/api";

type SearchState = {
  loading: boolean;
  error: string | null;
  data: SearchResult[];
};

export function useSearch(query: string) {
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    data: []
  });

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setState({ loading: false, error: null, data: [] });
      return;
    }

    const controller = new AbortController();
    setState({ loading: true, error: null, data: [] });

    fetchSearch(trimmed, controller.signal)
      .then((data) => {
        setState({ loading: false, error: null, data });
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({
          loading: false,
          error: "No se pudo buscar instrumentos.",
          data: []
        });
      });

    return () => controller.abort();
  }, [query]);

  return state;
}
