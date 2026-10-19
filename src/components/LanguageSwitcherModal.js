import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';
import { SUPPORTED_LANGUAGES } from '../config/i18n';

const LanguageSwitcherModal = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
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
      <View style={styles.iconCircle}>
        <Ionicons name="language-outline" size={wp('8.5%')} color="#F25000" />
      </View>

      <Text style={styles.title}>{t('profile.language') || 'Select Language'}</Text>
      <Text style={styles.subtitle}>Choose your preferred language</Text>

      <View style={styles.list}>
        {SUPPORTED_LANGUAGES.map(language => {
          const isActive = i18n.language === language.code;
          return (
            <TouchableOpacity
              key={language.code}
              activeOpacity={0.8}
              style={[styles.row, isActive && styles.rowActive]}
              onPress={() => {
                i18n.changeLanguage(language.code);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={language.label}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {language.label}
              </Text>
              <View style={[styles.radioCircle, isActive && styles.radioCircleActive]}>
                {isActive && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: hp('0.5%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.3%'),
    color: '#6B7280',
    marginBottom: hp('2.2%'),
    textAlign: 'center',
  },
  list: {
    width: '100%',
    gap: hp('1.2%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3.6%'),
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#ECEEF2',
  },
  rowActive: {
    backgroundColor: '#FFF1EB',
    borderColor: '#F25000',
  },
  label: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: '#2B2D36',
  },
  labelActive: {
    color: '#F25000',
    fontFamily: FONTS.gilroy.bold,
  },
  radioCircle: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#F25000',
  },
  radioInner: {
    width: wp('2.6%'),
    height: wp('2.6%'),
    borderRadius: wp('1.3%'),
    backgroundColor: '#F25000',
  },
});

export default LanguageSwitcherModal;
