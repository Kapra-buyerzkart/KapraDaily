import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AddrText } from '../atoms';
import { COLORS, RADIUS, SHADOW, SPACING, hp, wp } from '../../theme';
import BallPulse from '../../../../components/BallPulse';

const SaveButton = ({ label, isBusy, isBlocked, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    disabled={isBusy}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled: isBusy, busy: isBusy }}
    style={[
      styles.button,
      isBlocked && styles.buttonBlocked,
      isBusy && styles.buttonBusy,
    ]}
  >
    {isBusy ? (
      <BallPulse color={COLORS.onDark} />
    ) : (
      <>
        <AddrText variant="cta" tone="onDark">
          {label}
        </AddrText>
        <Ionicons
          name="arrow-forward"
          size={wp('4.4%')}
          color={COLORS.onDark}
          style={styles.arrow}
        />
      </>
    )}
  </TouchableOpacity>
);

export default React.memo(SaveButton);

const styles = StyleSheet.create({
  button: {
    height: hp('6.4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.primary,
    ...SHADOW.raised,
  },
  buttonBusy: {
    opacity: 0.7,
  },
  buttonBlocked: {
    opacity: 0.55,
  },
  arrow: {
    marginLeft: SPACING.sm,
  },
});
