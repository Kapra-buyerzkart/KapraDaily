import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { ACCENT } from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import styles from '../styles';
import { ADD_HIT_SLOP } from '../constants';

/** The `+` square shown when the product is not yet in the cart. */
const AddButton = ({ isThreeColumn, productName, animatedStyle, onPress }) => (
  <Animated.View style={animatedStyle}>
    <View
      style={[
        styles.addButtonWrapper,
        isThreeColumn && styles.addButtonWrapperSmall,
      ]}
    >
      <AnimatedPressable
        onPress={onPress}
        hitSlop={ADD_HIT_SLOP}
        style={[styles.addButton, isThreeColumn && styles.addButtonSmall]}
        accessibilityRole="button"
        accessibilityLabel={`Add ${productName} to cart`}
      >
        <Entypo
          name="plus"
          size={isThreeColumn ? 18 : 20}
          color={ACCENT.primary}
        />
      </AnimatedPressable>
    </View>
  </Animated.View>
);

export default React.memo(AddButton);
