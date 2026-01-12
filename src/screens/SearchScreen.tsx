import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchResultRow } from "../components/SearchResultRow";
import { useSearch } from "../hooks/useSearch";
import { colors, fonts, radii, spacing } from "../theme";

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const state = useSearch(query);

  const content = useMemo(() => {
    if (query.trim().length < 2) {
      return (
        <View style={styles.center} testID="search-idle">
          <Text style={styles.helper}>Buscá por ticker para ver resultados.</Text>
        </View>
      );
    }

    if (state.loading) {
      return (
        <View style={styles.center} testID="search-loading">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.helper}>Buscando instrumentos...</Text>
        </View>
      );
    }

    if (state.error) {
      return (
        <View style={styles.center} testID="search-error">
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      );
    }

    if (!state.data.length) {
      return (
        <View style={styles.center} testID="search-empty">
          <Text style={styles.helper}>No encontramos resultados.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={state.data}
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
          />
        )}
      />
    );
  }, [query, state.data, state.error, state.loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Buscar</Text>
          <Text style={styles.subtitle}>Encontrá instrumentos por ticker</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Ej: AL30, MEP, CEDEAR..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="characters"
            autoCorrect={false}
            testID="search-input"
          />
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
