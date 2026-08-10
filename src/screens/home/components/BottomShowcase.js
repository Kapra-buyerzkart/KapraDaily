import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedPressable from '../../../components/AnimatedPressable';
import CachedImage from '../../../components/CachedImage';
import {
  RADIUS,
  SPACE,
  ELEVATION,
  HAIRLINE,
  TYPE,
  ACCENT,
  INK,
  MAX_FONT_SCALE,
  hitSlopTo,
  categoryTint,
} from '@/styles/homeTheme';
import { FONTS } from '../../../styles/typography';

const CARD_WIDTH_PCT = 94;

const GRID_GAP = SPACE.sm;
const FEATURE_HEIGHT = wp('46%');
const SIDE_HEIGHT = (FEATURE_HEIGHT - GRID_GAP) / 2;
const MINI_HEIGHT = wp('26%');

const SHEET_PAD = SPACE.base;
const ARROW_CHIP = 40;
const ADD_CHIP = 24;

const TILE_TINT_START = { x: 0.5, y: 0 };
const TILE_TINT_END = { x: 0.5, y: 1 };

const CANVAS_GRADIENT = ['#1B0F33', '#2E1A55', '#4A2570'];
const CANVAS_LOCATIONS = [0, 0.55, 1];
const CANVAS_START = { x: 0, y: 0 };
const CANVAS_END = { x: 1, y: 1 };

const GLOW_GRADIENT = ['rgba(242,80,0,0.45)', 'rgba(242,80,0,0)'];
const SHEEN_GRADIENT = ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'];

const DEFAULT_TITLE = 'Bathroom\nEssentials';
const DEFAULT_SUBTITLE = 'Everything your washroom needs';

