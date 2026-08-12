import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING } from '@/styles/cartTheme';
import { deriveListItem } from '../utils';

const ActivityRow = ({ item, type, index }) => {
  const { name, sub, value, date } = deriveListItem(item, type, index);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <CartText variant="labelStrong" numberOfLines={1}>
          {name}
        </CartText>
        {!!sub && (
          <CartText
            variant={type === 'payouts' ? 'captionStrong' : 'caption'}
            tone={type === 'payouts' ? 'success' : 'muted'}
            numberOfLines={1}
          >
            {sub}
          </CartText>
        )}
      </View>

      <View style={styles.right}>
        {!!value && (
          <CartText
            variant={type === 'copartners' ? 'caption' : 'price'}
            tone={type === 'copartners' ? 'muted' : 'primary'}
            numberOfLines={1}
          >
            {value}
          </CartText>
        )}
        {!!date && (
          <CartText variant="caption" tone="faint" numberOfLines={1}>
            {date}
          </CartText>
        )}
      </View>
    </View>
  );
};

export default React.memo(ActivityRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CART_SPACING.md,
    gap: CART_SPACING.md,
  },
  left: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 1,
  },
});
