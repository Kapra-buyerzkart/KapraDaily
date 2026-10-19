import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../styles/typography';
import { openExternalUrl } from '../utils/safeUrl';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const AppUpdateModal = ({ visible, updateInfo, onLater }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible && updateInfo) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible, updateInfo]);

  if (!updateInfo) return null;

  const { versionCode, redirectUrl, isCompulsory } = updateInfo;

  const handleUpdate = () => {
    if (redirectUrl) {
      openExternalUrl(redirectUrl);
    }
  };

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.CENTER}
      width={wp('86%')}
      closeOnBackdropPress={!isCompulsory}
      closeOnBackPress={!isCompulsory}
      onClose={isCompulsory ? () => {} : onLater}
      contentStyle={styles.content}
    >
      <View style={styles.iconCircle}>
        <MaterialIcons
          name="system-update"
          size={wp('9%')}
          color="#F25000"
        />
      </View>

      <Text style={styles.title}>Update Available</Text>

      <View style={styles.versionPill}>
        <Text style={styles.versionText}>v{versionCode}</Text>
      </View>

      <Text style={styles.message}>
        {isCompulsory
          ? 'A critical update is available. Please update the app to continue enjoying uninterrupted grocery shopping.'
          : 'A new version of Uden Deal is available with enhanced performance and latest features.'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          activeOpacity={0.85}
          onPress={handleUpdate}
          accessibilityRole="button"
          accessibilityLabel="Update Now"
        >
          <Text style={styles.updateButtonText}>Update Now</Text>
        </TouchableOpacity>

        {!isCompulsory && (
          <TouchableOpacity
            style={styles.laterButton}
            activeOpacity={0.7}
            onPress={onLater}
            accessibilityRole="button"
            accessibilityLabel="Maybe Later"
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        )}
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
  iconCircle: {
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
    marginBottom: hp('0.6%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  versionPill: {
    backgroundColor: '#FFF1EB',
    paddingHorizontal: wp('2.8%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.15)',
    marginBottom: hp('1.5%'),
  },
  versionText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#F25000',
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
    gap: hp('1%'),
  },
  updateButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    backgroundColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  laterButton: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
});

export default AppUpdateModal;
