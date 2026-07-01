import React from 'react';
import CartHeader from './CartHeader';
import AddressSelector from './AddressSelector';
import DeliveryHeader from './DeliveryHeader';
import DeliveryGroupCard from './DeliveryGroupCard';
import StoreUnavailableBanner from './StoreUnavailableBanner';

const CartHeaderSection = ({
  onBack,
  onClearAll,
  address,
  onAddressPress,
  isCartStoreNotFound,
  cartError,
  itemCount,
  tokenLabel,
  isScheduled,
  scheduleLabel,
  onSchedulePress,
  onSwitchToExpress,
}) => (
  <>
    <CartHeader onBack={onBack} onClearAll={onClearAll} />
    <AddressSelector address={address} onPress={onAddressPress} />

    {isCartStoreNotFound && (
      <StoreUnavailableBanner
        message={cartError}
        onChangePress={onAddressPress}
      />
    )}
    <DeliveryGroupCard position="top">
      <DeliveryHeader
        itemCount={itemCount}
        tokenLabel={tokenLabel}
        isScheduled={isScheduled}
        scheduleLabel={scheduleLabel}
        onSchedulePress={onSchedulePress}
        onSwitchToExpress={onSwitchToExpress}
      />
    </DeliveryGroupCard>
  </>
);

export default CartHeaderSection;
