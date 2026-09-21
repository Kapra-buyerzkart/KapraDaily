import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { PRESS_IN, PRESS_OUT } from '../../motion';
import { LUXURY_COLORS } from '../../SupportTicketsListScreen/supportLuxuryTheme';

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
        { paddingBottom: Math.max(insets.bottom, 16) },
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
          <Feather
            name={complete ? 'send' : 'edit-3'}
            size={18}
            color={complete ? LUXURY_COLORS.white : LUXURY_COLORS.textMuted}
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
