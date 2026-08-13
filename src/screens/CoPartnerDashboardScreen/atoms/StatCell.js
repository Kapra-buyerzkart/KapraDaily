import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';

const StatCell = ({ icon, label, value, tone }) => {
  const isMoney = tone === 'success';

  return (
    <View style={styles.cell}>
      <IconDisc size={wp('8%')} tone={isMoney ? 'success' : 'neutral'}>
        <MaterialCommunityIcons
          name={icon}
          size={wp('4%')}
          color={isMoney ? CART_COLORS.successDeep : CART_COLORS.textSecondary}
        />
      </IconDisc>

      <CartText
        variant="price"
        tone={isMoney ? 'success' : 'primary'}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={styles.value}
      >
        {value}
      </CartText>

      <CartText variant="micro" tone="muted" numberOfLines={1}>
        {label}
      </CartText>
    </View>
  );
};

export default React.memo(StatCell);

const styles = StyleSheet.create({
  cell: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.sm,
    gap: CART_SPACING.xs,
  },
  value: {
    marginTop: CART_SPACING.xs,
  },
});
