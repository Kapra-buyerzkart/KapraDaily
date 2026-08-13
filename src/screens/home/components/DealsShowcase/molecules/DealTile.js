import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_SPACING } from '@/styles/cartTheme';
import { DealText, OfferSeal, ProductStage } from '../atoms';
import {
  DEFAULTS,
  PEACH,
  TILE_ENTER_STEP,
  TILE_RADIUS,
  TILE_STAGE,
} from '../tokens';

const DealTile = ({ item, index = 0, offer, onPress }) => {
  const title = item?.title || item?.Title;
  const caption = item?.subTitle || item?.SubTitle;

  const handlePress = useCallback(() => onPress?.(item), [onPress, item]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${title || 'Deal'}, ${
        DEFAULTS.tileOfferLead
      } ${offer} ${DEFAULTS.tileOfferTrail}`}
      entering={FadeInDown.delay(index * TILE_ENTER_STEP)
        .springify()
        .damping(18)}
      style={styles.tile}
    >
      {title ? (
        <DealText variant="tileTitle" tone="ink" numberOfLines={1}>
          {title}
        </DealText>
      ) : null}

      {caption ? (
        <DealText variant="tileCaption" tone="muted" numberOfLines={2}>
          {caption}
        </DealText>
      ) : null}

      <ProductStage source={item?.uri} style={styles.stage} />

      <OfferSeal
        lead={DEFAULTS.tileOfferLead}
        value={offer}
        trail={DEFAULTS.tileOfferTrail}
        style={styles.seal}
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: TILE_STAGE * 2,
    backgroundColor: PEACH.washSoft,
    borderRadius: TILE_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PEACH.edge,
    padding: CART_SPACING.sm,
    gap: 2,
  },
  stage: {
    marginTop: 'auto',
  },
  seal: {
    position: 'absolute',
    right: -CART_SPACING.xs,
    bottom: CART_SPACING.sm,
  },
});

export default React.memo(DealTile);
