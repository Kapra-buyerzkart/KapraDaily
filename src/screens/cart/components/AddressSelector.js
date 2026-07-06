import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '../../../styles/typography';
import { CART_COLORS, CART_SPACING, wp, hp } from '../../../styles/cartTheme';

const AddressSelector = ({ address, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.row}>
      <Ionicons
        name="location-outline"
        size={wp('4.2%')}
        color={CART_COLORS.textPrimary}
      />
      <Text style={styles.addressText} numberOfLines={1}>
        {address || 'Select delivery address'}
      </Text>
      <AntDesign name="down" size={wp('3%')} color={CART_COLORS.textPrimary} />
    </TouchableOpacity>
  );
};

export default React.memo(AddressSelector);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: CART_COLORS.card,
  },
  addressText: {
    flex: 1,
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: CART_COLORS.textPrimary,
    marginHorizontal: CART_SPACING.sm,
  },
});
