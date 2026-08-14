import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import images from '@/assets/images';

const ClaimButton = ({ onPress }) => {
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.92, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 220 });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Reanimated.View style={buttonStyle}>
        <Image
          source={images.claimbutton}
          style={styles.claimButton}
          resizeMode="contain"
        />
      </Reanimated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  claimButton: {
    width: 96,
    height: 100,
  },
});

export default React.memo(ClaimButton);
