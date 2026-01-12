import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InstrumentRow } from "../components/InstrumentRow";
import { OrderModal } from "../components/OrderModal";
import { Instrument } from "../domain/instrument";
import { useInstruments } from "../hooks/useInstruments";
import { useSearch } from "../hooks/useSearch";
import { calculateReturnPct } from "../lib/returns";
import { SearchResultRow } from "../components/SearchResultRow";
import { colors, fonts, radii, spacing } from "../theme";

export function InstrumentsScreen() {
  const instruments = useInstruments();
  const [query, setQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const searchState = useSearch(query);
  const trimmedQuery = query.trim();
  const searching = trimmedQuery.length >= 2;

  const instrumentsContent = useMemo(() => {
    if (instruments.loading) {
      return (
        <View style={styles.center} testID="instruments-loading">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.helper}>Cargando instrumentos...</Text>
        </View>
      );
    }

    if (instruments.error) {
      return (
        <View style={styles.center} testID="instruments-error">
          <Text style={styles.errorText}>{instruments.error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={instruments.data}
        keyExtractor={(item) => String(item.id ?? item.ticker)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <InstrumentRow
            ticker={item.ticker}
            name={item.name}
            lastPrice={item.last_price}
            returnPct={calculateReturnPct(item.last_price, item.close_price)}
            testID={`instrument-row-${item.ticker}`}
            onPress={() => setSelectedInstrument(item)}
          />
        )}
      />
    );
  }, [instruments.data, instruments.error, instruments.loading]);

  const searchContent = useMemo(() => {
    if (!searching) return null;

    if (searchState.loading) {
      return (
        <View style={styles.center} testID="search-loading">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.helper}>Buscando instrumentos...</Text>
        </View>
      );
    }

    if (searchState.error) {
      return (
        <View style={styles.center} testID="search-error">
          <Text style={styles.errorText}>{searchState.error}</Text>
        </View>
      );
    }

    if (!searchState.data.length) {
      return (
        <View style={styles.center} testID="search-empty">
          <Text style={styles.helper}>No encontramos resultados.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchState.data}
        keyExtractor={(item) => String(item.id ?? item.ticker)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SearchResultRow
            ticker={item.ticker}
            name={item.name}
            type={item.type ?? ""}
            lastPrice={item.last_price}
            closePrice={item.close_price}
            testID={`search-row-${item.ticker}`}
            onPress={() => setSelectedInstrument(item)}
          />
        )}
      />
    );
  }, [searchState.data, searchState.error, searchState.loading, searching]);

  const content = searching ? searchContent : instrumentsContent;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Instrumentos</Text>
          <Text style={styles.subtitle}>Ultimo precio y retorno</Text>
        </View>
        <View style={styles.searchBlock}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Buscar por ticker (ej: AL30, MEP, CEDEAR...)"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="characters"
              autoCorrect={false}
              testID="search-input"
            />
          </View>
          {!searching && (
            <Text style={styles.helper} testID="search-idle">
              Escribí al menos 2 letras para buscar por ticker.
            </Text>
          )}
        </View>
        {content}
      </View>
      <OrderModal
        key={selectedInstrument?.id ?? "none"}
        instrument={selectedInstrument}
        onClose={() => setSelectedInstrument(null)}
      />
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
  searchBlock: {
    gap: spacing.xs
  },
  inputWrapper: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  input: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 16
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
