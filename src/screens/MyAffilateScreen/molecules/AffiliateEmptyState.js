import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import images from '@/assets/images';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING, wp } from '@/styles/cartTheme';

const AffiliateEmptyState = () => (
  <View style={styles.wrap}>
    <Image source={images.noAffliate} style={styles.art} />
    <CartText variant="heading">No network yet</CartText>
    <CartText variant="caption" tone="muted" style={styles.copy}>
      Share your referral code — members you bring in show up here with the UD
      they earn you.
    </CartText>
  </View>
);

export default React.memo(AffiliateEmptyState);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CART_SPACING.xxl,
    paddingBottom: wp('20%'),
    gap: CART_SPACING.sm,
  },
  art: {
    resizeMode: 'contain',
    marginBottom: CART_SPACING.md,
  },
  copy: {
    textAlign: 'center',
  },
});
