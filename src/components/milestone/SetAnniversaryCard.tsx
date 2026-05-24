import { colors } from "@/constants/theme";
import { DatePickerField } from "@/components/milestone/DatePickerField";
import { toIsoDate } from "@/utils/date";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  onSave: (isoDate: string) => Promise<void>;
};

export function SetAnniversaryCard({ onSave }: Props) {
  const [date, setDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(toIsoDate(date));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>When did you start dating?</Text>
      <Text style={styles.subtitle}>
        This powers your “days together” counter on the card above.
      </Text>

      <DatePickerField value={date} onChange={setDate} />

      <Pressable
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save anniversary date</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.8)",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5A4B50",
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.tertiary,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.7,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
