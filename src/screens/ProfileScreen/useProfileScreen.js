import { useContext, useEffect, useRef, useState } from 'react';
import { Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../../context/appContext';
import { LoaderContext } from '../../context/loaderContext';
import {
  getAvailableCouponsApi,
  getAvailableGiftCardsApi,
} from '../../api/cartService';
import {
  getWalletDataApi,
  requestProductApi,
  deleteAccountApi,
  getGeneralSettingsApi,
} from '../../api/userService';

export const useProfileScreen = () => {
  const navigation = useNavigation();
  const helpSheetRef = useRef(null);
  const suggestProductsSheetRef = useRef(null);
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
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      showLoader(true);
      await loadProfile();
      showLoader(false);
    };
    fetchProfile();
    fetchWalletData();
    fetchGeneralSettings();
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

  const fetchGeneralSettings = async () => {
    try {
      const response = await getGeneralSettingsApi();
      console.log('General settings response:', response);
    } catch (error) {
      console.error('Error fetching general settings:', error);
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
    Clipboard.setString(code);
    setOffersModalVisible(false);
  };

  return {
    navigation,
    helpSheetRef,
    suggestProductsSheetRef,
    profile,
    isStoreUnavailable,
    storeUnavailableData,
    offersModalVisible,
    setOffersModalVisible,
    isLocationModalVisible,
    setIsLocationModalVisible,
    availableCoupons,
    availableGiftCards,
    isGiftCard,
    couponCode,
    setCouponCode,
    requestText,
    setRequestText,
    isSubmittingRequest,
    isLogoutModalVisible,
    setIsLogoutModalVisible,
    isDeleteAccountModalVisible,
    setIsDeleteAccountModalVisible,
    isLanguageModalVisible,
    setIsLanguageModalVisible,
    walletData,
    statusConfig,
    setStatusConfig,
    handleRequestProduct,
    handleLogout,
    handleDeleteAccount,
    openOffersModal,
    handleApplyCoupon,
  };
};
