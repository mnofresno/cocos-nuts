import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../theme";
import { formatCurrency } from "../lib/format";
import { ReturnPill } from "./ReturnPill";

type InstrumentRowProps = {
  ticker: string;
  name: string;
  lastPrice: number;
  returnPct: number;
  testID?: string;
};

export function InstrumentRow({
  ticker,
  name,
  lastPrice,
  returnPct,
  testID
}: InstrumentRowProps) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.header}>
        <View>
          <Text style={styles.ticker}>{ticker}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <ReturnPill value={returnPct} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.label}>Ultimo precio</Text>
        <Text style={styles.price}>{formatCurrency(lastPrice)}</Text>
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12
  },
  price: {
    fontFamily: fonts.mono,
    color: colors.text,
    fontSize: 14
  }
});
