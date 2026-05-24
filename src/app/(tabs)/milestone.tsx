import { AddMilestoneModal } from "@/components/milestone/AddMilestoneModal";
import { AnniversaryHero } from "@/components/milestone/AnniversaryHero";
import { MilestoneCalendarPanel } from "@/components/milestone/MilestoneCalendarPanel";
import { MilestoneTimeline } from "@/components/milestone/MilestoneTimeline";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MilestoneScreen() {
  const insets = useSafeAreaInsets();
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
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 8, paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>🌸 Love Journey</Text>

          {!relationshipStart ? (
            <SetAnniversaryCard onSave={setAnniversary} />
          ) : (
            <AnniversaryHero
              daysTogether={days}
              sinceLabel={formatDisplayDate(relationshipStart)}
            />
          )}

          <MilestoneCalendarPanel milestones={milestones} />

          <MilestoneTimeline items={milestones} />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add a milestone</Text>
          </Pressable>
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
  scroll: {
    paddingHorizontal: 20,
    gap: 24,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#5A4B50",
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
