import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DISC, ICON, STATUS_COLORS, styles } from './styles';

export type StatusTone = 'success' | 'danger' | 'brand';

const TONE_COLOR: Record<StatusTone, string> = {
  success: STATUS_COLORS.success,
  danger: STATUS_COLORS.danger,
  brand: STATUS_COLORS.pending,
};

const TONE_RING: Record<StatusTone, string> = {
  success: STATUS_COLORS.successDiscBorder,
  danger: STATUS_COLORS.dangerDiscBorder,
  brand: STATUS_COLORS.pendingDiscBorder,
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

  const isDanger = tone === 'danger';
  const isSuccess = tone === 'success';

  return (
    <View
      style={[
        styles.statusDisc,
        isDanger && styles.statusDiscDanger,
        isSuccess && styles.statusDiscSuccess,
        !isDanger && !isSuccess && styles.statusDiscBrand,
      ]}
    >
      <Animated.View
        style={[styles.statusRing, { borderColor: TONE_RING[tone] }, ringStyle]}
      />
      <MaterialCommunityIcons
        name={icon}
        size={ICON.status}
        color={TONE_COLOR[tone]}
      />
    </View>
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
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={20} color={STATUS_COLORS.ink} />
      </TouchableOpacity>
    ) : null}

    <View style={styles.topBarCopy}>
      <Text style={styles.topBarTitle} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.topBarSubtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>

    <View
      style={[
        styles.statusPill,
        tone === 'danger' && styles.statusPillDanger,
        tone === 'success' && styles.statusPillSuccess,
        tone === 'brand' && styles.statusPillBrand,
      ]}
    >
      <StatusDot tone={tone} pulse={pulse} />
      <Text
        style={[
          styles.statusPillText,
          tone === 'danger' && styles.statusPillTextDanger,
          tone === 'success' && styles.statusPillTextSuccess,
          tone === 'brand' && styles.statusPillTextBrand,
        ]}
      >
        {statusLabel}
      </Text>
    </View>
  </View>
);

export const MetaRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <View style={styles.metaRow}>
    <Text style={styles.metaLabel}>{label}</Text>
    <View style={styles.metaValueWrap}>{children}</View>
  </View>
);

export const CopyChip: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.copyChip}
    onPress={onPress}
    activeOpacity={0.75}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    accessibilityRole="button"
    accessibilityLabel="Copy order number"
  >
    <Feather name="copy" size={ICON.chip} color={STATUS_COLORS.inkSecondary} />
    <Text style={styles.copyChipText}>Copy</Text>
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
  <View style={styles.cardContainer}>
    <View style={styles.cardHeaderRow}>
      <Text style={styles.cardHeading}>{title}</Text>
      {right}
    </View>

    <View style={styles.bulletGroup}>
      {bullets.map((bullet, index) => (
        <View key={bullet.id}>
          {index > 0 ? <View style={styles.bulletSeparator} /> : null}
          <View style={styles.bulletRow}>
            <View style={styles.bulletIconDisc}>
              <Feather
                name={bullet.icon}
                size={ICON.bullet}
                color={STATUS_COLORS.darkGreen}
              />
            </View>
            <View style={styles.bulletCopy}>
              <Text style={styles.bulletTitle}>{bullet.title}</Text>
              <Text style={styles.bulletDesc}>{bullet.description}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const SupportCard: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <View style={styles.cardContainer}>
    <View style={styles.supportRow}>
      <View style={styles.bulletIconDisc}>
        <Feather
          name="headphones"
          size={ICON.meta}
          color={STATUS_COLORS.darkGreen}
        />
      </View>
      <View style={styles.supportCopy}>
        <Text style={styles.bulletTitle}>{title}</Text>
        <Text style={styles.bulletDesc}>{subtitle}</Text>
      </View>
    </View>
  </View>
);

export const FooterStrip: React.FC<{ icon?: string; note: string }> = ({
  icon = 'shield',
  note,
}) => (
  <View style={styles.footerStrip}>
    <Feather name={icon} size={ICON.meta} color={STATUS_COLORS.darkGreen} />
    <Text style={styles.footerStripCopy}>{note}</Text>
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
    <Feather name={primaryIcon} size={ICON.cta} color="#FFFFFF" />
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.actionBar}>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={onPrimary}
        activeOpacity={0.88}
        accessibilityRole="button"
      >
        {primaryIconTrailing ? null : icon}
        <Text style={styles.primaryBtnText}>{primaryLabel}</Text>
        {primaryIconTrailing ? icon : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.ghostBtn}
        onPress={onGhost}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Feather name="home" size={ICON.ghost} color={STATUS_COLORS.inkSecondary} />
        <Text style={styles.ghostBtnText}>{ghostLabel}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
