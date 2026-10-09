import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';
import RotatingPlaceholder from '@/components/RotatingPlaceholder';

const HEADER_GRADIENT = ['#FF7300', '#FF7300', '#FF7300'];

const SEARCH_EXAMPLES = [
  "'Coconut oil, Apple, Milma...'",
  "'Groceries & daily needs'",
  "'Milk, bread & butter'",
  "'Fresh vegetables & fruits'",
  "'Chocolates & snacks'",
  "'Basmati rice & pulses'",
  "'Cooking oil & ghee'",
];

export const HEADER_TOP_PADDING = Platform.OS === 'ios' ? 6 : 10;
export const TOP_ROW_HEIGHT = 42;
export const TOP_ROW_MARGIN_BOTTOM = 10;
export const SEARCH_BAR_HEIGHT = Math.max(hp('5.2%'), 44);
export const HEADER_BOTTOM_PADDING = hp('1.4%');
export const COLLAPSE_DISTANCE = TOP_ROW_HEIGHT + TOP_ROW_MARGIN_BOTTOM;

export const getExpandedHeaderHeight = (topInset = 0) => {
  return (
    topInset +
    HEADER_TOP_PADDING +
    TOP_ROW_HEIGHT +
    TOP_ROW_MARGIN_BOTTOM +
    SEARCH_BAR_HEIGHT +
    HEADER_BOTTOM_PADDING
  );
};

