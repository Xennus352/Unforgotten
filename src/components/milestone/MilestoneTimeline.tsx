import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import { formatDisplayDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeableRow } from "./SwipeableRow";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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

      {/* UNIQUE ENVELOPE LOVE LETTER MODAL */}
      <Modal
        visible={!!selectedMilestone}
        animationType="none"
        transparent={true}
        onRequestClose={() => setSelectedMilestone(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setSelectedMilestone(null)}
        >
          {selectedMilestone && (
            <UniqueLoveLetterContent 
              milestone={selectedMilestone} 
              onClose={() => setSelectedMilestone(null)} 
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

// ✅ SUB-COMPONENT: The Beautiful Love Letter Envelope Experience
function UniqueLoveLetterContent({ milestone, onClose }: { milestone: Milestone; onClose: () => void }) {
  const fullText = milestone.note || "No extra notes recorded for this milestone. 💕";
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  // Animation Anchors
  const letterSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const auraPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Generating coordinates for 6 magical floating background micro-hearts
  const particles = useRef(
    Array.from({ length: 6 }).map(() => ({
      anim: new Animated.Value(0),
      left: Math.random() * (SCREEN_WIDTH - 60) + 20,
      delay: Math.random() * 800,
    }))
  ).current;

  useEffect(() => {
    // 1️⃣ Slide Love Letter Up from bottom smoothly
    Animated.spring(letterSlideAnim, {
      toValue: 0,
      tension: 35,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // 2️⃣ Ambient Aura Pulse Loop (Gives a warm breathing glow effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(auraPulseAnim, {
          toValue: 1.01,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auraPulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3️⃣ Typewriter effect initiation
    setDisplayedText("");
    indexRef.current = 0;
    const typingInterval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(indexRef.current));
        indexRef.current += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, 195);

    // 4️⃣ Fire Individual Magic Particles
    particles.forEach((p) => {
      const runParticle = () => {
        p.anim.setValue(0);
        Animated.timing(p.anim, {
          toValue: 1,
          duration: 2500 + Math.random() * 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => runParticle());
      };
      setTimeout(runParticle, p.delay);
    });

    return () => clearInterval(typingInterval);
  }, [fullText]);

  return (
    <View style={styles.letterContainer}>
      
      {/* RENDER FLOATING MAGIC BACKGROUND PARTICLES */}
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [60, -180] });
        const opacity = p.anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.7, 0.7, 0] });
        const scale = p.anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.1, 0.5] });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              { left: p.left, opacity, transform: [{ translateY }, { scale }] },
            ]}
          >
            <Ionicons name="sparkles" size={14} color="#FFB6C1" />
          </Animated.View>
        );
      })}

      {/* THE EMBEDDED LETTERS MAIN CARD STRUCTURE */}
      <Animated.View 
        style={[
          styles.loveLetterCard,
          {
            transform: [
              { translateY: letterSlideAnim },
              { scale: auraPulseAnim } 
            ]
          }
        ]}
      >
      
        <View style={styles.letterTopFlapEdge} />

        <View style={styles.letterHeader}>
          <View style={styles.stampContainer}>
            <Text style={styles.stampEmoji}>{milestone.emoji || "✉️"}</Text>
          </View>
          
          <View style={styles.headerTextGroup}>
            <Text style={styles.letterTitle}>{milestone.title}</Text>
            <Text style={styles.letterDate}>{formatDisplayDate(milestone.date)}</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.waxSealClose}>
            <Ionicons name="close" size={16} color="#FFF" style={styles.closeHeartIcon} />
          </TouchableOpacity>
        </View>

        
        <View style={styles.paperBodyContainer}>
          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.handwrittenNoteText}>
              {displayedText}
              {indexRef.current < fullText.length && <Text style={styles.heartCursor}>♥</Text>}
            </Text>
          </ScrollView>
        </View>

        {/* Love Note Footer Seal Sign-off */}
        <View style={styles.letterFooter}>
          <Text style={styles.footerSignOff}>Forever & Always</Text>
          <Ionicons name="heart" size={12} color="#FF6987" style={styles.miniHeart} />
        </View>
      </Animated.View>
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
  
  /* UNIQUE LOVE LETTER ARCHITECTURE DESIGN */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(74, 55, 60, 0.45)", // Warm cocoa deeply-muted backdrop overlay
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  letterContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loveLetterCard: {
    backgroundColor: "#FFFDF6", // Warm old-parchment stationery linen tone
    borderRadius: 24,
    width: "100%",
    maxWidth: 325,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FCE7EB",
    shadowColor: "#FF6987",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },
  letterTopFlapEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "rgba(255, 105, 135, 0.3)", // Soft blushing upper letter binding accent
  },
  letterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  stampContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF5F6",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#FFB6C1", // Vintage postage-stamp look
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stampEmoji: {
    fontSize: 24,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 6,
  },
  letterTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4A3B40",
    letterSpacing: -0.3,
  },
  letterDate: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.tertiary,
    marginTop: 2,
    textTransform: "uppercase",
  },
  waxSealClose: {
    backgroundColor: "#FF6987", // Wax-seal inspired close button block
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6987",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  closeHeartIcon: {
    marginTop: 1,
  },
  paperBodyContainer: {
    backgroundColor: "rgba(254, 250, 230, 0.4)", // Inner note paper layer
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.25)",
    minHeight: 100,
  },
  scrollBody: {
    maxHeight: 200,
  },
  handwrittenNoteText: {
    fontSize: 15,
    color: "#5A4B50",
    lineHeight: 24,
    fontWeight: "600",
    fontStyle: "italic", // Feels personal and intimate
    letterSpacing: 0.2,
  },
  heartCursor: {
    color: "#FF6987",
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 2,
  },
  letterFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255, 230, 235, 0.6)",
  },
  footerSignOff: {
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "700",
    color: "#A39399",
    marginRight: 4,
  },
  miniHeart: {
    marginTop: 1,
  },
  particle: {
    position: "absolute",
    zIndex: 0,
    pointerEvents: "none",
  },
});