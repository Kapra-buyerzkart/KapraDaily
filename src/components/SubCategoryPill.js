import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { getImageUrl } from '../utils/imageUrl';
import COLORS from '@/styles/colors';
import AnimatedPressable from './AnimatedPressable';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

const BORDER_INACTIVE = '#ECECEC';
const TEXT_INACTIVE = '#6B7280';
const TEXT_ACTIVE = '#FF6B00';
const SELECTION_DURATION = 150;

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
      [BORDER_INACTIVE, COLORS.primary],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [TEXT_INACTIVE, TEXT_ACTIVE]),
  }));

  return (
    <AnimatedPressable onPress={onPress} style={[styles.subCatPill, containerStyle]}>
      <Image style={styles.subCatPillImage} source={getImageUrl(item.imageUrl)} />
      <AnimatedText
        style={[
          isSelected ? styles.subCatPillTextActive : styles.subCatPillTextInactive,
          textStyle,
        ]}
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
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    backgroundColor: 'white',
  },
  subCatPillImage: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    marginRight: wp('2%'),
    resizeMode: 'cover',
  },
  subCatPillTextActive: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    marginRight: wp('2%'),
  },
  subCatPillTextInactive: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    marginRight: wp('2%'),
  },
});
