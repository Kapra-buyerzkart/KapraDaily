import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const isOrange = type === 'orange' || type === 'warning';
  const iconName = isSuccess ? 'checkmark' : isOrange ? 'alert-outline' : 'close';
  const iconColor = isSuccess ? '#0C382E' : isOrange ? '#B68D40' : '#B83A3A';
  const iconBg = isSuccess ? '#E8F2EE' : isOrange ? '#FEF8EA' : '#FFF4EC';
  const iconBorder = isSuccess ? '#D1E6DD' : isOrange ? '#FCE8B2' : '#FCDCC8';

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
      width={wp('85%')}
      onClose={handleClose}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: iconBg, borderColor: iconBorder },
        ]}
      >
        <Ionicons name={iconName} size={wp('6.8%')} color={iconColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleClose}
          activeOpacity={0.88}
        >
          <Text style={styles.buttonText}>OK</Text>
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
    width: '100%',
  },
  button: {
    width: '100%',
    height: hp('5.8%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default StatusModal;
