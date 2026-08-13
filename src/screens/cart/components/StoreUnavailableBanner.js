import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CartText from './atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const StoreUnavailableBanner = ({ message, onChangePress }) => (
  <View style={styles.banner}>
    <MaterialIcons
      name="error-outline"
      size={wp('4.6%')}
      color={CART_COLORS.danger}
    />
    <CartText variant="caption" tone="danger" style={styles.text}>
      {message ||
        'Store not found for this pincode. Please select another location.'}
    </CartText>
    <TouchableOpacity
      onPress={onChangePress}
      style={styles.changeBtn}
      activeOpacity={0.85}
    >
      <CartText variant="micro" tone="onDark">
        Change
      </CartText>
    </TouchableOpacity>
  </View>
);

export default StoreUnavailableBanner;

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.dangerTint,
    borderWidth: 1,
    borderColor: 'rgba(217,48,37,0.18)',
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.2%'),
    marginHorizontal: CART_SPACING.lg,
    marginTop: CART_SPACING.md,
    borderRadius: CART_RADIUS.button,
  },
  text: {
    flex: 1,
  },
  changeBtn: {
    backgroundColor: CART_COLORS.danger,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.5%'),
    borderRadius: CART_RADIUS.pill,
  },
});
