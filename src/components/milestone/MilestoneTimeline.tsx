import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import { formatDisplayDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

type Props = {
  items: Milestone[];
  onEdit?: (item: Milestone) => void;
  onDelete?: (id: string) => void; 
};

// Isolated individual item component parameters
interface SwipeableRowProps {
  item: Milestone;
  isLast: boolean;
  onEdit?: (item: Milestone) => void;
  onDelete?: (id: string) => void; // ✅ FIXED: Signature aligned with parent interface
}

function SwipeableRow({
  item,
  isLast,
  onEdit,
  onDelete,
}: SwipeableRowProps) {
  const swipeableRef = React.useRef<Swipeable>(null);

  // Renders action panels on the right side
  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        {/* EDIT BUTTON */}
        <Pressable
          style={[styles.actionButton, styles.editActionButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit?.(item);
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </Pressable>

        {/* DELETE BUTTON */}
        <Pressable
          style={[styles.actionButton, styles.deleteActionButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.(item.id); 
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.row}>
      {/* TIMELINE LEFT TRACK EMBED */}
      <View style={styles.rail}>
        <View style={styles.dot}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* GESTURE SLIDER FRAMEWAY */}
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
      >
        <View style={[styles.card, isLast && styles.cardLast]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formatDisplayDate(item.date)}</Text>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
        </View>
      </Swipeable>
    </View>
  );
}

export function MilestoneTimeline({ items, onEdit, onDelete }: Props) {
   
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          <SwipeableRow
            key={item.id}
            item={item}
            isLast={index === sorted.length - 1} // Line connects appropriately
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5A4B50",
  },
  subheading: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 4,
    marginBottom: 12,
  },
  empty: {
    fontSize: 14,
    color: colors.neutral,
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: "italic",
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    minHeight: 88,
  },
  rail: {
    width: 44,
    alignItems: "center",
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  emoji: {
    fontSize: 18,
  },
  line: {
    position: "absolute",
    top: 40,
    bottom: -8,
    width: 2,
    backgroundColor: "rgba(245, 158, 11, 0.35)",
    borderRadius: 1,
  },
  swipeableContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.6)",
  },
  cardLast: {
    marginBottom: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5A4B50",
  },
  date: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.tertiary,
    marginTop: 4,
  },
  note: {
    fontSize: 13,
    color: colors.neutral,
    marginTop: 6,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: "row",
    width: 140,
    height: "100%",
    paddingLeft: 8,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 16,
  },
  editActionButton: {
    backgroundColor: "#A39399", 
    marginRight: 6,
  },
  deleteActionButton: {
    backgroundColor: "#E91E63", 
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
}); 