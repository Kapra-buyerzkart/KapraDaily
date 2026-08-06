import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const AddressConfirmationModal = ({
  visible,
  onClose,
  pincode,
  areaName,
  onConfirm,
  isServiceable = true,
  unavailableMessage,
  isPlacingOrder = false,
  onChangeAddress,
}) => {
  const modalRef = useRef(null);

  const [display, setDisplay] = useState({
    pincode,
    areaName,
    isServiceable,
    unavailableMessage,
    isPlacingOrder,
  });
  if (
    visible &&
    (display.pincode !== pincode ||
      display.areaName !== areaName ||
      display.isServiceable !== isServiceable ||
      display.unavailableMessage !== unavailableMessage ||
      display.isPlacingOrder !== isPlacingOrder)
  ) {
    setDisplay({
      pincode,
      areaName,
      isServiceable,
      unavailableMessage,
      isPlacingOrder,
    });
  }

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
      width={wp('90%')}
      backdropOpacity={0.7}
      closeOnBackdropPress={false}
      onClose={onClose}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.iconContainer,
          !display.isServiceable && styles.iconContainerWarning,
        ]}
      >
        <Ionicons
          name={display.isServiceable ? 'location' : 'warning'}
          size={wp('8%')}
          color={display.isServiceable ? '#F25000' : '#FF0000'}
        />
      </View>

      <Text style={styles.title}>
        {display.isServiceable ? 'Delivery Confirmation' : 'Delivery Unavailable'}
      </Text>

      {display.isServiceable ? (
        <Text style={styles.message}>
          <Text style={styles.messageRegular}>
            Your order will be delivered to pincode{' '}
          </Text>
          <Text style={styles.messageHighlight}>
            {display.pincode} {display.areaName}
          </Text>
        </Text>
      ) : (
        <Text style={styles.message}>
          <Text style={styles.messageRegular}>
            {display.unavailableMessage ||
              'We currently do not serve this area: '}
          </Text>
        </Text>
      )}

      {display.isServiceable && (
        <Text style={styles.warningMessage}>
          {display.isPlacingOrder
            ? 'Clicking Confirm will finalize your order.'
            : 'Note: your cart might have been updated due to address change'}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        {display.isServiceable ? (
          <TouchableOpacity
            style={{ width: '100%' }}
            activeOpacity={0.8}
            onPress={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
          >
            <LinearGradient
              colors={['#F25000', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {display.isPlacingOrder
                  ? 'Confirm & Place Order'
                  : 'Confirm Delivery'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.outlineButton, { width: '100%' }]}
            onPress={() => {
              if (onChangeAddress) {
                onChangeAddress();
              } else {
                onClose();
              }
            }}
          >
            <Text style={styles.outlineButtonText}>Change Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: wp('8%'),
  },
  content: {
    paddingVertical: wp('6%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  iconContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  iconContainerWarning: {
    backgroundColor: '#FFF0F0',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    color: '#1A1A1A',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    lineHeight: wp('5.8%'),
    paddingHorizontal: wp('2%'),
  },
  messageRegular: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#4A4A4A',
  },
  messageHighlight: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: '#F25000',
  },
  warningMessage: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: hp('3%'),
    backgroundColor: '#F9F9F9',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
  },
  gradientButton: {
    width: '100%',
    height: wp('13%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.2%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  outlineButton: {
    width: '100%',
    height: wp('13%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F25000',
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: '#F25000',
    textAlign: 'center',
  },
});

export default AddressConfirmationModal;
