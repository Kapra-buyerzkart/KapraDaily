import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import styles from '../styles';
import { COUNTER_HIT_SLOP } from '../constants';

/**
 * The `− qty +` pill shown once the product is in the cart.
 * `animatedStyle` is owned by QuantityControl so the ADD → counter swap
 * keeps a single continuous pop animation.
 */
const CartCounter = ({
  quantity,
  isThreeColumn,
  productName,
  animatedStyle,
  onIncrement,
  onDecrement,
}) => {
  const iconSize = isThreeColumn ? 15 : 17;

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
        <Entypo name="minus" size={iconSize} color="#FFFFFF" />
      </AnimatedPressable>

      <Text style={styles.counterQty} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {quantity}
      </Text>

      <AnimatedPressable
        style={[styles.counterBtn, isThreeColumn && styles.counterBtnSmall]}
        hitSlop={COUNTER_HIT_SLOP}
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${productName} quantity`}
      >
        <Entypo name="plus" size={iconSize} color="#FFFFFF" />
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(CartCounter);
