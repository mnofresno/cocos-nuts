import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { InstrumentsScreen } from "./src/screens/InstrumentsScreen";
import { PortfolioScreen } from "./src/screens/PortfolioScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { colors, fonts, radii, spacing } from "./src/theme";

type TabKey = "instruments" | "portfolio" | "search";

export default function App() {
  const [tab, setTab] = useState<TabKey>("instruments");

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.app}>
        <View style={styles.tabs}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setTab("instruments")}
            style={[styles.tab, tab === "instruments" && styles.tabActive]}
            testID="tab-instruments"
          >
            <Text style={styles.tabText}>Instrumentos</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setTab("portfolio")}
            style={[styles.tab, tab === "portfolio" && styles.tabActive]}
            testID="tab-portfolio"
          >
            <Text style={styles.tabText}>Portfolio</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setTab("search")}
            style={[styles.tab, tab === "search" && styles.tabActive]}
            testID="tab-search"
          >
            <Text style={styles.tabText}>Buscar</Text>
          </Pressable>
        </View>
        {tab === "instruments" && <InstrumentsScreen />}
        {tab === "portfolio" && <PortfolioScreen />}
        {tab === "search" && <SearchScreen />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.background
  },
  tab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt
  },
  tabActive: {
    backgroundColor: colors.primary
  },
  tabText: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 13
  }
});
