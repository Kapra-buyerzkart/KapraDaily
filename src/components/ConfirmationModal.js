import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Remove',
  cancelText = 'Cancel',
  dismissible = true,
}) => {
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
      closeOnBackdropPress={dismissible}
      closeOnBackPress={dismissible}
      contentStyle={styles.content}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={wp('9%')} color="#F25000" />
      </View>

      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          activeOpacity={0.8}
          onPress={() => {
            onClose();
            onCancel?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={cancelText}
        >
          <Text
            style={styles.cancelButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {cancelText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          activeOpacity={0.85}
          onPress={() => {
            onClose();
            onConfirm();
          }}
          accessibilityRole="button"
          accessibilityLabel={confirmText}
        >
          <Text
            style={styles.confirmButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    color: '#12131A',
    marginBottom: hp('0.8%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: hp('2.8%'),
    lineHeight: wp('5.2%'),
    paddingHorizontal: wp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
  },
  cancelButton: {
    backgroundColor: '#F5F6F8',
    borderWidth: 1,
    borderColor: '#ECEEF2',
  },
  confirmButton: {
    backgroundColor: '#F25000',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.6%'),
    color: '#2B2D36',
  },
  confirmButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;
