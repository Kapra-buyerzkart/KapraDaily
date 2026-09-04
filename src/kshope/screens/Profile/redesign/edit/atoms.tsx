import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { AppText } from '../../../../components/atoms';
import { PressableScale } from '../atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hp,
  wp,
} from '../../../../theme/tokens';

export const FieldLabel: React.FC<{
  children: React.ReactNode;
  optional?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ children, optional, style }) => (
  <View style={[styles.labelRow, style]}>
    <AppText variant="micro" tone="muted" style={styles.label}>
      {children}
    </AppText>
    {!!optional && (
      <AppText variant="micro" tone="faint">
        Optional
      </AppText>
    )}
  </View>
);

export const FieldWell: React.FC<{
  focus: SharedValue<number>;
  error?: string;
  locked?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}> = ({ focus, error, locked, style, children }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [UI_COLORS.well, UI_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [UI_COLORS.border, UI_COLORS.borderStrong],
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.well,
        locked ? styles.wellLocked : animatedStyle,
        !!error && styles.wellError,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export const InlineError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.errorRow}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={wp('3.4%')}
        color={UI_COLORS.danger}
      />
      <AppText variant="caption" tone="danger" style={styles.errorText}>
        {message}
      </AppText>
    </View>
  );
};

export const VerifiedPill: React.FC = () => (
  <View style={styles.pill}>
    <MaterialCommunityIcons
      name="check-decagram"
      size={wp('3.2%')}
      color={UI_COLORS.successDeep}
    />
    <AppText variant="micro" tone="success">
      Verified
    </AppText>
  </View>
);

export const GenderChip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <PressableScale
    to={0.96}
    style={styles.chipPressable}
    contentStyle={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    <MaterialCommunityIcons
      name="check"
      size={wp('3.4%')}
      color={selected ? UI_COLORS.primary : 'transparent'}
    />
    <AppText
      variant={selected ? 'labelStrong' : 'label'}
      tone={selected ? 'primary' : 'muted'}
      numberOfLines={1}
    >
      {label}
    </AppText>
  </PressableScale>
);

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs + 2,
    marginBottom: UI_SPACING.sm,
  },
  label: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderRadius: UI_RADIUS.input,
    borderWidth: 1,
    paddingHorizontal: UI_SPACING.md,
  },
  wellLocked: {
    backgroundColor: UI_COLORS.well,
    borderColor: 'transparent',
  },
  wellError: {
    backgroundColor: UI_COLORS.dangerTint,
    borderColor: UI_COLORS.danger,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    marginTop: UI_SPACING.sm,
  },
  errorText: {
    flexShrink: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.sm,
    paddingVertical: 3,
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.successTint,
  },
  chipPressable: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.xs,
    minHeight: hp('5.4%'),
    paddingHorizontal: UI_SPACING.xs,
    borderRadius: UI_RADIUS.input,
    borderWidth: 1,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.well,
  },
  chipSelected: {
    backgroundColor: UI_COLORS.card,
    borderColor: UI_COLORS.borderStrong,
  },
});
