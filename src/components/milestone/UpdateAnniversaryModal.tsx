import { DatePickerField } from "@/components/milestone/DatePickerField";
import { colors } from "@/constants/theme";
import { toIsoDate } from "@/utils/date";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  currentDateString: string | null;
  onSave: (isoDate: string) => Promise<void>;
};

export function UpdateAnniversaryModal({
  visible,
  onClose,
  currentDateString,
  onSave,
}: Props) {
  const [date, setDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);

  // Sync state if modal reopens with a different date saved in SQLite
  useEffect(() => {
    if (visible && currentDateString) {
      try {
        // Fallback to standard instantiation if your utility isn't named parseIsoDate
        const parsed = new Date(currentDateString);
        if (!isNaN(parsed.getTime())) {
          setDate(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [visible, currentDateString]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(toIsoDate(date));
      Alert.alert("Updated", "Your anniversary date has been updated! ❤️");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Could not update the anniversary.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Change Anniversary Date</Text>
          <Text style={styles.subheading}>
            Update the starting date of your relationship timeline.
          </Text>

          <DatePickerField value={date} onChange={setDate} />

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.saveButton, saving && styles.disabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Update</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  heading: { fontSize: 20, fontWeight: "800", color: "#5A4B50" },
  subheading: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 4,
    marginBottom: 20,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: colors.neutral },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  disabled: { opacity: 0.6 },
});
