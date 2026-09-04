import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from '../../../components/atoms';
import { UI_COLORS, UI_SPACING, wp } from '../../../theme/tokens';
import { PRESS_IN, PRESS_OUT } from './motion';

interface PressableScaleProps extends PressableProps {
  to?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const PressableScale: React.FC<PressableScaleProps> = ({
  to = 0.97,
  style,
  contentStyle,
  children,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...rest}
      style={style}
      onPressIn={event => {
        scale.value = withTiming(to, PRESS_IN);
        rest.onPressIn?.(event);
      }}
      onPressOut={event => {
        scale.value = withSpring(1, PRESS_OUT);
        rest.onPressOut?.(event);
      }}
    >
      <Animated.View style={[contentStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export const RowChevron: React.FC<{ color?: string }> = ({
  color = UI_COLORS.textFaint,
}) => <AntDesign name="right" size={wp('3.4%')} color={color} />;

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AppText variant="micro" tone="muted" style={styles.label}>
    {children}
  </AppText>
);

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: UI_SPACING.lg,
    marginBottom: UI_SPACING.sm,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
