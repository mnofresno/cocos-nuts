import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics
} from "react-native-safe-area-context";
import { InstrumentsScreen } from "./src/screens/InstrumentsScreen";
import { PortfolioScreen } from "./src/screens/PortfolioScreen";
import { colors, fonts, radii, spacing } from "./src/theme";

type TabKey = "instruments" | "portfolio" | "search";

export default function App() {
  const [tab, setTab] = useState<TabKey>("instruments");

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          </View>
          {tab === "instruments" && <InstrumentsScreen />}
          {tab === "portfolio" && <PortfolioScreen />}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
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
