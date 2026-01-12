import { useEffect, useState } from "react";
import { listInstruments } from "../application/useCases";
import { defaultPorts } from "../application/container";
import { Instrument } from "../domain/instrument";

type InstrumentsState = {
  loading: boolean;
  error: string | null;
  data: Instrument[];
};

export function useInstruments() {
  const [state, setState] = useState<InstrumentsState>({
    loading: true,
    error: null,
    data: []
  });

  useEffect(() => {
    const controller = new AbortController();
    listInstruments({ signal: controller.signal, ports: defaultPorts })
      .then((data) => {
        setState({ loading: false, error: null, data });
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, error: "No se pudo cargar instrumentos.", data: [] });
      });

    return () => controller.abort();
  }, []);

  return state;
}
