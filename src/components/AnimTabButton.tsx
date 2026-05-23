import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Defining types for our props to keep TypeScript happy
type TabItem = {
  label: string;
  activeIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  inActiveIcon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Props = {
  item: TabItem;
  onPress: () => void;
  accessibilityState?: {
    selected?: boolean;
  };
};

export const AnimTabButton: React.FC<Props> = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected ?? false;
  
  // Reanimated shared value for smooth scale transition
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, {
      damping: 12,
      stiffness: 120,
    });
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
      style={styles.container}
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
  }
});// install required icons package:bun x expo install @expo/vector-icons