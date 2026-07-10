import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import { CART_COLORS } from '../styles/cartTheme';
import icons from '@/assets/icons';
import { scheduleOnRN } from 'react-native-worklets';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ANIMATION_DURATION = 240;
const ANIMATION_EASING = Easing.out(Easing.cubic);

interface HeaderSearchProps {
  title: string;
  searchText: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onFilterPress: () => void;
}

const HeaderSearch = memo(
  ({
    title,
    searchText,
    onChangeText,
    onSubmitEditing,
    onFilterPress,
  }: HeaderSearchProps) => {
    const [isActive, setIsActive] = useState(false);
    const progress = useSharedValue(0);
    const inputRef = useRef<TextInput>(null);

    const openSearch = useCallback(() => {
      setIsActive(true);
      progress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
      });
      requestAnimationFrame(() => inputRef.current?.focus());
    }, [progress]);

    const closeSearch = useCallback(() => {
      if (searchText.length > 0) {
        onChangeText('');
        return;
      }
      Keyboard.dismiss();
      inputRef.current?.blur();
      progress.value = withTiming(
        0,
        { duration: ANIMATION_DURATION, easing: ANIMATION_EASING },
        finished => {
          if (finished) {
            scheduleOnRN(setIsActive, false);
          }
        },
      );
    }, [searchText, onChangeText, progress]);

    const handleIconPress = useCallback(() => {
      if (isActive) {
        closeSearch();
      } else {
        openSearch();
      }
    }, [isActive, closeSearch, openSearch]);

    // --- animation: title fades/scales out as search opens ---
    const titleAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [1, 0.92],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, -8],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    // --- animation: input fades/scales in from the title's position ---
    const inputAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.94, 1],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    const searchIconAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [1, 0.4],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [0, 45],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    }));

    const closeIconAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.4, 1],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [-45, 0],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    }));

    return (
      <>
        <View style={styles.middleContainer}>
          <Animated.Text
            style={[styles.title, titleAnimatedStyle]}
            numberOfLines={1}
            pointerEvents="none"
          >
            {title}
          </Animated.Text>
          <AnimatedTextInput
            ref={inputRef}
            style={[styles.input, inputAnimatedStyle]}
            value={searchText}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            placeholder="Search products"
            placeholderTextColor="#999999"
            returnKeyType="search"
            selectionColor={CART_COLORS.primary}
            pointerEvents={isActive ? 'auto' : 'none'}
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={handleIconPress}
            style={styles.headerActionButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isActive ? 'Close search' : 'Search products'}
            accessibilityRole="button"
          >
            <View style={styles.iconStack}>
              <Animated.View
                style={[styles.iconLayer, searchIconAnimatedStyle]}
                pointerEvents="none"
              >
                <Feather name="search" size={wp('5.5%')} color="#0F0F0F" />
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconLayer,
                  styles.iconLayerAbsolute,
                  closeIconAnimatedStyle,
                ]}
                pointerEvents="none"
              >
                <Ionicons name="close" size={wp('6%')} color="#0F0F0F" />
              </Animated.View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.headerActionButton}
            accessibilityLabel="Sort and filter"
            accessibilityRole="button"
          >
            <Image source={icons.filter} style={styles.filterStyle} />
          </TouchableOpacity>
        </View>
      </>
    );
  },
);

HeaderSearch.displayName = 'HeaderSearch';
export default HeaderSearch;

const styles = StyleSheet.create({
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5%'),
    color: '#0F0F0F',
    marginLeft: wp('1%'),
  },
  filterStyle: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    resizeMode: 'contain',
  },
  input: {
    position: 'absolute',
    left: wp('1%'),
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: wp('4.2%'),
    color: '#0F0F0F',
    fontFamily: FONTS.gilroy.regular,
    padding: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',

    // shadowRadius: 8,
    // elevation: 2,
  },
  iconStack: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLayerAbsolute: {
    position: 'absolute',
  },
});
