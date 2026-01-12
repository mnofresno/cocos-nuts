/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock("react-native-safe-area-context", () => {
  const React = require("react") as typeof import("react");
  const { View } = require("react-native") as typeof import("react-native");

  const initialWindowMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 }
  };

  const SafeAreaContext = React.createContext(initialWindowMetrics.insets);

  const SafeAreaProvider = ({
    children,
    initialMetrics
  }: {
    children?: React.ReactNode;
    initialMetrics?: typeof initialWindowMetrics;
  }) => {
    const metrics = initialMetrics || initialWindowMetrics;
    return React.createElement(
      SafeAreaContext.Provider,
      { value: metrics.insets },
      children
    );
  };

  const SafeAreaView = ({
    children,
    style,
    ...props
  }: {
    children?: React.ReactNode;
    style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
  }) => React.createElement(View, { style, ...props }, children);

  return {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets: () => initialWindowMetrics.insets,
    initialWindowMetrics
  };
});
