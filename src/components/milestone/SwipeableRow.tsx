import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import { formatDisplayDate } from "@/utils/date";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type Props = {
  item: Milestone;
  isLast: boolean;
  onEdit: (item: Milestone) => void;
  onDelete: (id: string) => void;
};

export function SwipeableRow({ item, isLast, onEdit, onDelete }: Props) {
  
  const renderRightActions = () => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(item.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.rowContainer}>
        {/* Timeline Line Graphics */}
        <View style={styles.timelineLeft}>
          <View style={styles.iconCircle}>
            <Text style={styles.emojiText}>{item.emoji || "💖"}</Text>
          </View>
          {!isLast && <View style={styles.verticalLine} />}
        </View>

        {/* Card Body Core */}
        <View style={styles.cardContent}>
          <Text 
            numberOfLines={1} 
            ellipsizeMode="tail" 
            style={styles.titleStyle}
          >
            {item.title}
          </Text>
          <Text style={styles.dateStyle}>{formatDisplayDate(item.date)}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    backgroundColor: "transparent", 
    paddingVertical: 2,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 14,
    width: 40,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  emojiText: {
    fontSize: 18,
  },
  verticalLine: {
    width: 2,
    position: "absolute",
    top: 40,
    bottom: -10, // Pulls line perfectly straight through items
    backgroundColor: "rgba(255, 194, 209, 0.5)",
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 132, 156, 0.34)",
    marginBottom: 12, // Clean fixed spacing between rows
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A4B50",
  },
  dateStyle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.tertiary,
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: "row",
    width: 130,
    height: 50,
    alignSelf: "center",
    paddingLeft: 8,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: "#E2E8F0",
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  actionText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#5A4B50",
  },
});