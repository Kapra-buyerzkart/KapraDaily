import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderText from '../atoms/OrderText';
import LivePulse from '../atoms/LivePulse';
import { COLORS, SPACING, wp } from '../theme';
import { TRACK_STAGES } from '../tokens/tracking';

const NODE = wp('6.4%');
const RAIL = 3;

const TrackingStepper = ({
  completedThrough = -1,
  activeIndex = -1,
  tone,
  live,
  stages = TRACK_STAGES,
  style,
}) => (
  <View style={style}>
    {stages.map((stage, index) => {
      const done = index <= completedThrough;
      const active = index === activeIndex;
      const reached = done || active;
      const last = index === stages.length - 1;

      return (
        <View key={stage.key} style={styles.row}>
          <View style={styles.rail}>
            <View
              style={[
                styles.node,
                done && { backgroundColor: tone.fg, borderColor: tone.fg },
                active && {
                  backgroundColor: COLORS.surface,
                  borderColor: tone.fg,
                },
              ]}
            >
              {done ? (
                <Ionicons
                  name="checkmark"
                  size={NODE * 0.55}
                  color={COLORS.onDark}
                />
              ) : active && live ? (
                <LivePulse color={tone.fg} size={NODE * 0.34} />
              ) : active ? (
                <View style={[styles.core, { backgroundColor: tone.fg }]} />
              ) : null}
            </View>

            {!last && (
              <View
                style={[
                  styles.link,
                  { backgroundColor: done ? tone.fg : COLORS.lineStrong },
                ]}
              />
            )}
          </View>

          <View style={[styles.copy, last && styles.copyLast]}>
            <OrderText
              variant={reached ? 'bodyStrong' : 'body'}
              tone={active ? tone.fg : reached ? 'primary' : 'faint'}
              numberOfLines={1}
            >
              {stage.label}
            </OrderText>
            <OrderText
              variant="caption"
              tone={active ? 'muted' : 'faint'}
              numberOfLines={2}
              style={styles.hint}
            >
              {stage.hint}
            </OrderText>
          </View>
        </View>
      );
    })}
  </View>
);

export default React.memo(TrackingStepper);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
    width: NODE,
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 2,
    backgroundColor: COLORS.well,
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: NODE * 0.34,
    height: NODE * 0.34,
    borderRadius: NODE,
  },
  link: {
    flex: 1,
    width: RAIL,
    minHeight: SPACING.lg,
    borderRadius: RAIL,
    marginVertical: 3,
  },
  copy: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  copyLast: {
    paddingBottom: 0,
  },
  hint: {
    marginTop: 2,
  },
});
