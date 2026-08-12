import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';
import StrengthMeter from './StrengthMeter';
import RuleChecklist from './RuleChecklist';

const StrengthPanel = ({ visible, score, checks }) => {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(180)} style={styles.panel}>
      <StrengthMeter score={score} />
      <View style={styles.rules}>
        <RuleChecklist checks={checks} />
      </View>
    </Animated.View>
  );
};

export default React.memo(StrengthPanel);

const styles = StyleSheet.create({
  panel: {
    marginTop: CART_SPACING.md,
    padding: CART_SPACING.md,
    borderRadius: CART_RADIUS.sm,
    backgroundColor: CART_COLORS.well,
  },
  rules: {
    marginTop: CART_SPACING.md,
  },
});
