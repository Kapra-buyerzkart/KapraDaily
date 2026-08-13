import { View, StatusBar } from 'react-native';
import React from 'react';
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
import LanguageSwitcherModal from '../../components/LanguageSwitcherModal';
import { useProfileScreen } from './useProfileScreen';
import { styles, BAR_REST, BAR_SOLID } from './styles';
import {
  buildOffersItems,
  buildMyAccountItems,
  buildInformationItems,
} from './menuItems';
import ProfileHeaderBar from './organisms/ProfileHeaderBar';
import ProfileHeroCard from './organisms/ProfileHeroCard';
import QuickActionsGrid from './organisms/QuickActionsGrid';
import MenuSection from './organisms/MenuSection';
import LogoutRow from './molecules/LogoutRow';
import AppVersion from './molecules/AppVersion';
import SuggestProductsModal from './components/SuggestProductsModal';
import {
  BAR_SOLID_AT,
  BORDER_FADE_RANGE,
  NAME_FADE_IN,
  NAME_TRAVEL,
  TITLE_FADE_OUT,
  entrance,
} from './motion';

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
  const onHeroMeasure = React.useCallback(
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
    if (a <= 0) return { backgroundColor: BAR_REST };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, a * BAR_SOLID_AT],
        [BAR_REST, BAR_SOLID],
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
            isPrivileged={profile?.isPrivileged}
            walletData={walletData}
            onEditProfile={() => navigation.navigate('EditProfileScreen')}
            onWallet={() => navigation.navigate('BCoinScreen')}
            onMeasure={onHeroMeasure}
            entering={entrance(0)}
          />

          <Animated.View entering={entrance(1)}>
            <QuickActionsGrid
              onMyOrders={() => navigation.navigate('MyOrdersScreen')}
              onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
              onCoPartnerDashboard={() =>
                navigation.navigate('CoPartnerDashboardScreen')
              }
              onRefer={() => navigation.navigate('ReferralScreen')}
            />
          </Animated.View>
        </View>

        <Animated.View entering={entrance(2)}>
          <MenuSection title="Offers" items={offersItems} />
          <MenuSection title="My Account" items={myAccountItems} />
          <MenuSection title="Information" items={informationItems} />
        </Animated.View>

        <Animated.View entering={entrance(3)}>
          <LogoutRow onPress={() => setIsLogoutModalVisible(true)} />
          <AppVersion />
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
