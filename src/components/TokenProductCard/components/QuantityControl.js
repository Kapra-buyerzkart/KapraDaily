import React, { useCallback, useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AddButton from './AddButton';
import CartCounter from './CartCounter';
import {
  ADD_POP_SPRING,
  ADD_SQUISH,
  ADD_SQUISH_SCALE,
  COUNTER_FADE,
} from '../constants';

/**
 * Owns the `+` ⇄ counter swap and its shared animation values, then delegates
 * rendering to AddButton / CartCounter.
 */
const QuantityControl = ({
  quantity,
  isAtMaxQty,
  isOutOfStock,
  isThreeColumn,
  productName,
  onIncrement,
  onDecrement,
  onAdd,
}) => {
  const pop = useSharedValue(1);
  const counterIn = useSharedValue(quantity > 0 ? 1 : 0);
  const wasEmpty = useRef(quantity === 0);

  useEffect(() => {
    if (quantity > 0 && wasEmpty.current) {
      counterIn.value = 0;
      counterIn.value = withTiming(1, COUNTER_FADE);
    } else if (quantity === 0) {
      counterIn.value = 0;
    }
    wasEmpty.current = quantity === 0;
  }, [quantity, counterIn]);

  const dockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    opacity: counterIn.value,
    transform: [{ scale: pop.value * (0.9 + counterIn.value * 0.1) }],
  }));

  const handleAddPress = useCallback(() => {
    pop.value = withSequence(
      withTiming(ADD_SQUISH_SCALE, ADD_SQUISH),
      withSpring(1, ADD_POP_SPRING),
    );
    onAdd?.();
  }, [onAdd, pop]);

  if (quantity > 0) {
    return (
      <CartCounter
        quantity={quantity}
        isAtMaxQty={isAtMaxQty}
        isThreeColumn={isThreeColumn}
        productName={productName}
        animatedStyle={counterAnimatedStyle}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    );
  }

  if (isOutOfStock) return null;

  return (
    <AddButton
      isThreeColumn={isThreeColumn}
      productName={productName}
      animatedStyle={dockAnimatedStyle}
      onPress={handleAddPress}
    />
  );
};

export default React.memo(QuantityControl);
