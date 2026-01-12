import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../lib/format";
import { calculateReturnPct } from "../lib/returns";
import { colors, fonts, radii, spacing } from "../theme";
import { ReturnPill } from "./ReturnPill";

type SearchResultRowProps = {
  ticker: string;
  name: string;
  type: string;
  lastPrice: number;
  closePrice: number;
  testID?: string;
};

export function SearchResultRow({
  ticker,
  name,
  type,
  lastPrice,
  closePrice,
  testID
}: SearchResultRowProps) {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.header}>
        <View>
          <Text style={styles.ticker}>{ticker}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <ReturnPill value={calculateReturnPct(lastPrice, closePrice)} />
      </View>
      <View style={styles.footer}>
        <View style={styles.typePill}>
          <Text style={styles.type}>{type}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.label}>Ultimo precio</Text>
          <Text style={styles.price}>{formatCurrency(lastPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md
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
  typePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill
  },
  type: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12
  },
  priceBlock: {
    alignItems: "flex-end"
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
