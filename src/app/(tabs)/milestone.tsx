import { AddMilestoneModal } from "@/components/milestone/AddMilestoneModal";
import { AnniversaryHero } from "@/components/milestone/AnniversaryHero";
import { MilestoneCalendarPanel } from "@/components/milestone/MilestoneCalendarPanel";
import { MilestoneTimeline } from "@/components/milestone/MilestoneTimeline";
import { SetAnniversaryCard } from "@/components/milestone/SetAnniversaryCard";
import { colors } from "@/constants/theme";
import { useMilestones } from "@/hooks/useMilestones";
import { deleteMilestone, updateMilestone } from "@/lib/db/milestones";
import type { Milestone } from "@/types/milestone";
import { daysTogetherSince, formatDisplayDate } from "@/utils/date";
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
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

 
  const { milestones, relationshipStart, loading, reload, addMilestone } = useMilestones();

  const days = relationshipStart ? daysTogetherSince(relationshipStart) : 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteMilestone(id);
      await reload(); 
    } catch (error) {
      console.error("Failed to delete milestone row:", error);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setModalVisible(true); 
  };

  const handleSaveOrUpdate = async (fields: { title: string; note?: string; emoji: string; date: string }) => {
    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id, fields);
      } else {
        await addMilestone(fields);
      }
      
      setModalVisible(false);
      setEditingMilestone(null);
      
      await reload();
    } catch (error) {
      console.error("Error committing milestone modification task:", error);
    }
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollViewWrapper}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <MilestoneCalendarPanel milestones={milestones} />

          <View style={styles.contentBody}>
            {!relationshipStart ? (
              <SetAnniversaryCard onSave={async (d) => {}} />
            ) : (
              <View style={styles.heroGrid}>
                <View style={styles.heroMainColumn}>
                  <AnniversaryHero
                    daysTogether={days}
                    sinceLabel={formatDisplayDate(relationshipStart)}
                  />
                </View>

                <View style={styles.heroSideColumn}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionCard,
                      pressed && styles.actionCardPressed,
                    ]}
                    onPress={() => {
                      setEditingMilestone(null); 
                      setModalVisible(true);
                    }}
                  >
                    <View style={styles.plusIconCircle}>
                      <Text style={styles.plusIconText}>+</Text>
                    </View>
                    <Text style={styles.actionCardLabel}>Log Moment</Text>
                  </Pressable>

                  <View style={styles.metaStatCard}>
                    <Text style={styles.metaStatNumber}>
                      {milestones.length}
                    </Text>
                    <Text style={styles.metaStatLabel}>Memories Shared</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.timelineContainer}>
              <MilestoneTimeline 
                items={milestones} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </View>
          </View>
        </ScrollView>
      )}

      <AddMilestoneModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingMilestone(null);
        }}
        onSave={handleSaveOrUpdate}
        initialData={editingMilestone ?? undefined} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.creamBg,
  },
  scrollViewWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  contentBody: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 28,
  },
  heroGrid: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  heroMainColumn: {
    flex: 1.4,
  },
  heroSideColumn: {
    flex: 1,
    gap: 12,
    justifyContent: "space-between",
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.4)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  plusIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 194, 209, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  plusIconText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.neutral,
    marginTop: -2,
  },
  actionCardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.neutral,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  metaStatCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.2)",
  },
  metaStatNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4A3E3F",
  },
  metaStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral,
    marginTop: 2,
    textAlign: "center",
  },
  timelineContainer: {
    marginTop: 4,
  },
});