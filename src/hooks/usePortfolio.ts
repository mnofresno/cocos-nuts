import { useEffect, useState } from "react";
import { fetchPortfolio, PortfolioItem } from "../services/api";

type PortfolioState = {
  loading: boolean;
  error: string | null;
  data: PortfolioItem[];
};

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>({
    loading: true,
    error: null,
    data: []
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchPortfolio(controller.signal)
      .then((data) => {
        setState({ loading: false, error: null, data });
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, error: "No se pudo cargar portfolio.", data: [] });
      });

    return () => controller.abort();
  }, []);

  return state;
}
