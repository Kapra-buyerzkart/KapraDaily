import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
  Clipboard,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../theme/colours';
import { styles } from './styles';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useUser } from '../../context/UserContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import CouponModal from '../../components/CouponModal';
import FloatingCartButton from '../../components/FloatingCartButton';
import { useCustomAlert } from '../../context/AlertContext';
import { LoaderContext } from '../../context/loaderContext';
import { clearKshopeSession } from '../../api/session';
import {
  deleteAccountApi,
  getWalletDataApi,
} from '../../api/services/userService';
import {
  getAvailableCouponsApi,
  getAvailableGiftCardsApi,
} from '../../api/services/cartService';
import Toast from 'react-native-simple-toast';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, loadProfile } = useUser();
  const { showAlert } = useCustomAlert();
  const loader = React.useContext(LoaderContext);
  const showLoader = loader ? loader.showLoader : () => {};

  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    React.useState(false);
  const [walletData, setWalletData] = React.useState<any>(null);
  const [activeOfferModal, setActiveOfferModal] = React.useState<
    'smart' | 'coupon' | null
  >(null);

  const [availableCoupons, setAvailableCoupons] = React.useState<any[]>([]);
  const [availableGiftCards, setAvailableGiftCards] = React.useState<any[]>([]);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    loadProfile();
    fetchWalletData();
    fetchOffersData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await getWalletDataApi();
      if (response && response.success) {
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchOffersData = async () => {
    try {
      const [couponsRes, giftCardsRes] = await Promise.all([
        getAvailableCouponsApi(),
        getAvailableGiftCardsApi(),
      ]);
      if (couponsRes?.success) {
        setAvailableCoupons(couponsRes.data?.items || []);
      } else {
        setAvailableCoupons([]);
      }
      if (giftCardsRes?.success) {
        setAvailableGiftCards(giftCardsRes.data?.items || []);
      } else {
        setAvailableGiftCards([]);
      }
    } catch (error) {
      console.error('Error fetching offers data:', error);
      setAvailableCoupons([]);
      setAvailableGiftCards([]);
    }
  };

  const handleCouponClickOnProfile = (item: any) => {
    const code = item.couponCode || item.code || item.giftCardCode;
    if (code) {
      Clipboard.setString(code);
      Toast.show(`Code "${code}" copied to clipboard!`, Toast.SHORT);
      setActiveOfferModal(null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, []),
  );

  const handleDeleteAccount = async () => {
    setIsDeleteAccountModalVisible(false);
    showLoader(true);
    try {
      const response = await deleteAccountApi();
      if (response && response.success) {
        await clearKshopeSession();
        Toast.show('Account deleted successfully', Toast.SHORT);
        navigation.goBack();
      } else {
        showAlert(
          'Error',
          response?.message ||
            'Failed to delete account. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Delete account error:', error);
      showAlert('Error', 'An error occurred while deleting your account.');
    } finally {
      showLoader(false);
    }
  };

  const renderMenuItem = (
    icon: any,
    title: string,
    showBadge?: boolean,
    badgeValue?: string,
    iconBgColor?: string,
    onPress?: () => void,
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[
          styles.menuIconContainer,
          iconBgColor ? { backgroundColor: iconBgColor } : null,
        ]}
      >
        {icon}
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeValue}</Text>
        </View>
      )}
      <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        style={[
          styles.backgroundImage,
          { paddingTop: hp('2%'), paddingBottom: hp('2%') },
        ]}
        imageStyle={{
          borderBottomLeftRadius: wp('10%'),
          borderBottomRightRadius: wp('10%'),
        }}
        source={require('../../assets/images/profile.png')}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color={colors.black} />
          </TouchableOpacity>

          <View style={styles.userInfoContainer}>
            <View style={styles.userProfileSection}>
              <View style={styles.avatarContainer}>
                <MaterialIcons
                  name="person"
                  size={40}
                  color={colors.themeTeal}
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.welcomeText}>Hey</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {profile?.custName || 'User'}
                  </Text>
                </View>
                <Text style={styles.userPhone}>{profile?.phoneNo || ''}</Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={() => navigation.navigate('KshopeBCoin')}>
                <ImageBackground
                  source={require('../../assets/images/bcoinprofile.png')}
                  style={{
                    width: 75,
                    height: 22,
                    top: -5,
                    left: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  resizeMode="contain"
                >
                  <Text
                    style={[
                      styles.coinText,
                      {
                        color: '#FFBA33',
                        fontWeight: 'bold',
                        fontSize: wp('2.9%'),
                        textAlign: 'center',
                        marginLeft: hp('1.3%'),
                        marginTop: hp('0.1%'),
                      },
                    ]}
                  >
                    {profile?.totalBCoins || '0.00'}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notificationBell}
                onPress={() =>
                  showAlert('Notifications', 'You have no new notifications.')
                }
              >
                <Ionicons
                  name="notifications"
                  size={24}
                  color={colors.black}
                  style={{ top: -5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: hp('2%'),
          paddingBottom: hp('10%'),
        }}
      >
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('KshopeCart')}
          >
            <Image
              source={require('../../assets/images/profile/cart.png')}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('KshopeMyOrders')}
          >
            <Image
              source={require('../../assets/images/profile/order.png')}
              style={{ width: 35, height: 35 }}
            />
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('KshopeSavedAddress')}
          >
            <Image
              source={require('../../assets/images/profile/location.png')}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Address</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('KshopeReferral')}>
          <Image
            source={require('../../assets/images/refer.png')}
            style={styles.referIllustration}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/images/profile/profile.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'Edit profile',
              false,
              '1',
              undefined,
              () => navigation.navigate('KshopeEditProfile'),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={colors.themeTeal}
              />,
              'Update Phone Number',
              false,
              undefined,
              undefined,
              () =>
                navigation.navigate('KshopeUpdateContact', { type: 'phone' }),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="email-outline"
                size={16}
                color={colors.themeTeal}
              />,
              'Update Email ID',
              false,
              undefined,
              undefined,
              () =>
                navigation.navigate('KshopeUpdateContact', { type: 'email' }),
            )}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Offers</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/icons/profile/gift.png')}
                style={{ width: 16, height: 16, tintColor: colors.themeTeal }}
                resizeMode="contain"
              />,
              'Smart point',
              false,
              undefined,
              undefined,
              () => setActiveOfferModal('smart'),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/images/offer.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'Coupon',
              false,
              undefined,
              undefined,
              () => setActiveOfferModal('coupon'),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/images/cartbcoin.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'B coin',
              false,
              undefined,
              undefined,
              () => navigation.navigate('KshopeBCoin'),
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              <Image
                source={require('../../assets/images/profile/Union.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'Privacy Policy',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'Privacy Policy will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/images/profile/terms.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'Terms and conditions',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'Terms and Conditions will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <Image
                source={require('../../assets/images/profile/info.png')}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />,
              'About us',
              false,
              undefined,
              undefined,
              () =>
                showAlert(
                  'Information',
                  'About Us information will be updated soon.',
                ),
            )}
            {renderMenuItem(
              <MaterialCommunityIcons
                name="account-remove-outline"
                size={16}
                color={colors.themeTeal}
              />,
              'Delete account',
              false,
              undefined,
              undefined,
              () => setIsDeleteAccountModalVisible(true),
            )}
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Image
            source={require('../../assets/images/login/logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        iconName="delete-forever"
        themeColor={colors.themeTeal}
      />

      <CouponModal
        profile="user"
        visible={activeOfferModal !== null}
        onClose={() => setActiveOfferModal(null)}
        isGiftCard={activeOfferModal === 'smart'}
        availableCoupons={availableCoupons}
        availableGiftCards={availableGiftCards}
        onCouponClick={handleCouponClickOnProfile}
      />
      <FloatingCartButton bottom={20} />
    </View>
  );
};

export default ProfileScreen;
