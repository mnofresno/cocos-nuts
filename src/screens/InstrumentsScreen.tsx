import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { colors, fonts, spacing } from "../theme";
import { InstrumentRow } from "../components/InstrumentRow";
import { useInstruments } from "../hooks/useInstruments";

function calculateReturnPct(lastPrice: number, closePrice: number) {
  if (!Number.isFinite(lastPrice) || !Number.isFinite(closePrice) || closePrice === 0) {
    return 0;
  }
  return ((lastPrice - closePrice) / closePrice) * 100;
}

export function InstrumentsScreen() {
  const state = useInstruments();

  const content = useMemo(() => {
    if (state.loading) {
      return (
        <View style={styles.center} testID="instruments-loading">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.helper}>Cargando instrumentos...</Text>
        </View>
      );
    }

    if (state.error) {
      return (
        <View style={styles.center} testID="instruments-error">
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={state.data}
        keyExtractor={(item) => String(item.id ?? item.ticker)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <InstrumentRow
            ticker={item.ticker}
            name={item.name}
            lastPrice={item.last_price}
            returnPct={calculateReturnPct(item.last_price, item.close_price)}
            testID={`instrument-row-${item.ticker}`}
          />
        )}
      />
    );
  }, [state.data, state.error, state.loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Instrumentos</Text>
          <Text style={styles.subtitle}>Ultimo precio y retorno</Text>
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
