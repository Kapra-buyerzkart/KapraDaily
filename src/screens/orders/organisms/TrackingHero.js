import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { entrance } from '@/styles/motion';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import IconDisc from '../atoms/IconDisc';
import LivePulse from '../atoms/LivePulse';
import TrackingStepper from '../molecules/TrackingStepper';
import { COLORS, RADIUS, SPACING, wp } from '../theme';

const DISC = wp('12%');

const TrackingHero = ({ tracking, timestampLabel, reason, showStepper }) => {
  const { tone, live } = tracking;

  return (
    <Animated.View entering={entrance(0)}>
      <Surface style={styles.card}>
        <View style={styles.top}>
          <View style={styles.copy}>
            <View style={[styles.badge, { backgroundColor: tone.bg }]}>
              {live ? (
                <LivePulse color={tone.fg} size={6} />
              ) : (
                <Ionicons
                  name={tracking.icon}
                  size={wp('3%')}
                  color={tone.fg}
                />
              )}
              <OrderText
                variant="microStrong"
                tone={tone.fg}
                style={styles.badgeText}
              >
                {tracking.badge}
              </OrderText>
            </View>

            <OrderText variant="title" style={styles.title}>
              {tracking.title}
            </OrderText>

            {!!tracking.caption && (
              <OrderText variant="label" tone="muted" style={styles.caption}>
                {tracking.caption}
              </OrderText>
            )}
          </View>

          <IconDisc size={DISC} tone="neutral" radius={RADIUS.icon}>
            <Ionicons name={tracking.icon} size={DISC * 0.46} color={tone.fg} />
          </IconDisc>
        </View>

        {!!timestampLabel && (
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={wp('3.4%')}
              color={COLORS.textFaint}
            />
            <OrderText
              variant="caption"
              tone="faint"
              numberOfLines={1}
              style={styles.meta}
            >
              {timestampLabel}
            </OrderText>
          </View>
        )}

        {!!reason && (
          <View style={[styles.reason, { backgroundColor: tone.bg }]}>
            <OrderText variant="captionStrong" tone={tone.fg}>
              {reason}
            </OrderText>
          </View>
        )}

        {showStepper && (
          <>
            <Divider style={styles.rule} />
            <TrackingStepper
              completedThrough={tracking.completedThrough}
              activeIndex={tracking.activeIndex}
              tone={tone}
              live={live}
            />
          </>
        )}
      </Surface>
    </Animated.View>
  );
};

export default React.memo(TrackingHero);

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  copy: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  badgeText: {
    letterSpacing: 1,
  },
  title: {
    marginTop: SPACING.sm,
  },
  caption: {
    marginTop: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 1,
    marginTop: SPACING.md,
  },
  meta: {
    flexShrink: 1,
  },
  reason: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  rule: {
    marginVertical: SPACING.lg,
  },
});
