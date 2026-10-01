import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';
import { ADD_HIT_SLOP } from '../constants';

/** The `Add to cart` button shown when the product is not yet in the cart. */
const AddButton = ({ isThreeColumn, productName, animatedStyle, onPress }) => (
  <Animated.View style={[styles.addButtonWrapper, animatedStyle]}>
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      hitSlop={ADD_HIT_SLOP}
      style={[styles.addButton, isThreeColumn && styles.addButtonSmall]}
      accessibilityRole="button"
      accessibilityLabel={`Add ${productName} to cart`}
    >
      <MaterialIcons
        name="shopping-cart"
        size={isThreeColumn ? 13 : 15}
        color="#FFFFFF"
        style={styles.addCartIcon}
      />
      <Text style={[styles.addText, isThreeColumn && styles.addTextSmall]}>
        Add to cart
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

export default React.memo(AddButton);
