import { View, StatusBar } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  interpolate,
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
import { styles } from './styles';
import { buildMyAccountItems, buildInformationItems } from './menuItems';
import ProfileTopBar from './components/ProfileTopBar';
import ProfileIdentity from './components/ProfileIdentity';
import ProfileQuickActions from './components/ProfileQuickActions';
import OffersSection from './components/OffersSection';
import ListSection from './components/ListSection';
import SuggestProductsModal from './components/SuggestProductsModal';
import LogoutButton from './components/LogoutButton';
import ProfileFooter from './components/ProfileFooter';
import LanguageSwitcherModal from '../../components/LanguageSwitcherModal';
import {
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
    statusConfig,
    setStatusConfig,
    handleRequestProduct,
    handleLogout,
    handleDeleteAccount,
    openOffersModal,
    handleApplyCoupon,
  } = useProfileScreen();

  // All three bar animations read the same scroll value and run on the UI
  // thread, so scrolling this screen never re-renders it. The identity block's
  // height is measured rather than assumed — it changes with the font scale and
  // with whether the crown badge is drawn.
  const scrollY = useSharedValue(0);
  const identityHeight = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const onIdentityLayout = React.useCallback(
    event => {
      identityHeight.value = event.nativeEvent.layout.height;
    },
    [identityHeight],
  );

  // The rule fades in over the first few points of scroll rather than snapping
  // on at a threshold, so it arrives with the content instead of announcing
  // itself.
  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Until the identity block has been measured the bar is just "Profile" — a
  // zero height would otherwise make every range collapse to a single point and
  // swap the titles on the first pixel of scroll.
  const barTitleStyle = useAnimatedStyle(() => {
    const h = identityHeight.value;
    if (h <= 0) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        TITLE_FADE_OUT.map(f => f * h),
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });

  const barNameStyle = useAnimatedStyle(() => {
    const h = identityHeight.value;
    if (h <= 0) return { opacity: 0 };
    const progress = interpolate(
      scrollY.value,
      NAME_FADE_IN.map(f => f * h),
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: progress,
      transform: [{ translateY: (1 - progress) * NAME_TRAVEL }],
    };
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
      {/* Home leaves the bar on `light-content` while its dark banner is up,
          and this page is now white to the top edge — without this the icons
          arrive here invisible. Unmounting pops the entry, so Home gets its
          own setting back on the way out. */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
      >
        <ProfileTopBar
          name={profile?.custName}
          onBack={() => navigation.goBack()}
          borderStyle={topBarBorderStyle}
          titleStyle={barTitleStyle}
          nameStyle={barNameStyle}
        />

        <Animated.View entering={entrance(0)} onLayout={onIdentityLayout}>
          <ProfileIdentity
            profile={profile}
            onEditProfile={() => navigation.navigate('EditProfileScreen')}
            isPrivileged={profile?.isPrivileged}
          />
        </Animated.View>

        <Animated.View entering={entrance(1)}>
          <ProfileQuickActions
            onMyOrders={() => navigation.navigate('MyOrdersScreen')}
            onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
            onCoPartnerDashboard={() =>
              navigation.navigate('CoPartnerDashboardScreen')
            }
            onRefer={() => navigation.navigate('ReferralScreen')}
          />
        </Animated.View>

        <Animated.View entering={entrance(2)} style={styles.sectionsContainer}>
          <OffersSection
            onBCoin={() => navigation.navigate('BCoinScreen')}
            onSmartPoint={() => openOffersModal('Gift Cards')}
            onCoupons={() => openOffersModal('Coupons')}
          />
          <View style={styles.sectionGap} />
          <ListSection
            eyebrow="Settings"
            title="My Account"
            items={myAccountItems}
          />
          <View style={styles.sectionGap} />
          <ListSection
            eyebrow="Help"
            title="Information"
            items={informationItems}
          />
        </Animated.View>

        <Animated.View entering={entrance(3)}>
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
