import { AddMilestoneModal } from "@/components/milestone/AddMilestoneModal";
import { AnniversaryHero } from "@/components/milestone/AnniversaryHero";
import { MilestoneCalendarPanel } from "@/components/milestone/MilestoneCalendarPanel";
import { SetAnniversaryCard } from "@/components/milestone/SetAnniversaryCard";
import { colors } from "@/constants/theme";
import { useMilestones } from "@/hooks/useMilestones";
import { daysTogetherSince, formatDisplayDate } from "@/utils/date";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MilestoneScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    milestones,
    relationshipStart,
    loading,
    addMilestone,
    setAnniversary,
  } = useMilestones();

  const days = relationshipStart ? daysTogetherSince(relationshipStart) : 0;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#FFF5F7", "#FFEDF2", "#FCE7F3"]}
        style={StyleSheet.absoluteFill}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.tertiary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollViewWrapper}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. Calendar Panel sits completely at the top layout index now */}
          <MilestoneCalendarPanel milestones={milestones} />

          <View style={styles.contentBody}>
            {/* 2. Golden relationship banner card stays cleanly nested under it */}
            {!relationshipStart ? (
              <SetAnniversaryCard onSave={setAnniversary} />
            ) : (
              <AnniversaryHero
                daysTogether={days}
                sinceLabel={formatDisplayDate(relationshipStart)}
              />
            )}

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Add a milestone</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <AddMilestoneModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addMilestone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  contentBody: {
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 16, // Adds a clean layout gap directly under the berry header card
  },
  addButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    borderStyle: "dashed",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.tertiary,
  },
});