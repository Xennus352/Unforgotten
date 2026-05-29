import { colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  daysTogether: number;
  sinceLabel: string;
  onBadgePress?: () => void;
};

export function AnniversaryHero({
  daysTogether,
  sinceLabel,
  onBadgePress,
}: Props) {
  return (
    <LinearGradient
      colors={["#FFFFFF", colors.creamBg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.eyebrow}>Together for</Text>
      <Text style={styles.days}>{daysTogether.toLocaleString()}</Text>
      <Text style={styles.unit}>days of love</Text>
      <View style={styles.divider} />
      <Text style={styles.since}>Since {sinceLabel}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.badge,
          pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
        ]}
        onPress={onBadgePress}
      >
        <Text style={styles.badgeText}>Our Space ›</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 194, 209, 0.4)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neutral,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    padding: 1,
  },
  days: {
    fontSize: 60,
    fontWeight: "900",
    color: "#4A3E3F",
    marginTop: 6,
    lineHeight: 66,
  },
  unit: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral,
    marginTop: 2,
  },
  divider: {
    width: 36,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
    marginVertical: 20,
  },
  since: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3E3F",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 10,
    paddingHorizontal: 18,

    marginTop: 16, 

    borderRadius: 999, 

    backgroundColor: "#FF7EB3",

    borderWidth: 0,  

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