const ShowcaseTile = ({ item, index, height, variant, onPress }) => {
  const caption = item.title || item.Title;

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.tile, variant === 'mini' && styles.tileInRow, { height }]}
      accessibilityRole="button"
      accessibilityLabel={caption || 'Featured product'}
    >
      <LinearGradient
        colors={[categoryTint(index), '#FFFFFF']}
        start={TILE_TINT_START}
        end={TILE_TINT_END}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[styles.tileHalo, variant === 'feature' && styles.tileHaloLarge]}
        pointerEvents="none"
      />
      <CachedImage
        source={item.uri}
        style={[styles.tileImage, variant !== 'mini' && styles.tileImageInset]}
        resizeMode="contain"
        accessible={false}
      />

      <View style={styles.tileAddChip}>
        <Feather name="plus" size={14} color="#FFFFFF" />
      </View>

      {!!caption && variant !== 'mini' && (
        <View style={styles.captionPill}>
          <Text
            style={styles.captionText}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {caption}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

const BottomShowcase = ({ banner, products, onBannerPress }) => {
  const grid = useMemo(() => {
    const list = products || [];
    return {
      feature: list[0],
      side: list.slice(1, 3),
      mini: list.slice(3, 5),
    };
  }, [products]);

  const title = useMemo(() => {
    const raw = banner?.title || banner?.Title;
    return raw ? raw.replace(' ', '\n') : DEFAULT_TITLE;
  }, [banner]);

  const subtitle = banner?.subTitle || banner?.SubTitle || DEFAULT_SUBTITLE;

  if (!banner || !products || products.length === 0) return null;

  const openBanner = () => onBannerPress(banner);

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={CANVAS_GRADIENT}
        locations={CANVAS_LOCATIONS}
        start={CANVAS_START}
        end={CANVAS_END}
        style={styles.canvas}
      >
        <LinearGradient
          colors={GLOW_GRADIENT}
          start={CANVAS_START}
          end={CANVAS_END}
          style={styles.glow}
          pointerEvents="none"
        />
        <LinearGradient
          colors={SHEEN_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />
        <View style={styles.ring} pointerEvents="none" />

        <AnimatedPressable
          onPress={openBanner}
          style={styles.header}
          accessibilityRole="button"
          accessibilityLabel={banner.title || 'Bathroom Essentials'}
        >
          <View style={styles.headerText}>
            <View style={styles.badgePill}>
              <View style={styles.badgeDot} />
              <Text
                style={styles.badgeText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                CURATED PICKS
              </Text>
            </View>

            <Text
              style={styles.title}
              numberOfLines={2}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {title}
            </Text>
            <Text
              style={styles.subtitle}
              numberOfLines={2}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {subtitle}
            </Text>

            <View style={styles.ctaPill}>
              <Text
                style={styles.ctaText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Shop now
              </Text>
              <Feather name="arrow-right" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.arrowChip} hitSlop={hitSlopTo(ARROW_CHIP)}>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </View>
        </AnimatedPressable>

        <View style={styles.sheet}>
          <View style={styles.mosaic}>
            <View style={styles.featureColumn}>
              <ShowcaseTile
                item={grid.feature}
                index={0}
                height={FEATURE_HEIGHT}
                variant="feature"
                onPress={() => onBannerPress(grid.feature)}
              />
            </View>

            {grid.side.length > 0 && (
              <View style={styles.sideColumn}>
                {grid.side.map((item, index) => (
                  <ShowcaseTile
                    key={(item.bannerId || item.id || index).toString()}
                    item={item}
                    index={index + 1}
                    height={grid.side.length > 1 ? SIDE_HEIGHT : FEATURE_HEIGHT}
                    variant="side"
                    onPress={() => onBannerPress(item)}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.miniRow}>
            {grid.mini.map((item, index) => (
              <ShowcaseTile
                key={(item.bannerId || item.id || index).toString()}
                item={item}
                index={index + 3}
                height={MINI_HEIGHT}
                variant="mini"
                onPress={() => onBannerPress(item)}
              />
            ))}

            <AnimatedPressable
              onPress={openBanner}
              style={[styles.seeAllTile, { height: MINI_HEIGHT }]}
              accessibilityRole="button"
              accessibilityLabel="See all products"
            >
              <View style={styles.seeAllDisc}>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </View>
              <Text
                style={styles.seeAllText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                See all
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(`${CARD_WIDTH_PCT}%`),
    alignSelf: 'center',
    marginTop: SPACE.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: CANVAS_GRADIENT[1],
    ...ELEVATION.md,
  },
  canvas: {
    paddingTop: SPACE.lg,
  },

  glow: {
    position: 'absolute',
    top: -wp('26%'),
    right: -wp('22%'),
    width: wp('64%'),
    height: wp('64%'),
    borderRadius: wp('32%'),
    opacity: 0.9,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: wp('30%'),
  },
  ring: {
    position: 'absolute',
    top: -wp('18%'),
    left: -wp('16%'),
    width: wp('52%'),
    height: wp('52%'),
    borderRadius: wp('26%'),
    borderWidth: wp('9%'),
    borderColor: 'rgba(255,255,255,0.05)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
    paddingBottom: SPACE.base,
  },
  headerText: {
    flex: 1,
    paddingRight: SPACE.md,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs,
    paddingHorizontal: SPACE.sm + 2,
    marginBottom: SPACE.md,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT.primary,
    marginRight: SPACE.xs + 2,
  },
  badgeText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: TYPE.display.fontSize * 1.1,
    lineHeight: TYPE.display.lineHeight * 1.06,
    fontFamily: FONTS.gilroy.heavy,
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginBottom: SPACE.xs + 2,
  },
  subtitle: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
    color: 'rgba(255,255,255,0.68)',
    marginBottom: SPACE.base,
  },
  ctaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: ACCENT.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.base,
    shadowColor: ACCENT.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginRight: SPACE.xs + 2,
  },
  arrowChip: {
    width: ARROW_CHIP,
    height: ARROW_CHIP,
    borderRadius: ARROW_CHIP / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.24)',
  },

  sheet: {
    paddingTop: SPACE.base,
    paddingBottom: SPACE.base,
    paddingHorizontal: SHEET_PAD,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: '#FFFFFF',
  },
  mosaic: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  featureColumn: {
    flex: 1.32,
  },
  sideColumn: {
    flex: 1,
    gap: GRID_GAP,
  },
  miniRow: {
    flexDirection: 'row',
    gap: GRID_GAP,
    marginTop: GRID_GAP,
  },
  tile: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.md,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  tileInRow: {
    flex: 1,
  },
  tileHalo: {
    position: 'absolute',
    bottom: -wp('7%'),
    width: wp('26%'),
    height: wp('26%'),
    borderRadius: wp('13%'),
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  tileHaloLarge: {
    bottom: -wp('12%'),
    width: wp('44%'),
    height: wp('44%'),
    borderRadius: wp('22%'),
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileImageInset: {
    height: '80%',
    marginBottom: '14%',
  },
  tileAddChip: {
    position: 'absolute',
    right: SPACE.sm,
    top: SPACE.sm,
    width: ADD_CHIP,
    height: ADD_CHIP,
    borderRadius: ADD_CHIP / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT.primary,
    shadowColor: ACCENT.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  captionPill: {
    position: 'absolute',
    left: SPACE.sm,
    right: SPACE.sm,
    bottom: SPACE.sm,
    alignSelf: 'stretch',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs + 1,
    paddingHorizontal: SPACE.md,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.06)',
  },
  captionText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    textAlign: 'center',
  },
  seeAllTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: INK.strong,
  },
  seeAllDisc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: SPACE.xs + 2,
  },
  seeAllText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
  },
});

export default React.memo(BottomShowcase);
