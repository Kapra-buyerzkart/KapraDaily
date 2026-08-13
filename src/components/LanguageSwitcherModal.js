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
            style={styles.row}
            onPress={() => {
              i18n.changeLanguage(language.code);
              onClose();
            }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {language.label}
            </Text>
            {isActive && (
              <Ionicons name="checkmark-circle" size={wp('5%')} color="#F04B1B" />
            )}
          </TouchableOpacity>
        );
      })}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: wp('5%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: '#333333',
  },
  labelActive: {
    color: '#F04B1B',
    fontFamily: FONTS.gilroy.semiBold,
  },
});

export default LanguageSwitcherModal;
