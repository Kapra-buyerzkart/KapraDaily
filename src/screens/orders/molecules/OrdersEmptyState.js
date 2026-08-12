import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  TOUCH_MIN,
  MAX_FONT_SCALE,
  GUTTER,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const OrdersEmptyState = ({
  icon = 'bag-handle-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.wrap}>
    <View style={styles.badge}>
      <Ionicons name={icon} size={wp('9%')} color={ACCENT.primary} />
    </View>
    <Text style={styles.title} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {title}
    </Text>
    <Text style={styles.message} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {message}
    </Text>
    {!!onAction && (
      <AnimatedPressable
        style={styles.action}
        onPress={onAction}
        accessibilityRole="button"
      >
        <Text style={styles.actionText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {actionLabel}
        </Text>
      </AnimatedPressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xxl,
  },
  badge: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.tint,
  },
  title: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginTop: SPACE.base,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  message: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: SPACE.xs + 2,
    textAlign: 'center',
    maxWidth: wp('72%'),
  },
  action: {
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
    paddingHorizontal: SPACE.xl,
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.primary,
    marginTop: SPACE.lg,
  },
  actionText: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    letterSpacing: 0.3,
  },
});

export default React.memo(OrdersEmptyState);
