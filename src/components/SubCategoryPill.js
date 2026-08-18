import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { FONTS } from '../styles/typography';
import COLORS from '../styles/colors';
import {
  CATEGORY_SELECT,
  INK,
  SURFACE,
  RADIUS,
  SPACE,
  TYPE,
  MAX_FONT_SCALE,
} from '../styles/homeTheme';
import { getImageUrl } from '../utils/imageUrl';
import AnimatedPressable from './AnimatedPressable';
import CachedImage from './CachedImage';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

const SELECTION_DURATION = 180;

export const PILL_HEIGHT = 40;
const WELL_SIZE = 26;
const LIFT = 4;

const SubCategoryPill = ({ item, isSelected, onPress }) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: SELECTION_DURATION,
    });
  }, [isSelected, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.border, CATEGORY_SELECT.edge],
    ),
  }));

  const wellStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -LIFT]) }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [INK.muted, CATEGORY_SELECT.text],
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.subCatPill, containerStyle]}
    >
      <Animated.View style={[styles.subCatPillWell, wellStyle]}>
        <CachedImage
          style={styles.subCatPillImage}
          source={getImageUrl(item.imageUrl)}
          accessible={false}
        />
      </Animated.View>
      <AnimatedText
        style={[
          isSelected
            ? styles.subCatPillTextActive
            : styles.subCatPillTextInactive,
          textStyle,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {item.catName}
      </AnimatedText>
    </AnimatedPressable>
  );
};

export default React.memo(SubCategoryPill);

const styles = StyleSheet.create({
  subCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PILL_HEIGHT,
    paddingLeft: SPACE.xs + 1,
    paddingRight: SPACE.md,
    borderRadius: RADIUS.sm,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: SURFACE.base,
  },
  subCatPillWell: {
    borderRadius: RADIUS.xs,
    marginRight: SPACE.sm,
  },
  subCatPillImage: {
    width: WELL_SIZE,
    height: WELL_SIZE,
    borderRadius: RADIUS.xs,
    resizeMode: 'cover',
  },
  subCatPillTextActive: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    includeFontPadding: false,
  },
  subCatPillTextInactive: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    includeFontPadding: false,
  },
});
