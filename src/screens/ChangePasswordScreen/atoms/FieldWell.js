import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_RADIUS } from '../theme';

const FieldWell = ({ focus, error, success, style, children }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [PWD_COLORS.well, PWD_COLORS.card],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [PWD_COLORS.border, PWD_COLORS.gold],
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.well,
        animatedStyle,
        !error && success && styles.wellSuccess,
        !!error && styles.wellError,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default React.memo(FieldWell);

const styles = StyleSheet.create({
  well: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderRadius: PWD_RADIUS.input,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  wellSuccess: {
    borderColor: PWD_COLORS.emerald,
  },
  wellError: {
    backgroundColor: PWD_COLORS.dangerTint,
    borderColor: PWD_COLORS.danger,
  },
});
