import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS, PWD_RADIUS } from '../theme';
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
    marginTop: hp('1.2%'),
    padding: wp('3.5%'),
    borderRadius: PWD_RADIUS.sm,
    backgroundColor: PWD_COLORS.well,
    borderWidth: 1,
    borderColor: PWD_COLORS.borderLight,
  },
  rules: {
    marginTop: hp('1.2%'),
  },
});
