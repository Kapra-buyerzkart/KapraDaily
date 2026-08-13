import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderText from '../atoms/OrderText';
import { COLORS, SPACING } from '../theme';
import { TRACK_STEPS } from '../tokens/orderStatus';

const NODE = 8;

const ProgressRail = ({ step = 0, tone, steps = TRACK_STEPS, style }) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.track}>
      {steps.map((label, index) => {
        const reached = index <= step;
        return (
          <View
            key={label}
            style={[styles.segment, index > 0 && styles.segmentFill]}
          >
            {index > 0 && (
              <View
                style={[
                  styles.link,
                  { backgroundColor: reached ? tone.fg : COLORS.line },
                ]}
              />
            )}
            <View
              style={[
                styles.node,
                {
                  backgroundColor: reached ? tone.fg : COLORS.well,
                  borderColor: reached ? tone.fg : COLORS.lineStrong,
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
        <OrderText
          key={label}
          variant={index === step ? 'microStrong' : 'micro'}
          tone={
            index === step ? 'primary' : index < step ? 'secondary' : 'faint'
          }
          numberOfLines={1}
          style={[
            styles.label,
            index === 0 && styles.labelStart,
            index === steps.length - 1 && styles.labelEnd,
          ]}
        >
          {label}
        </OrderText>
      ))}
    </View>
  </View>
);

export default React.memo(ProgressRail);

const styles = StyleSheet.create({
  wrap: {
    marginTop: SPACING.md,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentFill: {
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
    marginTop: SPACING.xs + 2,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
  labelStart: {
    textAlign: 'left',
  },
  labelEnd: {
    textAlign: 'right',
  },
});
