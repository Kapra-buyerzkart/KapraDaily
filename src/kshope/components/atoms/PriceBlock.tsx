import React from 'react';
import { View, StyleSheet, FlexAlignType } from 'react-native';
import AppText from './AppText';
import { UITypeVariant, UI_SPACING } from '../../theme/tokens';

export interface PriceBlockProps {
  price: number | string;
  mrp?: number | string | null;
  align?: FlexAlignType;
  variant?: UITypeVariant;
}

const PriceBlock: React.FC<PriceBlockProps> = ({
  price,
  mrp,
  align = 'flex-end',
  variant = 'price',
}) => {
  const hasStrike = mrp != null && Number(mrp) > Number(price);

  return (
    <View style={[styles.wrap, { alignItems: align }]}>
      <AppText variant={variant}>₹{price}</AppText>
      {hasStrike ? (
        <AppText variant="micro" tone="faint" style={styles.strike}>
          ₹{mrp}
        </AppText>
      ) : null}
    </View>
  );
};

export default React.memo(PriceBlock);

const styles = StyleSheet.create({
  wrap: {
    gap: 1,
  },
  strike: {
    textDecorationLine: 'line-through',
    marginTop: UI_SPACING.xs / 2,
  },
});
