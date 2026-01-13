/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  const initialWindowMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 }
  };

  const SafeAreaContext = React.createContext(initialWindowMetrics.insets);

  const SafeAreaProvider = ({ children, initialMetrics }: any) => {
    const metrics = initialMetrics || initialWindowMetrics;
    return React.createElement(
      SafeAreaContext.Provider,
      { value: metrics.insets },
      children
    );
  };

  const SafeAreaView = ({ children, style, ...props }: any) => {
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
