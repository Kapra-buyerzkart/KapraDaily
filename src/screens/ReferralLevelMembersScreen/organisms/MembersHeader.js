import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import icons from '@/assets/icons';
import CartText from '@/screens/cart/components/atoms/CartText';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, CART_SPACING, hitSlopTo, hp } from '@/styles/cartTheme';
import { levelLabel } from '@/screens/MyAffilateScreen/utils';

const MembersHeader = ({ onBack, levelNumber, label, countLabel }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.backBtn}
      hitSlop={hitSlopTo(24)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Image source={icons.backArrowNew} style={styles.backIcon} />
    </TouchableOpacity>

    <View style={styles.titleBlock}>
      <CartText variant="title" accessibilityRole="header" numberOfLines={1}>
        {label || `Level ${levelNumber}`}
      </CartText>
      <CartText variant="caption" tone="muted" numberOfLines={1}>
        {levelLabel(levelNumber)}
      </CartText>
    </View>

    {!!countLabel && <Badge tone="neutral" label={countLabel} />}
  </View>
);

export default React.memo(MembersHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: CART_COLORS.card,
    gap: CART_SPACING.sm,
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: CART_COLORS.textPrimary,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    marginLeft: CART_SPACING.xs,
  },
});
