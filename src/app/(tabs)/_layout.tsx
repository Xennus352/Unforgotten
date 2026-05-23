import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TabButtonProps {
  isFocused: boolean;
  label: string;
  activeIcon: IoniconsName;
  inactiveIcon: IoniconsName;
  onPress: (e: any) => void;
}

// 🌸 Premium Sophisticated Palette
const ACTIVE_PINK = "#E91E63";
const INACTIVE_MUTE = "rgba(90, 75, 80, 0.6)";

const GLASS_SPRING = {
  damping: 14,
  stiffness: 110,
  mass: 0.55,
};

// Dimensions config for pixel-perfect centering
const DROP_DIAMETER = 72;

// -----------------------------
// GLASS INTERACTIVE BUTTON
// -----------------------------
const WaterDropletButton = ({
  isFocused,
  label,
  activeIcon,
  inactiveIcon,
  onPress,
}: TabButtonProps) => {
  const contentScale = useSharedValue(1);

  useEffect(() => {
    contentScale.value = withSpring(isFocused ? 1.08 : 1, GLASS_SPRING);
  }, [isFocused]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: contentScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}
      android_ripple={{ color: "transparent" }}
    >
      <Animated.View
        style={[styles.buttonAlignmentFrame, animatedContentStyle]}
      >
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={24}
          color={isFocused ? ACTIVE_PINK : INACTIVE_MUTE}
        />
        <Text
          style={[
            styles.label,
            { color: isFocused ? ACTIVE_PINK : INACTIVE_MUTE },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// -----------------------------
// MAIN NAVIGATION LAYOUT
// -----------------------------
export default function TabLayout() {
  const { width } = useWindowDimensions();

  const BAR_MARGIN = 20;
  const BAR_INNER_PADDING = 8;
  const TAB_BAR_WIDTH = width - BAR_MARGIN * 2;
  const TRACK_WIDTH = TAB_BAR_WIDTH - BAR_INNER_PADDING * 2;
  const TAB_WIDTH = TRACK_WIDTH / 2;

  const translateX = useSharedValue(0);
  const movementVelocity = useSharedValue(0);

  const snapToCenterOfTab = (index: number) => {
    // Calculates the dead-center point of the specific tab block
    const tabCenter = index * TAB_WIDTH + TAB_WIDTH / 2;
    const targetX = tabCenter - DROP_DIAMETER / 2;

    movementVelocity.value = targetX - translateX.value;
    translateX.value = withSpring(targetX, GLASS_SPRING, (finished) => {
      if (finished) {
        movementVelocity.value = 0;
      }
    });
  };

  const glassDropletAnimatedStyle = useAnimatedStyle(() => {
    // Physics Engine: Squeezes the circle into an oval depending on transition velocity
    const stretchX = interpolate(
      Math.abs(movementVelocity.value),
      [0, TRACK_WIDTH],
      [1, 1.35],
      Extrapolation.CLAMP,
    );

    const squeezeY = interpolate(
      Math.abs(movementVelocity.value),
      [0, TRACK_WIDTH],
      [1, 0.82],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: stretchX },
        { scaleY: squeezeY },
      ],
    };
  });

  useEffect(() => {
    snapToCenterOfTab(0);
  }, []);

  return (
    <View style={styles.viewport}>
      {/* Soft Ambient Background Gradient */}
      <LinearGradient
        colors={["#FFF5F7", "#FFEDF2", "#FCE7F3"]}
        style={StyleSheet.absoluteFill}
      />

      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            left: BAR_MARGIN,
            right: BAR_MARGIN,
            bottom: 30,
            height: 76,
            borderRadius: 38,
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.5)",
            paddingHorizontal: BAR_INNER_PADDING,
            elevation: 0,
            shadowColor: "transparent",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "💕 Treasure",
            tabBarButton: (props) => (
              <WaterDropletButton
                isFocused={!!props.accessibilityState?.selected}
                label="Home"
                activeIcon="heart"
                inactiveIcon="heart-outline"
                onPress={(e) => {
                  snapToCenterOfTab(0);
                  props.onPress?.(e);
                }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="milestone"
          options={{
            title: "Moments",
            headerTitle: "🌸 Love Journey",
            tabBarButton: (props) => (
              <WaterDropletButton
                isFocused={!!props.accessibilityState?.selected}
                label="Calendar"
                activeIcon="calendar"
                inactiveIcon="calendar-outline"
                onPress={(e) => {
                  snapToCenterOfTab(1);
                  props.onPress?.(e);
                }}
              />
            ),
          }}
        />
      </Tabs>

      {/* DYNAMIC FROSTED GLASS DROPLET LAYER */}
      <View
        pointerEvents="none"
        style={[
          styles.dropletAbsoluteTrack,
          { left: BAR_MARGIN + BAR_INNER_PADDING, width: TRACK_WIDTH },
        ]}
      >
        <Animated.View
          style={[styles.liquidGlassCircle, glassDropletAnimatedStyle]}
        >
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={28}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={styles.androidGlassFallback} />
          )}

          {/* Internal Specular Glass Highlight Edge */}
          <View style={styles.glassHighlightRim} />
          <View style={styles.specularReflectionGlance} />
        </Animated.View>
      </View>
    </View>
  );
}

// -----------------------------
// PREMIUM STYLE ENGINE
// -----------------------------
const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    height: "100%",
  },
  buttonAlignmentFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20, // Forces structural icons to sit perfectly transparent above the drop
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  dropletAbsoluteTrack: {
    position: "absolute",
    bottom: 30,
    height: 76,
    zIndex: 5, // Sandwiched precisely between text elements and the container background
    justifyContent: "center",
  },
  liquidGlassCircle: {
    width: DROP_DIAMETER,
    height: DROP_DIAMETER,
    borderRadius: DROP_DIAMETER / 2,
    overflow: "hidden", // Clips the BlurView to maintain a strict circular liquid drop shape
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)", // Glass edge refraction line
    backgroundColor: "rgba(255, 255, 255, 0.22)",

    // Volumetric realistic drop shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  androidGlassFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255, 255, 255, 0.45)", // High quality semi-transparent layering for Android environments
  },
  glassHighlightRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: DROP_DIAMETER / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    margin: 1,
  },
  specularReflectionGlance: {
    position: "absolute",
    top: 3,
    left: 12,
    right: 12,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.35)", // Subtle glossy white reflection curve at the top edge of the droplet
  },
});
