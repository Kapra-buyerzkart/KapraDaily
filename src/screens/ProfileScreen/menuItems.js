import React from 'react';
import { Linking } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CONFIG from '../../globals/config';

const GOLD = '#B68D40';
const RED = '#E53935';
const ICON_SIZE = 18;

export const buildOffersItems = ({ onSmartPoint, onCoupons }) => [
  {
    key: 'smart-point',
    label: 'Smart Point',
    icon: <Ionicons name="gift-outline" color={GOLD} size={ICON_SIZE} />,
    onPress: onSmartPoint,
  },
  {
    key: 'coupon',
    label: 'Coupon',
    icon: <Ionicons name="pricetag-outline" color={GOLD} size={ICON_SIZE} />,
    onPress: onCoupons,
  },
];

export const buildMyAccountItems = ({ navigation }) => [
  {
    key: 'update-phone',
    label: 'Update Phone Number',
    icon: <Feather name="phone" color={GOLD} size={ICON_SIZE} />,
    onPress: () =>
      navigation.navigate('KshopeUpdateContact', { type: 'phone' }),
  },
  {
    key: 'update-email',
    label: 'Update Email ID',
    icon: <Feather name="mail" color={GOLD} size={ICON_SIZE} />,
    onPress: () =>
      navigation.navigate('KshopeUpdateContact', { type: 'email' }),
  },
  {
    key: 'update-password',
    label: 'Update Password',
    icon: <Feather name="lock" color={GOLD} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('KshopeChangePassword'),
  },
  {
    key: 'my-affiliates',
    label: 'My Affiliates',
    icon: <Feather name="users" color={GOLD} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('KshopeReferral'),
  },
  {
    key: 'my-wishlist',
    label: 'My Wishlist',
    icon: <Feather name="heart" color={GOLD} size={ICON_SIZE} />,
    onPress: () =>
      navigation.navigate('KshopeHome', { screen: 'WishlistScreen' }),
  },
  {
    key: 'my-cart',
    label: 'My Cart',
    icon: <Feather name="shopping-cart" color={GOLD} size={ICON_SIZE} />,
    onPress: () => navigation.navigate('KshopeCart'),
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
        color={GOLD}
        size={ICON_SIZE}
      />
    ),
    onPress: () => suggestProductsSheetRef.current?.open(),
  },
  {
    key: 'customer-support',
    label: 'Customer Support',
    icon: <Feather name="headphones" color={GOLD} size={ICON_SIZE} />,
    onPress: () => helpSheetRef.current?.open(),
  },
  // {
  //   key: 'privacy-policy',
  //   label: 'Privacy Policy',
  //   icon: (
  //     <MaterialCommunityIcons
  //       name="shield-check-outline"
  //       color={GOLD}
  //       size={ICON_SIZE}
  //     />
  //   ),
  //   onPress: () =>
  //     navigation.navigate('KshopeLegalContent', {
  //       settingKeys: ['privacy_policy', 'privacypolicy'],
  //       title: 'Privacy Policy',
  //     }),
  // },
  // {
  //   key: 'terms-of-use',
  //   label: 'Terms Of Use',
  //   icon: (
  //     <MaterialCommunityIcons
  //       name="file-document-outline"
  //       color={GOLD}
  //       size={ICON_SIZE}
  //     />
  //   ),
  //   onPress: () =>
  //     navigation.navigate('KshopeLegalContent', {
  //       settingKeys: ['terms_of_use', 'terms_and_conditions', 'terms'],
  //       title: 'Terms Of Use',
  //       fallback: 'terms',
  //     }),
  // },
  {
    key: 'support-tickets',
    label: 'Support Tickets',
    icon: (
      <MaterialCommunityIcons
        name="ticket-confirmation-outline"
        color={GOLD}
        size={ICON_SIZE}
      />
    ),
    onPress: () => navigation.navigate('KshopeSupportTickets'),
  },
  // {
  //   key: 'udc-login',
  //   label: 'UDC Login',
  //   icon: <Feather name="globe" color={GOLD} size={ICON_SIZE} />,
  //   onPress: () => Linking.openURL(CONFIG.image_base_url),
  // },
  {
    key: 'delete-account',
    label: 'Delete Account',
    textColor: RED,
    tone: 'danger',
    icon: <Feather name="user-x" color={RED} size={ICON_SIZE} />,
    onPress: () => setIsDeleteAccountModalVisible(true),
  },
];
