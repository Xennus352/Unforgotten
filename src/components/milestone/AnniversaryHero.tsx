import { colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  daysTogether: number;
  sinceLabel: string;
};

export function AnniversaryHero({ daysTogether, sinceLabel }: Props) {
  return (
    <LinearGradient
      colors={["#FEF3C7", "#FDE68A", "#FCD34D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.eyebrow}>Together for</Text>
      <Text style={styles.days}>{daysTogether.toLocaleString()}</Text>
      <Text style={styles.unit}>days of love</Text>
      <View style={styles.divider} />
      <Text style={styles.since}>Since {sinceLabel}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Our Space</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
    shadowColor: colors.tertiary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  days: {
    fontSize: 56,
    fontWeight: "800",
    color: "#78350F",
    marginTop: 4,
    lineHeight: 62,
  },
  unit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B45309",
    marginTop: -4,
  },
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(120, 53, 15, 0.2)",
    marginVertical: 16,
  },
  since: {
    fontSize: 15,
    fontWeight: "500",
    color: "#92400E",
  },
  badge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.tertiary,
    letterSpacing: 0.3,
  },
});
