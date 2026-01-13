/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  const initialWindowMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 }
  };

  const SafeAreaContext = React.createContext(initialWindowMetrics.insets);

  const SafeAreaProvider = ({ children, initialMetrics }: { children: React.ReactNode, initialMetrics?: unknown }) => {
    const metrics = (initialMetrics as { insets?: typeof initialWindowMetrics.insets }) || initialWindowMetrics;
    return React.createElement(
      SafeAreaContext.Provider,
      { value: metrics.insets },
      children
    );
  };

  const SafeAreaView = ({ children, style, ...props }: { children: React.ReactNode, style?: unknown, [key: string]: unknown }) => {
    return React.createElement(View, { style, ...props }, children);
  };

  return {
    __esModule: true,
    default: {
      SafeAreaProvider,
      SafeAreaView,
      useSafeAreaInsets: () => initialWindowMetrics.insets,
      initialWindowMetrics
    },
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets: () => initialWindowMetrics.insets,
    initialWindowMetrics
  };
});

jest.mock("@expo-google-fonts/outfit", () => ({
  useFonts: () => [true],
  Outfit_400Regular: "Outfit_400Regular",
  Outfit_700Bold: "Outfit_700Bold"
}));

jest.mock("react-native-reanimated", () => {
  const View = require("react-native").View;
  return {
    __esModule: true,
    default: {
      View: View,
      createAnimatedComponent: (component: unknown) => component,
    },
    FadeInDown: {},
    FadeOutDown: {}
  };
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MaterialIcons: (props: { name: string }) => React.createElement(Text, props, props.name),
    Ionicons: (props: { name: string }) => React.createElement(Text, props, props.name),
  };
});
