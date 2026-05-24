import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedText = Animated.Text;

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TabButtonProps {
  isFocused: boolean;
  label: string;
  activeIcon: IoniconsName;
  inactiveIcon: IoniconsName;
  onPress: (e: any) => void;
}

const ACTIVE_PINK = "#E91E63";
const INACTIVE_MUTE = "rgba(90, 75, 80, 0.6)";

const GLASS_SPRING = {
  damping: 18,
  stiffness: 90,
  mass: 0.7,
};

const DROP_DIAMETER = 72;
const TAB_COUNT = 2;

const WaterDropletButton = ({
  isFocused,
  label,
  activeIcon,
  inactiveIcon,
  onPress,
}: TabButtonProps) => {
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);
  const labelOpacity = useSharedValue(1);

  useEffect(() => {
    iconScale.value = withSpring(isFocused ? 1.15 : 1, GLASS_SPRING);
    iconTranslateY.value = withSpring(isFocused ? -4 : 0, GLASS_SPRING);
    labelOpacity.value = withSpring(isFocused ? 1 : 0.7, GLASS_SPRING);
  }, [isFocused]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconTranslateY.value },
      { scale: iconScale.value },
    ],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}
      android_ripple={{ color: "transparent" }}
      hitSlop={20}
    >
      <View style={styles.buttonAlignmentFrame}>
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons
            name={isFocused ? activeIcon : inactiveIcon}
            size={24}
            color={isFocused ? ACTIVE_PINK : INACTIVE_MUTE}
          />
        </Animated.View>
        <AnimatedText
          style={[
            styles.label,
            labelAnimatedStyle,
            { color: isFocused ? ACTIVE_PINK : INACTIVE_MUTE },
          ]}
        >
          {label}
        </AnimatedText>
      </View>
    </Pressable>
  );
};

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const BAR_MARGIN = 20;
  const BAR_INNER_PADDING = 8;
  const TAB_BAR_WIDTH = width - BAR_MARGIN * 2;
  const TRACK_WIDTH = TAB_BAR_WIDTH - BAR_INNER_PADDING * 2;
  const TAB_WIDTH = TRACK_WIDTH / TAB_COUNT;

  const translateX = useSharedValue(0);
  const movementVelocity = useSharedValue(0);
  const floating = useSharedValue(0);

  useEffect(() => {
    const targetX = TAB_WIDTH / 2 - DROP_DIAMETER / 2;
    translateX.value = targetX;
    
    floating.value = withRepeat(
      withTiming(-3, { duration: 2200 }),
      -1,
      true
    );
  }, []);

  const snapToCenterOfTab = (index: number) => {
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
    const velocity = Math.abs(movementVelocity.value);

    const width = interpolate(
      velocity,
      [0, TRACK_WIDTH],
      [DROP_DIAMETER, 96],
      Extrapolation.CLAMP
    );

    const height = interpolate(
      velocity,
      [0, TRACK_WIDTH],
      [DROP_DIAMETER, 58],
      Extrapolation.CLAMP
    );

    return {
      width,
      height,
      borderRadius: height / 2,
      transform: [
        {
          translateX:
            translateX.value - (width - DROP_DIAMETER) / 2,
        },
        {
          translateY: floating.value,
        },
      ],
    };
  });

  return (
    <View style={styles.viewport}>
      <LinearGradient
        colors={["#FFF5F7", "#FFEDF2", "#FCE7F3"]}
        style={StyleSheet.absoluteFill}
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            left: BAR_MARGIN,
            right: BAR_MARGIN,
            bottom: insets.bottom + 16,
            height: 76,
            borderRadius: 38,
            backgroundColor: colors.primary,
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

      <View
        pointerEvents="none"
        style={[
          styles.dropletAbsoluteTrack,
          {
            left: BAR_MARGIN + BAR_INNER_PADDING,
            width: TRACK_WIDTH,
            bottom: insets.bottom + 16,
          },
        ]}
      >
        <Animated.View style={glassDropletAnimatedStyle}>
          {/* PINK ATMOSPHERIC BLUR */}
          <View style={styles.pinkGlow} />

          {/* LIQUID GLASS */}
          <View style={styles.liquidWrapper}>
            <BlurView
              intensity={40}
              tint="light"
              style={StyleSheet.absoluteFill}
            />

            {/* pink tint */}
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.22)",
                "rgba(233,30,99,0.10)",
                "rgba(255,255,255,0.06)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* top lighting */}
            <View style={styles.edgeGlow} />

            {/* glass border */}
            <View style={styles.glassBorder} />

            {/* specular highlight */}
            <View style={styles.specularReflection} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

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
    zIndex: 20,
    elevation: 20,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  dropletAbsoluteTrack: {
    position: "absolute",
    height: 76,
    zIndex: 10,
    elevation: 10,
    justifyContent: "center",
  },
  pinkGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 999,
    backgroundColor: "rgba(233,30,99,0.16)",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 0,
  },
  liquidWrapper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  edgeGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  glassBorder: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  specularReflection: {
    position: "absolute",
    top: 4,
    left: 14,
    right: 14,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.30)",
  },
});