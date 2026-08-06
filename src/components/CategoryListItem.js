import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { getImageUrl } from '../utils/imageUrl';
import AnimatedPressable from './AnimatedPressable';
import CachedImage from './CachedImage';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

const ACTIVE_BG = '#FFF3EA';
const TEXT_INACTIVE = '#4A4A4A';
const TEXT_ACTIVE = '#FF6B00';
const BG_DURATION = 180;
const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };

const CategoryListItem = ({ item, isSelected, onPress, onLayout }) => {
  const bgProgress = useSharedValue(isSelected ? 1 : 0);
  const indicatorScale = useSharedValue(isSelected ? 1 : 0);
  const iconScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    bgProgress.value = withTiming(isSelected ? 1 : 0, {
      duration: BG_DURATION,
    });
    indicatorScale.value = withSpring(isSelected ? 1 : 0, SPRING);

    if (isSelected) {
      iconScale.value = withSequence(
        withTiming(1.15, { duration: 90 }),
        withSpring(1.05, SPRING),
      );
      cardScale.value = withSequence(
        withTiming(0.96, { duration: 90 }),
        withSpring(1, SPRING),
      );
    } else {
      iconScale.value = withSpring(1, SPRING);
    }
  }, [isSelected, bgProgress, indicatorScale, iconScale, cardScale]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgProgress.value,
    transform: [{ scale: interpolate(bgProgress.value, [0, 1], [0.6, 1]) }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorScale.value,
    transform: [{ scaleY: indicatorScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      bgProgress.value,
      [0, 1],
      [TEXT_INACTIVE, TEXT_ACTIVE],
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLayout={onLayout}
      style={styles.itemWrapper}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[styles.activeBg, bgStyle]} />
        <Animated.View style={[styles.indicator]} />
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
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('1%'),
  },
  activeBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ACTIVE_BG,
    borderRadius: 18,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
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
    color: TEXT_ACTIVE,
    fontFamily: FONTS.gilroy.bold,
  },
  inactiveTitle: {
    fontSize: wp('2.8%'),
    textAlign: 'center',
    color: TEXT_INACTIVE,
    fontFamily: FONTS.gilroy.medium,
  },
});
