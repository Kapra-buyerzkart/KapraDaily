import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderText from './OrderText';
import LivePulse from './LivePulse';
import { RADIUS, SPACING, wp } from '../theme';

const StatusPill = ({ status, live = false, style }) => {
  if (!status) return null;

  return (
    <View style={[styles.pill, { backgroundColor: status.tone.bg }, style]}>
      {live ? (
        <LivePulse color={status.tone.fg} size={6} />
      ) : (
        <Ionicons name={status.icon} size={wp('3.2%')} color={status.tone.fg} />
      )}
      <OrderText
        variant="micro"
        tone={status.tone.fg}
        numberOfLines={1}
        style={styles.label}
      >
        {status.label}
      </OrderText>
    </View>
  );
};

export default React.memo(StatusPill);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    borderRadius: RADIUS.pill,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    maxWidth: '62%',
  },
  label: {
    textTransform: 'capitalize',
  },
});
