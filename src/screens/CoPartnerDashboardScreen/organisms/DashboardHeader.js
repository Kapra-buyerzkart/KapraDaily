import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import icons from '@/assets/icons';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_SPACING, hitSlopTo, hp } from '@/styles/cartTheme';
import AreaChipsRow from '../molecules/AreaChipsRow';

const DashboardHeader = ({ onBack, areas, activeArea, onSelectArea }) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
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
        <CartText variant="title" numberOfLines={1} accessibilityRole="header">
          Co-Partner
        </CartText>
        <CartText variant="caption" tone="muted">
          Area performance overview
        </CartText>
      </View>
    </View>

    {areas?.length > 0 && (
      <View style={styles.chips}>
        <AreaChipsRow
          areas={areas}
          activeArea={activeArea}
          onSelect={onSelectArea}
        />
      </View>
    )}
  </View>
);

export default React.memo(DashboardHeader);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: CART_COLORS.card,
    paddingBottom: CART_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
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
    marginLeft: CART_SPACING.xs,
  },
  chips: {
    marginTop: CART_SPACING.xs,
  },
});
