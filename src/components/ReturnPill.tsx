import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, fonts } from "../theme";
import { formatPercent } from "../lib/format";

type ReturnPillProps = {
  value: number;
};

export function ReturnPill({ value }: ReturnPillProps) {
  const isPositive = value >= 0;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isPositive ? colors.success : colors.danger }
      ]}
    >
      <Text style={styles.text}>{formatPercent(value / 100)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill
  },
  text: {
    fontFamily: fonts.mono,
    color: colors.background,
    fontSize: 12
  }
});
