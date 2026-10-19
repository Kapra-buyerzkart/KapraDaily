import React from 'react';
import { View, StyleSheet } from 'react-native';
import QuickActionTile from '../molecules/QuickActionTile';

const ACTIONS = [
  {
    key: 'orders',
    iconName: 'shopping-outline',
    label: 'My\nOrders',
    a11y: 'My Orders',
  },
  {
    key: 'address',
    iconName: 'map-marker-outline',
    label: 'Saved\nAddress',
    a11y: 'Saved Address',
  },
  {
    key: 'co-partner',
    iconName: 'account-group-outline',
    label: 'Co-Partner\nDashboard',
    a11y: 'Co-Partner Dashboard',
  },
  {
    key: 'refer',
    iconName: 'account-multiple-outline',
    label: 'Refer &\nEarn',
    a11y: 'Refer and Earn',
  },
];

const QuickActionsGrid = ({
  onMyOrders,
  onSavedAddress,
  onCoPartnerDashboard,
  onRefer,
}) => {
  const handlers = {
    orders: onMyOrders,
    address: onSavedAddress,
    'co-partner': onCoPartnerDashboard,
    refer: onRefer,
  };

  return (
    <View style={styles.container}>
      {ACTIONS.map(action => (
        <QuickActionTile
          key={action.key}
          iconName={action.iconName}
          label={action.label}
          a11y={action.a11y}
          onPress={handlers[action.key]}
        />
      ))}
    </View>
  );
};

export default React.memo(QuickActionsGrid);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
});
