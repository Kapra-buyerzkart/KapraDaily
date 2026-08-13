import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INK, MAX_FONT_SCALE, SPACE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { PRESS_IN, PRESS_OUT } from '../../motion';

export default function SubmitBar({ complete, label, hint, onPress }) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.actionBar,
        { paddingBottom: Math.max(insets.bottom, SPACE.md) },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, PRESS_IN);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_OUT);
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={complete ? undefined : hint}
      >
        <Animated.View
          style={[
            styles.actionButton,
            !complete && styles.actionButtonResting,
            buttonStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={complete ? 'send-outline' : 'pencil-outline'}
            size={ICON.action}
            color={complete ? INK.onDark : INK.muted}
            style={styles.actionButtonIcon}
          />
          <Text
            style={[
              styles.actionButtonText,
              !complete && styles.actionButtonTextResting,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {complete ? label : hint}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}
