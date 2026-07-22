import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  // When false, the modal cannot be dismissed by the hardware back button or
  // by tapping the backdrop — the user must pick one of the two buttons.
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
      width={wp('85%')}
      onClose={onClose}
      closeOnBackdropPress={dismissible}
      closeOnBackPress={dismissible}
      contentStyle={styles.content}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="warning" size={wp('12%')} color="#F04B1B" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            onClose();
            onCancel?.();
          }}
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
          onPress={() => {
            onClose();
            onConfirm();
          }}
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
    padding: wp('5%'),
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  button: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  confirmButton: {
    backgroundColor: '#F04B1B',
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.7%'),
    color: '#666666',
  },
  confirmButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.7%'),
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;
