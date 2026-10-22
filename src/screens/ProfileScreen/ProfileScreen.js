import { View, StatusBar, ScrollView } from 'react-native';
import React from 'react';
import CouponModal from '../../components/CouponModal';
import LocationModal from '../../components/LocationModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import HelpSupportModal from '../../components/HelpSupportModal';
import LanguageSwitcherModal from '../../components/LanguageSwitcherModal';
import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';
import {
  buildOffersItems,
  buildMyAccountItems,
  buildInformationItems,
} from './menuItems';
import ProfileHeaderBar from './organisms/ProfileHeaderBar';
import ProfileHeroCard from './organisms/ProfileHeroCard';
import QuickActionsGrid from './organisms/QuickActionsGrid';
import MenuSection from './organisms/MenuSection';
import SuggestProductsModal from './components/SuggestProductsModal';

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

  const offersItems = buildOffersItems({
    onBCoin: () => navigation.navigate('BCoinScreen'),
    onSmartPoint: () => openOffersModal('Gift Cards'),
    onCoupons: () => openOffersModal('Coupons'),
    onMyRewards: () => navigation.navigate('MyRewardsScreen'),
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
    setIsLogoutModalVisible,
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeaderBar onBack={() => navigation.goBack()} />

        <View style={styles.heroBlock}>
          <ProfileHeroCard
            profile={profile}
            walletData={walletData}
            onEditProfile={() => navigation.navigate('EditProfileScreen')}
            onWallet={() => navigation.navigate('BCoinScreen')}
          />

          <QuickActionsGrid
            onMyOrders={() => navigation.navigate('MyOrdersScreen')}
            onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
            onCoPartnerDashboard={() =>
              navigation.navigate('CoPartnerDashboardScreen')
            }
            onRefer={() => navigation.navigate('ReferralScreen')}
          />
        </View>

        <View style={styles.menuWrap}>
          <MenuSection title="Offers" items={offersItems} />
          <MenuSection title="My Account" items={myAccountItems} />
          <MenuSection title="My Information" items={informationItems} />
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
