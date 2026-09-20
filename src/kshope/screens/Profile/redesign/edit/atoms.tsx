import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PressableScale } from '../atoms';
import { EDIT_COLORS, EDIT_FONTS } from './editTheme';

export const FieldLabel: React.FC<{
  children: React.ReactNode;
  optional?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ children, optional, style }) => (
  <View style={[styles.labelRow, style]}>
    <Text style={styles.label}>
      {children}
    </Text>
    {!!optional && (
      <Text style={styles.optionalText}>
        Optional
      </Text>
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
      [EDIT_COLORS.well, EDIT_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [EDIT_COLORS.border, EDIT_COLORS.gold],
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
        size={wp('3.6%')}
        color={EDIT_COLORS.danger}
      />
      <Text style={styles.errorText}>
        {message}
      </Text>
    </View>
  );
};

export const VerifiedPill: React.FC = () => (
  <View style={styles.pill}>
    <MaterialCommunityIcons
      name="check-decagram"
      size={wp('3.4%')}
      color={EDIT_COLORS.emerald}
    />
    <Text style={styles.pillText}>
      Verified
    </Text>
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
      name={selected ? 'check' : 'circle-outline'}
      size={wp('3.4%')}
      color={selected ? EDIT_COLORS.emerald : EDIT_COLORS.textFaint}
    />
    <Text
      style={[
        styles.chipText,
        selected && styles.chipTextSelected,
      ]}
      numberOfLines={1}
    >
      {label}
    </Text>
  </PressableScale>
);

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('0.8%'),
  },
  label: {
    fontFamily: EDIT_FONTS.bodyMedium,
    fontSize: wp('2.9%'),
    color: EDIT_COLORS.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  optionalText: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('2.6%'),
    color: EDIT_COLORS.textFaint,
  },
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.2%'),
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: wp('3.5%'),
  },
  wellLocked: {
    backgroundColor: EDIT_COLORS.well,
    borderColor: EDIT_COLORS.borderLight,
  },
  wellError: {
    backgroundColor: EDIT_COLORS.dangerTint,
    borderColor: EDIT_COLORS.danger,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginTop: hp('0.8%'),
  },
  errorText: {
    flexShrink: 1,
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('3%'),
    color: EDIT_COLORS.danger,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EDIT_COLORS.emeraldTint,
    paddingHorizontal: wp('2.2%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 999,
    gap: wp('1%'),
  },
  pillText: {
    fontFamily: EDIT_FONTS.bodyMedium,
    fontSize: wp('2.6%'),
    color: EDIT_COLORS.emerald,
  },
  chipPressable: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 12,
    backgroundColor: EDIT_COLORS.well,
    borderWidth: 1,
    borderColor: EDIT_COLORS.border,
  },
  chipSelected: {
    backgroundColor: EDIT_COLORS.emeraldTint,
    borderColor: EDIT_COLORS.emerald,
  },
  chipText: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('3.2%'),
    color: EDIT_COLORS.textMuted,
  },
  chipTextSelected: {
    fontFamily: EDIT_FONTS.bodySemiBold,
    color: EDIT_COLORS.emerald,
  },
});