const HomeHeaderGreen = ({
  topInset = 0,
  profile,
  dashboardData,
  navigation,
  onPressLocation,
  onSearchPress,
  onMicPress,
  onCartPress,
  cartCount = 0,
  scrollY,
  colorScheme,
}) => {
  const headerGradient = colorScheme?.gradient || HEADER_GRADIENT;
  const accentColor = colorScheme?.accent || '#FF7300';
  const searchIconColor =
    colorScheme?.searchIcon || colorScheme?.primary || '#FF7300';

  // Parse area name (before first comma) and secondary location details (city/pincode)
  const pinAddress =
    profile?.pinAddress || profile?.address || 'Select Location';
  const pincode = profile?.pincode;

  const { title, subtitle } = React.useMemo(() => {
    if (!profile?.pinAddress && !profile?.address) {
      return { title: 'Select Location', subtitle: '' };
    }
    const parts = pinAddress
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    // Resolve genuine 6-digit postal pincode:
    // Check 6-digit match in address strings, or postalPincode, or profile.pincode if 6 digits
    let detectedPincode = '';
    const pinMatch = (pinAddress + ' ' + (profile?.address || '')).match(
      /\b\d{6}\b/,
    );
    if (pinMatch) {
      detectedPincode = pinMatch[0];
    } else if (
      profile?.postalPincode &&
      String(profile.postalPincode).length === 6
    ) {
      detectedPincode = String(profile.postalPincode);
    } else if (pincode && String(pincode).length === 6) {
      detectedPincode = String(pincode);
    }

    // Clean primary title: remove pincode, parentheses/brackets, and trailing delimiters
    let primaryTitle = parts[0] || pinAddress;
    primaryTitle = primaryTitle
      .replace(/[[({\])}]+/g, '')
      .replace(/\b\d{6}\b/g, '')
      .replace(/[-–—,]\s*$/, '')
      .trim();

    // Clean city part: strip pincode and brackets
    let city = (parts[1] || 'Kochi')
      .replace(/[[({\])}]+/g, '')
      .replace(/\b\d{6}\b/g, '')
      .trim();
    if (!city) city = 'Kochi';

    const finalTitle = detectedPincode
      ? `${primaryTitle || 'Select Location'} • ${detectedPincode}`
      : primaryTitle || 'Select Location';

    return { title: finalTitle, subtitle: city };
  }, [pinAddress, pincode, profile]);

  const coins = dashboardData?.wallet?.bCoins ?? 0;

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen', { type: 'login' });
  };

  const handleCoinsPress = () => {
    navigation.navigate('BCoinScreen');
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate('SearchScreen');
    }
  };

  const handleMicPress = () => {
    if (onMicPress) {
      onMicPress();
    } else {
      navigation.navigate('SearchScreen', { openVoice: true });
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      navigation.navigate('CartScreen');
    }
  };

  // Pure UI-thread transforms and opacities via Reanimated
  const reanimatedHeaderStyle = useAnimatedStyle(() => {
    if (!scrollY || scrollY.value === undefined) return {};
    const translateY = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [0, -COLLAPSE_DISTANCE],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }],
    };
  });

  const reanimatedTopRowStyle = useAnimatedStyle(() => {
    if (!scrollY || scrollY.value === undefined) return {};
    const opacity = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE * 0.55],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [0, -6],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          paddingTop: topInset + HEADER_TOP_PADDING,
        },
        reanimatedHeaderStyle,
      ]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
        pointerEvents="none"
      />

      {/* Top Header Row */}
      <Animated.View
        style={[
          styles.topRow,
          {
            height: TOP_ROW_HEIGHT,
            marginBottom: TOP_ROW_MARGIN_BOTTOM,
          },
          reanimatedTopRowStyle,
        ]}
      >
        {/* Left: Location & Sub-row */}
        <AnimatedPressable
          onPress={onPressLocation}
          style={styles.locationContainer}
          accessibilityRole="button"
          accessibilityLabel={`Delivering to ${title}. Tap to change location`}
        >
          {/* Main Title Row: e.g. "Chakkaraparambu" */}
          <View style={styles.titleRow}>
            <Text style={styles.locationTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Sub Row: [⏱ Express] Kochi • 682032 */}
          <View style={styles.subRow}>
            <View style={styles.expressBadge}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={13}
                color={accentColor}
                style={styles.expressIcon}
              />
              <Text style={[styles.expressText, { color: accentColor }]}>
                Express
              </Text>
            </View>

            {!!subtitle && (
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </AnimatedPressable>

        {/* Right: Coins Chip & Profile Avatar */}
        <View style={styles.rightGroup}>
          {/* 👛 8 coins pill */}
          <AnimatedPressable
            onPress={handleCoinsPress}
            style={styles.coinsPill}
            accessibilityRole="button"
            accessibilityLabel={`${coins} coins. View wallet`}
          >
            <MaterialCommunityIcons
              name="wallet-outline"
              size={wp('4.6%')}
              color={accentColor}
              style={styles.walletIcon}
            />
            <Text style={[styles.coinsText, { color: accentColor }]}>
              {coins} coins
            </Text>
          </AnimatedPressable>

          {/* Profile Circle with white icon */}
          <AnimatedPressable
            onPress={handleProfilePress}
            style={styles.profileCircle}
            accessibilityRole="button"
            accessibilityLabel="Your profile"
          >
            <Feather name="user" size={wp('5.6%')} color="#FFFFFF" />
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* Search Bar Row with Search Side Action Button */}
      <View style={styles.searchRow}>
        <AnimatedPressable
          onPress={handleSearchPress}
          style={styles.searchBar}
          accessibilityRole="search"
          accessibilityLabel="Search products and categories"
        >
          <Feather
            name="search"
            size={wp('4.8%')}
            color={accentColor}
            style={styles.searchIcon}
          />
          <View style={styles.placeholderContainer}>
            <RotatingPlaceholder
              examples={SEARCH_EXAMPLES}
              prefix="Search "
              style={styles.searchPlaceholder}
              numberOfLines={1}
            />
          </View>
          <View style={styles.searchDivider} />
          <AnimatedPressable
            onPress={handleMicPress}
            style={styles.micButton}
            accessibilityRole="button"
            accessibilityLabel="Voice search"
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Feather name="mic" size={wp('4.6%')} color={accentColor} />
          </AnimatedPressable>
        </AnimatedPressable>

        {/* Right: Quick-Action Cart / Shopping Bag Button */}
        <AnimatedPressable
          onPress={handleCartPress}
          style={styles.cartActionButton}
          accessibilityRole="button"
          accessibilityLabel={`Shopping cart${
            cartCount > 0 ? `, ${cartCount} items` : ''
          }`}
        >
          <Feather name="shopping-cart" size={wp('5.4%')} color={accentColor} />
          {cartCount > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: wp('4%'),
    paddingBottom: HEADER_BOTTOM_PADDING,
  },
  gradientBackground: {
    position: 'absolute',
    top: -200,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flex: 1,
    marginRight: wp('1.5%'),
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: wp('4.9%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  chevron: {
    marginLeft: 3,
    marginTop: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.4%'),
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 12,
    marginRight: 7,
    flexShrink: 0,
  },
  expressIcon: {
    marginRight: 3,
  },
  expressText: {
    fontSize: wp('2.8%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#FF7300',
  },
  locationSubtitle: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.8%'),
    flexShrink: 0,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('0.55%'),
    paddingHorizontal: wp('2.4%'),
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  walletIcon: {
    marginRight: 4,
  },
  coinsText: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FF7300',
  },
  profileCircle: {
    width: wp('9.6%'),
    height: wp('9.6%'),
    borderRadius: wp('4.8%'),
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 10,
    paddingLeft: wp('3.6%'),
    paddingRight: wp('2.8%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  placeholderContainer: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontSize: wp('3.4%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#8E949E',
  },
  searchDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E5E7EB',
    marginHorizontal: wp('2%'),
  },
  micButton: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartActionButton: {
    width: SEARCH_BAR_HEIGHT,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('2.4%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#FF5722',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontFamily: FONTS.gilroy.bold,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 12,
  },
});

export default React.memo(HomeHeaderGreen);
