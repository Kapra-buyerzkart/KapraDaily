import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import styles from '../styles';
import { ADD_HIT_SLOP } from '../constants';

/** The `+ ADD` pill shown when the product is not yet in the cart. */
const AddButton = ({ isThreeColumn, productName, animatedStyle, onPress }) => (
  <Animated.View style={animatedStyle}>
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      hitSlop={ADD_HIT_SLOP}
      style={[styles.addButton, isThreeColumn && styles.addButtonSmall]}
      accessibilityRole="button"
      accessibilityLabel={`Add ${productName} to cart`}
    >
      <Text style={[styles.addText, isThreeColumn && styles.addTextSmall]}>
        + ADD
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

export default React.memo(AddButton);
