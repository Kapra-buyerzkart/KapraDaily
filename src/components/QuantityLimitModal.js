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
      width={wp('86%')}
      onClose={onClose}
      contentStyle={styles.content}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="basket-remove-outline"
          size={wp('9%')}
          color="#F25000"
        />
      </View>

      <Text style={styles.title}>Quantity limit reached</Text>

      <Text style={styles.message}>
        {message || 'Maximum quantity allowed for this product has been reached.'}
      </Text>

      {maxQuantity ? (
        <View style={styles.limitPill}>
          <Text style={styles.limitPillText}>
            Maximum {maxQuantity} units per order
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={onClose}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Got it"
      >
        <Text style={styles.buttonText}>Got It</Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('2.8%'),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: '#FFF1EB',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.8%'),
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    color: '#12131A',
    textAlign: 'center',
    marginBottom: hp('0.8%'),
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: wp('5.2%'),
    paddingHorizontal: wp('2%'),
  },
  limitPill: {
    marginTop: hp('1.6%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 999,
    backgroundColor: '#FFF1EB',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.18)',
  },
  limitPillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3%'),
    color: '#F25000',
  },
  button: {
    width: '100%',
    height: 48,
    marginTop: hp('2.8%'),
    borderRadius: 999,
    backgroundColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default QuantityLimitModal;
