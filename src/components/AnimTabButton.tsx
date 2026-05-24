import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type TabItem = {
  label: string;
  activeIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  inActiveIcon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Props = {
  item: TabItem;
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityState?: { selected?: boolean };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  href?: string;
};

export const AnimTabButton: React.FC<Props> = ({
  item,
  onPress,
  accessibilityState,
  children: _children,
  href: _href,
  style,
  ...rest
}) => {
  const focused = accessibilityState?.selected ?? false;
  
  // Reanimated shared value for smooth scale transition
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, {
      damping: 12,
      stiffness: 120,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, style]}
      {...rest}
    >
      <Animated.View style={[styles.btn, animatedStyle]}>
        <MaterialCommunityIcons 
          name={focused ? item.activeIcon : item.inActiveIcon} 
          size={24} 
          color={focused ? '#6200ee' : '#757575'} 
        />
        {focused && <Text style={styles.text}>{item.label}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 12,
    marginLeft: 6,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});