import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Clipboard,
  Linking,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { getAccessToken } from '../api/tokenService';
import LoginScreen from './LoginScreen';
import { AppContext } from '../context/appContext';
import { LoaderContext } from '../context/loaderContext';
import CouponModal from '../components/CouponModal';
import ProfileAvatarBadge from '../components/ProfileAvatarBadge';
import {
  getAvailableCouponsApi,
  getAvailableGiftCardsApi,
} from '../api/cartService';
import Toast from 'react-native-simple-toast';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import CONFIG from '../globals/config';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusModal from '../components/StatusModal';
import {
  getWalletDataApi,
  requestProductApi,
  deleteAccountApi,
} from '../api/userService';
import {
  LocationIcon,
  OrderIcon,
  ReferIcon,
  SmartPointIcon,
  PrivacyIcon,
  TermsIcon,
  AboutIcon,
  CouponIcon,
} from '../components/ProfileIcons';
import DeviceInfo from 'react-native-device-info';

const INK = '#1A1A1A';
const ORANGE = '#FF6A00';
const GRAY_50 = '#FFF';
const GRAY_300 = '#D8D6CE';
const GRAY_500 = '#9A9A92';
const GRAY_600 = '#6B6B6B';

export default function ProfileScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const navigation = useNavigation();
  const {
    profile,
    loadProfile,
    logout,
    isStoreUnavailable,
    storeUnavailableData,
  } = useContext(AppContext);
  const { showLoader } = useContext(LoaderContext);
  const [offersModalVisible, setOffersModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [availableGiftCards, setAvailableGiftCards] = useState([]);
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [requestText, setRequestText] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
  const [walletData, setWalletData] = useState(null);
  const [statusConfig, setStatusConfig] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleRequestProduct = async () => {
    if (!requestText.trim()) return;

    try {
      setIsSubmittingRequest(true);
      const response = await requestProductApi({ requestdetails: requestText });
      if (response && response.success) {
        setStatusConfig({
          visible: true,
          type: 'orange',
          title: 'Request Submitted',
          message: 'Thank you! Your request has been submitted.',
        });
        setRequestText('');
      } else {
        setStatusConfig({
          visible: true,
          type: 'error',
          title: 'Request Failed',
          message:
            response?.message || 'Failed to submit request. Please try again.',
        });
      }
    } catch (error) {
      console.error('Request product error:', error);
      setStatusConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // useEffect(() => {
  //     const fetchProfile = async () => {
  //         showLoader(true)
  //         await loadProfile()
  //         showLoader(false)
  //     }
  //     fetchProfile()
  // }, [])

  // if (!profile) {
  //     return <LoginScreen />
  // }

  useEffect(() => {
    const fetchProfile = async () => {
      showLoader(true);
      await loadProfile();
      showLoader(false);
      // setIsProfileLoaded(true);   // ✅ IMPORTANT
    };
    fetchProfile();
    fetchWalletData();
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

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoginScreen',
          params: {
            type: 'login',
          },
        },
      ],
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleteAccountModalVisible(false);
    showLoader(true);
    try {
      const response = await deleteAccountApi();
      console.log('Delete account response:', response);
      if (response && response.success) {
        await handleLogout();
        Toast.show('Account deleted successfully', Toast.SHORT);
      } else {
        setStatusConfig({
          visible: true,
          type: 'error',
          title: 'Deletion Failed',
          message:
            response?.message || 'Failed to delete account. Please try again.',
        });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setStatusConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      showLoader(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [profile]);

  const fetchOffers = async () => {
    try {
      const pincodeAreaId = profile?.pincode || profile?.pincodeAreaId;
      const [couponsRes, giftCardsRes] = await Promise.all([
        getAvailableCouponsApi(pincodeAreaId),
        getAvailableGiftCardsApi(pincodeAreaId),
      ]);

      if (couponsRes && couponsRes.data) {
        const coupons =
          couponsRes.data.items ||
          (Array.isArray(couponsRes.data) ? couponsRes.data : []);
        setAvailableCoupons(coupons);
      }
      if (giftCardsRes && giftCardsRes.data) {
        const giftCards =
          giftCardsRes.data.items ||
          (Array.isArray(giftCardsRes.data) ? giftCardsRes.data : []);
        setAvailableGiftCards(giftCards);
      }
    } catch (error) {
      console.log('Error fetching offers:', error);
    }
  };

  const openOffersModal = type => {
    setIsGiftCard(type === 'Gift Cards');
    setCouponCode('');
    setOffersModalVisible(true);
  };

  const handleApplyCoupon = codeToApply => {
    const code = codeToApply || couponCode;
    if (!code) {
      Toast.show('Please enter a code', Toast.SHORT);
      return;
    }
    // Copy functionality
    Clipboard.setString(code);
    setOffersModalVisible(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.mainConatiner}>
      {console.log('profilescreen', profile)}
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name={'arrowleft'} size={wp('4.5%')} color={INK} />
          </TouchableOpacity>
          <Text style={styles.profileHeaderText}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.userView}>
            <View style={styles.userAvatarContainer}>
              <ProfileAvatarBadge
                size={wp('13%')}
                isPrivileged={profile?.isPrivileged}
              />
            </View>
            <View style={styles.userNamePhoneView}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={styles.userNameText}>{profile.custName}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfileScreen')}
                  style={{ marginLeft: wp('2%'), marginTop: hp('0.5%') }}
                >
                  <MaterialIcons name="edit" size={wp('4%')} color={ORANGE} />
                </TouchableOpacity>
              </View>
              <Text style={styles.phoneNumberStyle}>{profile.phoneNo}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('BCoinScreen')}
              style={styles.tokenContainer}
            >
              <Image
                source={require('../assets/icons/udcoin.png')}
                style={{ width: wp('5%'), height: wp('5%') }}
                resizeMode="contain"
              />
              <Text style={styles.tokenText}>
                {walletData?.wallet?.bCoins || '0'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.containerTwo}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SavedAddressScreen')}
              style={styles.saveAddressContainer}
            >
              <View style={styles.actionIconView}>
                <LocationIcon
                  width={wp('5%')}
                  height={wp('5%')}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.saveAddressText}>{'Saved \nAddress'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyOrdersScreen')}
              style={styles.saveAddressContainer}
            >
              <View style={styles.actionIconView}>
                <OrderIcon width={wp('5%')} height={wp('5%')} color="#FFFFFF" />
              </View>
              <Text style={styles.saveAddressText}>{'My \nOrders'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ReferralScreen')}
              style={[styles.saveAddressContainer, styles.saveAddressAccent]}
            >
              <View style={styles.actionIconView}>
                <ReferIcon width={wp('5%')} height={wp('5%')} color="#FFFFFF" />
              </View>
              <Text style={styles.saveAddressText}>Refer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionHeader}>Offers</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() => openOffersModal('Gift Cards')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <SmartPointIcon width={wp('6%')} height={wp('6%')} />
                </View>
                <Text style={styles.listItemText}>Smart point</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => openOffersModal('Coupons')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <CouponIcon width={wp('6%')} height={wp('6%')} />
                </View>
                <Text style={styles.listItemText}>Coupon</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>My Account</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Wishlist')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="heart-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>My Wishlist</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigation.navigate('MyOrdersScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="receipt-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>My Orders</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigation.navigate('CartScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="cart-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>My Cart</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigation.navigate('CoPartnerDashboardScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Co-Partner Dashboard</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('MyAffilateScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>My Affiliates</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Account Security</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UpdateContactScreen', { type: 'phone' })
              }
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Update Phone Number</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UpdateContactScreen', { type: 'email' })
              }
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Update Email ID</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePasswordScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Change Password</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Informations</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <PrivacyIcon width={wp('6%')} height={wp('6%')} />
                </View>
                <Text style={styles.listItemText}>Privacy Policy</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <TermsIcon width={wp('6%')} height={wp('6%')} />
                </View>
                <Text style={styles.listItemText}>Terms Of Use</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <AboutIcon width={wp('6%')} height={wp('6%')} />
                </View>
                <Text style={styles.listItemText}>About Us</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigation.navigate('SupportTicketsListScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="help-circle-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Help & Support</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerSupportScreen')}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="headset-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>Customer Support</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => Linking.openURL(CONFIG.image_base_url)}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="globe-outline"
                    color={ORANGE}
                    size={wp('4%')}
                  />
                </View>
                <Text style={styles.listItemText}>KPC Login</Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => setIsLogoutModalVisible(true)}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Ionicons
                    name="log-out-outline"
                    color={'#FF0000'}
                    size={wp('4%')}
                  />
                </View>
                <Text style={[styles.listItemText, { color: '#FF0000' }]}>
                  Log Out
                </Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => setIsDeleteAccountModalVisible(true)}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <MaterialCommunityIcons
                    name="account-remove-outline"
                    color={'#FF0000'}
                    size={wp('4%')}
                  />
                </View>
                <Text style={[styles.listItemText, { color: '#FF0000' }]}>
                  Delete Account
                </Text>
              </View>
              <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sendContainer}>
          <Text style={styles.sendContainerTextOne}>
            Didnt Find Your Product!
          </Text>
          <Text style={styles.sendContainerTextTwo}>
            Tell us which product you want in our app
          </Text>
          <View style={styles.sendContainerInnerView}>
            <TextInput
              placeholderTextColor={GRAY_300}
              placeholder="eg: biscuit, caske, fruits ..."
              style={styles.sendTextInput}
              value={requestText}
              onChangeText={setRequestText}
            />
            <TouchableOpacity
              onPress={handleRequestProduct}
              disabled={isSubmittingRequest}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerBranding}>
          {/* <LinearGradient
                    colors={['#F1F1F1', '#FFFFFF']}
                    style={styles.footerBranding}
                > */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/images/logoo.png')}
              style={styles.footerLogo}
            />
          </View>
          <Text style={styles.versionText}>
            Version {DeviceInfo.getVersion()}
          </Text>
        </View>
      </ScrollView>

      <CouponModal
        visible={offersModalVisible}
        onClose={() => setOffersModalVisible(false)}
        isGiftCard={isGiftCard}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        onApply={handleApplyCoupon}
        availableCoupons={availableCoupons}
        availableGiftCards={availableGiftCards}
        onCouponClick={handleApplyCoupon}
        isCopyOnly={true}
      />
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />

      <ConfirmationModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
      />

      <ConfirmationModal
        visible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <StatusModal
        visible={statusConfig.visible}
        onClose={() => setStatusConfig(prev => ({ ...prev, visible: false }))}
        type={statusConfig.type}
        title={statusConfig.title}
        message={statusConfig.message}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_50,
  },
  profileHeaderText: {
    color: INK,
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5.2%'),
    marginLeft: wp('4%'),
  },
  profileCard: {
    backgroundColor: GRAY_50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginTop: hp('1%'),
    marginHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  userView: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userAvatarContainer: {
    position: 'relative',
  },
  userNamePhoneView: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  userNameText: {
    color: INK,
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('4.8%'),
    flexShrink: 1,
  },
  phoneNumberStyle: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.poppins.medium,
    color: GRAY_600,
    marginTop: hp('0.2%'),
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INK,
    borderRadius: 20,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    gap: wp('1.5%'),
  },
  tokenBadgeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenBadgeIconText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('2.8%'),
    color: '#FFFFFF',
  },
  tokenText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
  },
  containerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2.5%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  saveAddressContainer: {
    flex: 1,
    alignItems: 'center',
    height: hp('10%'),
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: INK,
    paddingVertical: hp('0.5%'),
  },
  saveAddressAccent: {
    backgroundColor: ORANGE,
  },
  actionIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.2%'),
  },
  saveAddressText: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.1%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sectionHeader: {
    fontFamily: FONTS.outfit.semiBold,
    fontSize: wp('4.2%'),
    color: INK,
    marginBottom: hp('1.2%'),
    marginTop: hp('1%'),
  },
  sectionsContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY_300,
    paddingVertical: hp('0.5%'),
    marginBottom: hp('0.5%'),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconWrapper: {
    width: wp('6%'),
    height: wp('6%'),
    backgroundColor: GRAY_50,
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    marginLeft: wp('3%'),
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3.2%'),
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: GRAY_50,
    marginHorizontal: wp('4%'),
  },
  circle: {
    width: wp('4.2%'),
    height: wp('4.2%'),
  },
  sendContainer: {
    borderColor: GRAY_300,
    marginHorizontal: wp('5%'),
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: wp('3%'),
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  sendContainerTextOne: {
    fontFamily: FONTS.poppins.regular,
    color: INK,
    fontSize: wp('3.72%'),
    paddingBottom: 10,
    lineHeight: wp('3.72%') * 1.2,
  },
  sendContainerTextTwo: {
    color: GRAY_600,
    fontFamily: FONTS.poppins.light,
    fontSize: wp('3.25%'),
  },
  sendContainerInnerView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: GRAY_300,
    borderRadius: 50,
    alignItems: 'center',
    height: hp('6.3%'),
    marginTop: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  sendTextInput: {
    flex: 1,
    fontFamily: FONTS.poppins.light,
    fontSize: wp('3.72%'),
    color: INK,
  },
  sendButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 40,
    height: hp('4.3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.5%'),
  },
  sendImage: {
    width: wp('18.6%'),
    height: hp('4.3%'),
    resizeMode: 'contain',
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
    marginBottom: hp('4%'),
  },
  footerLogo: {
    width: wp('28%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  logoWrapper: {
    paddingHorizontal: wp('4%'),
  },
  versionText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3%'),
    color: GRAY_500,
    marginTop: hp('0.1%'),
  },
});
