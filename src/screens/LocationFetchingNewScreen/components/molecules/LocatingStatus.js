import React from 'react';
import { StyleSheet, View } from 'react-native';

import BallPulse from '@/components/BallPulse';

import { LOCATING_SUBTITLE, LOCATING_TITLE } from '../../constants';
import { COLORS, SPACING } from '../../theme';
import { LocText } from '../atoms';

const LocatingStatus = () => (
  <View style={styles.wrap}>
    <LocText variant="title" tone="brandDeep" style={styles.title}>
      {LOCATING_TITLE}
    </LocText>
    <LocText variant="body" tone="secondary" style={styles.subtitle}>
      {LOCATING_SUBTITLE}
    </LocText>
    <BallPulse color={COLORS.brand} size="large" style={styles.dots} />
  </View>
);

export default React.memo(LocatingStatus);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  dots: {
    marginTop: SPACING.xl,
  },
});
