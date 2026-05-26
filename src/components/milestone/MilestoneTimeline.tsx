import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import { formatDisplayDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeableRow } from "./SwipeableRow";

type Props = {
  items: Milestone[];
  onEdit: (item: Milestone) => void;
  onDelete: (id: string) => void;
};

export function MilestoneTimeline({ items, onEdit, onDelete }: Props) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const sorted = [...items].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Our milestones</Text>
      <Text style={styles.subheading}>Every moment that shaped us</Text>

      {sorted.length === 0 ? (
        <Text style={styles.empty}>
          No milestones yet. Tap “Add a milestone” to save your first memory.
        </Text>
      ) : null}

      <View style={styles.list}>
        {sorted.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.6}
            onPress={() => setSelectedMilestone(item)} 
          >
            <SwipeableRow
              item={item}
              isLast={index === sorted.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TouchableOpacity>
        ))}
      </View>

      
      <Modal
        visible={!!selectedMilestone}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedMilestone(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setSelectedMilestone(null)}
        >
          <View style={styles.modalContent}>
            {selectedMilestone && (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalEmoji}>{selectedMilestone.emoji || "💖"}</Text>
                  <View style={styles.modalMeta}>
                    <Text style={styles.modalTitleText}>{selectedMilestone.title}</Text>
                    <Text style={styles.modalFullNoteText}>{selectedMilestone.note}</Text>
                    <Text style={styles.modalDateText}>
                      {formatDisplayDate(selectedMilestone.date)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setSelectedMilestone(null)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={20} color="#A39399" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={true}>
                  <Text style={styles.modalFullNoteText}>
                    {selectedMilestone.note || "No extra notes recorded for this milestone."}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5A4B50",
  },
  subheading: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 2,
    marginBottom: 20,
  },
  empty: {
    textAlign: "center",
    color: "#A39399",
    marginVertical: 20,
    fontSize: 14,
  },
  list: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(90, 75, 80, 0.35)", 
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 320,
    padding: 20,
    shadowColor: "#5A4B50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#FDF0F3",
    paddingBottom: 12,
    marginBottom: 14,
  },
  modalEmoji: {
    fontSize: 30,
    marginRight: 12,
  },
  modalMeta: {
    flex: 1,
    paddingRight: 6,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5A4B50",
  },
  modalDateText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.tertiary,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: "#FFFBFC",
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FDF0F3",
  },
  modalScrollBody: {
    maxHeight: 180,
  },
  modalFullNoteText: {
    fontSize: 14,
    color: "#5A4B50",
    lineHeight: 22,
  },
});