const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat("es-AR", {
  style: "percent",
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 2
});

export function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return currencyFormatter.format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return percentFormatter.format(value);
}

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return numberFormatter.format(value);
}
