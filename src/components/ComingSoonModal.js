import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const ComingSoonModal = ({
  visible,
  onClose,
  title = 'Coming Soon!',
  message = "We're working hard to bring this feature to you. Stay tuned!",
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
      contentStyle={styles.content}
    >
      <View style={styles.badgeWrapper}>
        <View style={styles.badgePill}>
          <Ionicons name="sparkles" size={wp('3.2%')} color="#F25000" />
          <Text style={styles.badgePillText}>IN THE WORKS</Text>
        </View>
      </View>

      <View style={styles.iconCircle}>
        <Ionicons name="rocket-outline" size={wp('9%')} color="#F25000" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Got it"
      >
        <Text style={styles.buttonText}>Got It, Thanks!</Text>
      </TouchableOpacity>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('3%'),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  badgeWrapper: {
    marginBottom: hp('1.5%'),
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.2%'),
    backgroundColor: '#FFF1EB',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.2)',
  },
  badgePillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.6%'),
    color: '#F25000',
    letterSpacing: 0.6,
  },
  iconCircle: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    backgroundColor: '#FFF1EB',
    borderWidth: 1,
    borderColor: 'rgba(242, 80, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.2%'),
    color: '#12131A',
    marginBottom: hp('1%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5.2%'),
    paddingHorizontal: wp('2%'),
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#F25000',
    borderRadius: 999,
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
});

export default ComingSoonModal;
