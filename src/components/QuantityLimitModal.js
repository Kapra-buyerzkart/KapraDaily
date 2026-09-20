import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

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
        <Ionicons
          name="alert-circle-outline"
          size={wp('7%')}
          color="#0C382E"
        />
      </View>

      <Text style={styles.title}>Quantity Limit Reached</Text>

      <Text style={styles.message}>
        {message || 'Maximum quantity allowed for this item has been reached.'}
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
        activeOpacity={0.88}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Got it</Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp('5.5%'),
    paddingVertical: hp('3%'),
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
    backgroundColor: '#E8F2EE',
    borderWidth: 1,
    borderColor: '#D1E6DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.8%'),
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    textAlign: 'center',
    marginBottom: hp('0.8%'),
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.3%'),
    color: '#666666',
    textAlign: 'center',
    lineHeight: wp('4.8%'),
    paddingHorizontal: wp('2%'),
  },
  limitPill: {
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 10,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECE7DE',
  },
  limitPillText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3%'),
    color: '#0C382E',
  },
  button: {
    width: '100%',
    marginTop: hp('2.5%'),
    height: hp('5.6%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default QuantityLimitModal;
