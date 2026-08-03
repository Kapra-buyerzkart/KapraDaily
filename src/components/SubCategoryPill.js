import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { getImageUrl } from '../utils/imageUrl';
import AnimatedPressable from './AnimatedPressable';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

const BG_INACTIVE = '#FFFFFF';
const BG_ACTIVE = '#FFF3EA';
const BORDER_INACTIVE = '#EFEFEF';
const BORDER_ACTIVE = '#FF6B00';
const TEXT_INACTIVE = '#6B7280';
const TEXT_ACTIVE = '#FF6B00';
const SELECTION_DURATION = 180;

const SubCategoryPill = ({ item, isSelected, onPress }) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: SELECTION_DURATION,
    });
  }, [isSelected, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [BG_INACTIVE, BG_ACTIVE],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [BORDER_INACTIVE, BORDER_ACTIVE],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [TEXT_INACTIVE, TEXT_ACTIVE],
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.subCatPill, containerStyle]}
    >
      <Image
        style={styles.subCatPillImage}
        source={getImageUrl(item.imageUrl)}
      />
      <AnimatedText
        style={[
          isSelected
            ? styles.subCatPillTextActive
            : styles.subCatPillTextInactive,
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
    height: 44,
    paddingHorizontal: wp('3%'),
    borderRadius: 22,
    // borderWidth: 1,
  },
  subCatPillImage: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    marginRight: wp('2%'),
    resizeMode: 'cover',
  },
  subCatPillTextActive: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.4%'),
    marginRight: wp('1.5%'),
  },
  subCatPillTextInactive: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    marginRight: wp('1.5%'),
  },
});
