import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';

const CurrentContactRow = ({ isPhone, value }) => (
  <View style={styles.row}>
    <IconDisc size={wp('9%')} tone="neutral">
      <MaterialCommunityIcons
        name={isPhone ? 'phone-outline' : 'email-outline'}
        size={wp('4.2%')}
        color={CART_COLORS.textSecondary}
      />
    </IconDisc>

    <View style={styles.copy}>
      <CartText variant="micro" tone="muted">
        {isPhone ? 'CURRENT NUMBER' : 'CURRENT EMAIL'}
      </CartText>
      <CartText variant="labelStrong" numberOfLines={1}>
        {isPhone ? `+91 ${value}` : value}
      </CartText>
    </View>

    <Badge
      tone="success"
      label="Verified"
      icon={
        <MaterialCommunityIcons
          name="check-decagram"
          size={wp('3.2%')}
          color={CART_COLORS.successDeep}
        />
      }
    />
  </View>
);

export default React.memo(CurrentContactRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});
