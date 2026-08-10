import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ACCENT } from '@/styles/homeTheme';
import styles from '../styles';
import { HEART_POP_SPRING, WISHLIST_HIT_SLOP } from '../constants';

const LIKED_COLOUR = '#FF0048';

const WishlistButton = ({ liked, isThreeColumn, productName, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (liked) {
      scale.value = withSequence(
        withSpring(1.35, HEART_POP_SPRING),
        withSpring(1, HEART_POP_SPRING),
      );
    }
  }, [liked, scale]);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      style={[
        styles.wishlistButton,
        isThreeColumn && styles.wishlistButtonSmall,
      ]}
      hitSlop={WISHLIST_HIT_SLOP}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: liked }}
      accessibilityLabel={
        liked
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
    >
      <Animated.View style={heartAnimatedStyle}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={16}
          color={liked ? LIKED_COLOUR : ACCENT.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default React.memo(WishlistButton);
