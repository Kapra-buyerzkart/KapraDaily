import React, { useState } from 'react';
import {
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { HOME_ART } from './assets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HOME_COLORS, HOME_FONTS, TOKEN_COLORS, fs, s } from './theme';

export const imageSource = (image: any) => image || HOME_ART.placeholder;

const hasRemoteSource = (image: any) =>
  !!image && (typeof image === 'number' || !!image.uri);

type ProductImageProps = {
  source: any;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  placeholderResizeMode?: ImageResizeMode;
};

export const ProductImage: React.FC<ProductImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  placeholderResizeMode = 'contain',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const usable = hasRemoteSource(source) && !failed;

  return (
    <View style={[styles.productImageWrap, style]}>
      {usable ? (
        <Image
          source={source}
          resizeMode={resizeMode}
          style={StyleSheet.absoluteFill as StyleProp<ImageStyle>}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      {usable && loaded ? null : (
        <View style={styles.productImagePlaceholder}>
          <Image
            source={HOME_ART.noImage}
            resizeMode={placeholderResizeMode}
            style={styles.productImagePlaceholderImg}
          />
        </View>
      )}
    </View>
  );
};

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

export const DiscountBadge: React.FC<{
  label: string;
  style?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
}> = ({ label, style, textStyle }) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{label}</Text>
  </View>
);

export const TokenBadge: React.FC<{
  tokens: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ tokens, size = 9, style }) => (
  <View style={[styles.tokenBadge, style]}>
    <MaterialCommunityIcons
      name="ticket-confirmation-outline"
      size={fs(size) * 1.4}
      color={TOKEN_COLORS.ink}
    />
    <Text
      style={[
        styles.tokenBadgeText,
        { fontSize: fs(size), lineHeight: fs(size) * 1.35 },
      ]}
      numberOfLines={1}
    >
      {tokens}
      <Text style={styles.tokenBadgeUnit}>{' UD tokens'}</Text>
    </Text>
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
        {
          fontSize: fs(size),
          color,
          lineHeight: fs(size) * 1.35,
          textDecorationColor: color,
        },
      ]}
    >
      {value}
    </Text>
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
  productImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: '18%',
  },
  productImagePlaceholderImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productImageWrap: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: HOME_COLORS.white,
  },
  badge: {
    minHeight: s(12),
    minWidth: s(38),
    paddingHorizontal: s(5),
    paddingVertical: s(1),
    borderRadius: s(5),
    backgroundColor: HOME_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: s(4),
    paddingHorizontal: s(6),
    paddingVertical: s(2),
    borderRadius: s(999),
    backgroundColor: TOKEN_COLORS.tint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKEN_COLORS.edge,
  },
  tokenBadgeText: {
    fontFamily: HOME_FONTS.bold,
    color: TOKEN_COLORS.ink,
    letterSpacing: 0.2,
  },
  tokenBadgeUnit: {
    fontFamily: HOME_FONTS.semiBold,
    color: TOKEN_COLORS.inkSoft,
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
    textDecorationLine: 'line-through',
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
  sectionTitle: {
    fontFamily: HOME_FONTS.semiBold,
    color: HOME_COLORS.heading,
    fontSize: fs(19),
    lineHeight: fs(30) * 1.5,
    letterSpacing: 0.2,
  },

  sectionAccent: {
    fontFamily: HOME_FONTS.script,
    fontSize: fs(30),
    lineHeight: fs(30) * 1.5,
    letterSpacing: 0,
    color: HOME_COLORS.script,
  },
});
