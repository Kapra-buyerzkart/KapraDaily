import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import { INK, SPACE, SURFACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import LivePulse from '../atoms/LivePulse';
import { TRACK_STAGES } from '../tokens/tracking';

const NODE = wp('6.4%');
const RAIL = 3;
const IDLE_LINE = '#E7E9ED';

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
                  backgroundColor: SURFACE.base,
                  borderColor: tone.fg,
                },
              ]}
            >
              {done ? (
                <Ionicons
                  name="checkmark"
                  size={NODE * 0.55}
                  color={INK.onDark}
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
                  { backgroundColor: done ? tone.fg : IDLE_LINE },
                ]}
              />
            )}
          </View>

          <View style={[styles.copy, last && styles.copyLast]}>
            <Text
              style={[
                styles.label,
                reached && styles.labelReached,
                active && { color: tone.fg },
              ]}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {stage.label}
            </Text>
            <Text
              style={[styles.hint, active && styles.hintActive]}
              numberOfLines={2}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {stage.hint}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

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
    backgroundColor: SURFACE.sunken,
    borderColor: IDLE_LINE,
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
    minHeight: SPACE.lg,
    borderRadius: RAIL,
    marginVertical: 3,
  },
  copy: {
    flex: 1,
    marginLeft: SPACE.md,
    paddingBottom: SPACE.base,
  },
  copyLast: {
    paddingBottom: 0,
  },
  label: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.faint,
    letterSpacing: -0.2,
  },
  labelReached: {
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
  },
  hint: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
    marginTop: 2,
  },
  hintActive: {
    color: INK.muted,
  },
});

export default React.memo(TrackingStepper);
