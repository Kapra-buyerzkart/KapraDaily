import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';
import AddressCard from '../molecules/AddressCard';

const EmptyState = () => (
  <View style={styles.empty}>
    <IconDisc size={wp('11%')} tone="neutral" radius={CART_RADIUS.pill}>
      <Ionicons
        name="location-outline"
        size={wp('5.4%')}
        color={CART_COLORS.textMuted}
      />
    </IconDisc>
    <CartText variant="labelStrong">No saved addresses yet</CartText>
    <CartText variant="micro" tone="muted" style={styles.emptyCopy}>
      Add one above and we'll keep it ready for your next order
    </CartText>
  </View>
);

const SavedAddressList = ({
  addresses,
  onSelect,
  onEdit,
  onDelete,
  onOpenActions,
  onCloseActions,
}) => (
  <View>
    <View style={styles.label}>
      <CartText variant="micro" tone="muted">
        SAVED ADDRESSES
      </CartText>
      <View style={styles.rule} />
    </View>

    {addresses.length ? (
      addresses.map(item => (
        <AddressCard
          key={item.id}
          item={item}
          onSelect={onSelect}
          onEdit={() => onEdit(item)}
          onDelete={onDelete}
          onOpenActions={onOpenActions}
          onCloseActions={onCloseActions}
        />
      ))
    ) : (
      <EmptyState />
    )}
  </View>
);

export default React.memo(SavedAddressList);

const styles = StyleSheet.create({
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    marginTop: hp('2.2%'),
    marginBottom: CART_SPACING.md,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.border,
  },
  empty: {
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingVertical: hp('3%'),
  },
  emptyCopy: {
    textAlign: 'center',
    paddingHorizontal: CART_SPACING.xl,
  },
});
