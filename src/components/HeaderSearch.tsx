import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
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

// Title <-> search-input morph + search-icon <-> close-icon morph, driven by a
// single `progress` shared value. All search behavior (value/onChangeText/
// onSubmitEditing) is passed straight through from the parent screen — this
// component only owns the transition animation, not the search logic itself.
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

    // --- animation: open ---
    const openSearch = useCallback(() => {
      setIsActive(true);
      progress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
      });
      // Input stays mounted at all times (no remount/flicker); focus it
      // programmatically instead of relying on TextInput's `autoFocus`.
      requestAnimationFrame(() => inputRef.current?.focus());
    }, [progress]);

    // --- animation: close ---
    const closeSearch = useCallback(() => {
      // Reuse the app's existing clear behavior: first press with text clears it.
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
            runOnJS(setIsActive)(false);
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
          scale: interpolate(progress.value, [0, 1], [1, 0.92], Extrapolation.CLAMP),
        },
        {
          translateX: interpolate(progress.value, [0, 1], [0, -8], Extrapolation.CLAMP),
        },
      ],
    }));

    // --- animation: input fades/scales in from the title's position ---
    const inputAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.94, 1], Extrapolation.CLAMP),
        },
        {
          translateX: interpolate(progress.value, [0, 1], [10, 0], Extrapolation.CLAMP),
        },
      ],
    }));

    // --- animation: search icon morphs into the close (X) icon ---
    const searchIconAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.4], Extrapolation.CLAMP),
        },
        {
          rotate: `${interpolate(progress.value, [0, 1], [0, 45], Extrapolation.CLAMP)}deg`,
        },
      ],
    }));

    const closeIconAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.4, 1], Extrapolation.CLAMP),
        },
        {
          rotate: `${interpolate(progress.value, [0, 1], [-45, 0], Extrapolation.CLAMP)}deg`,
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
          {/* Existing search logic reused as-is: value/onChangeText/onSubmitEditing
              are the parent screen's own state and handlers. */}
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
                style={[styles.iconLayer, styles.iconLayerAbsolute, closeIconAnimatedStyle]}
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
            <Ionicons name="options-outline" size={wp('5.5%')} color="#0F0F0F" />
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
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5%'),
    color: '#0F0F0F',
    marginLeft: wp('1%'),
  },
  input: {
    position: 'absolute',
    left: wp('1%'),
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: wp('4.2%'),
    color: '#0F0F0F',
    fontFamily: FONTS.outfit.regular,
    padding: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    paddingHorizontal: wp('2.2%'),
    paddingVertical: wp('1%'),
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
