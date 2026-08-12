import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated from 'react-native-reanimated';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import { entrance } from '@/styles/motion';
import LivePulse from '../atoms/LivePulse';
import IconChip from '../atoms/IconChip';
import TrackingStepper from '../molecules/TrackingStepper';

const TrackingHero = ({
  tracking,
  placedLabel,
  timestampLabel,
  reason,
  showStepper = true,
}) => {
  const { tone, live } = tracking;

  return (
    <Animated.View entering={entrance(0)} style={styles.shell}>
      <View style={[styles.card, { borderColor: tone.border }]}>
        <LinearGradient
          colors={tone.wash}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.top}>
          <View style={styles.copy}>
            <View
              style={[
                styles.badge,
                { backgroundColor: tone.bg, borderColor: tone.border },
              ]}
            >
              {live ? (
                <LivePulse color={tone.fg} size={6} />
              ) : (
                <Ionicons
                  name={tracking.icon}
                  size={wp('3%')}
                  color={tone.fg}
                />
              )}
              <Text
                style={[styles.badgeText, { color: tone.fg }]}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {tracking.badge}
              </Text>
            </View>

            <Text style={styles.title} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {tracking.title}
            </Text>

            {!!tracking.caption && (
              <Text
                style={styles.caption}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {tracking.caption}
              </Text>
            )}
          </View>

          <IconChip
            name={tracking.icon}
            tone={live ? 'brand' : 'success'}
            size={wp('12%')}
            style={styles.chip}
          />
        </View>

        {(!!timestampLabel || !!placedLabel) && (
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={wp('3.4%')} color={INK.faint} />
            <Text
              style={styles.meta}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {timestampLabel || placedLabel}
            </Text>
          </View>
        )}

        {!!reason && (
          <View style={[styles.reason, { borderColor: tone.border }]}>
            <Text
              style={[styles.reasonText, { color: tone.fg }]}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {reason}
            </Text>
          </View>
        )}

        {showStepper && (
          <View style={styles.stepperWrap}>
            <TrackingStepper
              completedThrough={tracking.completedThrough}
              activeIndex={tracking.activeIndex}
              tone={tone}
              live={live}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACE.base,
    backgroundColor: SURFACE.base,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    marginRight: SPACE.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
  },
  badgeText: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.heavy,
    letterSpacing: 1,
    marginLeft: 4,
  },
  title: {
    ...TYPE.display,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.8,
    marginTop: SPACE.sm,
  },
  caption: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: SPACE.xs,
  },
  chip: {
    borderRadius: RADIUS.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
  },
  meta: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
    marginLeft: SPACE.xs + 1,
    flexShrink: 1,
  },
  reason: {
    marginTop: SPACE.md,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
  },
  reasonText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
  },
  stepperWrap: {
    marginTop: SPACE.base,
    paddingTop: SPACE.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
});

export default React.memo(TrackingHero);
