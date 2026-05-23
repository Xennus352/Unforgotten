import { colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function MilestoneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Space Milestones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.tertiary, // Uses Gentle Gold Accent
  },
});
