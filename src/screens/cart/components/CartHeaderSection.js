import React from 'react';
import { View, StyleSheet } from 'react-native';
import DeliveryHeader from './DeliveryHeader';
import DeliveryGroupCard from './DeliveryGroupCard';
import StoreUnavailableBanner from './StoreUnavailableBanner';
import { CART_SPACING, hp } from '../../../styles/cartTheme';

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

    <View style={styles.spacer} />

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

const styles = StyleSheet.create({
  spacer: {
    height: hp('1.6%'),
    marginTop: CART_SPACING.xs,
  },
});
