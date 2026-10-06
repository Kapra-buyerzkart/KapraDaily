import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import styles from '../styles';
import { COUNTER_HIT_SLOP } from '../constants';

/**
 * The `− qty +` pill shown once the product is in the cart.
 * `animatedStyle` is owned by QuantityControl so the `+` → counter swap
 * keeps a single continuous pop animation.
 */
const CartCounter = ({
  quantity,
  isAtMaxQty,
  isThreeColumn,
  productName,
  animatedStyle,
  onIncrement,
  onDecrement,
}) => {
  const iconSize = isThreeColumn ? 11 : 13;

  return (
    <Animated.View
      style={[
        styles.counterContainer,
        isThreeColumn && styles.counterContainerSmall,
        animatedStyle,
      ]}
      accessibilityLabel={`${productName}, quantity ${quantity}`}
    >
      <AnimatedPressable
        style={[styles.counterBtn, isThreeColumn && styles.counterBtnSmall]}
        hitSlop={COUNTER_HIT_SLOP}
        onPress={onDecrement}
        accessibilityRole="button"
        accessibilityLabel={
          quantity === 1
            ? `Remove ${productName} from cart`
            : `Decrease ${productName} quantity`
        }
      >
        <Entypo name="minus" size={iconSize} color="#000000" />
      </AnimatedPressable>

      <Text
        style={[styles.counterQty, isThreeColumn && styles.counterQtySmall]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {quantity}
      </Text>

      <AnimatedPressable
        style={[
          styles.counterBtn,
          isThreeColumn && styles.counterBtnSmall,
          isAtMaxQty && styles.counterBtnCapped,
        ]}
        hitSlop={COUNTER_HIT_SLOP}
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel={
          isAtMaxQty
            ? `Maximum quantity reached for ${productName}`
            : `Increase ${productName} quantity`
        }
      >
        <Entypo name="plus" size={iconSize} color="#000000" />
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(CartCounter);
