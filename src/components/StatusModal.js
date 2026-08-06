import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const StatusModal = ({
  visible,
  onClose,
  type = 'success',
  title,
  message,
}) => {
  const isSuccess = type === 'success';
  const isOrange = type === 'orange';
  const iconName = isSuccess || isOrange ? 'check-circle' : 'error';
  const iconColor = isOrange ? '#F25000' : isSuccess ? '#0CA201' : '#FF0000';
  const buttonColor = isOrange ? '#F25000' : isSuccess ? '#0CA201' : '#FF0000';

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
      <View style={styles.iconContainer}>
        <MaterialIcons name={iconName} size={wp('12%')} color={iconColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>OK</Text>
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
    color: '#616161',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5%'),
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.7%'),
    color: '#FFFFFF',
  },
});

export default StatusModal;
