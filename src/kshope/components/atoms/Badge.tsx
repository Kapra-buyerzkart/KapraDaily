import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppText, { AppTextTone } from './AppText';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
} from '../../theme/tokens';

const TONE_STYLES: Record<string, { bg: string; fg: AppTextTone }> = {
  success: { bg: UI_COLORS.successTint, fg: 'success' },
  brand: { bg: UI_COLORS.primaryTint, fg: 'brand' },
  neutral: { bg: UI_COLORS.well, fg: 'muted' },
  ink: { bg: UI_COLORS.inkTint, fg: 'primary' },
  danger: { bg: UI_COLORS.dangerTint, fg: 'danger' },
  token: { bg: UI_COLORS.tokenTint, fg: 'token' },
  solidSuccess: { bg: UI_COLORS.success, fg: 'onDark' },
  solidBrand: { bg: UI_COLORS.primary, fg: 'onDark' },
  solidInk: { bg: UI_COLORS.textPrimary, fg: 'onDark' },
};

export interface BadgeProps {
  tone?: keyof typeof TONE_STYLES;
  label?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  label,
  icon,
  style,
  children,
}) => {
  const palette = TONE_STYLES[tone] || TONE_STYLES.neutral;

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      {icon}
      {label ? (
        <AppText variant="micro" tone={palette.fg} numberOfLines={1}>
          {label}
        </AppText>
      ) : (
        children
      )}
    </View>
  );
};

export default React.memo(Badge);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: UI_SPACING.xs,
    paddingHorizontal: UI_SPACING.sm,
    paddingVertical: 3,
    borderRadius: UI_RADIUS.pill,
  },
});
