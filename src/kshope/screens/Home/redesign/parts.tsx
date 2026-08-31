import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { HOME_COLORS, HOME_FONTS, fs, s } from './theme';

type SectionTitleProps = {
  text: string;
  accent?: string;
  style?: ViewStyle;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  text,
  accent,
  style,
}) => (
  <Text style={[styles.sectionTitle, style]}>
    {text}
    {accent ? <Text style={styles.sectionAccent}>{` ${accent}`}</Text> : null}
  </Text>
);

export const DiscountBadge: React.FC<{ label: string; style?: ViewStyle }> = ({
  label,
  style,
}) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const StrikePrice: React.FC<{
  value: string;
  size?: number;
  color?: string;
}> = ({ value, size = 8, color = HOME_COLORS.muted }) => (
  <View style={styles.strikeWrap}>
    <Text
      style={[
        styles.strikeText,
        { fontSize: fs(size), color, lineHeight: fs(size) * 1.35 },
      ]}
    >
      {value}
    </Text>
    <View style={[styles.strikeRule, { backgroundColor: color }]} />
  </View>
);

export const PillButton: React.FC<{
  label: string;
  onPress?: () => void;
  width?: number;
  filled?: boolean;
  style?: ViewStyle;
}> = ({ label, onPress, width = 95, filled = true, style }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[
      styles.pill,
      {
        width: s(width),
        backgroundColor: filled ? HOME_COLORS.orange : HOME_COLORS.white,
        borderWidth: filled ? 0 : StyleSheet.hairlineWidth * 2,
      },
      style,
    ]}
  >
    <Text
      style={[
        styles.pillText,
        { color: filled ? HOME_COLORS.white : HOME_COLORS.orange },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const IconTile: React.FC<{
  source: ImageSourcePropType;
  size: number;
  style?: StyleProp<ImageStyle>;
}> = ({ source, size, style }) => (
  <Image
    source={source}
    resizeMode="contain"
    style={[{ width: s(size), height: s(size) }, style]}
  />
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(16),
    color: HOME_COLORS.heading,
  },
  sectionAccent: {
    fontFamily: HOME_FONTS.script,
    fontSize: fs(24),
    color: HOME_COLORS.script,
  },
  badge: {
    height: s(12),
    width: s(38),
    borderRadius: s(5),
    backgroundColor: HOME_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(8),
    lineHeight: fs(8) * 1.3,
    color: HOME_COLORS.white,
  },
  strikeWrap: {
    alignSelf: 'flex-start',
  },
  strikeText: {
    fontFamily: HOME_FONTS.regular,
  },
  strikeRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '52%',
    height: StyleSheet.hairlineWidth,
  },
  pill: {
    height: s(26),
    borderRadius: s(10),
    borderColor: HOME_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
  },
});
