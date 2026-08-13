import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomModal, { MODAL_POSITION } from './modal/CustomModal';
import { CART_COLORS, CART_RADIUS } from '../styles/cartTheme';
import { FONTS } from '../styles/typography';

const QuantityLimitModal = ({ visible, message, maxQuantity, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.CENTER}
      width={wp('85%')}
      onClose={onClose}
      contentStyle={styles.content}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="basket-remove-outline"
          size={wp('9%')}
          color={CART_COLORS.primary}
        />
      </View>

      <Text style={styles.title}>Quantity limit reached</Text>

      <Text style={styles.message}>
        {message || 'Maximum quantity allowed for this product is exceeded.'}
      </Text>

      {maxQuantity ? (
        <View style={styles.limitPill}>
          <Text style={styles.limitPillText}>
            Limit: {maxQuantity} per order
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={onClose}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Got it</Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
    alignItems: 'center',
  },
  iconCircle: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: CART_COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: CART_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: wp('5%'),
  },
  limitPill: {
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.7%'),
    borderRadius: CART_RADIUS.sm,
    backgroundColor: CART_COLORS.primaryTint,
  },
  limitPillText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: CART_COLORS.primary,
  },
  button: {
    width: '100%',
    marginTop: hp('3%'),
    paddingVertical: hp('1.6%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
  },
});

export default QuantityLimitModal;
