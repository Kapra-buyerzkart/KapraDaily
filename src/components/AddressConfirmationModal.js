import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
      width={wp('88%')}
      backdropOpacity={0.65}
      closeOnBackdropPress={false}
      onClose={onClose}
      containerStyle={styles.container}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.iconCircle,
          display.isServiceable
            ? styles.iconCircleSuccess
            : styles.iconCircleWarning,
        ]}
      >
        <Ionicons
          name={display.isServiceable ? 'location-outline' : 'alert-circle-outline'}
          size={wp('7%')}
          color={display.isServiceable ? '#0C382E' : '#B83A3A'}
        />
      </View>

      <Text style={styles.title}>
        {display.isServiceable ? 'Delivery Confirmation' : 'Delivery Unavailable'}
      </Text>

      {display.isServiceable ? (
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>
            Your jewellery order will be delivered to{' '}
            <Text style={styles.addressHighlight}>
              {display.pincode} {display.areaName}
            </Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.message}>
          {display.unavailableMessage ||
            'We currently do not serve this delivery area.'}
        </Text>
      )}

      {display.isServiceable && (
        <Text style={styles.warningMessage}>
          {display.isPlacingOrder
            ? 'Clicking Confirm will finalize your order.'
            : 'Note: your cart will be updated based on this delivery area.'}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        {display.isServiceable ? (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.88}
              onPress={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
            >
              <Text style={styles.primaryButtonText}>
                {display.isPlacingOrder
                  ? 'Confirm & Place Order'
                  : 'Confirm Delivery'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              activeOpacity={0.8}
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
          </>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() => {
              if (onChangeAddress) {
                onChangeAddress();
              } else {
                onClose();
              }
            }}
          >
            <Text style={styles.primaryButtonText}>Change Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
  },
  content: {
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5.5%'),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ECE7DE',
  },
  iconCircle: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.8%'),
  },
  iconCircleSuccess: {
    backgroundColor: '#E8F2EE',
    borderColor: '#D1E6DD',
  },
  iconCircleWarning: {
    backgroundColor: '#FFF4EC',
    borderColor: '#FCDCC8',
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.4%'),
    color: '#12372A',
    marginBottom: hp('1.2%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  addressBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: '#ECE7DE',
    width: '100%',
    marginBottom: hp('1.6%'),
  },
  addressText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.4%'),
    color: '#555555',
    textAlign: 'center',
    lineHeight: wp('5%'),
  },
  addressHighlight: {
    fontFamily: 'Lexend-Medium',
    color: '#0C382E',
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.4%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    lineHeight: wp('5%'),
    paddingHorizontal: wp('2%'),
  },
  warningMessage: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('2.8%'),
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('2%'),
  },
  buttonContainer: {
    width: '100%',
    gap: hp('1.2%'),
  },
  primaryButton: {
    width: '100%',
    height: hp('5.8%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.7%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  outlineButton: {
    width: '100%',
    height: hp('5.6%'),
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D4CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
  },
});

export default AddressConfirmationModal;
