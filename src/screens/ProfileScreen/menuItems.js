import React from 'react';
import { Image, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONFIG from '../../globals/config';
import icons from '@/assets/icons';
import { INK, RED } from './styles';

const ICON_SIZE = wp('4%');

export const buildOffersItems = ({ onBCoin, onSmartPoint, onCoupons }) => [
  {
    key: 'smart-point',
    label: 'Smart point',
    icon: <Ionicons name="wallet-outline" color={INK} size={ICON_SIZE} />,
    onPress: onSmartPoint,
  },
  {
    key: 'coupon',
    label: 'Coupon',
    icon: <Ionicons name="pricetag-outline" color={INK} size={ICON_SIZE} />,
    onPress: onCoupons,
  },
];

export const buildMyAccountItems = ({
  navigation,
  onLanguage,
  isTicketValidationVisible,
}) => [
  {
    key: 'update-phone',
    label: 'Update Phone Number',
    icon: (
      <MaterialCommunityIcons
        name="phone-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () =>
      navigation.navigate('KshopeUpdateContact', { type: 'phone' }),
  },
  {
    key: 'update-email',
    label: 'Update Email ID',
    icon: (
      <MaterialCommunityIcons
        name="email-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () =>
      navigation.navigate('KshopeUpdateContact', { type: 'email' }),
  },
];

export const buildInformationItems = ({
  navigation,
  helpSheetRef,
  suggestProductsSheetRef,
  setIsDeleteAccountModalVisible,
}) => [
  {
    key: 'suggest-products',
    label: 'Suggest Products',
    icon: (
      <MaterialCommunityIcons
        name="lightbulb-on-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => suggestProductsSheetRef.current?.open(),
  },
  {
    key: 'customer-support',
    label: 'Customer Support',
    icon: <Ionicons name="headset-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => helpSheetRef.current?.open(),
  },
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: (
      <MaterialCommunityIcons
        name="shield-lock-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () =>
      navigation.navigate('KshopeLegalContent', {
        settingKeys: ['privacy_policy', 'privacypolicy'],
        title: 'Privacy Policy',
      }),
  },
  {
    key: 'terms-of-use',
    label: 'Terms Of Use',
    icon: (
      <MaterialCommunityIcons
        name="file-document-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () =>
      navigation.navigate('KshopeLegalContent', {
        settingKeys: ['terms_of_use', 'terms_and_conditions', 'terms'],
        title: 'Terms Of Use',
        fallback: 'terms',
      }),
  },
  {
    key: 'kpc-login',
    label: 'UDC Login',
    icon: <Ionicons name="globe-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => Linking.openURL(CONFIG.image_base_url),
  },
  {
    key: 'delete-account',
    label: 'Delete Account',
    textColor: RED,
    tone: 'danger',
    icon: (
      <MaterialCommunityIcons
        name="account-remove-outline"
        color={RED}
        size={ICON_SIZE}
      />
    ),
    onPress: () => setIsDeleteAccountModalVisible(true),
  },
];
