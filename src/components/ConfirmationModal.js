import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  iconName,
  themeColor,
}) => {
  const modalRef = useRef(null);
  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  const isDestructive =
    confirmText.toLowerCase().includes('remove') ||
    confirmText.toLowerCase().includes('delete');

  const resolvedIcon =
    iconName ||
    (isDestructive ? 'trash-outline' : 'alert-circle-outline');
  const iconColor = themeColor || (isDestructive ? '#B83A3A' : '#0C382E');
  const iconBg = isDestructive ? '#FFF4EC' : '#E8F2EE';
  const iconBorder = isDestructive ? '#FCDCC8' : '#D1E6DD';

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
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: iconBg, borderColor: iconBorder },
        ]}
      >
        <Ionicons name={resolvedIcon} size={wp('6.8%')} color={iconColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          activeOpacity={0.8}
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
          style={[
            styles.button,
            styles.confirmButton,
            themeColor ? { backgroundColor: themeColor } : null,
          ]}
          activeOpacity={0.88}
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
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    marginBottom: hp('0.8%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.3%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('2.8%'),
    lineHeight: wp('4.8%'),
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
    height: hp('5.6%'),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D4CC',
  },
  confirmButton: {
    backgroundColor: '#0C382E',
  },
  cancelButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
  },
  confirmButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;
