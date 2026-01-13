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
import { useToast } from "./Toast";

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

  const { submit, submitting, error } = useSubmitOrder();
  const toast = useToast();

  const priceValue = useMemo(() => {
    if (!instrument) return null;
    if (type === OrderType.MARKET) return instrument.last_price;
    return parsePositiveNumber(price);
  }, [type, price, instrument]);

  const computedQuantity = useMemo(() => {
    if (mode === "quantity") return parsePositiveNumber(quantity);
    const amountVal = parsePositiveNumber(amount);
    if (!amountVal || !priceValue) return null;
    return Math.floor(amountVal / priceValue);
  }, [mode, quantity, amount, priceValue]);

  const canSubmit = useMemo(() => {
    if (!computedQuantity || computedQuantity <= 0) return false;
    if (type === OrderType.LIMIT && !priceValue) return false;
    return true;
  }, [computedQuantity, type, priceValue]);

  if (!instrument) return null;


  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      const response = await submit({
        instrument_id: instrument.id,
        side,
        type,
        quantity: computedQuantity!,
        ...(type === OrderType.LIMIT ? { price: priceValue! } : {})
      });

      // If success (response is returned without throwing)
      onClose();
      toast.show({
        message: `Orden enviada: ${response.status} (ID: ${response.id})`,
        type: "success"
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
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View style={styles.sheet}>
          {/* Header, Subtitle, Inputs... Same content as before */}
          <View style={styles.header}>
            <Text style={styles.title}>Orden {instrument.ticker}</Text>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text style={styles.close}>Cerrar</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>{instrument.name}</Text>
          <Text style={styles.helper}>Último precio: {formatCurrency(instrument.last_price)}</Text>

          {/* Groups for Side, Type, Quantity, Price... */}
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

          {/* Removed Result View here as we rely on Toast */}

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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    padding: spacing.lg
  },
  sheet: {
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
