import React from 'react';
import { StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import { Surface } from '../atoms';
import QuickActionTile from '../molecules/QuickActionTile';
import { CART_SPACING } from '@/styles/cartTheme';

const ACTIONS = [
  {
    key: 'orders',
    icon: icons.myorder,
    label: 'My\nOrders',
    a11y: 'My Orders',
  },
  {
    key: 'address',
    icon: icons.savedAddress,
    label: 'Saved\nAddress',
    a11y: 'Saved Address',
  },
  {
    key: 'co-partner',
    icon: icons.coPartnerdashboard,
    label: 'Co-Partner\nDashboard',
    a11y: 'Co-Partner Dashboard',
  },
  {
    key: 'refer',
    icon: icons.referNearn,
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
    <Surface style={styles.card}>
      {ACTIONS.map(action => (
        <QuickActionTile
          key={action.key}
          icon={action.icon}
          label={action.label}
          a11y={action.a11y}
          onPress={handlers[action.key]}
        />
      ))}
    </Surface>
  );
};

export default React.memo(QuickActionsGrid);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CART_SPACING.sm,
    paddingVertical: CART_SPACING.lg - 2,
    paddingHorizontal: CART_SPACING.md,
  },
});
