import React from 'react';
import { Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CONFIG from '../../globals/config';
import { INK, RED } from './styles';
import { Badge } from './atoms';

const ICON_SIZE = 20;

export const buildOffersItems = ({
  onBCoin,
  onSmartPoint,
  onCoupons,
  onMyRewards,
}) => [
  {
    key: 'my-rewards',
    label: 'My Rewards',
    icon: (
      <MaterialCommunityIcons
        name="gift-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    // badge: <Badge label="SPIN & WIN" tone="success" />,
    onPress: onMyRewards,
  },
  {
    key: 'smart-point',
    label: 'Smart Point',
    icon: (
      <MaterialCommunityIcons
        name="star-circle-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: onSmartPoint,
  },
  {
    key: 'coupon',
    label: 'Coupon',
    icon: (
      <MaterialCommunityIcons
        name="ticket-percent-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
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
    label: 'Updated Phone Number',
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
    label: 'Updated Email ID',
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
    label: 'Updated Passwords',
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
        name="account-network-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('MyAffilateScreen'),
  },
  {
    key: 'wishlist',
    label: 'My Wishlist',
    icon: (
      <MaterialCommunityIcons
        name="heart-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('MainTabs', { screen: 'Wishlist' }),
  },
  {
    key: 'my-cart',
    label: 'My Cart',
    icon: (
      <MaterialCommunityIcons
        name="cart-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
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
  setIsLogoutModalVisible,
}) => [
  {
    key: 'suggest-products',
    label: 'Suggested Products',
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
    icon: (
      <MaterialCommunityIcons name="face-agent" color={INK} size={ICON_SIZE} />
    ),
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
      navigation.navigate('LegalContentScreen', {
        settingKey: 'privacy_policy',
        title: 'Privacy Policy',
      }),
  },
  {
    key: 'terms-of-use',
    label: 'Terms and conditions',
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
    key: 'support-tickets',
    label: 'Support Tickets',
    icon: (
      <MaterialCommunityIcons
        name="ticket-confirmation-outline"
        color={INK}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('SupportTicketsListScreen'),
  },
  {
    key: 'kpc-login',
    label: 'UDC Login',
    icon: <MaterialCommunityIcons name="web" color={INK} size={ICON_SIZE} />,
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
  {
    key: 'log-out',
    label: 'Log Out',
    textColor: RED,
    tone: 'danger',
    icon: <MaterialCommunityIcons name="logout" color={RED} size={ICON_SIZE} />,
    onPress: () => setIsLogoutModalVisible(true),
  },
];
