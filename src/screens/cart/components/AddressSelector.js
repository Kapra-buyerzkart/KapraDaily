import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CartText from './atoms/CartText';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const AddressSelector = ({ address, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.row}>
      <IconDisc size={wp('8.5%')} tone="neutral">
        <Ionicons
          name="location-sharp"
          size={wp('4.2%')}
          color={CART_COLORS.textSecondary}
        />
      </IconDisc>

      <View style={styles.copy}>
        <CartText variant="micro" tone="muted">
          DELIVERING TO
        </CartText>
        <CartText variant="labelStrong" numberOfLines={1}>
          {address || 'Select delivery address'}
        </CartText>
      </View>

      <View style={styles.changeChip}>
        <CartText variant="micro" tone="muted">
          Change
        </CartText>
        <AntDesign
          name="right"
          size={wp('2.6%')}
          color={CART_COLORS.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AddressSelector);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: hp('0.4%'),
    paddingBottom: hp('1.4%'),
    backgroundColor: CART_COLORS.card,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: hp('0.4%'),
    borderRadius: 999,
    backgroundColor: CART_COLORS.well,
  },
});
