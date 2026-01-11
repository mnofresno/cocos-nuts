import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from './src/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
      </View>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cocos Nuts</Text>
          <Text style={styles.subtitle}>Scaffold inicial</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholder}>React Native + Expo</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  glowOne: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    top: -80,
    right: -60,
  },
  glowTwo: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    bottom: -90,
    left: -80,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.heading,
    color: colors.text,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholder: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
