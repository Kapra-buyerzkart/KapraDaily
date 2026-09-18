import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  address: any;
  onEditAddress: () => void;
};

export const CartAddressCard: React.FC<Props> = ({ address, onEditAddress }) => {
  const addressText =
    address?.address ||
    address?.raw?.addressLine1 ||
    address?.raw?.address ||
    (address?.pin ? `Pin: ${address.pin}` : 'Select your delivery address');

  const fullDetails = [
    addressText,
    address?.area || address?.raw?.areaName,
    address?.city || address?.raw?.cityName,
    address?.pin || address?.raw?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      {/* Top Separator Shadow Bar */}
      <View style={styles.topShadowLine} />

      <Text style={styles.sectionCaption}>Edit Saved Address</Text>

      <TouchableOpacity
        testID="cart-address-card"
        activeOpacity={0.85}
        onPress={onEditAddress}
        style={styles.card}
      >
        {/* Left Location Pin Icon (clean outline, matching screenshot) */}
        <Ionicons
          name="location-outline"
          size={s(19)}
          color={CART_COLORS.textDark}
          style={styles.pinIcon}
        />

        {/* Center Details */}
        <View style={styles.infoCol}>
          <Text style={styles.addressTitle}>Address</Text>
          <Text style={styles.addressBody} numberOfLines={2}>
            {fullDetails || 'Lorem ipsum dolor sit amet, consectetur adipiscing eiusmod tempor incididunt ut labore.....'}
          </Text>
        </View>

        {/* Right Edit Action */}
        <TouchableOpacity
          testID="cart-address-edit-btn"
          activeOpacity={0.7}
          onPress={onEditAddress}
          style={styles.editBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={s(19)} color={CART_COLORS.textDark} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(16),
    marginTop: s(10),
    marginBottom: s(20),
  },
  topShadowLine: {
    height: s(8),
    backgroundColor: '#F7F8F9',
    marginHorizontal: -s(16),
    marginBottom: s(14),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F1F3',
  },
  sectionCaption: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(11.5),
    color: '#7A7A7A',
    marginBottom: s(8),
    paddingHorizontal: s(2),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CART_COLORS.card,
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: s(12),
    paddingVertical: s(12),
  },
  pinIcon: {
    marginTop: s(2),
    marginRight: s(10),
  },
  infoCol: {
    flex: 1,
    paddingRight: s(8),
  },
  addressTitle: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13),
    color: CART_COLORS.textDark,
  },
  addressBody: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10.5),
    color: '#7A7A7A',
    marginTop: s(3),
    lineHeight: fs(15),
  },
  editBtn: {
    padding: s(2),
  },
});
