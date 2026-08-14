import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Reanimated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { getVoucherImageSource } from '@/components/events/imageUtils';

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  SCREEN_WIDTH,
  STACK_SCALE_STEP,
  STACK_VISIBLE,
  STACK_Y_STEP,
  SWIPE_THRESHOLD,
} from '../../constants';
import { COLORS, RADIUS } from '../../theme';
import { TicketText } from '../atoms';

const StackCard = ({ item, stackIndex, dragX, dragY, isTop }) => {
  const imageSource = getVoucherImageSource(item);
  const zIndex = isTop ? 10 : STACK_VISIBLE - stackIndex;

  const transformStyle = useAnimatedStyle(() => {
    if (isTop) {
      const rotate = interpolate(
        dragX.value,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-12, 0, 12],
        Extrapolation.CLAMP,
      );
      return {
        transform: [
          { translateX: dragX.value },
          { translateY: dragY.value * 0.4 },
          { rotate: `${rotate}deg` },
        ],
      };
    }

    const dragProgress = interpolate(
      Math.abs(dragX.value) + Math.abs(dragY.value) * 0.5,
      [0, SWIPE_THRESHOLD * 1.1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      dragProgress,
      [0, 1],
      [
        1 - stackIndex * STACK_SCALE_STEP,
        1 - (stackIndex - 1) * STACK_SCALE_STEP,
      ],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      dragProgress,
      [0, 1],
      [stackIndex * STACK_Y_STEP, (stackIndex - 1) * STACK_Y_STEP],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    if (!isTop) return { opacity: 0 };
    const progress = interpolate(
      Math.abs(dragX.value),
      [0, SWIPE_THRESHOLD],
      [0, 0.7],
      Extrapolation.CLAMP,
    );
    return { opacity: progress };
  });

  return (
    <Reanimated.View
      entering={FadeInDown.delay(stackIndex * 90)
        .springify()
        .damping(16)}
      style={[styles.stackCardSlot, { zIndex }]}
    >
      <Reanimated.View style={[styles.stackCardVisual, transformStyle]}>
        {isTop && (
          <Reanimated.View
            pointerEvents="none"
            style={[styles.stackCardGlow, glowStyle]}
          />
        )}
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {!!item?.discountTitle && (
          <View style={styles.stackDiscountBadge}>
            <TicketText variant="chip">{item.discountTitle}</TicketText>
          </View>
        )}
        <TicketText
          variant="cardTitle"
          style={styles.cardTitle}
          numberOfLines={1}
        >
          {item?.title}
        </TicketText>
      </Reanimated.View>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  stackCardSlot: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  stackCardVisual: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.cardSurface,
  },
  stackCardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  stackDiscountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.badgeScrim,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
});

export default React.memo(StackCard);
