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
      width={wp('86%')}
      backdropOpacity={0.65}
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
          name={
            display.isServiceable ? 'location-sharp' : 'alert-circle-outline'
          }
          size={wp('8.5%')}
          color={display.isServiceable ? '#F25000' : '#DC2626'}
        />
      </View>

      <Text style={styles.title}>
        {display.isServiceable
          ? 'Delivery Confirmation'
          : 'Delivery Unavailable'}
      </Text>

      {display.isServiceable ? (
        <View style={styles.addressCard}>
          <Text style={styles.addressCardLabel}>DELIVERING TO</Text>
          <Text style={styles.addressCardArea}>{display.areaName}</Text>
          <View style={styles.pincodePill}>
            <Text style={styles.pincodeText}>PIN: {display.pincode}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.addressCard, styles.addressCardWarning]}>
          <Text style={styles.unserviceableText}>
            {display.unavailableMessage ||
              'We currently do not serve this area. Please select another delivery address.'}
          </Text>
        </View>
      )}

      {display.isServiceable && (
        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle-outline"
            size={wp('3.8%')}
            color="#6B7280"
          />
          <Text style={styles.warningMessage}>
            {display.isPlacingOrder
              ? 'Clicking Confirm will finalize your order.'
              : 'Cart items may update based on your selected address.'}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {display.isServiceable ? (
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Confirm Delivery"
          >
            <Text style={styles.buttonText}>
              {display.isPlacingOrder
                ? 'Confirm & Place Order'
                : 'Confirm Delivery'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.85}
            onPress={() => {
              if (onChangeAddress) {
                onChangeAddress();
              } else {
                onClose();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Change Address"
          >
            <Text style={styles.outlineButtonText}>Change Address</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        <TouchableOpacity
          hitSlop={20}
          style={{ paddingTop: 40 }}
          onPress={onClose}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: wp('6%'),
  },
  content: {
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5.5%'),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: '#FFF1EB',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1.8%'),
  },
  iconContainerWarning: {
    backgroundColor: '#FEE2E2',
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    color: '#12131A',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  addressCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: wp('3.5%'),
    borderWidth: 1,
    borderColor: '#ECEEF2',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    marginBottom: hp('1.8%'),
  },
  addressCardWarning: {
    backgroundColor: '#FFF8F8',
    borderColor: 'rgba(220, 38, 38, 0.15)',
  },
  addressCardLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.4%'),
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: hp('0.4%'),
  },
  addressCardArea: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#12131A',
    textAlign: 'center',
    marginBottom: hp('0.6%'),
  },
  pincodePill: {
    backgroundColor: '#FFF1EB',
    paddingHorizontal: wp('2.8%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.15)',
  },
  pincodeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#F25000',
  },
  unserviceableText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: '#DC2626',
    textAlign: 'center',
    lineHeight: wp('4.8%'),
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('2%'),
  },
  warningMessage: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#6B7280',
    flexShrink: 1,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
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
  outlineButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F25000',
    backgroundColor: '#FFF1EB',
  },
  outlineButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#F25000',
  },
});

export default AddressConfirmationModal;
