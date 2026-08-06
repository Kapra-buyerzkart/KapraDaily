import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import styles from '../styles';
import { ACTION_HIT_SLOP } from '../constants';

/** ADD affordance shown when the product is not yet in the cart. */
const AddButton = ({
  isOutOfStock,
  isThreeColumn,
  productName,
  animatedStyle,
  onPress,
}) => {
  if (isOutOfStock) {
    return (
      <View
        style={[
          styles.addButton,
          isThreeColumn && styles.addButtonSmall,
          styles.addDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        accessibilityLabel={`${productName} is out of stock`}
      >
        <Text
          style={[
            styles.addLabel,
            isThreeColumn && styles.addLabelSmall,
            styles.addLabelDisabled,
          ]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ADD
        </Text>
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedPressable
        onPress={onPress}
        hitSlop={ACTION_HIT_SLOP}
        style={[styles.addButton, isThreeColumn && styles.addButtonSmall]}
        accessibilityRole="button"
        accessibilityLabel={`Add ${productName} to cart`}
      >
        <Text
          style={[styles.addLabel, isThreeColumn && styles.addLabelSmall]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ADD
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(AddButton);
