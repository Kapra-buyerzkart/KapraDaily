import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';

const AffiliateMessage = ({ loading = false, title = '', message = '' }) => (
  <View style={styles.wrap}>
    {loading ? (
      <ActivityIndicator color={CART_COLORS.textSecondary} />
    ) : (
      <IconDisc size={wp('12%')} tone="neutral">
        <MaterialCommunityIcons
          name="wifi-off"
          size={wp('5.6%')}
          color={CART_COLORS.textMuted}
        />
      </IconDisc>
    )}

    {!!title && <CartText variant="heading">{title}</CartText>}
    {!!message && (
      <CartText variant="caption" tone="muted" style={styles.copy}>
        {message}
      </CartText>
    )}
  </View>
);

export default React.memo(AffiliateMessage);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CART_SPACING.xxl,
    paddingBottom: wp('20%'),
    gap: CART_SPACING.sm,
  },
  copy: {
    textAlign: 'center',
  },
});
