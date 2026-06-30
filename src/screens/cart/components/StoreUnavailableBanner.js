import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../../../styles/typography';
import { CART_COLORS, CART_SPACING } from '../../../styles/cartTheme';

const StoreUnavailableBanner = ({ message, onChangePress }) => (
  <View style={styles.storeNotFoundWarning}>
    <MaterialIcons
      name="error-outline"
      size={wp('4.2%')}
      color={CART_COLORS.danger}
    />
    <Text style={styles.storeNotFoundText}>
      {message ||
        'Store not found for this pincode. Please select another location.'}
    </Text>
    <TouchableOpacity onPress={onChangePress} style={styles.changeLocBtn}>
      <Text style={styles.changeLocText}>Change</Text>
    </TouchableOpacity>
  </View>
);

export default StoreUnavailableBanner;

const styles = StyleSheet.create({
  storeNotFoundWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    marginHorizontal: CART_SPACING.lg,
    marginTop: CART_SPACING.sm,
    borderRadius: 12,
  },
  storeNotFoundText: {
    flex: 1,
    fontFamily: FONTS.outfit.medium,
    fontSize: wp('3%'),
    color: CART_COLORS.danger,
    marginLeft: CART_SPACING.sm,
  },
  changeLocBtn: {
    backgroundColor: CART_COLORS.danger,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.5%'),
    borderRadius: 5,
    marginLeft: CART_SPACING.sm,
  },
  changeLocText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#FFF',
  },
});
