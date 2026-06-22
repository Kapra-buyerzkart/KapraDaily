import { View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CouponModal from '../../components/CouponModal';
import LocationModal from '../../components/LocationModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import HelpSupportModal from '../../components/HelpSupportModal';
import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';
import {
  buildMyAccountItems,
  buildAccountSecurityItems,
  buildInformationItems,
} from './menuItems';
import ProfileHeader from './components/ProfileHeader';
import ProfileUserInfo from './components/ProfileUserInfo';
import ProfileQuickActions from './components/ProfileQuickActions';
import OffersSection from './components/OffersSection';
import ListSection from './components/ListSection';
import RequestProductSection from './components/RequestProductSection';
import ProfileFooter from './components/ProfileFooter';

export default function ProfileScreen() {
  const {
    navigation,
    helpSheetRef,
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
    walletData,
    statusConfig,
    setStatusConfig,
    handleRequestProduct,
    handleLogout,
    handleDeleteAccount,
    openOffersModal,
    handleApplyCoupon,
  } = useProfileScreen();

  const myAccountItems = buildMyAccountItems(navigation);
  const accountSecurityItems = buildAccountSecurityItems(navigation);
  const informationItems = buildInformationItems({
    navigation,
    helpSheetRef,
    setIsLogoutModalVisible,
    setIsDeleteAccountModalVisible,
  });

  return (
    <SafeAreaView edges={['top']} style={styles.mainConatiner}>
      <ScrollView>
        <ProfileHeader onBack={() => navigation.goBack()} />

        <View style={styles.profileCard}>
          <ProfileUserInfo
            profile={profile}
            walletData={walletData}
            onEditProfile={() => navigation.navigate('EditProfileScreen')}
            onPressCoin={() => navigation.navigate('BCoinScreen')}
          />
          <ProfileQuickActions
            onSavedAddress={() => navigation.navigate('SavedAddressScreen')}
            onMyOrders={() => navigation.navigate('MyOrdersScreen')}
            onRefer={() => navigation.navigate('ReferralScreen')}
          />
        </View>

        <View style={styles.sectionsContainer}>
          <OffersSection
            onSmartPoint={() => openOffersModal('Gift Cards')}
            onCoupons={() => openOffersModal('Coupons')}
          />
          <ListSection title="My Account" items={myAccountItems} />
          <ListSection title="Account Security" items={accountSecurityItems} />
          <ListSection title="Informations" items={informationItems} />
        </View>

        <RequestProductSection
          requestText={requestText}
          setRequestText={setRequestText}
          isSubmittingRequest={isSubmittingRequest}
          onSubmit={handleRequestProduct}
        />
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
    </SafeAreaView>
  );
}
