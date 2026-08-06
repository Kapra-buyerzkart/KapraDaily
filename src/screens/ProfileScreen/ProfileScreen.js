import { View, StatusBar } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import CouponModal from '../../components/CouponModal';
import LocationModal from '../../components/LocationModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import HelpSupportModal from '../../components/HelpSupportModal';
import { useProfileScreen } from './useProfileScreen';
import { styles, HERO_TOP, HERO_GRADIENT } from './styles';
import {
  buildOffersItems,
  buildMyAccountItems,
  buildInformationItems,
} from './menuItems';
import ProfileTopBar from './components/ProfileTopBar';
import ProfileIdentity from './components/ProfileIdentity';
import UDWalletStrip from './components/UDWalletStrip';
import ProfileQuickActions from './components/ProfileQuickActions';
import ListSection from './components/ListSection';
import SuggestProductsModal from './components/SuggestProductsModal';
import LogoutButton from './components/LogoutButton';
import ProfileFooter from './components/ProfileFooter';
import LanguageSwitcherModal from '../../components/LanguageSwitcherModal';
import {
  BAR_SOLID_AT,
  BORDER_FADE_RANGE,
  NAME_FADE_IN,
  NAME_TRAVEL,
  TITLE_FADE_OUT,
  entrance,
} from './motion';
import { CANVAS } from '@/styles/homeTheme';

export default function ProfileScreen() {
  const {
    navigation,
    helpSheetRef,
    suggestProductsSheetRef,
    profile,
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
  } = useProfileScreen();

  const scrollY = useSharedValue(0);
  const swapAnchor = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const onIdentityMeasure = React.useCallback(
    bottom => {
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
    if (a <= 0) return { backgroundColor: HERO_TOP };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, a * BAR_SOLID_AT],
        [HERO_TOP, CANVAS],
      ),
    };
  });

  const offersItems = buildOffersItems({
    onBCoin: () => navigation.navigate('BCoinScreen'),
    onSmartPoint: () => openOffersModal('Gift Cards'),
    onCoupons: () => openOffersModal('Coupons'),
  });
  const myAccountItems = buildMyAccountItems({
    navigation,
    onLanguage: () => setIsLanguageModalVisible(true),
    isTicketValidationVisible: profile?.isTicketValidationVisible,
  });
  const informationItems = buildInformationItems({
    navigation,
    helpSheetRef,
    suggestProductsSheetRef,
    setIsDeleteAccountModalVisible,
  });

  return (
    <View style={styles.mainContainer}>
      {}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
      >
        <ProfileTopBar
          name={profile?.custName}
          onBack={() => navigation.goBack()}
          backgroundStyle={topBarBackgroundStyle}
          borderStyle={topBarBorderStyle}
          titleStyle={barTitleStyle}
          nameStyle={barNameStyle}
        />

        {}
        <LinearGradient colors={HERO_GRADIENT} style={styles.hero}>
          <ProfileIdentity
            profile={profile}
            onEditProfile={() => navigation.navigate('EditProfileScreen')}
            isPrivileged={profile?.isPrivileged}
            onMeasure={onIdentityMeasure}
            entering={entrance(0)}
          />

          <Animated.View entering={entrance(1)}>
            <UDWalletStrip
              walletData={walletData}
              onPress={() => navigation.navigate('BCoinScreen')}
            />
          </Animated.View>
        </LinearGradient>

        <Animated.View entering={entrance(2)}>
          <ProfileQuickActions
            onMyOrders={() => navigation.navigate('MyOrdersScreen')}
            onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
            onCoPartnerDashboard={() =>
              navigation.navigate('CoPartnerDashboardScreen')
            }
            onRefer={() => navigation.navigate('ReferralScreen')}
          />
        </Animated.View>

        <Animated.View entering={entrance(3)} style={styles.sectionsContainer}>
          <ListSection title="Offers" items={offersItems} />
          <View style={styles.sectionGap} />
          <ListSection title="My Account" items={myAccountItems} />
          <View style={styles.sectionGap} />
          <ListSection title="Information" items={informationItems} />
        </Animated.View>

        <Animated.View entering={entrance(4)}>
          <LogoutButton onPress={() => setIsLogoutModalVisible(true)} />
          <ProfileFooter />
        </Animated.View>
      </Animated.ScrollView>

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

      <LanguageSwitcherModal
        visible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
      />

      <HelpSupportModal ref={helpSheetRef} />
      <SuggestProductsModal
        ref={suggestProductsSheetRef}
        requestText={requestText}
        setRequestText={setRequestText}
        isSubmittingRequest={isSubmittingRequest}
        onSubmit={handleRequestProduct}
      />
    </View>
  );
}
