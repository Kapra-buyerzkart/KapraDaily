import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import COLORS from '../styles/colors';
import { CATEGORY_SELECT, INK, SURFACE } from '../styles/homeTheme';
import { getImageUrl } from '../utils/imageUrl';
import AnimatedPressable from './AnimatedPressable';
import CachedImage from './CachedImage';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

const SELECTION_DURATION = 180;
const LIFT = 4;

const CategoryListItem = ({ item, isSelected, onPress, onLayout }) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: SELECTION_DURATION,
    });
  }, [isSelected, progress]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.border, CATEGORY_SELECT.edge],
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
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
      onLayout={onLayout}
      style={styles.itemWrapper}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <CachedImage
            source={getImageUrl(item.imageUrl)}
            style={styles.image}
            resizeMode="contain"
            accessible={false}
          />
        </Animated.View>
        <AnimatedText
          style={[
            isSelected ? styles.activeTitle : styles.inactiveTitle,
            textStyle,
          ]}
          numberOfLines={3}
        >
          {item.catName || item.name}
        </AnimatedText>
      </Animated.View>
    </AnimatedPressable>
  );
};

export default React.memo(CategoryListItem);

const styles = StyleSheet.create({
  itemWrapper: {
    marginBottom: hp('1.8%'),
    paddingHorizontal: wp('0.6%'),
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: SURFACE.base,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('1%'),
  },
  iconWrap: {
    width: wp('11%'),
    height: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('0.6%'),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  activeTitle: {
    fontSize: wp('2.8%'),
    textAlign: 'center',
    fontFamily: FONTS.gilroy.bold,
  },
  inactiveTitle: {
    fontSize: wp('2.8%'),
    textAlign: 'center',
    fontFamily: FONTS.gilroy.medium,
  },
});
