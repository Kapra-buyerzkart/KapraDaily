import { View, ScrollView } from 'react-native';
import React from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CouponModal from '../../components/CouponModal';
import LocationModal from '../../components/LocationModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import HelpSupportModal from '../../components/HelpSupportModal';
import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';
import { buildMyAccountItems, buildInformationItems } from './menuItems';
import ProfileHeader from './components/ProfileHeader';
import ProfileUserInfo from './components/ProfileUserInfo';
import ProfileQuickActions from './components/ProfileQuickActions';
import OffersSection from './components/OffersSection';
import ListSection from './components/ListSection';
import SuggestProductsModal from './components/SuggestProductsModal';
import LogoutButton from './components/LogoutButton';
import ProfileFooter from './components/ProfileFooter';
import COLORS from '@/styles/colors';

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
    statusConfig,
    setStatusConfig,
    handleRequestProduct,
    handleLogout,
    handleDeleteAccount,
    openOffersModal,
    handleApplyCoupon,
  } = useProfileScreen();

  const insets = useSafeAreaInsets();
  const myAccountItems = buildMyAccountItems(navigation);
  const informationItems = buildInformationItems({
    navigation,
    helpSheetRef,
    suggestProductsSheetRef,
    setIsDeleteAccountModalVisible,
  });

  return (
    <View style={{ backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          profile={profile}
          onBack={() => navigation.goBack()}
          onEditProfile={() => navigation.navigate('EditProfileScreen')}
          isPrivileged={profile?.isPrivileged}
        />

        <ProfileQuickActions
          onMyOrders={() => navigation.navigate('MyOrdersScreen')}
          onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
          onCoPartnerDashboard={() =>
            navigation.navigate('CoPartnerDashboardScreen')
          }
          onRefer={() => navigation.navigate('ReferralScreen')}
        />

        <View style={styles.sectionsContainer}>
          <OffersSection
            onBCoin={() => navigation.navigate('BCoinScreen')}
            onSmartPoint={() => openOffersModal('Gift Cards')}
            onCoupons={() => openOffersModal('Coupons')}
          />
          <ListSection title="My Account" items={myAccountItems} />
          <ListSection title="Informations" items={informationItems} />
        </View>

        <LogoutButton onPress={() => setIsLogoutModalVisible(true)} />

        <ProfileFooter />
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
