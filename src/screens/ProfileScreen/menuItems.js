import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONFIG from '../../globals/config';
import { Linking } from 'react-native';
import { INK } from './styles';

export const buildMyAccountItems = navigation => [
  {
    key: 'wishlist',
    label: 'My Wishlist',
    icon: <Ionicons name="heart-outline" color={INK} size={wp('4%')} />,
    onPress: () => navigation.navigate('MainTabs', { screen: 'Wishlist' }),
  },
  {
    key: 'my-orders',
    label: 'My Orders',
    icon: <Ionicons name="receipt-outline" color={INK} size={wp('4%')} />,
    onPress: () => navigation.navigate('MyOrdersScreen'),
  },
  {
    key: 'my-cart',
    label: 'My Cart',
    icon: <Ionicons name="cart-outline" color={INK} size={wp('4%')} />,
    onPress: () => navigation.navigate('CartScreen'),
  },
  {
    key: 'co-partner-dashboard',
    label: 'Co-Partner Dashboard',
    icon: (
      <MaterialCommunityIcons
        name="account-group-outline"
        color={INK}
        size={wp('4%')}
      />
    ),
    onPress: () => navigation.navigate('CoPartnerDashboardScreen'),
    hideDividerAfter: true,
  },
  {
    key: 'my-affiliates',
    label: 'My Affiliates',
    icon: (
      <MaterialCommunityIcons
        name="account-group-outline"
        color={INK}
        size={wp('4%')}
      />
    ),
    onPress: () => navigation.navigate('MyAffilateScreen'),
  },
];

export const buildAccountSecurityItems = navigation => [
  {
    key: 'update-phone',
    label: 'Update Phone Number',
    icon: (
      <MaterialCommunityIcons
        name="phone-outline"
        color={INK}
        size={wp('4%')}
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
        size={wp('4%')}
      />
    ),
    onPress: () =>
      navigation.navigate('UpdateContactScreen', { type: 'email' }),
  },
  {
    key: 'change-password',
    label: 'Change Password',
    icon: (
      <MaterialCommunityIcons name="lock-outline" color={INK} size={wp('4%')} />
    ),
    onPress: () => navigation.navigate('ChangePasswordScreen'),
  },
];

export const buildInformationItems = ({
  navigation,
  helpSheetRef,
  setIsLogoutModalVisible,
  setIsDeleteAccountModalVisible,
}) => [
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: (
      <MaterialCommunityIcons
        name="shield-lock-outline"
        color={INK}
        size={wp('4%')}
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
        size={wp('4%')}
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
      <Ionicons name="information-circle-outline" color={INK} size={wp('4%')} />
    ),
  },
  {
    key: 'support-tickets',
    label: 'Support Tickets',
    icon: <Ionicons name="help-circle-outline" color={INK} size={wp('4%')} />,
    onPress: () => navigation.navigate('SupportTicketsListScreen'),
    hideDividerAfter: true,
  },
  {
    key: 'customer-support',
    label: 'Customer Support',
    icon: <Ionicons name="headset-outline" color={INK} size={wp('4%')} />,
    onPress: () => helpSheetRef.current?.open(),
  },
  {
    key: 'kpc-login',
    label: 'KPC Login',
    icon: <Ionicons name="globe-outline" color={INK} size={wp('4%')} />,
    onPress: () => Linking.openURL(CONFIG.image_base_url),
  },
  {
    key: 'log-out',
    label: 'Log Out',
    textColor: '#FF0000',
    icon: <Ionicons name="log-out-outline" color={'#FF0000'} size={wp('4%')} />,
    onPress: () => setIsLogoutModalVisible(true),
  },
  {
    key: 'delete-account',
    label: 'Delete Account',
    textColor: '#FF0000',
    icon: (
      <MaterialCommunityIcons
        name="account-remove-outline"
        color={'#FF0000'}
        size={wp('4%')}
      />
    ),
    onPress: () => setIsDeleteAccountModalVisible(true),
  },
];
