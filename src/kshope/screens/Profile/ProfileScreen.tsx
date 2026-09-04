import React from 'react';
import { View, Image, StatusBar, Clipboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../theme/colours';
import { UI_COLORS, wp } from '../../theme/tokens';
import { styles, BAR_REST, BAR_SOLID } from './styles';

import { useUser } from '../../context/UserContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import CouponModal from '../../components/CouponModal';
import FloatingCartButton from '../../components/FloatingCartButton';
import {
  trackCartPillScroll,
  useCartPillScrollTracker,
} from '../../components/cartPillScroll';
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

import ProfileHeaderBar from './redesign/sections/ProfileHeaderBar';
import ProfileHeroCard from './redesign/sections/ProfileHeroCard';
import QuickActionsGrid from './redesign/sections/QuickActionsGrid';
import MenuSection, { MenuItem } from './redesign/sections/MenuSection';
import {
  BAR_SOLID_AT,
  BORDER_FADE_RANGE,
  NAME_FADE_IN,
  NAME_TRAVEL,
  TITLE_FADE_OUT,
  entrance,
} from './redesign/motion';

const INK = UI_COLORS.textSecondary;
const RED = UI_COLORS.danger;
const ICON_SIZE = wp('4%');

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
  const scrollViewRef = React.useRef<any>(null);

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

  const scrollY = useSharedValue(0);
  const swapAnchor = useSharedValue(0);
  useCartPillScrollTracker();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      trackCartPillScroll(event.contentOffset.y);
    },
  });
  const onHeroMeasure = React.useCallback(
    (bottom: number) => {
      swapAnchor.value = bottom;
    },
    [swapAnchor],
  );

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const barTitleStyle = useAnimatedStyle(() => {
    const a = swapAnchor.value;
    if (a <= 0) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        TITLE_FADE_OUT.map(f => f * a),
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });

  const barNameStyle = useAnimatedStyle(() => {
    const a = swapAnchor.value;
    if (a <= 0) return { opacity: 0 };
    const progress = interpolate(
      scrollY.value,
      NAME_FADE_IN.map(f => f * a),
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: progress,
      transform: [{ translateY: (1 - progress) * NAME_TRAVEL }],
    };
  });

  const topBarBackgroundStyle = useAnimatedStyle(() => {
    const a = swapAnchor.value;
    if (a <= 0) return { backgroundColor: BAR_REST };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, a * BAR_SOLID_AT],
        [BAR_REST, BAR_SOLID],
      ),
    };
  });

  const accountItems: MenuItem[] = [
    {
      key: 'edit-profile',
      label: 'Edit profile',
      icon: (
        <MaterialCommunityIcons
          name="account-outline"
          color={INK}
          size={ICON_SIZE}
        />
      ),
      onPress: () => navigation.navigate('KshopeEditProfile'),
    },
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

  const offersItems: MenuItem[] = [
    {
      key: 'smart-point',
      label: 'Smart point',
      icon: <Ionicons name="wallet-outline" color={INK} size={ICON_SIZE} />,
      onPress: () => setActiveOfferModal('smart'),
    },
    {
      key: 'coupon',
      label: 'Coupon',
      icon: <Ionicons name="pricetag-outline" color={INK} size={ICON_SIZE} />,
      onPress: () => setActiveOfferModal('coupon'),
    },
    {
      key: 'bcoin',
      label: 'B coin',
      icon: (
        <MaterialCommunityIcons
          name="hand-coin-outline"
          color={INK}
          size={ICON_SIZE}
        />
      ),
      onPress: () => navigation.navigate('KshopeBCoin'),
    },
  ];

  const informationItems: MenuItem[] = [
    {
      key: 'privacy',
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
      key: 'terms',
      label: 'Terms and conditions',
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
          title: 'Terms and conditions',
          fallback: 'terms',
        }),
    },
    {
      key: 'about',
      label: 'About us',
      icon: (
        <Ionicons
          name="information-circle-outline"
          color={INK}
          size={ICON_SIZE}
        />
      ),
      onPress: () =>
        navigation.navigate('KshopeLegalContent', {
          settingKeys: ['about_us', 'aboutus', 'about'],
          title: 'About us',
        }),
    },
    {
      key: 'delete-account',
      label: 'Delete account',
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

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
      >
        <ProfileHeaderBar
          name={profile?.custName}
          onBack={() => navigation.goBack()}
          backgroundStyle={topBarBackgroundStyle}
          borderStyle={topBarBorderStyle}
          titleStyle={barTitleStyle}
          nameStyle={barNameStyle}
        />

        <View style={styles.heroBlock}>
          <ProfileHeroCard
            profile={profile}
            walletData={walletData}
            onEditProfile={() => navigation.navigate('KshopeEditProfile')}
            onWallet={() => navigation.navigate('KshopeBCoin')}
            onMeasure={onHeroMeasure}
            entering={entrance(0)}
          />

          <Animated.View entering={entrance(1)}>
            <QuickActionsGrid
              onCart={() => navigation.navigate('KshopeCart')}
              onMyOrders={() => navigation.navigate('KshopeMyOrders')}
              onSavedAddress={() => navigation.navigate('KshopeSavedAddress')}
              onRefer={() => navigation.navigate('KshopeReferral')}
            />
          </Animated.View>
        </View>

        <Animated.View entering={entrance(2)}>
          <MenuSection title="Account Security" items={accountItems} />
          <MenuSection title="Offers" items={offersItems} />
          <MenuSection title="Informations" items={informationItems} />
        </Animated.View>

        <Animated.View entering={entrance(3)} style={styles.footerContainer}>
          <Image
            source={require('../../assets/images/login/logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.ScrollView>

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
