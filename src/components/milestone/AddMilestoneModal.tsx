import { DatePickerField } from "@/components/milestone/DatePickerField";
import { colors } from "@/constants/theme";
import type { NewMilestone } from "@/lib/db/milestones";
import type { Milestone } from "@/types/milestone"; // ✅ Added import
import { toIsoDate } from "@/utils/date";
import { useEffect, useState } from "react"; // ✅ Added useEffect
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const EMOJI_OPTIONS = ["💕", "💌", "🌹", "💍", "✈️", "🎂", "🎉", "🏠", "📸", "🌸", "❤️", "🎊"];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: NewMilestone) => Promise<unknown>;
  initialData?: Milestone; // ✅ 1. Accept initial data payload
};

export function AddMilestoneModal({ visible, onClose, onSave, initialData }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [emoji, setEmoji] = useState("💕");
  const [date, setDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 2. Sync state with editing record when modal context pivots
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setNote(initialData.note || "");
        setEmoji(initialData.emoji);
        setDate(initialData.date ? new Date(initialData.date) : new Date());
      } else {
        resetForm();
      }
    }
  }, [initialData, visible]);

  const resetForm = () => {
    setTitle("");
    setNote("");
    setEmoji("💕");
    setDate(new Date());
    setError(null);
  };

  const handleClose = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Give this moment a title.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: trimmedTitle,
        date: toIsoDate(date),
        emoji,
        note: note.trim() || undefined,
      });
      resetForm();
      onClose();
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>{initialData ? "Edit milestone" : "New milestone"}</Text>
          <Text style={styles.subheading}>
            {initialData ? "Make adjustments to your memory" : "Save a moment you never want to forget"}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. First trip together"
              placeholderTextColor="#B8A8AA"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />

            <Text style={styles.label}>Date</Text>
            <DatePickerField value={date} onChange={setDate} />

            <Text style={styles.label}>Icon</Text>
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setEmoji(option)}
                  style={[styles.emojiChip, emoji === option && styles.emojiChipSelected]}
                >
                  <Text style={styles.emoji}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="A short memory..."
              placeholderTextColor="#B8A8AA"
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={200}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleClose} disabled={saving}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.saveButton, saving && styles.disabled]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save changes</Text>}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(90, 75, 80, 0.45)" },
  sheet: { maxHeight: "88%", backgroundColor: "#FFFBFC", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(90, 75, 80, 0.2)", marginBottom: 12 },
  heading: { fontSize: 22, fontWeight: "800", color: "#5A4B50" },
  subheading: { fontSize: 14, color: colors.neutral, marginTop: 4, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: "#5A4B50", marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "rgba(255, 194, 209, 0.9)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: "#5A4B50", backgroundColor: "#fff" },
  noteInput: { minHeight: 88, textAlignVertical: "top" },
  emojiRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emojiChip: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(255, 194, 209, 0.6)" },
  emojiChipSelected: { borderColor: colors.tertiary, backgroundColor: "rgba(254, 243, 199, 0.8)" },
  emoji: { fontSize: 22 },
  error: { color: "#DC2626", fontSize: 14, marginTop: 12 },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center", minHeight: 48 },
  cancelButton: { backgroundColor: "rgba(255, 255, 255, 0.9)", borderWidth: 1, borderColor: "rgba(255, 194, 209, 0.8)" },
  saveButton: { backgroundColor: colors.tertiary },
  disabled: { opacity: 0.7 },
  cancelText: { fontSize: 15, fontWeight: "700", color: colors.neutral },
  saveText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});