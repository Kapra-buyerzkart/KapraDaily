import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import { INK, SPACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { TRACK_STEPS } from '../tokens/orderStatus';

const NODE = 9;

const ProgressRail = ({ step = 0, tone, steps = TRACK_STEPS, style }) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.track}>
      {steps.map((label, index) => {
        const reached = index <= step;
        return (
          <View key={label} style={styles.segment}>
            {index > 0 && (
              <View
                style={[
                  styles.link,
                  { backgroundColor: reached ? tone.fg : tone.border },
                ]}
              />
            )}
            <View
              style={[
                styles.node,
                {
                  backgroundColor: reached ? tone.fg : tone.bg,
                  borderColor: reached ? tone.fg : tone.border,
                },
                index === step && styles.nodeCurrent,
              ]}
            />
          </View>
        );
      })}
    </View>

    <View style={styles.labels}>
      {steps.map((label, index) => (
        <Text
          key={label}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          style={[
            styles.label,
            index === 0 && styles.labelStart,
            index === steps.length - 1 && styles.labelEnd,
            index <= step && { color: tone.fg },
            index === step && { fontFamily: FONTS.gilroy.bold },
          ]}
        >
          {label}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginTop: SPACE.md,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  link: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 2,
  },
  nodeCurrent: {
    width: NODE + 5,
    height: NODE + 5,
    borderRadius: (NODE + 5) / 2,
    borderWidth: 3,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACE.xs + 2,
  },
  label: {
    ...TYPE.micro,
    lineHeight: undefined,
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
  },
  labelStart: {
    textAlign: 'left',
  },
  labelEnd: {
    textAlign: 'right',
  },
});

export default React.memo(ProgressRail);
