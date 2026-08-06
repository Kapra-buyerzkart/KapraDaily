import React from 'react';
import { Image, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONFIG from '../../globals/config';
import icons from '@/assets/icons';
import { INK, RED } from './styles';

const ICON_SIZE = wp('4.6%');

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
      navigation.navigate('UpdateContactScreen', { type: 'phone' }),
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
      navigation.navigate('UpdateContactScreen', { type: 'email' }),
  },
  {
    key: 'update-password',
    label: 'Update Password',
    icon: (
      <MaterialCommunityIcons
        name="lock-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('ChangePasswordScreen'),
  },
  {
    key: 'my-affiliates',
    label: 'My Affiliates',
    icon: (
      <MaterialCommunityIcons
        name="account-group-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('MyAffilateScreen'),
  },
  {
    key: 'wishlist',
    label: 'My Wishlist',
    icon: <Ionicons name="heart-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('MainTabs', { screen: 'Wishlist' }),
  },
  {
    key: 'my-cart',
    label: 'My Cart',
    icon: <Ionicons name="cart-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('CartScreen'),
  },
  ...(Number(isTicketValidationVisible) === 1
    ? [
        {
          key: 'scan-qr',
          label: 'Scan QR Code',
          icon: (
            <MaterialCommunityIcons
              name="qrcode-scan"
              color={INK}
              size={ICON_SIZE}
            />
          ),
          onPress: () => navigation.navigate('QRScannerScreen'),
        },
      ]
    : []),
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
    key: 'faq',
    label: 'F&Q',
    icon: <Ionicons name="help-circle-outline" color={INK} size={ICON_SIZE} />,
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
      navigation.navigate('LegalContentScreen', {
        settingKey: 'privacy_policy',
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
      navigation.navigate('LegalContentScreen', {
        settingKey: 'terms_of_use',
        title: 'Terms Of Use',
      }),
  },
  {
    key: 'about-us',
    label: 'About Us',
    icon: (
      <Ionicons
        name="information-circle-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
  },
  {
    key: 'support-tickets',
    label: 'Support Tickets',
    icon: <Ionicons name="help-circle-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('SupportTicketsListScreen'),
  },
  {
    key: 'kpc-login',
    label: 'KPC Login',
    icon: <Ionicons name="globe-outline" color={INK} size={ICON_SIZE} />,
    onPress: () => Linking.openURL(CONFIG.image_base_url),
  },
  {
    key: 'delete-account',
    label: 'Delete Account',
    textColor: RED,
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
