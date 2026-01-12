import { useEffect, useState } from "react";
import { listPortfolio } from "../application/useCases";
import { defaultPorts } from "../application/container";
import { PortfolioPosition } from "../domain/portfolio";

type PortfolioState = {
  loading: boolean;
  error: string | null;
  data: PortfolioPosition[];
};

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>({
    loading: true,
    error: null,
    data: []
  });

  useEffect(() => {
    const controller = new AbortController();
    listPortfolio({ signal: controller.signal, ports: defaultPorts })
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
