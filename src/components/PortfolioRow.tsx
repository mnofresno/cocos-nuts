import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../theme";
import { formatCurrency, formatNumber } from "../lib/format";
import { ReturnPill } from "./ReturnPill";

type PortfolioRowProps = {
  ticker: string;
  name: string;
  quantity: number;
  marketValue: number;
  gain: number;
  returnPct: number;
  testID?: string;
};

export function PortfolioRow({
  ticker,
  name,
  quantity,
  marketValue,
  gain,
  returnPct,
  testID
}: PortfolioRowProps) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.header}>
        <View>
          <Text style={styles.ticker}>{ticker}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.quantity}>Cantidad: {formatNumber(quantity)}</Text>
        </View>
        <ReturnPill value={returnPct} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Valor de mercado</Text>
        <Text style={styles.value}>{formatCurrency(marketValue)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ganancia total</Text>
        <Text style={styles.value}>{formatCurrency(gain)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ticker: {
    fontFamily: fonts.heading,
    color: colors.text,
    fontSize: 16
  },
  name: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13
  },
  quantity: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12
  },
  value: {
    fontFamily: fonts.mono,
    color: colors.text,
    fontSize: 14
  }
});
