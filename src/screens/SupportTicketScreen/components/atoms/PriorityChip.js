import { Text, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { CHIP_FADE, PRESS_IN, PRESS_OUT } from '../../motion';

function PriorityChip({ option, selected, onPress }) {
  const scale = useSharedValue(1);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      selected ? option.soft : 'transparent',
      CHIP_FADE,
    ),
    borderColor: withTiming(
      selected ? option.tint : 'rgba(17,19,26,0.10)',
      CHIP_FADE,
    ),
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.priorityChipHit}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.96, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${option.label} priority`}
    >
      <Animated.View style={[styles.priorityChip, chipStyle]}>
        <MaterialCommunityIcons
          name={option.icon}
          size={ICON.chip}
          color={option.tint}
        />
        <Text
          style={[
            styles.priorityChipText,
            { color: option.tint },
            selected && styles.priorityChipTextActive,
          ]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default React.memo(PriorityChip);
