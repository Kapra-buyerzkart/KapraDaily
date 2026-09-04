import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppText, Surface, IconDisc } from '../../../../components/atoms';
import { PressableScale } from '../atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  wp,
} from '../../../../theme/tokens';

const WELL = wp('12.2%');

const ACTIONS = [
  {
    key: 'cart',
    icon: null,
    label: 'Cart',
    a11y: 'Cart',
  },
  {
    key: 'orders',
    icon: require('../../../../assets/icons/profile/myoroders.png'),
    label: 'My\nOrders',
    a11y: 'My Orders',
  },
  {
    key: 'address',
    icon: require('../../../../assets/icons/profile/savedAddress.png'),
    label: 'Saved\nAddress',
    a11y: 'Saved Address',
  },
  {
    key: 'refer',
    icon: require('../../../../assets/icons/profile/referNearn.png'),
    label: 'Refer &\nEarn',
    a11y: 'Refer and Earn',
  },
];


interface Props {
  onCart: () => void;
  onMyOrders: () => void;
  onSavedAddress: () => void;
  onRefer: () => void;
}

const QuickActionsGrid: React.FC<Props> = ({
  onCart,
  onMyOrders,
  onSavedAddress,
  onRefer,
}) => {
  const handlers: Record<string, () => void> = {
    cart: onCart,
    orders: onMyOrders,
    address: onSavedAddress,
    refer: onRefer,
  };

  return (
    <Surface style={styles.card}>
      {ACTIONS.map(action => (
        <PressableScale
          key={action.key}
          to={0.94}
          style={styles.item}
          contentStyle={styles.itemContent}
          onPress={handlers[action.key]}
          accessibilityRole="button"
          accessibilityLabel={action.a11y}
        >
          <IconDisc size={WELL} tone="neutral" radius={UI_RADIUS.sm}>
            {action.icon ? (
              <Image source={action.icon} style={styles.icon} />
            ) : (
              <Ionicons
                name="cart-outline"
                size={WELL * 0.54}
                color={UI_COLORS.textSecondary}
              />
            )}
          </IconDisc>
          <AppText
            variant="micro"
            tone="secondary"
            numberOfLines={2}
            style={styles.label}
          >
            {action.label}
          </AppText>
        </PressableScale>
      ))}
    </Surface>
  );
};

export default React.memo(QuickActionsGrid);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: UI_SPACING.sm,
    paddingVertical: UI_SPACING.lg - 2,
    paddingHorizontal: UI_SPACING.md,
  },
  item: {
    flex: 1,
  },
  itemContent: {
    alignItems: 'center',
    gap: UI_SPACING.sm,
  },
  icon: {
    width: WELL * 0.54,
    height: WELL * 0.54,
    resizeMode: 'contain',
  },
  label: {
    height: UI_TYPE.micro.lineHeight * 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
