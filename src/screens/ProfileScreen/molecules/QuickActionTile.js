import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { ProfileText, PressableScale, IconDisc } from '../atoms';
import { CART_RADIUS, CART_SPACING, CART_TYPE, wp } from '@/styles/cartTheme';

const WELL = wp('12.2%');

const QuickActionTile = ({ icon, label, a11y, onPress }) => (
  <PressableScale
    to={0.94}
    style={styles.item}
    contentStyle={styles.itemContent}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={a11y}
  >
    <IconDisc size={WELL} tone="neutral" radius={CART_RADIUS.sm}>
      <Image source={icon} style={styles.icon} />
    </IconDisc>
    <ProfileText
      variant="micro"
      tone="secondary"
      numberOfLines={2}
      style={styles.label}
    >
      {label}
    </ProfileText>
  </PressableScale>
);

export default React.memo(QuickActionTile);

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  itemContent: {
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  icon: {
    width: WELL * 0.54,
    height: WELL * 0.54,
    resizeMode: 'contain',
  },
  label: {
    height: CART_TYPE.micro.lineHeight * 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
