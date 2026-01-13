import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "../theme";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type ToastType = "success" | "error" | "info";

type ToastMessage = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastContextValue = {
    show: (params: { message: string; type?: ToastType; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const show = useCallback(
        ({
            message,
            type = "info",
            duration = 3000
        }: {
            message: string;
            type?: ToastType;
            duration?: number;
        }) => {
            const id = Math.random().toString(36).substring(7);
            setToast({ id, message, type });

            setTimeout(() => {
                setToast((current) => (current?.id === id ? null : current));
            }, duration);
        },
        []
    );

    const value = useMemo(() => ({ show }), [show]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toast && (
                <View style={styles.container} pointerEvents="none">
                    <Animated.View
                        key={toast.id}
                        entering={FadeInDown}
                        exiting={FadeOutDown}
                        style={[styles.toast, styles[toast.type]]}
                    >
                        <Text style={styles.text} testID="toast-message">{toast.message}</Text>
                    </Animated.View>
                </View>
            )}
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: spacing.xl,
        left: spacing.lg,
        right: spacing.lg,
        alignItems: "center",
        zIndex: 9999
    },
    toast: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.md,
        backgroundColor: colors.surfaceAlt,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    success: {
        borderLeftColor: colors.success,
        backgroundColor: colors.surface
    },
    error: {
        borderLeftColor: colors.danger,
        backgroundColor: colors.surface
    },
    info: {
        borderLeftColor: colors.accent,
        backgroundColor: colors.surface
    },
    text: {
        fontFamily: fonts.body,
        color: colors.text,
        fontSize: 14
    }
});
