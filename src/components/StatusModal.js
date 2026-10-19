import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const StatusModal = ({
  visible,
  onClose,
  type = 'success',
  title,
  message,
  autoCloseMs = 0,
}) => {
  const isSuccess = type === 'success';
  const isOrange = type === 'orange';
  const iconName = isSuccess
    ? 'checkmark-circle'
    : isOrange
    ? 'alert-circle'
    : 'close-circle';

  const iconColor = isOrange ? '#F25000' : isSuccess ? '#0E9F4F' : '#DC2626';
  const iconBg = isOrange ? '#FFF1EB' : isSuccess ? '#E7F7EE' : '#FEE2E2';
  const iconBorder = isOrange
    ? 'rgba(242, 80, 0, 0.2)'
    : isSuccess
    ? 'rgba(14, 159, 79, 0.2)'
    : 'rgba(220, 38, 38, 0.2)';

  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const hasClosedRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleClose = useCallback(() => {
    if (hasClosedRef.current) return;
    hasClosedRef.current = true;
    onCloseRef.current?.();
  }, []);

  useEffect(() => {
    if (visible) {
      hasClosedRef.current = false;
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !autoCloseMs) return undefined;
    const timer = setTimeout(handleClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [visible, autoCloseMs, handleClose]);

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.CENTER}
      width={wp('86%')}
      onClose={handleClose}
      contentStyle={styles.content}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        <Ionicons name={iconName} size={wp('9%')} color={iconColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: iconColor }]}
          activeOpacity={0.85}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="OK"
        >
          <Text style={styles.buttonText}>OK</Text>
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
    borderWidth: 1,
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
    width: '100%',
  },
  button: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default StatusModal;
