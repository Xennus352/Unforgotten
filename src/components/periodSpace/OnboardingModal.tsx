/**
 * Onboarding and settings modal with premium styling
 * Handles both new user onboarding and settings configuration
 */

import { theme, layout } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

interface OnboardingModalProps {
  visible: boolean;
  isDismissable?: boolean;
  onClose?: () => void;
  onSave: (cycle: number, period: number) => void;
  initialCycle: number;
  initialPeriod: number;
}

export default function OnboardingModal({
  visible,
  isDismissable = false,
  onClose,
  onSave,
  initialCycle,
  initialPeriod,
}: OnboardingModalProps) {
  const [cycle, setCycle] = useState(String(initialCycle));
  const [period, setPeriod] = useState(String(initialPeriod));
  const [cycleFocused, setCycleFocused] = useState(false);
  const [periodFocused, setPeriodFocused] = useState(false);

  const handleSave = () => {
    const cycleValue = Math.max(21, Math.min(45, parseInt(cycle) || 28));
    const periodValue = Math.max(2, Math.min(14, parseInt(period) || 5));
    onSave(cycleValue, periodValue);
  };

  const handleCycleChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setCycle(numeric.slice(0, 2));
  };

  const handlePeriodChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setPeriod(numeric.slice(0, 2));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <LinearGradient
                  colors={["#FFB6C1", "#FF8DA1"]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="heart" size={28} color={theme.textInverse} />
                </LinearGradient>
              </View>

              <Text style={styles.heroTitle}>
                {isDismissable ? "Tracking Settings" : "Welcome to Her Space"}
              </Text>

              <Text style={styles.heroSubtitle}>
                {isDismissable
                  ? "Adjust your cycle tracking preferences"
                  : "Let's personalize your cycle perfectly"}
              </Text>
            </View>

            <View style={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Average Cycle Length (Days)</Text>

                <View
                  style={[
                    styles.inputWrapper,
                    cycleFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={cycleFocused ? theme.primary : theme.textSecondary}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={cycle}
                    onChangeText={handleCycleChange}
                    onFocus={() => setCycleFocused(true)}
                    onBlur={() => setCycleFocused(false)}
                    placeholder="28"
                    placeholderTextColor={theme.textMuted}
                    returnKeyType="done"
                    importantForAutofill="no"
                    accessibilityLabel="Cycle length"
                    accessibilityHint="Enter your average cycle length in days"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Average Period Length (Days)</Text>

                <View
                  style={[
                    styles.inputWrapper,
                    periodFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="water-outline"
                    size={20}
                    color={periodFocused ? theme.primary : theme.textSecondary}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={period}
                    onChangeText={handlePeriodChange}
                    onFocus={() => setPeriodFocused(true)}
                    onBlur={() => setPeriodFocused(false)}
                    placeholder="5"
                    placeholderTextColor={theme.textMuted}
                    returnKeyType="done"
                    importantForAutofill="no"
                    accessibilityLabel="Period length"
                    accessibilityHint="Enter your average period length in days"
                    maxLength={2}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={isDismissable ? "Apply Parameters" : "Get Started"}
              >
                <LinearGradient
                  colors={["#FF7EB3", "#FF8DA1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isDismissable ? "Apply Parameters" : "Get Started"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {isDismissable && onClose && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-start",
  },

  keyboardView: { flex: 1 },

  sheet: {
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingHorizontal: 20,
    paddingBottom: 36,
    elevation: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },

  hero: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,194,209,0.2)",
  },

  heroIcon: { marginBottom: 12 },

  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 4,
  },

  heroSubtitle: {
    fontSize: 13,
    color: theme.textMuted,
    textAlign: "center",
  },

  content: { paddingTop: 20 },

  inputGroup: { marginBottom: 16 },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.cardSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    minHeight: layout.touchTarget.minimum,
  },

  inputWrapperFocused: {
    borderColor: theme.primary,
  },

  inputIcon: { marginRight: 8 },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    paddingVertical: 12,
  },

  saveButton: {
    borderRadius: 20,
    marginTop: 8,
    overflow: "hidden",
  },

  buttonGradient: {
    padding: 16,
    alignItems: "center",
  },

  saveButtonText: {
    color: theme.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 12,
    minHeight: layout.touchTarget.minimum,
  },

  cancelButtonText: {
    color: theme.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
});