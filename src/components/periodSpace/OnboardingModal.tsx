import { colors } from "@/constants/theme";
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

  const handleFinish = () => {
    onSave(parseInt(cycle) || 28, parseInt(period) || 5);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      {/* SAFE OVERLAY (NO BLUR) */}
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            {/* HERO */}
            <LinearGradient
              colors={["rgba(255, 194, 209, 0.15)", "rgba(255, 194, 209, 0)"]}
              style={styles.hero}
            >
              <View style={styles.heroIcon}>
                <LinearGradient
                  colors={["#FFB6C1", "#FF8DA1"]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="heart" size={28} color={colors.white} />
                </LinearGradient>
              </View>

              <Text style={styles.heroTitle}>
                {isDismissable ? "Tracking Settings" : "Welcome to Her Space"}
              </Text>

              <Text style={styles.heroSubtitle}>
                {isDismissable
                  ? "Adjust your cycle tracking"
                  : "Let's personalize your cycle perfectly"}
              </Text>
            </LinearGradient>

            {/* CONTENT */}
            <View style={styles.content}>
              {/* CYCLE */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Average Cycle Length (Days)
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    cycleFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={cycleFocused ? colors.primary : colors.neutral}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={cycle}
                    onChangeText={setCycle}
                    onFocus={() => setCycleFocused(true)}
                    onBlur={() => setCycleFocused(false)}
                    placeholder="28"
                    placeholderTextColor="rgba(137,113,114,0.4)"
                    returnKeyType="done"
                    importantForAutofill="no"
                  />
                </View>
              </View>

              {/* PERIOD */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Average Period Length (Days)
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    periodFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons
                    name="water-outline"
                    size={20}
                    color={periodFocused ? colors.primary : colors.neutral}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={period}
                    onChangeText={setPeriod}
                    onFocus={() => setPeriodFocused(true)}
                    onBlur={() => setPeriodFocused(false)}
                    placeholder="5"
                    placeholderTextColor="rgba(137,113,114,0.4)"
                    returnKeyType="done"
                    importantForAutofill="no"
                  />
                </View>
              </View>

              {/* BUTTON */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleFinish}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF7EB3", "#FF758C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isDismissable ? "Apply Parameters" : "Get Started"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* CLOSE */}
              {isDismissable && onClose && (
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel & Close</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)", // SAFE BLUR REPLACEMENT
    justifyContent: "flex-start",
  },
  keyboardView: { flex: 1 },
  sheet: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingHorizontal: 20,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
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
    color: colors.neutral,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(137,113,114,0.7)",
    textAlign: "center",
  },
  content: { paddingTop: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.creamBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral,
    paddingVertical: 14,
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
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 12,
  },
  cancelButtonText: {
    color: "rgba(137,113,114,0.6)",
    fontSize: 15,
    fontWeight: "600",
  },
});
