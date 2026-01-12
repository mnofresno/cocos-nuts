import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSubmitOrder } from "../hooks/useSubmitOrder";
import { formatCurrency } from "../lib/format";
import { Instrument } from "../domain/instrument";
import { OrderSide, OrderType } from "../domain/orders";
import { colors, fonts, radii, spacing } from "../theme";

type OrderModalProps = {
  instrument: Instrument | null;
  onClose: () => void;
};

type QuantityMode = "quantity" | "amount";

function parsePositiveNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function OrderModal({ instrument, onClose }: OrderModalProps) {
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [type, setType] = useState<OrderType>(OrderType.MARKET);
  const [mode, setMode] = useState<QuantityMode>("quantity");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const { submit, submitting, error, result } = useSubmitOrder();

  const computedQuantity = useMemo(() => {
    if (!instrument) return 0;
    if (mode === "quantity") {
      const parsed = parsePositiveNumber(quantity);
      return parsed ? Math.floor(parsed) : 0;
    }

    const parsedAmount = parsePositiveNumber(amount);
    if (!parsedAmount) return 0;
    return Math.max(0, Math.floor(parsedAmount / instrument.last_price));
  }, [amount, instrument, mode, quantity]);

  const priceValue = useMemo(() => {
    if (type === OrderType.MARKET) return undefined;
    const parsed = parsePositiveNumber(price);
    return parsed ?? undefined;
  }, [price, type]);

  const canSubmit =
    !!instrument &&
    computedQuantity > 0 &&
    (type === OrderType.MARKET || (priceValue ?? 0) > 0) &&
    !submitting;

  if (!instrument) return null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await submit({
        instrument_id: instrument.id,
        side,
        type,
        quantity: computedQuantity,
        ...(type === OrderType.LIMIT ? { price: priceValue } : {})
      });
    } catch {
      // errors are handled in hook state
    }
  };

  return (
    <Modal
      visible
      animationType="fade"
      transparent
      onRequestClose={onClose}
      testID="order-modal"
    >
      <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button" />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Orden {instrument.ticker}</Text>
          <Pressable onPress={onClose} accessibilityRole="button">
            <Text style={styles.close}>Cerrar</Text>
          </Pressable>
        </View>

        <Text style={styles.subtitle}>{instrument.name}</Text>
        <Text style={styles.helper}>Último precio: {formatCurrency(instrument.last_price)}</Text>

        <View style={styles.group}>
          <Text style={styles.label}>Lado</Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.chip, side === OrderSide.BUY && styles.chipActive]}
              onPress={() => setSide(OrderSide.BUY)}
              testID="order-side-buy"
            >
              <Text style={styles.chipText}>Comprar</Text>
            </Pressable>
            <Pressable
              style={[styles.chip, side === OrderSide.SELL && styles.chipActive]}
              onPress={() => setSide(OrderSide.SELL)}
              testID="order-side-sell"
            >
              <Text style={styles.chipText}>Vender</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.chip, type === OrderType.MARKET && styles.chipActive]}
              onPress={() => setType(OrderType.MARKET)}
              testID="order-type-market"
            >
              <Text style={styles.chipText}>Market</Text>
            </Pressable>
            <Pressable
              style={[styles.chip, type === OrderType.LIMIT && styles.chipActive]}
              onPress={() => setType(OrderType.LIMIT)}
              testID="order-type-limit"
            >
              <Text style={styles.chipText}>Limit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Cantidad</Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.chip, mode === "quantity" && styles.chipActive]}
              onPress={() => setMode("quantity")}
              testID="order-mode-quantity"
            >
              <Text style={styles.chipText}>Cantidad exacta</Text>
            </Pressable>
            <Pressable
              style={[styles.chip, mode === "amount" && styles.chipActive]}
              onPress={() => setMode("amount")}
              testID="order-mode-amount"
            >
              <Text style={styles.chipText}>Monto en pesos</Text>
            </Pressable>
          </View>
          {mode === "quantity" ? (
            <TextInput
              placeholder="Ej: 10"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
              testID="order-quantity-input"
            />
          ) : (
            <>
              <TextInput
                placeholder="Ej: 50000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
                testID="order-amount-input"
              />
              <Text style={styles.helper}>
                Enviaremos {computedQuantity} acciones (máximo sin fracciones).
              </Text>
            </>
          )}
        </View>

        {type === OrderType.LIMIT ? (
          <View style={styles.group}>
            <Text style={styles.label}>Precio límite</Text>
            <TextInput
              placeholder="Ej: 120.50"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
              testID="order-price-input"
            />
          </View>
        ) : null}

        {error ? (
          <Text style={styles.error} testID="order-error">
            {error}
          </Text>
        ) : null}

        {result ? (
          <View style={styles.result} testID="order-result">
            <Text style={styles.resultTitle}>Orden enviada</Text>
            <Text style={styles.resultText}>ID: {result.id}</Text>
            <Text style={styles.resultText}>Status: {result.status}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          testID="order-submit-button"
        >
          {submitting ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.submitText}>Enviar orden</Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000080"
  },
  sheet: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    top: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.text
  },
  close: {
    fontFamily: fonts.body,
    color: colors.textMuted
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14
  },
  helper: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 12
  },
  group: {
    gap: spacing.sm
  },
  label: {
    fontFamily: fonts.body,
    color: colors.text
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt
  },
  chipActive: {
    backgroundColor: colors.primary
  },
  chipText: {
    fontFamily: fonts.body,
    color: colors.text
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    color: colors.text
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger
  },
  submit: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: "center"
  },
  submitDisabled: {
    opacity: 0.5
  },
  submitText: {
    fontFamily: fonts.heading,
    color: colors.text
  },
  result: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs
  },
  resultTitle: {
    fontFamily: fonts.heading,
    color: colors.text
  },
  resultText: {
    fontFamily: fonts.body,
    color: colors.text
  }
});
