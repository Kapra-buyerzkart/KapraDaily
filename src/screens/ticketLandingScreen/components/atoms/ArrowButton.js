import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '../../theme';

export const ARROW_BUTTON_SIZE = 44;

const ArrowButton = ({ iconName, onPress }) => {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.85, { duration: 70 }, () => {
      scale.value = withTiming(1, { duration: 90 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.arrowButton}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Reanimated.View style={pressStyle}>
        <MaterialIcons name={iconName} size={28} color={COLORS.textPrimary} />
      </Reanimated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowButton: {
    width: ARROW_BUTTON_SIZE,
    height: ARROW_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ArrowButton);
