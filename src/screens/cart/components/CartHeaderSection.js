import React from 'react';
import DeliveryHeader from './DeliveryHeader';
import StoreUnavailableBanner from './StoreUnavailableBanner';

const CartHeaderSection = ({
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
    {isCartStoreNotFound && (
      <StoreUnavailableBanner
        message={cartError}
        onChangePress={onAddressPress}
      />
    )}

    <DeliveryHeader
      itemCount={itemCount}
      tokenLabel={tokenLabel}
      isScheduled={isScheduled}
      scheduleLabel={scheduleLabel}
      onSchedulePress={onSchedulePress}
      onSwitchToExpress={onSwitchToExpress}
    />
  </>
);

export default CartHeaderSection;

