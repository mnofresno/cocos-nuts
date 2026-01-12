import { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioRow } from "../components/PortfolioRow";
import { usePortfolio } from "../hooks/usePortfolio";
import { calculatePortfolioMetrics } from "../lib/portfolio";
import { colors, fonts, spacing } from "../theme";

export function PortfolioScreen() {
  const state = usePortfolio();

  const content = useMemo(() => {
    if (state.loading) {
      return (
        <View style={styles.center} testID="portfolio-loading">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.helper}>Cargando portfolio...</Text>
        </View>
      );
    }

    if (state.error) {
      return (
        <View style={styles.center} testID="portfolio-error">
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={state.data}
        keyExtractor={(item) => String(item.id ?? item.ticker)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const metrics = calculatePortfolioMetrics({
            quantity: item.quantity,
            last_price: item.last_price,
            avg_cost_price: item.avg_cost_price
          });
          return (
            <PortfolioRow
              ticker={item.ticker}
              name={item.name}
              quantity={item.quantity}
              marketValue={metrics.marketValue}
              gain={metrics.gain}
              returnPct={metrics.returnPct}
              testID={`portfolio-row-${item.ticker}`}
            />
          );
        }}
      />
    );
  }, [state.data, state.error, state.loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>Valor de mercado y rendimiento</Text>
        </View>
        {content}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg
  },
  header: {
    gap: spacing.xs
  },
  title: {
    fontFamily: fonts.heading,
    color: colors.text,
    fontSize: 26
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.textMuted
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.lg
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  helper: {
    fontFamily: fonts.body,
    color: colors.textMuted
  },
  errorText: {
    fontFamily: fonts.body,
    color: colors.danger
  }
});
