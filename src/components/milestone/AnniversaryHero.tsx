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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Our Space</Text>
      </View>
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
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 194, 209, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.4)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.neutral,
    letterSpacing: 0.5,
  },
});