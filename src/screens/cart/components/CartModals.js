import React from 'react';
import StatusModal from '../../../components/StatusModal';
import AddressModal from '../../../components/AddressModal';
import DeliverySlotModal from '../../../components/DeliverySlotModal';
import CouponModal from '../../../components/CouponModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AddressConfirmationModal from '../../../components/AddressConfirmationModal';

const CartModals = ({
  navigation,
  // Status modal
  statusModalVisible,
  setStatusModalVisible,
  statusType,
  statusTitle,
  statusMessage,
  onRefresh,
  // Address modal
  showAddressModal,
  setShowAddressModal,
  addresses,
  onSelectAddress,
  onThreeDotsClicked,
  onDeleteClicked,
  onCloseThreeDots,
  // Delivery slot modal
  showSlotModal,
  setShowSlotModal,
  setChosenSlot,
  setSelectedDeliveryType,
  pincodeAreaId,
  // Coupon modal
  showCouponModal,
  setShowCouponModal,
  isGiftCard,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  availableCoupons,
  availableGiftCards,
  handleCouponClick,
  // Clear cart confirmation modal
  isClearCartModalVisible,
  setIsClearCartModalVisible,
  clearCart,
  // Address confirmation modal
  addressConfirmationData,
  setAddressConfirmationData,
  setServiceabilityTrigger,
  cartError,
  submitOrder,
}) => (
  <>
    <StatusModal
      visible={statusModalVisible}
      onClose={() => {
        setStatusModalVisible(false);
        if (
          statusTitle === 'Price/Stock Changed' ||
          statusTitle === 'Session Expired'
        ) {
          onRefresh();
        }
      }}
      type={statusType}
      title={statusTitle}
      message={statusMessage}
    />
    <AddressModal
      visible={showAddressModal}
      onClose={() => setShowAddressModal(false)}
      addresses={addresses}
      onSelectAddress={onSelectAddress}
      onThreeDotsClicked={onThreeDotsClicked}
      onDeleteClicked={onDeleteClicked}
      onCloseThreeDots={onCloseThreeDots}
      navigation={navigation}
    />
    <DeliverySlotModal
      visible={showSlotModal}
      onClose={() => setShowSlotModal(false)}
      onSelectSlot={slot => {
        setChosenSlot(slot);
        setSelectedDeliveryType('slot');
      }}
      pincodeAreaId={pincodeAreaId}
    />
    <CouponModal
      visible={showCouponModal}
      onClose={() => setShowCouponModal(false)}
      isGiftCard={isGiftCard}
      couponCode={couponCode}
      setCouponCode={setCouponCode}
      onApply={handleApplyCoupon}
      availableCoupons={availableCoupons}
      availableGiftCards={availableGiftCards}
      onCouponClick={handleCouponClick}
    />
    <ConfirmationModal
      visible={isClearCartModalVisible}
      onClose={() => setIsClearCartModalVisible(false)}
      onConfirm={() => {
        clearCart();
        setIsClearCartModalVisible(false);
      }}
      title="Clear Cart"
      message="Are you sure you want to remove all items?"
    />
    <AddressConfirmationModal
      visible={!!addressConfirmationData}
      onClose={() => {
        setAddressConfirmationData(null);
        setServiceabilityTrigger(false);
      }}
      pincode={
        addressConfirmationData?.pincode ||
        addresses.find(a => a.selected)?.pin
      }
      areaName={
        addressConfirmationData?.areaName ||
        addresses.find(a => a.selected)?.areaName ||
        addresses.find(a => a.selected)?.raw?.areaName
      }
      isServiceable={
        addressConfirmationData
          ? addressConfirmationData.isServiceable !== false
          : false
      }
      unavailableMessage={
        addressConfirmationData?.unavailableMessage || cartError
      }
      isPlacingOrder={addressConfirmationData?.isPlacingOrder}
      onConfirm={() => {
        if (
          addressConfirmationData?.isPlacingOrder &&
          addressConfirmationData?.isServiceable
        ) {
          submitOrder();
        } else {
          setAddressConfirmationData(null);
          setServiceabilityTrigger(false);
        }
      }}
      onChangeAddress={() => {
        setAddressConfirmationData(null);
        setServiceabilityTrigger(false);
        setShowAddressModal(true);
      }}
    />
  </>
);

export default CartModals;
