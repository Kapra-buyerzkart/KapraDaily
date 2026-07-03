import React, { memo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../styles/typography';
import SearchInput from './SearchInput';
import useAnimatedHeader from '../hooks/useAnimatedHeader';
import icons from '@/assets/icons';

const HEADER_HEIGHT = hp('7%');

interface AnimatedHeaderProps {
  title: string;
  onBack: () => void;
  onFilterPress: () => void;
  onSearchChange: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const AnimatedHeader = memo(
  ({
    title,
    onBack,
    onFilterPress,
    onSearchChange,
    style,
  }: AnimatedHeaderProps) => {
    const {
      progress,
      isSearchActive,
      searchText,
      inputRef,
      openSearch,
      closeSearch,
      handleSearchText,
      handleClear,
    } = useAnimatedHeader(onSearchChange);

    // Intercept Android hardware back to exit search before navigating
    useEffect(() => {
      if (!isSearchActive) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        closeSearch();
        return true;
      });
      return () => sub.remove();
    }, [isSearchActive, closeSearch]);

    const handleBack = useCallback(() => {
      if (isSearchActive) {
        closeSearch();
      } else {
        onBack();
      }
    }, [isSearchActive, closeSearch, onBack]);

    // Title fades up and out as search opens
    const titleAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        progress.value,
        [0, 0.45],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -6]) }],
    }));

    // Search input fades in and grows from slightly scaled to full
    const searchWrapperAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        progress.value,
        [0.35, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.88, 1]) }],
    }));

    // Search icon in header fades out as search opens
    const searchIconAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        progress.value,
        [0, 0.4],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    }));

    return (
      <View style={[styles.header, style]}>
        {/* Back / exit-search button */}
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={40}
          accessibilityLabel={isSearchActive ? 'Exit search' : 'Go back'}
          accessibilityRole="button"
        >
          <AntDesign name="left" size={wp('5%')} color="#000000" />
        </TouchableOpacity>

        {/* Middle: title and search input layered via absoluteFill */}
        <View style={styles.middle}>
          {/* Title — always in tree, fades out when search opens */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.titleWrapper,
              titleAnimatedStyle,
            ]}
            pointerEvents="none"
          >
            <Text style={styles.title} numberOfLines={1}>
              {/* {title} */}
            </Text>
          </Animated.View>

          {/* Search input — mounted while search is active (including close animation) */}
          {isSearchActive && (
            <Animated.View
              style={[StyleSheet.absoluteFill, searchWrapperAnimatedStyle]}
            >
              <SearchInput
                ref={inputRef}
                value={searchText}
                onChangeText={handleSearchText}
                onClear={handleClear}
              />
            </Animated.View>
          )}
        </View>

        {/* Right-side icons */}
        <View style={styles.rightIcons}>
          {/* Search icon — fades out when search is active */}
          <Animated.View
            style={searchIconAnimatedStyle}
            pointerEvents={isSearchActive ? 'none' : 'auto'}
          >
            <TouchableOpacity
              onPress={openSearch}
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Search products"
              accessibilityRole="button"
            >
              <Feather name="search" size={wp('5.5%')} color="#000000" />
            </TouchableOpacity>
          </Animated.View>

          {/* Filter icon — always visible */}
          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Sort and filter"
            accessibilityRole="button"
          >
            <Image source={icons.filter} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

AnimatedHeader.displayName = 'AnimatedHeader';
export default AnimatedHeader;

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: wp('1%'),
    marginRight: wp('2%'),
  },
  middle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginLeft: wp('2%'),
  },
  iconButton: {
    padding: wp('1%'),
  },
});
