import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
      width={wp('85%')}
      onClose={onClose}
      contentStyle={styles.content}
    >
      <Text style={styles.title}>{t('profile.language')}</Text>

      {SUPPORTED_LANGUAGES.map(language => {
        const isActive = i18n.language === language.code;
        return (
          <TouchableOpacity
            key={language.code}
            style={[styles.row, isActive && styles.rowActive]}
            activeOpacity={0.7}
            onPress={() => {
              i18n.changeLanguage(language.code);
              onClose();
            }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {language.label}
            </Text>
            {isActive && (
              <Ionicons name="checkmark-circle" size={wp('5.2%')} color="#0C382E" />
            )}
          </TouchableOpacity>
        );
      })}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ECE7DE',
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7DE',
    borderRadius: 8,
  },
  rowActive: {
    backgroundColor: '#FAF8F5',
  },
  label: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.7%'),
    color: '#444444',
  },
  labelActive: {
    color: '#0C382E',
    fontFamily: 'Lexend-Medium',
  },
});

export default LanguageSwitcherModal;
