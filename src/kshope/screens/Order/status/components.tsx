import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../../../components/atoms/AppText';
import Surface from '../../../components/atoms/Surface';
import Divider from '../../../components/atoms/Divider';
import IconDisc from '../../../components/atoms/IconDisc';
import SectionHeading from '../../../components/atoms/SectionHeading';
import { UI_COLORS, hitSlopTo } from '../../../theme/tokens';
import { DISC, ICON, styles } from './styles';

export type StatusTone = 'success' | 'danger' | 'brand';

const TONE_COLOR: Record<StatusTone, string> = {
  success: UI_COLORS.successDeep,
  danger: UI_COLORS.danger,
  brand: UI_COLORS.primary,
};

const TONE_DISC: Record<StatusTone, string> = {
  success: 'success',
  danger: 'danger',
  brand: 'brand',
};

const TONE_RING: Record<StatusTone, string> = {
  success: UI_COLORS.successEdge,
  danger: 'rgba(217,48,37,0.18)',
  brand: UI_COLORS.primaryEdge,
};

export const StatusDot: React.FC<{ tone: StatusTone; pulse?: boolean }> = ({
  tone,
  pulse = false,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!pulse) {
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress, pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse ? 0.35 + progress.value * 0.65 : 1,
  }));

  return (
    <Animated.View
      style={[styles.statusDot, { backgroundColor: TONE_COLOR[tone] }, dotStyle]}
    />
  );
};

export const StatusDisc: React.FC<{
  tone: StatusTone;
  icon: string;
  animated?: boolean;
}> = ({ tone, icon, animated = false }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress, animated]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animated ? 0.94 + progress.value * 0.06 : 1 }],
    opacity: animated ? 0.4 + progress.value * 0.6 : 1,
  }));

  return (
    <IconDisc
      size={DISC.status}
      tone={TONE_DISC[tone]}
      radius={DISC.status / 2}
      style={styles.statusDisc}
    >
      <Animated.View
        style={[styles.statusRing, { borderColor: TONE_RING[tone] }, ringStyle]}
      />
      <MaterialCommunityIcons
        name={icon}
        size={ICON.status}
        color={TONE_COLOR[tone]}
      />
    </IconDisc>
  );
};

export const StatusTopBar: React.FC<{
  title: string;
  subtitle?: string;
  statusLabel: string;
  tone: StatusTone;
  pulse?: boolean;
  onBack?: () => void;
}> = ({ title, subtitle, statusLabel, tone, pulse, onBack }) => (
  <View style={styles.topBar}>
    {onBack ? (
      <TouchableOpacity
        style={styles.topBarBack}
        onPress={onBack}
        activeOpacity={0.75}
        hitSlop={hitSlopTo(40)}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather
          name="arrow-left"
          size={ICON.meta}
          color={UI_COLORS.textPrimary}
        />
      </TouchableOpacity>
    ) : null}

    <View style={styles.topBarCopy}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="caption" tone="muted">
          {subtitle}
        </AppText>
      ) : null}
    </View>

    <View style={styles.statusPill}>
      <StatusDot tone={tone} pulse={pulse} />
      <AppText variant="micro" tone="muted">
        {statusLabel}
      </AppText>
    </View>
  </View>
);

export const MetaRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <View style={styles.metaRow}>
    <AppText variant="label" tone="muted">
      {label}
    </AppText>
    <View style={styles.metaValueWrap}>{children}</View>
  </View>
);

export const CopyChip: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.copyChip}
    onPress={onPress}
    activeOpacity={0.75}
    hitSlop={hitSlopTo(28)}
    accessibilityRole="button"
    accessibilityLabel="Copy order number"
  >
    <Feather name="copy" size={ICON.chip} color={UI_COLORS.textMuted} />
    <AppText variant="micro" tone="muted">
      Copy
    </AppText>
  </TouchableOpacity>
);

export interface StatusBullet {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const BulletCard: React.FC<{
  title: string;
  bullets: StatusBullet[];
  right?: React.ReactNode;
}> = ({ title, bullets, right }) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <SectionHeading title={title} right={right} />

      <View style={styles.bulletGroup}>
        {bullets.map((bullet, index) => (
          <View key={bullet.id}>
            {index > 0 ? <Divider style={styles.bulletSeparator} /> : null}
            <View style={styles.bulletRow}>
              <IconDisc size={DISC.bullet} tone="neutral">
                <Feather
                  name={bullet.icon}
                  size={ICON.bullet}
                  color={UI_COLORS.textSecondary}
                />
              </IconDisc>
              <View style={styles.bulletCopy}>
                <AppText variant="labelStrong">{bullet.title}</AppText>
                <AppText variant="caption" tone="muted">
                  {bullet.description}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  </Surface>
);

export const SupportCard: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <Surface style={styles.section}>
    <View style={styles.supportRow}>
      <IconDisc size={DISC.meta} tone="neutral">
        <Feather
          name="headphones"
          size={ICON.meta}
          color={UI_COLORS.textSecondary}
        />
      </IconDisc>
      <View style={styles.supportCopy}>
        <AppText variant="labelStrong">{title}</AppText>
        <AppText variant="caption" tone="muted">
          {subtitle}
        </AppText>
      </View>
    </View>
  </Surface>
);

export const FooterStrip: React.FC<{ icon?: string; note: string }> = ({
  icon = 'shield',
  note,
}) => (
  <View style={styles.footerStrip}>
    <Feather name={icon} size={ICON.meta} color={UI_COLORS.textSecondary} />
    <AppText
      variant="captionStrong"
      tone="secondary"
      style={styles.footerStripCopy}
    >
      {note}
    </AppText>
  </View>
);

export const StatusActionBar: React.FC<{
  primaryLabel: string;
  primaryIcon: string;
  primaryIconTrailing?: boolean;
  ghostLabel: string;
  onPrimary: () => void;
  onGhost: () => void;
}> = ({
  primaryLabel,
  primaryIcon,
  primaryIconTrailing = false,
  ghostLabel,
  onPrimary,
  onGhost,
}) => {
  const icon = (
    <Feather name={primaryIcon} size={ICON.cta} color={UI_COLORS.onPrimary} />
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.actionBar}>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={onPrimary}
        activeOpacity={0.9}
        accessibilityRole="button"
      >
        {primaryIconTrailing ? null : icon}
        <AppText variant="cta" tone="onDark">
          {primaryLabel}
        </AppText>
        {primaryIconTrailing ? icon : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.ghostBtn}
        onPress={onGhost}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Feather name="home" size={ICON.ghost} color={UI_COLORS.textMuted} />
        <AppText variant="bodyStrong" tone="muted">
          {ghostLabel}
        </AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
